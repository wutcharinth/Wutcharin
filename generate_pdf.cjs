const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Read the existing HTML
  let html = fs.readFileSync('wutcharin resume 2025.html', 'utf8');

  // Modify HTML for 1-page PDF generation
  // 1. Keep fixed height and overflow constraints (do not replace them)
  // html = html.replace('h-[297mm]', 'min-h-[297mm]'); 
  // html = html.replace('overflow-hidden', '');
  html = html.replace('flex justify-center items-center min-h-screen p-8', ''); // Remove centering wrapper

  // 2. Adjust container to be full width/height for print
  html = html.replace('w-[210mm]', 'w-full');
  html = html.replace('rounded-lg', ''); // Remove rounded corners for print
  html = html.replace('shadow-2xl', ''); // Remove shadow

  // 3. Add CSS to handle page breaks and background extension
  const styleInjection = `
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
      }
      .print-container {
        width: 210mm;
        height: 297mm !important; /* Force fixed height */
        overflow: hidden !important; /* Hide overflow */
      }
      /* Ensure the grid extends */
      .grid {
        display: grid;
        height: 100%;
      }
      /* Fix sidebar background for printing */
      .bg-slate-800 {
        background-color: #1e293b !important;
        -webkit-print-color-adjust: exact;
      }
      /* Typography Improvements for 1-page layout */
      .text-xxs {
        font-size: 8.5px !important;
        line-height: 1.3 !important;
      }
      .text-\[10px\] {
        font-size: 10px !important;
        letter-spacing: 0.05em !important;
      }
      h1 {
        font-size: 20px !important;
      }
      p, li {
        margin-bottom: 1px;
      }
      /* Force page breaks if needed, or avoid them inside elements */
      article, section {
        break-inside: avoid;
      }
    </style>
  `;
  html = html.replace('</head>', `${styleInjection}</head>`);

  // Set content
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Generate PDF
  await page.pdf({
    path: 'Wutcharin_Thatan_Resume.pdf',
    format: 'A4',
    printBackground: true,
    pageRanges: '1',
    margin: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
  });

  await browser.close();
  console.log("PDF generated successfully: Wutcharin_Thatan_Resume.pdf");
})();
