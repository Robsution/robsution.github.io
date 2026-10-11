import { escapeHtml as esc } from './content.mjs';

const navigation = [['index.html','Home','00'],['research.html','Research','01'],['writing.html','Writings','02'],['teaching.html','Teaching & talks','03'],['making.html','Things I make','04']];
const sectionTitle = (n, title, link = '') => `<div class="section-title"><h2><span>${n}</span> ${title}</h2>${link}</div>`;
const arrowLink = (url, text) => `<a class="text-link" href="${url}">${text} <span aria-hidden="true">↗</span></a>`;
const item = entry => `<div class="entry"><div class="entry-date">${esc(entry.label)}</div><div class="entry-copy"><h3>${esc(entry.title)}</h3>${entry.html}</div></div>`;

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
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · ${esc(site.name)}</title><meta name="description" content="${esc(`${site.name} — ${site.role}, ${site.affiliation}.`)}"><meta name="color-scheme" content="light dark">${site.previewTools?'<meta name="robots" content="noindex, nofollow">':''}<link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/katex/katex.min.css"><link rel="stylesheet" href="assets/style.css">${site.previewTools?'<script src="assets/appearance.js"></script><script type="module" src="assets/site.js"></script>':''}</head>
<body><a class="skip-link" href="#main">Skip to content</a>
<div class="page-shell"><header class="site-header"><div class="running-head"><a class="site-name" href="index.html" aria-label="${esc(site.name)} home">${esc(site.shortName)}</a><a class="cv-link" href="assets/${esc(site.cvFile)}" download aria-label="Download CV (${esc(site.cvDate)} PDF)" title="Download CV · ${esc(site.cvDate)}">CV <span aria-hidden="true">↓</span></a></div><nav aria-label="Main navigation">${nav}</nav></header>
<main id="main">${content}</main>
<footer class="site-footer"><span>${esc(site.name)} <span class="footer-dot">·</span> ${esc(site.location)}</span><a href="mailto:${esc(site.email)}">Email ↗</a><a href="assets/${esc(site.cvFile)}" download>CV · ${esc(site.cvDate)} ↓</a></footer></div>
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

// This file controls layout. Author-facing text lives in content/*.md and site.json.
export function home(site, content, posts) {
  const current = content.currently.sections[0];
  const recent = posts.filter(post => post.section !== 'academic' && !post.sample).slice(0, 3);
  const writings = content.writings;
  return `<section class="home-intro"><div class="home-copy"><h1>${esc(site.givenNames)} <span>${esc(site.familyName)}</span></h1><p class="position">${esc(site.role)}</p><p class="affiliation">${esc(site.affiliation)}</p><div class="abstract">${content.home}</div><div class="abstract-links">${arrowLink('research.html','Research')}${arrowLink(`mailto:${esc(site.email)}`,'Email')}</div></div>
<aside class="portrait-margin"><figure class="portrait-figure"><div class="portrait-frame">${site.portrait?`<img class="portrait-image" src="assets/${esc(site.portrait)}" alt="${esc(site.portraitAlt)}">`:site.previewTools?'<img class="portrait-image" alt="Your selected portrait" hidden>':''}<div class="portrait-placeholder"><span class="portrait-initials">racs.</span>${site.previewTools?'<span>Your portrait</span><button class="choose-portrait" type="button">Try a photograph ↗</button>':''}</div></div></figure></aside></section>
${current ? `<section class="current-section">${sectionTitle('01',esc(current.title))}<div class="current-grid"><div class="current-entries">${content.currently.html || ''}${current.html}${current.entries.map(item).join('')}${current.after}</div>${motif()}</div></section>` : content.currently.html || ''}
<section class="home-writings">${sectionTitle('02',esc(writings.title),arrowLink('writing.html','Browse writings'))}<p>${esc(writings.homeDescription || writings.description)}</p>${recent.length ? rows(recent) : '<p class="quiet-note">No posts yet.</p>'}</section>`;
}

export function pageHeading(site, n, title, subtitle) {
  return `<header class="document-heading"><p class="eyebrow">§ ${n} / ${esc(site.name)}</p><h1>${esc(title)}</h1><p class="document-deck">${esc(subtitle || '')}</p></header>`;
}

const anchor = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function documentPage(site, n, content, { projects = false } = {}) {
  const sections = content.sections.map((section, i) => {
    const entries = section.entries.map((entry, j) => projects
      ? `<div class="project-feature${i === 0 && j === 0 ? '' : ' text-only'}">${i === 0 && j === 0 ? paperArt(entry.title) : ''}<div><p class="eyebrow">${esc(entry.label)}</p><h3>${esc(entry.title)}</h3>${entry.html}</div></div>`
      : item(entry)).join('');
    return `<section id="${esc(anchor(section.title))}">${sectionTitle(i + 1,esc(section.title))}<div class="section-copy">${section.html}</div>${entries}${section.after ? `<div class="section-after">${section.after}</div>` : ''}</section>`;
  }).join('');
  return `${pageHeading(site,n,content.title,content.description)}<div class="document-body">${content.html}${sections}</div>`;
}

function paperArt(title) {
  return `<div class="paper-night-art" aria-label="An illustration of a research paper in a dark reading palette"><div class="mini-paper"><span class="mini-moon">☾</span><span class="mini-paper-label">${esc(title)}</span><i></i><i></i><i></i><div class="mini-equation">Z = ∑ e<sup>−βE</sup></div><i></i><i></i></div></div>`;
}

const rows = entries => entries.map(post => `<a href="${post.slug}.html" class="post-row"><span class="post-meta">${esc(post.kind || post.date)}</span><div><h3>${esc(post.title)}</h3><p>${esc(post.description || '')}</p>${post.sample ? '<p class="quiet-note">Sample writing for preview.</p>' : ''}</div><span aria-hidden="true">↗</span></a>`).join('');

export function writing(site, content, posts) {
  const groups = [['posts', posts.filter(post => post.section !== 'academic')], ['academic', posts.filter(post => post.section === 'academic')]];
  const sections = groups.map(([id, entries], i) => {
    const section = content.sections[i];
    return `<section id="${id}">${sectionTitle(i + 1,esc(section.title))}${section.html}${section.entries.map(item).join('')}${section.after}<div class="post-list">${entries.length ? rows(entries) : '<p class="empty-inline">No pieces yet.</p>'}</div></section>`;
  }).join('');
  return `${pageHeading(site,'02',content.title,content.description)}<div class="document-body">${content.html}${sections}</div>`;
}

export function article(post) {
  return `<article class="article"><header class="document-heading"><a class="back-link" href="writing.html">← Writings</a><p class="eyebrow">${esc(post.kind || post.date)}</p><h1>${esc(post.title)}</h1><p class="document-deck">${esc(post.description || '')}</p></header><div class="prose">${post.html}</div><div class="article-end">∗ &nbsp; ∗ &nbsp; ∗</div></article>`;
}
