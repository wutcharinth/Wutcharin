import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const inputFile = '2566_election_result.xlsx';
const outputFile = path.join('src', 'data', 'full_election_results.json');

// Read the file
const workbook = XLSX.readFile(inputFile);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
// Header is on row 4 (index 3), so we skip 3 rows?
// Actually, let's just read raw and filter.
const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Find the header row index
const headerRowIndex = rawData.findIndex(row => row && row[0] === 'จังหวัด');

if (headerRowIndex === -1) {
    console.error("Could not find header row starting with 'จังหวัด'");
    process.exit(1);
}

const headers = rawData[headerRowIndex];
console.log("Found headers:", headers);

const cleanData = [];

for (let i = headerRowIndex + 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length === 0 || !row[0]) continue; // Skip empty rows

    // Map columns: 0: Province, 1: District, 2: Number, 3: Name, 4: Party, 5: Votes
    const item = {
        province: row[0],
        district: row[1],
        number: row[2],
        name: row[3],
        party: row[4],
        votes: row[5]
    };

    cleanData.push(item);
}

console.log(`Processed ${cleanData.length} records.`);

// Write to file
fs.writeFileSync(outputFile, JSON.stringify(cleanData, null, 2));
console.log(`Written to ${outputFile}`);
