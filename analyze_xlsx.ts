import XLSX from 'xlsx';
import * as fs from 'fs';

const workbook = XLSX.readFile('2566_election_result.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log("Sheet Name:", sheetName);
console.log("Total Rows:", data.length);
console.log("Header Row:", data[0]);
console.log("First 3 Data Rows:", data.slice(1, 4));
