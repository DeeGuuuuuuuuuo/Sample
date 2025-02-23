function getMultipleEnvironmentVariableValues(variableSchemaNames, callback) {
    // 查询多个环境变量的定义
    var filter = variableSchemaNames.map(name => "schemaname eq '" + name + "'").join(" or ");
    var query = "/api/data/v9.2/environmentvariabledefinitions?$filter=" + filter + "&$select=environmentvariabledefinitionid,schemaname,defaultvalue";

    Xrm.WebApi.retrieveMultipleRecords("environmentvariabledefinition", query).then(
        function success(result) {
            if (result.entities.length > 0) {
                var variableDefinitions = result.entities;
                var variableValues = {};

                // 查询每个环境变量的值
                var promises = variableDefinitions.map(function(variable) {
                    var valueQuery = "/api/data/v9.2/environmentvariablevalues?$filter=_environmentvariabledefinitionid_value eq " + variable.environmentvariabledefinitionid + "&$select=value";

                    return Xrm.WebApi.retrieveMultipleRecords("environmentvariablevalue", valueQuery).then(
                        function success(valueResult) {
                            if (valueResult.entities.length > 0) {
                                // 存储环境变量的值
                                variableValues[variable.schemaname] = valueResult.entities[0].value;
                            } else {
                                // 如果没有设置值，使用默认值
                                variableValues[variable.schemaname] = variable.defaultvalue;
                            }
                        },
                        function error(error) {
                            console.error("查询环境变量值时出错:", error);
                            variableValues[variable.schemaname] = null;
                        }
                    );
                });

                // 等待所有查询完成
                Promise.all(promises).then(function() {
                    callback(variableValues);
                });
            } else {
                console.error("未找到环境变量定义。");
                callback({});
            }
        },
        function error(error) {
            console.error("查询环境变量定义时出错:", error);
            callback({});
        }
    );
}

// 使用示例
var variableSchemaNames = ["Variable1", "Variable2", "Variable3"];
getMultipleEnvironmentVariableValues(variableSchemaNames, function(values) {
    console.log("环境变量的值:", values);
});
