import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';

const parser = new Marked(markedKatex({ throwOnError: true, trust: false, output: 'htmlAndMathml' }));
export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// All Markdown is trusted author content, not a public upload API.
export const renderMarkdown = source => parser.parse(source);

function readMetadata(source, filename, required = false) {
  source = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const match = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);
  if (!match) {
    if (required || source.startsWith('---\n')) throw new Error(`Missing or unclosed metadata in ${filename}`);
    return { meta: {}, body: source };
  }
  const meta = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim()) continue;
    const split = line.indexOf(':');
    if (split < 1) throw new Error(`Invalid metadata in ${filename}`);
    meta[line.slice(0, split).trim()] = line.slice(split + 1).trim();
  }
  return { meta, body: match[2] };
}

// Ordinary Markdown sections; "### date | title" keeps the existing timeline layout.
// Splitting lexer tokens (rather than lines) leaves fenced code and equations intact.
export function parsePage(source, filename = 'page') {
  const { meta, body } = readMetadata(source, filename);
  const tokens = parser.lexer(body);
  const intro = [];
  const sections = [];
  let target = intro;
  let section;
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 1) throw new Error(`Use ## for sections in ${filename}; the page title is supplied by the layout.`);
    if (token.type === 'heading' && token.depth === 2) {
      section = { title: token.text, tokens: [], entries: [], after: [] };
      sections.push(section);
      target = section.tokens;
    } else if (section && token.type === 'heading' && token.depth === 3 && token.text.includes(' | ')) {
      const split = token.text.indexOf(' | ');
      const entry = { label: token.text.slice(0, split).trim(), title: token.text.slice(split + 3).trim(), tokens: [] };
      section.entries.push(entry);
      target = entry.tokens;
    } else if (section?.entries.length && token.type === 'hr') {
      target = section.after;
    } else {
      target.push(token);
    }
  }
  const html = items => {
    items.links = tokens.links;
    return parser.parser(items);
  };
  return {
    ...meta,
    html: html(intro),
    sections: sections.map(section => ({
      title: section.title,
      html: html(section.tokens),
      entries: section.entries.map(entry => ({ label: entry.label, title: entry.title, html: html(entry.tokens) })),
      after: html(section.after)
    }))
  };
}

export function parsePost(source, slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Use a lowercase, hyphenated post filename.');
  if (['index', 'research', 'writing', 'teaching', 'making'].includes(slug)) throw new Error(`The filename ${slug}.md is reserved for a main page. Choose another post filename.`);
  const { meta, body } = readMetadata(source, slug, true);
  if (!meta.title || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? '')) throw new Error(`A title and ISO date are required in ${slug}`);
  const section = meta.section || 'posts';
  if (!['posts','academic'].includes(section)) throw new Error(`Use section: posts or section: academic in ${slug}`);
  return { ...meta, sample: meta.sample === 'true', section, slug, html: renderMarkdown(body) };
}
