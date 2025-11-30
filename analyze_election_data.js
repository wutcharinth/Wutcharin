import XLSX from 'xlsx';
import fs from 'fs';

const filePath = '/Users/oui/Wutcharin/2566_election_result.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Test the exact call used in processing script
    const processedData = XLSX.utils.sheet_to_json(sheet, { range: 3 });

    // Extract unique party names
    const parties = new Set();
    processedData.forEach(row => {
        if (row['สังกัดพรรค']) {
            parties.add(row['สังกัดพรรค']);
        }
    });

    console.log("Unique Parties Found:", Array.from(parties));

    console.log("Processed Data Length:", processedData.length);
    if (processedData.length > 0) {
        console.log("First Row Keys:", Object.keys(processedData[0]));
        console.log("First Row:", processedData[0]);
    } else {
        console.log("No data found with range: 2");
    }

} catch (error) {
    console.error("Error reading file:", error);
}
