const XLSX = require('xlsx');

const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  return rows.flat();
};

module.exports = { parseExcel };
