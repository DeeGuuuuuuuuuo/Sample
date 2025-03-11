function processString(V, E) {
  try {
    // 处理 ISBLANK(V3792) 逻辑
    if (!V?.toString().trim()) return "";

    const str = E?.toString() || "";
    // 找到第一个空格的位置
    const firstSpaceIndex = str.indexOf(" ");
    if (firstSpaceIndex === -1) return "N/A"; // 无空格直接返回错误

    // 截取第一个空格后的部分
    const remainingStr = str.slice(firstSpaceIndex + 1);
    // 找第二个空格的位置
    const secondSpaceIndex = remainingStr.indexOf(" ");

    // 计算替换长度（Excel公式中的复杂逻辑）
    const replaceLength = secondSpaceIndex === -1 
      ? remainingStr.length 
      : secondSpaceIndex;

    // 生成替换字符串（REPT逻辑）
    const xStr = "X".repeat(replaceLength);

    // 拼接最终结果（REPLACE逻辑）
    return [
      str.slice(0, firstSpaceIndex + 1), // 保留第一个空格前的内容和空格
      xStr,
      secondSpaceIndex === -1 ? "" : remainingStr.slice(secondSpaceIndex)
    ].join("");
  } catch (e) {
    return "N/A"; // IFERROR 逻辑
  }
}