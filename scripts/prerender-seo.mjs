// Post-build step: gives every route its own HTML file with a real <title>,
// description, canonical, and readable fallback content inside #root.
// React replaces the fallback on mount; crawlers and agents that do not run
// JS read it as-is. Titles/descriptions come from src/data/projects.ts.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://wutcharin.com';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unq = (s) => s.replace(/\\'/g, "'").replace(/\\"/g, '"');

const field = (block, name) => {
  const m = block.match(new RegExp(`\\n\\s+${name}:\\s*(?:"((?:[^"\\\\]|\\\\.)*)"|'((?:[^'\\\\]|\\\\.)*)')`));
  return m ? unq(m[1] ?? m[2]) : '';
};
const records = (file) =>
  readFileSync(join(root, file), 'utf8').split(/\n    \{\n/).slice(1).map((b) => '\n' + b);

const projects = records('src/data/projects.ts')
  .map((b) => ({ title: field(b, 'title'), desc: field(b, 'desc'), link: field(b, 'link'), role: field(b, 'role') }))
  .filter((p) => p.link.startsWith('/'));
const jobs = records('src/data/career.ts')
  .map((b) => ({ company: field(b, 'company'), role: field(b, 'role'), period: field(b, 'period'), headline: field(b, 'headline') }))
  .filter((j) => j.company);

const homeDesc = 'Wutcharin Thatan leads FinTech Data & Automation at Agoda: a 12-person Analytics Engineering team, 15,000+ hours automated a year and AI agents in production. Based in Bangkok.';
const homeTitle = 'Wutcharin Thatan | Associate Director, FinTech Data & Automation';

const pages = [
  { path: '/', title: homeTitle, desc: homeDesc,
    body: `<h1>Wutcharin Thatan</h1><p>Associate Director, FinTech Data &amp; Automation at Agoda, Bangkok. AI strategy that ships.</p><p>${esc(homeDesc)}</p>
<h2>Career</h2><ul>${jobs.map((j) => `<li><strong>${esc(j.role)}, ${esc(j.company)}</strong> (${esc(j.period)}): ${esc(j.headline)}</li>`).join('')}</ul>
<h2>Selected work</h2><ul>${projects.map((p) => `<li><a href="${p.link}">${esc(p.title)}</a>: ${esc(p.desc)}</li>`).join('')}</ul>
<h2>Contact</h2><ul><li><a href="https://www.linkedin.com/in/Wutcharin">LinkedIn</a></li><li><a href="https://github.com/wutcharinth">GitHub</a></li><li><a href="/Wutcharin_CV_2026.pdf">Résumé (PDF)</a></li></ul>` },
  ...projects.map((p) => ({
    path: p.link,
    title: `${p.title} | Wutcharin Thatan`,
    desc: p.desc,
    body: `<h1>${esc(p.title)}</h1><p>${esc(p.role)}</p><p>${esc(p.desc)}</p><p><a href="/">More work by Wutcharin Thatan</a></p>`,
  })),
];

const template = readFileSync(join(dist, 'index.html'), 'utf8');
const swap = (html, re, rep) => (re.test(html) ? html.replace(re, rep) : html);

for (const pg of pages) {
  const url = SITE + (pg.path === '/' ? '/' : pg.path);
  const t = esc(pg.title), d = esc(pg.desc);
  let h = template;
  h = swap(h, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);
  h = swap(h, /(<meta name="description" content=")[^"]*"/, `$1${d}"`);
  h = swap(h, /(<link rel="canonical" href=")[^"]*"/, `$1${url}"`);
  h = swap(h, /(<meta property="og:url" content=")[^"]*"/, `$1${url}"`);
  h = swap(h, /(<meta property="og:title" content=")[^"]*"/, `$1${t}"`);
  h = swap(h, /(<meta property="og:description" content=")[^"]*"/, `$1${d}"`);
  h = swap(h, /(<meta name="twitter:title" content=")[^"]*"/, `$1${t}"`);
  h = swap(h, /(<meta name="twitter:description" content=")[^"]*"/, `$1${d}"`);
  h = h.replace('<!--SEO_STATIC-->', `<div data-seo-fallback>${pg.body}</div>`);
  const out = pg.path === '/' ? join(dist, 'index.html') : join(dist, pg.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, h);
}

// Sitemap from the same route list.
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map((p) => `  <url><loc>${SITE}${p.path === '/' ? '/' : p.path}</loc><lastmod>${today}</lastmod><priority>${p.path === '/' ? '1.0' : '0.7'}</priority></url>`).join('\n') +
  `\n</urlset>\n`);
console.log(`prerender-seo: ${pages.length} pages`);
