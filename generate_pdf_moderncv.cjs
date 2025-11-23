const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Read the HTML file
    const html = fs.readFileSync('resume_moderncv.html', 'utf8');

    // Set content
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    await page.pdf({
        path: 'public/Wutcharin_Thatan_Resume.pdf', // Overwrite the existing PDF
        format: 'A4',
        printBackground: true,
        margin: {
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px'
        }
    });

    await browser.close();
    console.log("PDF generated successfully: public/Wutcharin_Thatan_Resume.pdf");
})();
