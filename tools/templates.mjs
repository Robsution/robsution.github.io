import { escapeHtml as esc } from './content.mjs';

const navigation = [['index.html','Home','00'],['research.html','Research','01'],['writing.html','Writings','02'],['teaching.html','Teaching & talks','03'],['making.html','Things I make','04']];
const sectionTitle = (n, title, link = '') => `<div class="section-title"><h2><span>${n}</span> ${title}</h2>${link}</div>`;
const arrowLink = (url, text) => `<a class="text-link" href="${url}">${text} <span aria-hidden="true">↗</span></a>`;
const item = (date,title,body,extra='') => `<div class="entry"><div class="entry-date">${date}</div><div><h3>${title}</h3><p>${body}</p>${extra}</div></div>`;

export function motif() {
  let contours = '';
  for (let ring = 0; ring < 8; ring++) {
    let points = [];
    for (let i = 0; i <= 150; i++) {
      const a = i / 150 * Math.PI * 2;
      const r = 17 + ring * 8 + 4 * Math.sin(3*a + ring*.1) + 3 * Math.cos(2*a);
      points.push(`${(145 + Math.cos(a)*r*1.43).toFixed(2)},${(97 + Math.sin(a)*r*.86).toFixed(2)}`);
    }
    contours += `<path d="M${points.join(' L')} Z" opacity="${.28 + ring*.07}"/>`;
  }
  let lattice = '';
  for (let x=60;x<=240;x+=36) lattice += `<path d="M${x} 40V148"/>`;
  for (let y=40;y<=148;y+=36) lattice += `<path d="M60 ${y}H240"/>`;
  for (let x=60;x<=240;x+=36) for (let y=40;y<=148;y+=36) lattice += `<circle cx="${x}" cy="${y}" r="2.8" fill="currentColor" stroke="none"/>`;
  return `<div class="motif" aria-hidden="true"><svg class="contours" viewBox="0 0 300 195" fill="none" stroke="currentColor" stroke-width=".9">${contours}<circle cx="156" cy="91" r="3" fill="currentColor"/><path d="M156 91C170 87 176 102 185 108S206 104 217 120" stroke-dasharray="3 4"/></svg><svg class="lattice" viewBox="0 0 300 195" fill="none" stroke="currentColor" stroke-width="1">${lattice}<path d="M96 76H204V112H96Z" stroke-width="3"/></svg><span class="motif-caption">${''}<span class="contour-label">a small landscape of possibilities</span><span class="lattice-label">a nod to lattice QED</span></span></div>`;
}

export function shell(site, page, title, content, { post = false } = {}) {
  const nav = navigation.map(([href,label,n]) => `<a href="${href}" ${href === page || (post && href === 'writing.html') ? 'aria-current="page"' : ''}><span class="nav-number">${n}</span><span>${label}</span></a>`).join('');
  return `<!doctype html>
<html lang="en" data-theme="${esc(site.defaultTheme)}" data-font="${esc(site.defaultFont)}" data-accent="${esc(site.defaultAccent)}" data-layout="${esc(site.defaultLayout)}" data-motif="${esc(site.defaultMotif)}" data-motif-color="${esc(site.defaultMotifColor)}" data-photo="${site.portrait?'yes':'no'}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · ${esc(site.name)}</title><meta name="description" content="${esc(site.name)}, physics PhD student and Arthur L. Hughes Fellow at Washington University in St. Louis. Research, writing, teaching, and small software projects."><meta name="color-scheme" content="light dark">${site.previewTools?'<meta name="robots" content="noindex, nofollow">':''}<link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/katex/katex.min.css"><link rel="stylesheet" href="assets/style.css">${site.previewTools?'<script src="assets/appearance.js"></script><script type="module" src="assets/site.js"></script>':''}</head>
<body><a class="skip-link" href="#main">Skip to content</a>
<div class="page-shell"><header class="site-header"><div class="running-head"><a class="site-name" href="index.html" aria-label="Rafael Coca Salazar home">R. A. Coca Salazar</a><a class="cv-link" href="assets/${esc(site.cvFile)}" download aria-label="Download CV (May 2026 PDF)" title="Download CV · May 2026">CV <span aria-hidden="true">↓</span></a></div><nav aria-label="Main navigation">${nav}</nav></header>
<main id="main">${content}</main>
<footer class="site-footer"><span>Rafael Arturo Coca Salazar <span class="footer-dot">·</span> St. Louis, Missouri</span><a href="mailto:${esc(site.email)}">Email ↗</a><a href="assets/${esc(site.cvFile)}" download>CV · May 2026 ↓</a></footer></div>
${site.previewTools ? explorer(site) : ''}
</body></html>`;
}

function explorer(site) {
  const fontCard = ([value,label,note]) => `<label class="font-choice"><input type="radio" name="font" value="${value}" aria-label="${label}"><span class="font-name">${label}</span><span class="font-specimen" data-font="${value}" aria-hidden="true">Rafael Aa Rr Gg</span><span class="font-description">${note}</span></label>`;
  return `<aside class="explorer" aria-label="Design explorer"><button class="explorer-toggle" aria-expanded="false" aria-controls="explorer-panel"><span class="explorer-icon" aria-hidden="true">◐</span> Explore the design <span class="toggle-sign" aria-hidden="true">+</span></button><div id="explorer-panel" hidden>
<div class="explorer-heading"><div><span class="eyebrow">TYPE STUDY · 03</span><h2>A closer look at the letters.</h2></div><button type="button" class="close-explorer" aria-label="Close design explorer">×</button></div>
<fieldset class="font-picker"><legend>Serif typeface</legend><p class="font-hint">Compare the same capitals and lowercase letters, then try a font on the page.</p><div class="font-choices">${[['newsreader','Newsreader','Rounder & fluid'],['spectral','Spectral','Sturdy & distinctive'],['alegreya','Alegreya','Lively, strong capitals'],['crimsontext','Crimson Text','Another take on Crimson'],['garamond','EB Garamond','Your Garamond reference'],['crimson','Crimson Pro','Your Crimson reference']].map(fontCard).join('')}</div><details class="earlier-fonts"><summary>Earlier comparisons</summary><div class="font-choices">${[['source','Source Serif 4','Clear & substantial'],['baskerville','Libre Baskerville','Crisp & open']].map(fontCard).join('')}</div></details></fieldset>
<fieldset><legend>Paper</legend><div class="theme-choices">${[['paper','Paper','#e9ebed'],['gray','Gray','#d9dde1'],['night','Night','#2d3036']].map(([value,label,color])=>`<label class="theme-choice"><input type="radio" name="theme" value="${value}"><span class="swatch" style="--swatch:${color}"></span>${label}</label>`).join('')}</div><p class="palette-description">Cool paper against a slightly darker background.</p></fieldset>
<div class="control-grid"><label>Link accent<select name="accent"><option value="blue">Blue</option><option value="burgundy">Burgundy</option><option value="graphite">Graphite</option></select></label><label>Motif color<select name="motifColor"><option value="accent">Match links</option><option value="burgundy">Burgundy</option><option value="blue">Blue</option><option value="graphite">Graphite</option></select></label><label>Composition<select name="layout"><option value="margin">Portrait at right</option><option value="compact">Text only</option></select></label><label>Small motif<select name="motif"><option value="contours">Contours</option><option value="lattice">Lattice</option><option value="none">No flourish</option></select></label><div class="photo-control"><span>Try your portrait</span><label class="file-button" for="portrait-input">Choose a photo ↗</label><input id="portrait-input" type="file" accept="image/jpeg,image/png,image/webp"><button type="button" class="remove-photo">Remove photo</button></div></div>
<p class="photo-note">Photo previews stay in this browser tab. Nothing is uploaded.</p><div class="explorer-actions"><button type="button" class="copy-design">Copy this combination ↗</button><button type="button" class="reset-design">Reset</button></div><p class="explorer-status" role="status" aria-live="polite"></p>
</div></aside>`;
}

export function home(site) {
  return `<section class="home-intro"><div class="home-copy"><h1>Rafael Arturo <span>Coca Salazar</span></h1><p class="position">Physics PhD student · Arthur L. Hughes Fellow</p><p class="affiliation">${esc(site.affiliation)}</p><div class="abstract"><p>I’m interested in theoretical biophysics and condensed matter, and I’m currently exploring a small project with Mikhail Tikhonov.</p><p>My earlier work spans lattice QED, particle physics, and machine learning. I also teach physics and make small pieces of software.</p></div><div class="abstract-links">${arrowLink('research.html','Research')}${arrowLink(`mailto:${esc(site.email)}`,'Email')}</div></div>
<aside class="portrait-margin"><figure class="portrait-figure"><div class="portrait-frame">${site.portrait?`<img class="portrait-image" src="assets/${esc(site.portrait)}" alt="${esc(site.portraitAlt)}">`:site.previewTools?'<img class="portrait-image" alt="Your selected portrait" hidden>':''}<div class="portrait-placeholder"><span class="portrait-initials">racs.</span>${site.previewTools?'<span>Your portrait</span><button class="choose-portrait" type="button">Try a photograph ↗</button>':''}</div></div></figure></aside></section>
<section class="current-section">${sectionTitle('01','Currently')}<div class="current-grid"><div class="current-entries">${item('RESEARCH','Biophysics & condensed matter','An exploratory project with Mikhail Tikhonov at WashU.')}${item('TEACHING','Focused Physics I','TA for Physics 1760, alongside earlier teaching and tutoring at Princeton.',arrowLink('teaching.html','Teaching & talks'))}${item('MAKING','Niceties','Small tools for everyday friction, starting with Paper Night.',arrowLink('making.html','Things I make'))}</div>${motif()}</div></section>
<section class="home-writings">${sectionTitle('02','Writings',arrowLink('writing.html','Browse writings'))}<p>Informal posts and reflections, followed by academic writing.</p><p class="quiet-note">No posts yet. An equation specimen is available in the academic section.</p></section>`;
}

export function pageHeading(n, title, subtitle) { return `<header class="document-heading"><p class="eyebrow">§ ${n} / RAFAEL ARTURO COCA SALAZAR</p><h1>${title}</h1><p class="document-deck">${subtitle}</p></header>`; }

export function research() {
  return `${pageHeading('01','Research','From quantum fields toward living systems.')}<div class="document-body"><section>${sectionTitle('1','Current direction')}<p class="lead">My current interests lie between theoretical biophysics and condensed matter. I’m exploring a small project with Mikhail Tikhonov at WashU.</p><p class="quiet-note">This is an exploratory project; I have not formally joined the group.</p></section><section>${sectionTitle('2','Selected earlier work')}
${item('2025–2026¹','Beam-induced backgrounds','Lawrence Berkeley National Laboratory · US Muon Collider Collaboration. Studied oversampling methods that preserve particle correlations and machine learning approaches to generating background data.')}
${item('2024–2025','2+1D Hamiltonian lattice QED','Princeton University. Derived and implemented a lattice model in Mathematica; computed ground-state energies, fermion bilinears, and mass gaps on a 2 × 2 lattice, reproducing perturbative results.')}
${item('SUMMER 2024','Understanding a machine learning trigger','CERN · CMS. Investigated the CICADA Level-1 trigger through generated calorimeter deposit patterns and identified systematic biases associated with tower calibration.')}
${item('2024','Large-order quantum mechanics','Princeton University. Used instanton calculations to study correlation functions and large-order perturbative behavior in quantum-mechanical toy models.')}
${item('2023–2024','Axions & precision measurement','Princeton University. Reviewed axion detection experiments and investigated heading-error corrections in SERF magnetometers.')}
<p class="footnote">¹ The May 2026 CV lists this project as ongoing. Its present status still needs updating.</p></section></div>`;
}

export function teaching() {
  return `${pageHeading('03','Teaching & talks','Courses, tutoring, and presentations.')}<div class="document-body"><section>${sectionTitle('1','Teaching')}<p class="course-code">CURRENT · WASHINGTON UNIVERSITY IN ST. LOUIS</p><h3 class="large-heading">Focused Physics I</h3><p class="lead">Teaching assistant for Physics 1760, an honors-level introduction to physics.</p><p class="quiet-note">Office hours, course links, and resources will be added here.</p>
${item('FEB 2023–MAY 2024','Undergraduate Course Assistant','Princeton University · PHY103 Introductory Mechanics and PHY104 Introductory Electromagnetism. Hosted office hours, led problem sessions, and prepared solution sets.')}
${item('SEP 2023–DEC 2024','Physics Department Peer Tutor','Princeton University · Classical Mechanics and Quantum Mechanics I & II. Tutored students in problem-solving, conceptual reasoning, and analytical skills.')}</section><section id="talks">${sectionTitle('2','Talks')}<div class="upcoming-talk"><span class="entry-date">OCTOBER 2026 · PLANNED</span><p>A first talk is on the way. Title and details to follow.</p></div></section></div>`;
}

export function making() {
  return `${pageHeading('04','Things I make','Software, small tools, and other experiments.')}<div class="document-body"><section>${sectionTitle('1','Niceties')}<p class="lead">Small pieces of software that make everyday work a little more pleasant.</p><div class="project-feature"><div class="paper-night-art" aria-label="An illustration of a research paper in a dark reading palette"><div class="mini-paper"><span class="mini-moon">☾</span><span class="mini-paper-label">PAPER NIGHT</span><i></i><i></i><i></i><div class="mini-equation">Z = ∑ e<sup>−βE</sup></div><i></i><i></i></div></div><div><p class="eyebrow">BROWSER EXTENSION · LOCAL PROTOTYPE</p><h3>Paper Night</h3><p>Dark reading palettes for INSPIRE, arXiv, and bioRxiv. Cool Midnight and warm Lamplight, with independent controls for each site.</p><p>Figures retain their original colors. Settings stay in your browser.</p><span class="project-status"><span></span> In development</span></div></div></section></div>`;
}

export function writing(posts) {
  const rows = entries => entries.map(post => `<a href="${post.slug}.html" class="post-row"><span class="post-meta">${esc(post.kind || post.date)}</span><div><h3>${esc(post.title)}</h3><p>${esc(post.description || '')}</p></div><span aria-hidden="true">↗</span></a>`).join('');
  const informal = posts.filter(post => post.section !== 'academic');
  const academic = posts.filter(post => post.section === 'academic');
  return `${pageHeading('02','Writings','Posts, reflections, and academic writing.')}<div class="document-body"><section id="posts">${sectionTitle('1','Posts & reflections')}<p>Thoughts in progress, observations, and longer pieces.</p><div class="post-list">${informal.length ? rows(informal) : '<p class="empty-inline">No posts yet.</p>'}</div></section><section id="academic">${sectionTitle('2','Academic writing')}<p>Research writing, expositions, and calculations.</p><div class="post-list">${academic.length ? rows(academic) : '<p class="empty-inline">Academic pieces will appear here.</p>'}</div><p class="quiet-note">The equation specimen is demonstration copy, not a piece by Rafael.</p></section></div>`;
}

export function article(post) {
  return `<article class="article"><header class="document-heading"><a class="back-link" href="writing.html">← Writings</a><p class="eyebrow">${esc(post.kind || post.date)}</p><h1>${esc(post.title)}</h1><p class="document-deck">${esc(post.description || '')}</p></header><div class="prose">${post.html}</div><div class="article-end">∗ &nbsp; ∗ &nbsp; ∗</div></article>`;
}
