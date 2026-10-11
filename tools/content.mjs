import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';

const parser = new Marked(markedKatex({ throwOnError: true, trust: false, output: 'htmlAndMathml' }));
export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// Author-controlled Markdown only. This is a local static build, not an upload API.
export function parsePost(source, slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Use a lowercase, hyphenated post filename.');
  const match = source.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing metadata in ${slug}`);
  const meta = {};
  for (const line of match[1].split('\n')) {
    const split = line.indexOf(':');
    if (split < 1) throw new Error(`Invalid metadata in ${slug}`);
    meta[line.slice(0, split).trim()] = line.slice(split + 1).trim();
  }
  if (!meta.title || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? '')) throw new Error(`A title and ISO date are required in ${slug}`);
  const section = meta.section || 'posts';
  if (!['posts','academic'].includes(section)) throw new Error(`Use section: posts or section: academic in ${slug}`);
  return { ...meta, section, slug, html: parser.parse(match[2]) };
}
