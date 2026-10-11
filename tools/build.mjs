import { mkdir, readFile, writeFile, readdir, cp, copyFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePost } from './content.mjs';
import * as templates from './templates.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const site = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
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
const posts = [];
for (const filename of await readdir(path.join(root, 'content/writing'))) {
  if (filename.endsWith('.md')) posts.push(parsePost(await readFile(path.join(root, 'content/writing', filename), 'utf8'), filename.slice(0,-3)));
}
posts.sort((a,b) => b.date.localeCompare(a.date));
const pages = [['index.html','Home',templates.home(site)], ['research.html','Research',templates.research()], ['writing.html','Writings',templates.writing(posts)], ['teaching.html','Teaching & talks',templates.teaching()], ['making.html','Things I make',templates.making()]];
for (const [filename,title,body] of pages) await writeFile(path.join(dist,filename), templates.shell(site,filename,title,body));
for (const post of posts) await writeFile(path.join(dist,`${post.slug}.html`), templates.shell(site, `${post.slug}.html`, post.title, templates.article(post), {post:true}));
await writeFile(path.join(dist, '.nojekyll'), '');
await writeFile(path.join(dist, 'assets/defaults.json'), JSON.stringify(site));
console.log(`Built ${pages.length + posts.length} static pages in ${dist}`);
