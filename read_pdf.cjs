const fs = require('fs');
const pdfParse = require('pdf-parse');

let dataBuffer = fs.readFileSync('public/Wutcharin_CV_2025.pdf');

console.log(pdfParse);
// pdfParse(dataBuffer).then(function (data) {
//     console.log(data.text);
// });
