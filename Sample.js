/**
 * 根据表头名称提取 Excel 数据
 * @param {File} file Excel 文件对象
 * @param {Array<string>} headers 表头名称数组
 * @returns {Promise<Array<Object>>} 提取的数据（每行一个对象）
 */
async function extractDataByHeaders(file, headers) {
  // 1. 读取 Excel 文件
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]]; // 获取第一个工作表

  // 2. 将工作表数据转换为 JSON
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // 3. 找到表头行
  const headerRow = data.find(row => headers.every(header => row.includes(header)));
  if (!headerRow) {
    throw new Error('未找到匹配的表头行');
  }

  // 4. 提取表头索引
  const headerIndices = headers.map(header => headerRow.indexOf(header));

  // 5. 提取数据行
  const result = [];
  for (let i = data.indexOf(headerRow) + 1; i < data.length; i++) {
    const row = data[i];
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = row[headerIndices[index]] || null; // 如果数据为空，填充为 null
    });
    result.push(rowData);
  }

  return result;
}