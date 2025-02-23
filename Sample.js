function getEnvironmentVariableValue(variableSchemaName, callback) {
    // 查询环境变量的定义
    var query = "/api/data/v9.2/environmentvariabledefinitions?$filter=schemaname eq '" + variableSchemaName + "'&$select=environmentvariabledefinitionid,defaultvalue";

    Xrm.WebApi.retrieveMultipleRecords("environmentvariabledefinition", query).then(
        function success(result) {
            if (result.entities.length > 0) {
                var variableId = result.entities[0].environmentvariabledefinitionid;
                var defaultValue = result.entities[0].defaultvalue;

                // 查询环境变量的值
                var valueQuery = "/api/data/v9.2/environmentvariablevalues?$filter=_environmentvariabledefinitionid_value eq " + variableId + "&$select=value";

                Xrm.WebApi.retrieveMultipleRecords("environmentvariablevalue", valueQuery).then(
                    function success(valueResult) {
                        if (valueResult.entities.length > 0) {
                            // 返回环境变量的值
                            callback(valueResult.entities[0].value);
                        } else {
                            // 如果没有设置值，返回默认值
                            callback(defaultValue);
                        }
                    },
                    function error(error) {
                        console.error("查询环境变量值时出错:", error);
                        callback(null);
                    }
                );
            } else {
                console.error("未找到环境变量定义:", variableSchemaName);
                callback(null);
            }
        },
        function error(error) {
            console.error("查询环境变量定义时出错:", error);
            callback(null);
        }
    );
}

// 使用示例
getEnvironmentVariableValue("YourVariableSchemaName", function(value) {
    if (value !== null) {
        console.log("环境变量的值是:", value);
    } else {
        console.log("未找到环境变量或值。");
    }
});
