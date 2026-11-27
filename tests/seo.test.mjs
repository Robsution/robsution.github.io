import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { canonicalUrl, searchHead, sitemap } from '../tools/seo.mjs';
import { parsePost, renderMarkdown } from '../tools/content.mjs';
import { shell } from '../tools/templates.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const site = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
const graphFrom = html => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];

test('Every published page has a distinct title and description and a matching canonical/share URL', async () => {
  const titles = new Set(), descriptions = new Set();
  const pages = (await readdir(dist)).filter(file => file.endsWith('.html'));
  for (const page of pages) {
    const html = await readFile(path.join(dist, page), 'utf8');
    const url = canonicalUrl(site, page);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
    assert.ok(!titles.has(title), `Repeated title: ${page}`);
    assert.ok(!descriptions.has(description), `Repeated description: ${page}`);
    titles.add(title); descriptions.add(description);
    assert.equal([...html.matchAll(/rel="canonical"/g)].length, 1);
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
    assert.ok(html.includes(`<meta property="og:url" content="${url}">`));
    assert.ok(html.includes(`<meta property="og:title" content="${title}">`));
    assert.ok(html.includes(`<meta property="og:description" content="${description}">`));
    assert.ok(!html.includes('noindex'));
    if (site.googleSiteVerification) assert.ok(html.includes(`<meta name="google-site-verification" content="${site.googleSiteVerification}">`));
    const image = new URL(html.match(/property="og:image" content="([^"]+)"/)[1]);
    assert.equal(image.origin, new URL(site.url).origin);
    await access(path.join(dist, decodeURIComponent(image.pathname).replace(/^\//, '')));
    const graph = graphFrom(html);
    const webpage = graph.find(node => node['@id'] === url + '#webpage');
    assert.equal(webpage.url, url);
    assert.ok(graph.some(node => node['@id'] === webpage.isPartOf['@id']));
  }
});

test('The homepage identifies the real author and connects the profile, website, and confirmed external identity', async () => {
  const graph = graphFrom(await readFile(path.join(dist, 'index.html'), 'utf8'));
  const profile = graph.find(node => node['@type'] === 'ProfilePage');
  const person = graph.find(node => node['@id'] === profile.mainEntity['@id']);
  assert.equal(person['@type'], 'Person');
  assert.equal(person.name, site.name);
  assert.equal(person.url, site.url);
  assert.equal(person.affiliation.name, site.affiliation);
  assert.deepEqual(person.sameAs, site.sameAs);
  assert.ok(person.alternateName.includes(site.givenNames + ' ' + site.familyName));
  assert.ok(!graph.some(node => node['@type'] === 'ScholarlyArticle'));
});

test('Canonical URLs support root and project-subpath hosting and reject unsuitable website addresses', () => {
  assert.equal(canonicalUrl({ url: 'https://example.org' }, 'index.html'), 'https://example.org/');
  assert.equal(canonicalUrl({ url: 'https://example.org/site' }, 'index.html'), 'https://example.org/site/');
  assert.equal(canonicalUrl({ url: 'https://example.org/site/' }, 'research.html'), 'https://example.org/site/research.html');
  for (const url of [undefined, 'not a URL', 'http://example.org/', 'https://user:secret@example.org/', 'https://example.org/?x=1', 'https://example.org/#home']) {
    assert.throws(() => canonicalUrl({ url }, 'index.html'), /HTTPS/);
  }
});

test('Discovery files list exactly the built public pages without invented modification dates', async () => {
  const xml = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  const pages = (await readdir(dist)).filter(file => file.endsWith('.html'));
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls.sort(), pages.map(page => canonicalUrl(site, page)).sort());
  assert.equal(urls.length, new Set(urls).size);
  assert.doesNotMatch(xml, /lastmod|priority|changefreq|typesetting-a-thought|pghrev|index\.html|design-study/);
  const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
  assert.ok(robots.includes('User-agent: *\nAllow: /'));
  assert.ok(robots.includes(`Sitemap: ${new URL('sitemap.xml', site.url).href}`));
  assert.ok(sitemap(site, ['index.html', 'index.html']).match(/<loc>/g).length === 1);
});

test('Head metadata escapes markup and JSON cannot terminate its script element', () => {
  const unsafe = '</script><script>alert("x")</script>';
  const head = searchHead({ ...site, name: unsafe }, 'example.html', 'An "example" & more', { description: unsafe });
  assert.ok(head.includes('&lt;/script&gt;'));
  assert.equal([...head.matchAll(/<\/script>/g)].length, 1);
  assert.equal(graphFrom(head).find(node => node['@type'] === 'Person').name, unsafe);
  assert.doesNotMatch(head, /<script>alert/);
});

test('Local writings expose their own summary and actual dates without inventing academic publication claims', () => {
  const post = parsePost('---\ntitle: A question\ndate: 2026-11-01\nupdated: 2026-11-20\ndescription: A particular question in physics.\n---\nA paragraph.', 'a-question');
  const head = searchHead(site, 'a-question.html', post.title, { ...post, post });
  const article = graphFrom(head).find(node => node['@type'] === 'BlogPosting');
  assert.equal(article.headline, post.title);
  assert.equal(article.description, post.description);
  assert.equal(article.datePublished, post.date);
  assert.equal(article.dateModified, post.updated);
  assert.equal(article.author['@id'], site.url + '#person');
  assert.equal(article.mainEntityOfPage['@id'], site.url + 'a-question.html#webpage');
  for (const date of ['2026-02-30', '2026-13-01']) {
    assert.throws(() => parsePost(`---\ntitle: Bad date\ndate: ${date}\n---\nText`, 'bad-date'), /valid ISO date/);
  }
  assert.throws(() => parsePost('---\ntitle: Bad update\ndate: 2026-11-01\nupdated: 2026-10-01\n---\nText', 'bad-update'), /updated/);
});

test('Math styles load only when rendered equations need them and the reading font is preloaded', () => {
  const plain = shell(site, 'index.html', 'Home', '<p>A paragraph.</p>');
  assert.doesNotMatch(plain, /rel="stylesheet" href="assets\/katex/);
  assert.match(plain, /rel="preload"[^>]+as="font"[^>]+crossorigin/);
  const math = shell(site, 'example.html', 'Example', renderMarkdown('$E=mc^2$'));
  assert.match(math, /rel="stylesheet" href="assets\/katex\/katex.min.css"/);
});
