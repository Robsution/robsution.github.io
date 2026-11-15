import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { marked } from 'marked';
import { preprintHeader, preprintPage } from './preprint.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = name => readFile(path.join(root, name), 'utf8');
const [baseCss, preprintCss, landscape, landscapeScript, studyScript, plan] = await Promise.all([
  read('style.css'), read('preprint.css'), read('assets/landscape.svg'), read('landscape.js'), read('study.js'), read('CONTENT-PLAN.md')
]);
const css = baseCss + '\n' + preprintCss;
const versions = [
  ['index.html', 'alongside', 'A. Alongside'],
  ['ribbon.html', 'ribbon', 'B. Landscape ribbon'],
  ['column.html', 'column', 'C. Personal column'],
  ['journal.html', 'journal', 'D. First page'],
  ['manuscript.html', 'manuscript', 'E. Working manuscript'],
  ['writings.html', 'writings', 'Writings'],
  ['content-plan.html', 'plan', 'Content to fill']
];
const descriptions = {
  alongside: 'A. Your overview and landscape share the first screen. A shorter name, no portrait, burgundy with blue-green links.',
  ribbon: 'B. A compact introduction first, then a wide landscape. More of the preprint feeling, with a single burgundy accent.',
  column: 'C. A quieter reading column, with the landscape in the margin and your photo beside the contact section.',
  journal: 'D. A journal first page: centered name, abstract, two columns, a numbered figure, and correspondence footnote.',
  manuscript: 'E. A working manuscript: a reading column, contents and notes in the margin, and an interactive Figure 1.',
  writings: 'A draft introduction and section structure. No invented posts; the empty sections below are for this local study only.',
  plan: 'An editing checklist based on the current site. These are prompts for you, not claims to publish.'
};
function studyBar(current) {
  return `<aside class="study-bar" aria-label="Local mock-up comparison">
    <div class="study-top"><span class="study-label">Local mock-ups</span><nav aria-label="Compare mock-ups">${versions.map(([file,id,label]) => `<a href="${file}" ${id === current ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav></div>
    <p>${descriptions[current]}</p>
  </aside>`;
}
const siteNav = `<header class="site-header"><nav aria-label="Site navigation">
  <a href="index.html#research">Research</a><a href="writings.html">Writings</a><a href="index.html#teaching">Teaching &amp; talks</a><a href="index.html#making">Things I make</a>
  <a class="cv" href="assets/cv-2026-05.pdf" download="Rafael-Coca-Salazar-CV.pdf" aria-label="Download CV (PDF)">CV <span>PDF</span></a>
</nav></header>`;
const heading = `<div class="identity"><h1>Rafael A. <span class="surname">Coca Salazar</span></h1><p class="position">Physics PhD student &amp; Arthur L. Hughes Fellow<br><span>Washington University in St. Louis</span></p></div>`;
const intro = `<div class="intro"><p>I’m interested in how mathematical models describe complex systems, especially in theoretical biophysics and condensed matter.</p><p>My current work ranges from bacterial auxotrophy and spin glasses to machine learning in nuclear and particle physics.</p><a class="text-link" href="#research">More about my research</a></div>`;
const figure = `<figure class="landscape"><div class="plot" id="plot" role="button" tabindex="0" aria-label="Interactive contour landscape. Click to release a walker, or press Enter for a random starting point." aria-describedby="landscape-caption">${landscape}</div><figcaption id="landscape-caption">A noisy walk uphill on a toy landscape.<br><span id="verb">Click</span> to choose a starting point.</figcaption></figure>`;
const research = `<section class="research" id="research"><h2>Research</h2><dl class="research-list">
  <div><dt>Biophysics</dt><dd>Analyzing bacterial auxotrophy data with Mikhail Tikhonov.</dd></div>
  <div><dt>Condensed matter</dt><dd>Benchmarking local approaches to solving <i>p</i>-interacting spin glasses.</dd></div>
  <div><dt>Machine learning</dt><dd>Projects in nuclear physics with Saori Pastore and particle physics with the US Muon Collider Collaboration.</dd></div>
</dl><p class="earlier">Earlier work includes Hamiltonian lattice QED, the CMS Level-1 trigger, and precision measurement.</p><a href="https://robsution.github.io/research.html">Research background</a></section>`;
const teaching = `<section id="teaching"><h2>Teaching &amp; talks</h2><p>I’m a TA for Physics 1760, <i>Focused Physics I</i>, at WashU. At Princeton, I was an undergraduate course assistant in mechanics and electromagnetism (2023–2024), and a peer tutor in mechanics and quantum mechanics (2023–2024).</p><a href="https://robsution.github.io/teaching.html">Teaching experience</a></section>`;
const making = `<section id="making"><h2>Things I make</h2><p>I’m developing <a href="https://robsution.github.io/making.html">Paper Night</a>, a browser extension for reading physics and biology papers with a gentler background while preserving the colors in figures. It’s part of Niceties, a collection of tools I’m making for everyday use.</p></section>`;
const contact = photo => `<section class="contact ${photo ? 'with-photo' : ''}" id="contact">${photo ? '<img class="portrait" src="assets/portrait.jpg" width="750" height="1000" loading="lazy" alt="Rafael Coca Salazar outdoors">' : ''}<div><h2>Get in touch</h2><p id="email">rafael.coca.sal@gmail.com</p><button class="copy" data-copy="rafael.coca.sal@gmail.com" type="button" aria-live="polite">Copy</button><p class="location">St. Louis, Missouri</p></div></section>`;
function home(id) {
  return `<main id="main"><div class="hero">${heading}${intro}${figure}</div><div class="body-content">${research}<div class="secondary">${teaching}${making}</div>${contact(id === 'column')}</div></main>`;
}
const writingPage = `<main id="main" class="writing-page"><a class="back" href="index.html">Rafael A. Coca Salazar</a><h1>Writings</h1><p class="writing-intro">On physics, doing research, and questions that don’t fit in a paper.</p><section><h2>Essays &amp; reflections</h2><p>Ideas I want to spend more time with, whether or not I have a conclusion.</p></section><section><h2>Technical writing</h2><p>Explanations, calculations, and longer academic pieces.</p></section><aside class="draft-note"><p><strong>For this mock-up:</strong> these headings show the intended order. Once you add a piece, its title and a short description would sit below the appropriate heading. Until then, I’d leave Writings out of the public homepage navigation.</p><a href="content-plan.html#writings">Two alternative introductions</a></aside></main>`;
const generated = {};
for (const [file, id, label] of versions) {
  const isPreprint = ['journal','manuscript'].includes(id);
  const content = isPreprint ? preprintPage(id,{figure,research,teaching,making}) : id === 'plan' ? `<main id="main" class="plan-content">${marked.parse(plan)}</main>` : id === 'writings' ? writingPage : home(id);
  const footer = isPreprint ? '' : `<footer class="page-footer"><span>Rafael A. Coca Salazar</span><a href="assets/cv-2026-05.pdf" download>Curriculum vitae</a></footer>`;
  const header = isPreprint ? preprintHeader(id) : id === 'plan' ? '' : siteNav;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${label} — Rafael Coca Salazar · local study</title><style>${css}</style></head><body class="${id}"><a class="skip" href="#main">Skip to content</a>${studyBar(id)}<div class="page">${header}${content}${footer}</div><script>${studyScript}</script>${['alongside','ribbon','column','journal','manuscript'].includes(id) ? `<script>${landscapeScript}</script>` : ''}</body></html>`;
  await writeFile(path.join(root,file), html);
  generated[file] = html;
}
// A single portable comparison keeps every view available without further server requests.
// Only explicit links to the existing public site (including its CV) need the network.
const embeddedAssets = {};
for (const [name, type] of [
  ['crimson-text-latin-400-normal.woff2','font/woff2'],
  ['crimson-text-latin-400-italic.woff2','font/woff2'],
  ['crimson-text-latin-600-normal.woff2','font/woff2'],
  ['portrait.jpg','image/jpeg']
]) embeddedAssets['assets/' + name] = `data:${type};base64,${(await readFile(path.join(root,'assets',name))).toString('base64')}`;
const bridge = `<script>document.addEventListener('click',event=>{const a=event.target.closest('a');if(!a)return;const raw=a.getAttribute('href');if(raw.startsWith('#')){event.preventDefault();document.getElementById(raw.slice(1))?.scrollIntoView();return;}if(raw.startsWith('https:')){a.target='_blank';a.rel='noopener';return;}const [page,anchor]=raw.split('#');if(${JSON.stringify(versions.map(([file])=>file))}.includes(page)){event.preventDefault();parent.postMessage({type:'local-study-view',page,anchor},'*');}});<\/script>`;
for (const name of Object.keys(generated)) {
  let html = generated[name];
  for (const [asset,data] of Object.entries(embeddedAssets)) html = html.replaceAll(asset,data);
  html = html.replaceAll('assets/cv-2026-05.pdf','https://robsution.github.io/assets/cv-2026-05.pdf');
  generated[name] = html.replace('</body>',bridge+'</body>');
}
const serialized = JSON.stringify(generated).replaceAll('<','\\u003c');
await writeFile(path.join(root,'comparison.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Rafael — five homepage mock-ups</title><style>html,body{margin:0;height:100%;background:#f8f8f5}iframe{display:block;width:100%;height:100%;border:0}</style></head><body><iframe id="study" title="Homepage mock-ups and content checklist"></iframe><script>const pages=${serialized};const frame=document.getElementById('study');let pendingAnchor='';function show(page,anchor){if(!Object.hasOwn(pages,page))return;pendingAnchor=anchor||'';frame.srcdoc=pages[page];}frame.addEventListener('load',()=>{if(pendingAnchor)frame.contentDocument.getElementById(pendingAnchor)?.scrollIntoView();});window.addEventListener('message',event=>{if(event.source===frame.contentWindow&&event.data?.type==='local-study-view')show(event.data.page,event.data.anchor);});const initial=location.hash.slice(1);show(Object.hasOwn(pages,initial)?initial:'index.html');</script></body></html>`);
console.log('Built seven study pages plus the self-contained comparison.html.');
