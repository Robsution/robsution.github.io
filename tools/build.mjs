import { mkdir, readFile, writeFile, readdir, cp, copyFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePost, parsePage, renderMarkdown } from './content.mjs';
import * as templates from './templates.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export async function buildSite({ contentDir = path.join(root, 'content'), dist = path.join(root, 'dist') } = {}) {
  const site = JSON.parse(await readFile(path.join(contentDir, 'site.json'), 'utf8'));
  const content = { home: renderMarkdown(await readFile(path.join(contentDir, 'home.md'), 'utf8')) };
  for (const name of ['currently', 'research', 'writings', 'teaching', 'making']) {
    content[name] = parsePage(await readFile(path.join(contentDir, `${name}.md`), 'utf8'), `${name}.md`);
    if (name !== 'currently' && !content[name].title) throw new Error(`Add title: at the top of content/${name}.md.`);
  }
  if (content.currently.sections.length > 1) throw new Error('Use one ## section in content/currently.md. Add items with ### label | title.');
  if (content.writings.sections.length !== 2) throw new Error('Keep two ## sections in content/writings.md: informal writing first, academic writing second.');
  const posts = [];
  for (const filename of await readdir(path.join(contentDir, 'writing'))) {
    if (filename.endsWith('.md')) posts.push(parsePost(await readFile(path.join(contentDir, 'writing', filename), 'utf8'), filename.slice(0,-3)));
  }
  posts.sort((a,b) => b.date.localeCompare(a.date));
  const pages = [
    ['index.html','Home',templates.home(site,content,posts)],
    ['research.html',content.research.title,templates.documentPage(site,'01',content.research)],
    ['writing.html',content.writings.title,templates.writing(site,content.writings,posts)],
    ['teaching.html',content.teaching.title,templates.documentPage(site,'03',content.teaching)],
    ['making.html',content.making.title,templates.documentPage(site,'04',content.making,{projects:true})]
  ];
  await mkdir(path.join(dist, 'assets'), { recursive: true });
  // Clear only generated HTML to prevent deleted posts surviving a rebuild.
  for (const name of await readdir(dist)) if (name.endsWith('.html')) await unlink(path.join(dist, name));
  await cp(path.join(root, 'src/assets'), path.join(dist, 'assets'), { recursive: true });
  await cp(path.join(root, 'public'), path.join(dist, 'assets'), { recursive: true });
  await cp(path.join(root, 'node_modules/katex/dist'), path.join(dist, 'assets/katex'), { recursive: true, filter: source => !source.endsWith('.js') && !source.endsWith('.mjs') && !source.endsWith('.map') });
  await mkdir(path.join(dist, 'assets/fonts'), { recursive: true });
  for (const [family, variants] of [['eb-garamond', ['400-normal','400-italic','500-normal','600-normal']], ['source-serif-4',['400-normal','400-italic','600-normal']], ['libre-baskerville',['400-normal','400-italic','600-normal']], ['crimson-pro',['400-normal','400-italic','600-normal']], ['newsreader',['400-normal','400-italic','600-normal']], ['spectral',['400-normal','400-italic','600-normal']], ['alegreya',['400-normal','400-italic','600-normal']], ['crimson-text',['400-normal','400-italic','600-normal']], ['dm-sans',['400-normal','500-normal','600-normal']]]) {
    for (const variant of variants) {
      const file = `${family}-latin-${variant}.woff2`;
      await copyFile(path.join(root, `node_modules/@fontsource/${family}/files`, file), path.join(dist, 'assets/fonts', file));
    }
    await copyFile(path.join(root, `node_modules/@fontsource/${family}/LICENSE`), path.join(dist, 'assets/fonts', `${family}-LICENSE.txt`));
  }
  await copyFile(path.join(root,'node_modules/katex/LICENSE'), path.join(dist,'assets/katex/LICENSE.txt'));
  for (const [filename,title,body] of pages) await writeFile(path.join(dist,filename), templates.shell(site,filename,title,body));
  for (const post of posts) await writeFile(path.join(dist,`${post.slug}.html`), templates.shell(site, `${post.slug}.html`, post.title, templates.article(post), {post:true}));
  await writeFile(path.join(dist, '.nojekyll'), '');
  await writeFile(path.join(dist, 'assets/defaults.json'), JSON.stringify(site));
  return { count: pages.length + posts.length, dist };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildSite();
  console.log(`Built ${result.count} static pages in ${result.dist}`);
}
