import { readFileSync } from 'node:fs';
import { escapeHtml as esc } from './content.mjs';
import { searchHead } from './seo.mjs';

const landscape = readFileSync(new URL('../src/assets/landscape.svg', import.meta.url), 'utf8');
const navigation = [['research.html','Research'],['writing.html','Writings'],['teaching.html','Teaching & talks'],['making.html','Things I make']];
const anchor = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const sectionTitle = (n, title) => `<h2><span class="number">${n}.</span> ${esc(title)}</h2>`;
const item = entry => `<div class="entry"><div class="entry-date">${esc(entry.label)}</div><div class="entry-copy"><h3>${esc(entry.title)}</h3>${entry.html}</div></div>`;

function correspondence(site, photo = false) {
  return `<footer class="correspondence ${photo ? '' : 'compact'}" id="correspondence">${photo && site.portrait ? `<img class="portrait" src="assets/${esc(site.portrait)}" width="750" height="1000" loading="lazy" alt="${esc(site.portraitAlt || site.name)}">` : ''}<div>${photo ? '<h2><span class="star">*</span> Correspondence</h2>' : '<span class="star">*</span> Correspondence: '}<span class="email" id="email">${esc(site.email || '')}</span> <button class="copy" type="button" data-copy="${esc(site.email || '')}" aria-label="Copy email address" aria-live="polite">Copy</button></div></footer>`;
}

export function shell(site, page, title, content, options = {}) {
  const { post = false } = options;
  const isHome = page === 'index.html';
  const links = isHome ? navigation : [['index.html','Home'],...navigation];
  const nav = links.map(([href,label]) => `<a href="${href === 'index.html' ? './' : href}"${href === page || (post && href === 'writing.html') ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!doctype html>
<html lang="en" data-theme="paper" data-font="crimsontext" data-accent="blue" data-motif-color="burgundy">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${searchHead(site,page,title,options)}
<meta name="color-scheme" content="light"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="assets/fonts/crimson-text-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>${content.includes('class="katex"') ? '<link rel="stylesheet" href="assets/katex/katex.min.css">' : ''}<link rel="stylesheet" href="assets/style.css"><script defer src="assets/interactions.js"></script>${isHome ? '<script defer src="assets/landscape.js"></script>' : ''}</head>
<body class="${isHome ? 'first' : 'interior'}"><a class="skip" href="#main">Skip to content</a><div class="sheet"><header class="running-head"><a class="cv-link" href="assets/${esc(site.cvFile)}" download aria-label="Download CV (${esc(site.cvDate)} PDF)" title="Download CV · ${esc(site.cvDate)}">CV <small>PDF</small></a><nav aria-label="Main navigation">${nav}</nav></header><main id="main">${content}</main>${correspondence(site,isHome)}</div></body></html>`;
}

export function home(site, content, posts) {
  const [research, ...support] = content.currently.sections;
  const recent = posts.filter(post => post.section !== 'academic' && !post.sample && !post.draft).slice(0,3);
  const researchBlock = research ? `<section class="research" id="research">${sectionTitle(1,research.title)}${content.currently.html || ''}${research.html}<dl class="research-list">${research.entries.map(entry=>`<div><dt>${esc(entry.title)}</dt><dd>${entry.html}</dd></div>`).join('')}</dl><div class="research-after">${research.after}</div></section>` : '';
  const figure = `<figure class="landscape"><div class="plot" id="plot" role="button" tabindex="0" aria-label="Interactive contour landscape. Click to release a walker, or press Enter for a random starting point." aria-describedby="landscape-caption">${landscape}</div><figcaption id="landscape-caption"><strong>Figure 1.</strong> A noisy walk uphill on a toy landscape. <span id="verb">Click</span> to choose a starting point.</figcaption></figure>`;
  return `<div class="identity"><h1 aria-label="${esc(site.givenNames+' '+site.familyName)}">${esc(site.givenNames)} <span class="surname">${esc(site.familyName)}</span><sup><a href="#correspondence" aria-label="Correspondence details">*</a></sup></h1><p class="affiliation">${esc(site.affiliation || '')}</p><p class="role">${esc(site.role || '')}</p></div><section class="abstract" aria-labelledby="abstract-heading"><h2 id="abstract-heading">Abstract</h2>${content.home}</section><div class="first-grid">${researchBlock}${figure}${support.map((section,i)=>`<section id="${anchor(section.title)}">${sectionTitle(i+2,section.title)}<div class="section-copy">${section.html}${section.entries.map(item).join('')}${section.after}</div></section>`).join('')}${recent.length ? `<section class="home-writings">${sectionTitle(content.currently.sections.length+1,content.writings.title)}${rows(recent)}<a class="detail-link" href="writing.html">All writings</a></section>` : ''}</div>`;
}

export function pageHeading(site, n, title, subtitle) {
  return `<header class="document-heading"><a class="author-link" href="./">${esc(site.shortName || site.name)}</a><h1>${esc(title)}</h1>${subtitle ? `<p class="document-deck">${esc(subtitle)}</p>` : ''}</header>`;
}

export function documentPage(site, n, content) {
  const sections = content.sections.map((section,i)=>`<section id="${esc(anchor(section.title))}">${sectionTitle(i+1,section.title)}<div class="section-copy">${section.html}</div>${section.entries.map(item).join('')}${section.after ? `<div class="section-after">${section.after}</div>` : ''}</section>`).join('');
  return `${pageHeading(site,n,content.title,content.description)}<div class="document-body">${content.html}${sections}</div>`;
}

const formatDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T00:00:00Z')) : value || '';
const rows = entries => `<div class="post-list">${entries.map(post => `<div class="post-row"><p class="post-meta">${esc(post.kind || formatDate(post.date))}${post.publication ? ' · '+esc(post.publication) : ''}</p><h3><a href="${esc(post.externalUrl || post.slug+'.html')}">${esc(post.title)}</a></h3>${post.description ? `<p>${esc(post.description)}</p>` : ''}${post.sample ? '<p class="quiet-note">Sample writing for preview.</p>' : ''}</div>`).join('')}</div>`;

export function writing(site, content, posts) {
  const published = posts.filter(post=>!post.draft);
  const groups = [['posts',published.filter(post=>post.section !== 'academic')],['academic',published.filter(post=>post.section === 'academic')]];
  const sections = groups.map(([id,entries],i)=>{
    const section=content.sections[i];
    return `<section id="${id}">${sectionTitle(i+1,section.title)}${section.html}${section.entries.map(item).join('')}${section.after}${entries.length ? rows(entries) : ''}</section>`;
  }).join('');
  return `${pageHeading(site,'',content.title,content.description)}<div class="document-body">${content.html}${sections}</div>`;
}

export function article(post) {
  return `<article class="article"><header class="document-heading"><a class="back-link" href="writing.html">Writings</a><p class="post-meta">${esc(post.kind || formatDate(post.date))}</p><h1>${esc(post.title)}</h1>${post.description ? `<p class="document-deck">${esc(post.description)}</p>` : ''}</header><div class="prose">${post.html}</div></article>`;
}
