import { escapeHtml as esc } from './content.mjs';

export function siteUrl(site) {
  let url;
  try { url = new URL(site.url); } catch { throw new Error('Set url in content/site.json to the full HTTPS website address.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('The website url must use HTTPS without credentials, a query, or a fragment.');
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.href;
}

export const canonicalUrl = (site, page) => new URL(page === 'index.html' ? '' : page, siteUrl(site)).href;
const jsonForHtml = value => JSON.stringify(value).replace(/</g, '\\u003c');

export function searchHead(site, page, title, { post = false, seoTitle, seoDescription, description } = {}) {
  const base = siteUrl(site);
  const url = canonicalUrl(site, page);
  const isHome = page === 'index.html';
  const displayName = [site.givenNames, site.familyName].filter(Boolean).join(' ') || site.name;
  const pageTitle = seoTitle || (isHome ? site.seoTitle || site.name : `${title} | ${displayName}`);
  const summary = seoDescription || description || (post ? `${title} — writing by ${site.name}.` : site.description);
  if (!summary) throw new Error(`Add a search description for ${page}.`);
  const personId = base + '#person';
  const websiteId = base + '#website';
  const pageId = url + '#webpage';
  const image = site.portrait ? new URL(`assets/${site.portrait}`, base).href : null;
  const alternateNames = site.alternateNames ?? [];
  if (!Array.isArray(alternateNames) || alternateNames.some(name => typeof name !== 'string' || !name.trim())) {
    throw new Error('alternateNames must be a list of non-empty names in content/site.json.');
  }
  const person = {
    '@type': 'Person', '@id': personId, name: site.name,
    alternateName: [...new Set([displayName, site.shortName, ...alternateNames.map(name => name.trim())].filter(name => name && name !== site.name))],
    url: base, jobTitle: site.role,
    affiliation: { '@type': 'Organization', name: site.affiliation },
    ...(image ? { image } : {})
  };
  if (site.sameAs?.length) {
    for (const address of site.sameAs) {
      const profile = new URL(address);
      if (profile.protocol !== 'https:' || profile.username || profile.password) throw new Error('sameAs profiles must be public HTTPS URLs.');
    }
    person.sameAs = site.sameAs;
  }
  const graph = [person, {
    '@type': 'WebSite', '@id': websiteId, url: base, name: site.name,
    alternateName: displayName, inLanguage: 'en', publisher: { '@id': personId }
  }, {
    '@type': isHome ? 'ProfilePage' : post ? 'WebPage' : 'CollectionPage',
    '@id': pageId, url, name: pageTitle, description: summary, inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    ...(isHome ? { mainEntity: { '@id': personId } } : { about: { '@id': personId } })
  }];
  if (post) {
    graph.push({
      '@type': 'BlogPosting', '@id': url + '#article', url, headline: title,
      description: summary, inLanguage: 'en', mainEntityOfPage: { '@id': pageId },
      author: { '@id': personId }, publisher: { '@id': personId },
      ...(post.date ? { datePublished: post.date } : {}),
      ...(post.updated ? { dateModified: post.updated } : {})
    });
  }
  const meta = (name, value, property = false) => `<meta ${property ? 'property' : 'name'}="${name}" content="${esc(value)}">`;
  return [
    `<title>${esc(pageTitle)}</title>`, meta('description', summary), meta('author', site.name),
    `<link rel="canonical" href="${esc(url)}">`,
    meta('robots', 'index, follow, max-image-preview:large'),
    meta('og:type', post ? 'article' : 'website', true), meta('og:locale', 'en_US', true),
    meta('og:site_name', site.name, true), meta('og:title', pageTitle, true),
    meta('og:description', summary, true), meta('og:url', url, true),
    meta('twitter:card', 'summary'), meta('twitter:title', pageTitle), meta('twitter:description', summary),
    ...(image ? [meta('og:image', image, true), meta('og:image:alt', site.portraitAlt || site.name, true),
      meta('twitter:image', image), meta('twitter:image:alt', site.portraitAlt || site.name)] : []),
    ...(post?.date ? [meta('article:published_time', post.date, true), meta('article:author', base, true)] : []),
    ...(post?.updated ? [meta('article:modified_time', post.updated, true)] : []),
    ...(site.googleSiteVerification ? [meta('google-site-verification', site.googleSiteVerification)] : []),
    `<script type="application/ld+json">${jsonForHtml({ '@context': 'https://schema.org', '@graph': graph })}</script>`
  ].join('\n');
}

export function sitemap(site, pages) {
  const urls = [...new Set(pages.map(page => canonicalUrl(site, page)))];
  // Omit lastmod rather than mistaking a rebuild for a content change.
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${esc(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
}

export const robots = site => `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', siteUrl(site)).href}\n`;
