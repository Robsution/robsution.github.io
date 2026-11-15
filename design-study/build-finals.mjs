// The final three candidates are separate from the preserved A–E exploration.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = file => readFile(path.join(root, file), 'utf8');
const [css, landscape, interaction] = await Promise.all([
  read('finals.css'), read('assets/landscape.svg'), read('landscape.js')
]);
const site = 'https://robsution.github.io';
const email = 'rafael.coca.sal@gmail.com';
const portrait = (lazy = false) => `<img class="portrait" src="assets/portrait.jpg" width="750" height="1000" ${lazy ? 'loading="lazy"' : ''} alt="Rafael Coca Salazar outdoors">`;
const contact = `<span class="email" id="email">${email}</span><button class="copy" type="button" data-copy="${email}" aria-label="Copy email address" aria-live="polite">Copy</button>`;
const header = `<header class="running-head"><a class="cv" href="assets/cv-2026-05.pdf" download="Rafael-Coca-Salazar-CV.pdf" aria-label="Download CV (PDF)">CV <small>PDF</small></a><nav aria-label="Site navigation"><a href="${site}/research.html" target="_blank" rel="noopener">Research</a><a href="${site}/writing.html" target="_blank" rel="noopener">Writings</a><a href="${site}/teaching.html" target="_blank" rel="noopener">Teaching &amp; talks</a><a href="${site}/making.html" target="_blank" rel="noopener">Things I make</a></nav></header>`;
const name = `<h1 aria-label="Rafael A. Coca Salazar">Rafael A. <span class="surname">Coca Salazar</span><sup><a href="#correspondence" aria-label="Correspondence details">*</a></sup></h1>`;
const affiliation = `<p class="affiliation">Department of Physics, Washington University in St. Louis</p><p class="role">Physics PhD student &amp; Arthur L. Hughes Fellow</p>`;
const identity = `<div class="identity">${name}${affiliation}</div>`;
const abstract = `<section class="abstract" aria-labelledby="abstract-heading"><h2 id="abstract-heading">Abstract</h2><p>I’m interested in how mathematical models describe complex systems, especially in theoretical biophysics and condensed matter. My current work ranges from bacterial auxotrophy and spin glasses to machine learning in nuclear and particle physics.</p></section>`;
const figure = `<figure class="landscape"><div class="plot" id="plot" role="button" tabindex="0" aria-label="Interactive contour landscape. Click to release a walker, or press Enter for a random starting point." aria-describedby="landscape-caption">${landscape}</div><figcaption id="landscape-caption"><strong>Figure 1.</strong> A noisy walk uphill on a toy landscape. <span id="verb">Click</span> to choose a starting point.</figcaption></figure>`;
const research = `<section class="research" id="research"><h2><span class="number">1.</span> Research</h2><dl class="research-list"><div><dt>Biophysics</dt><dd>Analyzing bacterial auxotrophy data with Mikhail Tikhonov.</dd></div><div><dt>Condensed matter</dt><dd>Benchmarking local approaches to solving <i>p</i>-interacting spin glasses.</dd></div><div><dt>Machine learning</dt><dd>Projects in nuclear physics with Saori Pastore and particle physics with the US Muon Collider Collaboration.</dd></div></dl><p class="earlier">Earlier work includes Hamiltonian lattice QED, the CMS Level-1 trigger, and precision measurement.</p><a class="detail-link" href="${site}/research.html" target="_blank" rel="noopener">Research background</a></section>`;
const teaching = `<section id="teaching"><h2><span class="number">2.</span> Teaching &amp; talks</h2><div class="section-copy"><p>I’m a TA for Physics 1760, <i>Focused Physics I</i>, at WashU. At Princeton, I was an undergraduate course assistant in mechanics and electromagnetism (2023–2024), and a peer tutor in mechanics and quantum mechanics (2023–2024).</p></div><a class="detail-link" href="${site}/teaching.html" target="_blank" rel="noopener">Teaching experience</a></section>`;
const making = `<section id="making"><h2><span class="number">3.</span> Things I make</h2><div class="section-copy"><p>I’m developing <a href="${site}/making.html" target="_blank" rel="noopener">Paper Night</a>, a browser extension for reading physics and biology papers with a gentler background while preserving the colors in figures. It’s part of Niceties, a collection of tools I’m making for everyday use.</p></div></section>`;
const correspondence = photo => `<footer class="correspondence ${photo ? '' : 'compact'}" id="correspondence">${photo ? portrait(true) : ''}<div>${photo ? '<h2><span class="star">*</span> Correspondence</h2>' : '<span class="star">*</span> Correspondence: '}${contact}</div></footer>`;

const variants = [
  {file:'final-first.html',id:'first',label:'1. First page',description:'Chosen design: a centered abstract, two columns, and your photo beside the correspondence note.',content:`${identity}${abstract}<div class="first-grid">${research}${figure}${teaching}${making}</div>${correspondence(true)}`},
  {file:'final-alongside.html',id:'alongside-final',label:'2. Alongside',description:'A’s side-by-side composition, with a portrait by the introduction and the details of a preprint.',content:`<div class="alongside-hero"><div class="identity">${name}<div class="byline">${portrait()}<div>${affiliation}</div></div></div>${abstract.replace('>Abstract</h2>','>Abstract.</h2>')}${figure}</div><div class="alongside-lower">${research}<div class="support">${teaching}${making}</div></div>${correspondence(false)}`},
  {file:'final-personal.html',id:'personal',label:'3. Personal manuscript',description:'A centered title and abstract, a reading column, and your portrait in the author margin.',content:`${identity}${abstract}<div class="personal-grid"><div class="personal-main">${figure}${research}${teaching}${making}</div><aside class="author-margin" id="correspondence" aria-label="Author and correspondence">${portrait()}<div><p class="aside-title">* Correspondence</p>${contact}</div></aside></div>`}
];

const pages = {};
for (const version of variants) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${version.label} — Rafael Coca Salazar</title><style>${css}</style></head><body class="${version.id}"><a class="skip" href="#main">Skip to content</a><div class="sheet">${header}<main id="main">${version.content}</main></div><script>${interaction}</script></body></html>`;
  await writeFile(path.join(root, version.file), html);
  pages[version.file] = html;
}

// Embed display assets for a comparison that continues working offline once loaded.
const assets = [
  ['crimson-text-latin-400-normal.woff2','font/woff2'],
  ['crimson-text-latin-400-italic.woff2','font/woff2'],
  ['crimson-text-latin-600-normal.woff2','font/woff2'],
  ['portrait.jpg','image/jpeg']
];
for (const [file, mime] of assets) {
  const data = `data:${mime};base64,${(await readFile(path.join(root,'assets',file))).toString('base64')}`;
  for (const name of Object.keys(pages)) pages[name] = pages[name].replaceAll('assets/' + file, data);
}
for (const name of Object.keys(pages)) {
  pages[name] = pages[name].replaceAll('href="assets/cv-2026-05.pdf" download="Rafael-Coca-Salazar-CV.pdf"', `href="${site}/assets/cv-2026-05.pdf" target="_blank" rel="noopener"`);
  // Fragment-only links in srcdoc otherwise resolve to the parent comparison URL.
  const fragments = `<script>document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(!link)return;const target=document.getElementById(link.getAttribute('href').slice(1));if(!target)return;event.preventDefault();target.scrollIntoView();});<\/script>`;
  pages[name] = pages[name].replace('</body>',fragments+'</body>');
}
const serializedPages = JSON.stringify(pages).replaceAll('<','\\u003c');
const serializedVersions = JSON.stringify(variants.map(({file,label,description}) => ({file,label,description}))).replaceAll('<','\\u003c');
await writeFile(path.join(root,'final-comparison.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Rafael — three final homepage proposals</title><style>*{box-sizing:border-box}html,body{height:100%;margin:0;background:#f8f8f5}body{display:flex;flex-direction:column}header{flex:none;background:#e8edec;border-bottom:1px solid #d3dfdc;padding:11px 20px 10px;font:12px/1.4 system-ui,sans-serif;color:#405451}.controls{display:flex;align-items:baseline;gap:23px;max-width:1130px;margin:auto}.controls>span{font-weight:600}.controls nav{display:flex;flex-wrap:wrap;gap:8px 22px}.controls a{color:#405451;text-decoration:none;padding:3px 0}.controls a[aria-current]{border-bottom:2px solid #843c51;color:#242e2c;font-weight:650}.controls a:hover{text-decoration:underline}.controls .earlier{margin-left:auto;white-space:nowrap}.controls a:focus-visible{outline:2px solid #32636c;outline-offset:4px}header p{max-width:1130px;margin:8px auto 0;font-size:11px;color:#4c605b}iframe{flex:1;min-height:0;width:100%;border:0;display:block}@media(max-width:700px){header{padding:10px 16px}.controls{gap:10px}.controls>span{display:none}.controls nav{gap:7px 18px;font-size:11px}.controls .earlier{font-size:10px}header p{font-size:10px}}@media(max-width:430px){.controls{align-items:flex-start}.controls .earlier{max-width:48px;white-space:normal}}</style></head><body><header><div class="controls"><span>Final proposals</span><nav aria-label="Compare final proposals">${variants.map(v=>`<a href="#${v.file}">${v.label}</a>`).join('')}</nav><a class="earlier" href="comparison.html" target="_blank" rel="noopener">Earlier studies</a></div><p id="description"></p></header><iframe id="study" title="Selected homepage proposal" allow="clipboard-write"></iframe><script>const pages=${serializedPages};const versions=${serializedVersions};const frame=document.getElementById('study');function show(){const name=Object.hasOwn(pages,location.hash.slice(1))?location.hash.slice(1):versions[0].file;const version=versions.find(v=>v.file===name);frame.srcdoc=pages[name];frame.title=version.label+' — homepage proposal';document.getElementById('description').textContent=version.description+' Page links open the existing site.';for(const link of document.querySelectorAll('nav a')){if(link.hash==='#'+name)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}document.title=version.label+' — final homepage proposals';}window.addEventListener('hashchange',show);show();</script></body></html>`);
console.log('Built three final homepage proposals and final-comparison.html. Earlier studies unchanged.');
