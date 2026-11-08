/**
 * Print the 2026 résumé HTML to the PDF the site serves.
 *
 *   node scripts/build_resume_pdf.cjs
 *
 * Requires Playwright with Chromium (npx playwright install chromium).
 * Page size and margins come from the HTML's own @media print / @page
 * rules. Fonts (Inter, Fraunces) load from Google Fonts, so run it online.
 * Honours HTTPS_PROXY when set.
 */
const path = require('path');
const { chromium } = require('playwright');

const SRC = path.resolve(__dirname, '..', 'wutcharin resume 2026.html');
const OUT = path.resolve(__dirname, '..', 'public', 'Wutcharin_CV_2026.pdf');

(async () => {
    const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
    const browser = await chromium.launch({ proxy });
    const page = await browser.newPage();
    await page.goto(`file://${SRC}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const missing = await page.evaluate(() =>
        ['Inter', 'Fraunces'].filter((f) => !document.fonts.check(`500 12px "${f}"`)),
    );
    if (missing.length) {
        console.error(`Fonts did not load: ${missing.join(', ')}. Aborting so the PDF keeps its typography.`);
        process.exit(1);
    }
    await page.pdf({ path: OUT, preferCSSPageSize: true, printBackground: true });
    await browser.close();
    console.log(`Wrote ${path.relative(process.cwd(), OUT)}`);
})();
