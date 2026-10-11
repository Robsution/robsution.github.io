import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access, mkdir, mkdtemp, cp, writeFile, unlink, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parsePost, parsePage, escapeHtml } from '../tools/content.mjs';
import { writing, shell, home, documentPage } from '../tools/templates.mjs';
import { buildSite } from '../tools/build.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const writingCopy=parsePage('---\ntitle: Writings\ndescription: A collection\n---\n## Informal\n\nAn introduction.\n\n## Academic\n\nAnother introduction.');
const homeCopy={home:'<p>An editable bio.</p>',currently:{sections:[]},writings:writingCopy};

test('Markdown renders inline and display equations with accessible MathML',()=>{
  const result=parsePost('---\ntitle: Test\ndate: 2026-10-10\n---\nA value $x^2$.\n\n$$\nZ=\\sum_i e^{-E_i}\n$$\n','test');
  assert.match(result.html,/class="katex"/);
  assert.match(result.html,/class="katex-display"/);
  assert.match(result.html,/<math xmlns=/);
});
test('Code examples keep dollar delimiters literal',()=>{
  const result=parsePost('---\ntitle: Test\ndate: 2026-10-10\n---\n`$x$`\n\n```tex\n$y^2$\n```\n','test');
  assert.doesNotMatch(result.html,/class="katex"/);
  assert.match(result.html,/<code>\$x\$<\/code>/);
});
test('Malformed content fails the build instead of silently publishing',()=>{
  assert.throws(()=>parsePost('No metadata','test'));
  assert.throws(()=>parsePost('---\ntitle: Test\ndate: soon\n---\ntext','test'));
  assert.throws(()=>parsePost('---\ntitle: Test\ndate: 2026-10-10\n---\ntext','../escape'));
  assert.throws(()=>parsePost('---\ntitle: Test\ndate: 2026-10-10\n---\ntext','research'),/reserved/);
  assert.throws(()=>parsePost('---\ntitle: Test\ndate: 2026-10-10\n---\n$\\notARealCommand{x}$','test'));
});
test('All built page links and resources resolve, including under a project subpath',async()=>{
  const site=JSON.parse(await readFile(path.join(root,'content/site.json'),'utf8'));
  const pages=(await readdir(dist)).filter(name=>name.endsWith('.html'));
  for(const required of ['index.html','research.html','writing.html','teaching.html','making.html']) assert.ok(pages.includes(required));
  for(const retired of ['talks.html','projects.html','cv.html']) assert.ok(!pages.includes(retired));
  for(const page of pages){
    const html=await readFile(path.join(dist,page),'utf8');
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${page} needs one main heading`);
    assert.match(html,/aria-current="page"/);
    assert.ok(html.includes(`<a class="cv-link" href="assets/${escapeHtml(site.cvFile)}" download`));
    assert.doesNotMatch(html,/Physics · WashU|data-writing-label|writingLabel/);
    for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
      const url=match[1];
      if(url.startsWith('mailto:')||url.startsWith('#'))continue;
      if(/^https?:\/\//.test(url)){ new URL(url); continue; }
      assert.ok(!url.startsWith('/')&&!url.includes('://'),`Asset is not project-relative: ${url}`);
      const resolved=path.resolve(dist,path.dirname(page),decodeURIComponent(url.split(/[?#]/)[0]));
      await access(resolved);
    }
  }
  const css=await readFile(path.join(dist,'assets/style.css'),'utf8');
  for(const match of css.matchAll(/url\(([^)]+)\)/g))await access(path.join(dist,'assets',match[1]));
});
test('The configured CV date and downloadable PDF reach the public site',async()=>{
  const site=JSON.parse(await readFile(path.join(root,'content/site.json'),'utf8'));
  const home=await readFile(path.join(dist,'index.html'),'utf8');
  assert.ok(home.includes(`Download CV (${escapeHtml(site.cvDate)} PDF)`));
  const pdf=await readFile(path.join(dist,'assets',site.cvFile));
  assert.equal(pdf.subarray(0,5).toString(),'%PDF-');
});

test('Public pages keep the chosen design without preview controls or preference scripts',async()=>{
  const site=JSON.parse(await readFile(path.join(root,'content/site.json'),'utf8'));
  const publicSite={...site,previewTools:false};
  const html=shell(publicSite,'index.html','Home',home(publicSite,homeCopy,[]));
  assert.doesNotMatch(html,/Explore the design|Try a photograph|Your portrait|portrait-input|assets\/appearance\.js|assets\/site\.js|noindex/);
  assert.ok(html.includes(`data-font="${site.defaultFont}"`));
  assert.ok(html.includes(`data-theme="${site.defaultTheme}"`));
  assert.ok(html.includes(`data-accent="${site.defaultAccent}"`));
  assert.ok(html.includes(`data-motif-color="${site.defaultMotifColor}"`));
  const withPortrait={...publicSite,portrait:'portrait.jpg'};
  assert.match(home(withPortrait,homeCopy,[]),/src="assets\/portrait\.jpg"/);
  for(const page of (await readdir(dist)).filter(name=>name.endsWith('.html'))){
    const built=await readFile(path.join(dist,page),'utf8');
    assert.doesNotMatch(built,/Explore the design|Try a photograph|assets\/appearance\.js|assets\/site\.js/);
  }
});

test('Every palette has readable body, secondary, and link text on its surfaces',async()=>{
  const css=await readFile(path.join(root,'src/assets/style.css'),'utf8');
  const luminance=hex=>{
    const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
    return channels.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  };
  const palettes=[...css.matchAll(/:root(?:\[data-theme=([^\]]+)\])?\{([^}]+)\}/g)];
  assert.equal(palettes.length,3);
  for(const [,name='paper',block] of palettes){
    const colors=Object.fromEntries([...block.matchAll(/--([a-z]+):(#\w{6})/g)].map(m=>[m[1],m[2]]));
    for(const text of ['ink','muted','blue','burgundy','graphite'])for(const surface of ['paper','inset','panel']){
      const a=luminance(colors[text]),b=luminance(colors[surface]);
      const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      assert.ok(ratio>=4.5,`${name}: ${text} on ${surface} is only ${ratio.toFixed(2)}:1`);
    }
  }
});

test('Writings keeps informal posts before academic pieces regardless of date',()=>{
  const html=writing({name:'An author'},writingCopy,[
    {slug:'new-paper',title:'Academic example',date:'2026-10-10',section:'academic'},
    {slug:'older-post',title:'Informal example',date:'2026-09-01',section:'posts'}
  ]);
  assert.ok(html.indexOf('Informal example')<html.indexOf('Academic example'));
  assert.ok(html.indexOf('id="posts"')<html.indexOf('id="academic"'));
  assert.equal(parsePost('---\ntitle: A post\ndate: 2026-10-10\n---\nText','a-post').section,'posts');
  assert.throws(()=>parsePost('---\ntitle: A post\ndate: 2026-10-10\nsection: typo\n---\nText','a-post'));
});

test('Page Markdown keeps timeline entries, links, notes, equations, and section order',()=>{
  const content=parsePage('---\r\ntitle: Teaching & talks\r\ndescription: Editable subtitle: including a colon.\r\n---\r\n\r\n## Teaching\r\n\r\nIntro $x^2$.\r\n\r\n### 2024–2026 | A course\r\n\r\nA **description** with a [resource][guide].\r\n\r\n> Office hours: tomorrow.\r\n\r\n```md\r\n## This is a code example\r\n### DATE | Still code\r\n```\r\n\r\n---\r\n\r\nA footnote.\r\n\r\n## Talks\r\n\r\n### 2026 | A talk\r\n\r\nAbstract.\r\n\r\n[guide]: https://example.org/\r\n');
  const html=documentPage({name:'Test Author'},'03',content);
  assert.equal(content.sections.length,2);
  assert.equal(content.sections[0].entries.length,1);
  assert.match(html,/class="entry-date">2024–2026/);
  assert.match(html,/<strong>description<\/strong>/);
  assert.match(html,/href="https:\/\/example.org\/"/);
  assert.match(html,/<blockquote>/);
  assert.match(html,/<math xmlns=/);
  assert.match(html,/class="section-after"><p>A footnote/);
  assert.match(html,/id="talks"/);
  assert.ok(html.indexOf('A course')<html.indexOf('A talk'));
  assert.throws(()=>parsePage('# Extra main heading'),/Use ##/);
});

test('Editing content, identity, CV date, and adding or deleting writing needs no template or test edits',async()=>{
  const artifactDir=path.join(root,'artifacts');
  await mkdir(artifactDir,{recursive:true});
  const temporary=await mkdtemp(path.join(artifactDir,'editing-test-'));
  const contentDir=path.join(temporary,'content');
  const output=path.join(temporary,'dist');
  try {
    await cp(path.join(root,'content'),contentDir,{recursive:true});
    for(const file of await readdir(path.join(contentDir,'writing')))if(file.endsWith('.md'))await unlink(path.join(contentDir,'writing',file));
    await writeFile(path.join(contentDir,'home.md'),'A **new bio** with a [research link](https://example.org/) and $E=mc^2$.\n\nA second paragraph.');
    const site=JSON.parse(await readFile(path.join(contentDir,'site.json'),'utf8'));
    Object.assign(site,{name:'Example Full Name',givenNames:'Example',familyName:'Full Name',shortName:'E. Name',role:'An updated role',affiliation:'A different university',location:'A new city',cvDate:'June 2030'});
    await writeFile(path.join(contentDir,'site.json'),JSON.stringify(site));
    const postFile=path.join(contentDir,'writing','a-new-post.md');
    await writeFile(postFile,'---\ntitle: A new post\ndate: 2030-06-01\nsection: posts\n---\nA new piece.');
    await buildSite({contentDir,dist:output});
    const html=await readFile(path.join(output,'index.html'),'utf8');
    for(const text of ['<strong>new bio</strong>','https://example.org/','<math xmlns=','A second paragraph.','E. Name','Example <span>Full Name</span>','An updated role','A different university','A new city','Download CV (June 2030 PDF)','CV · June 2030','a-new-post.html'])assert.ok(html.includes(text),text);
    assert.doesNotMatch(html,/No posts yet/);
    const listing=await readFile(path.join(output,'writing.html'),'utf8');
    assert.match(listing,/A new post/);
    assert.doesNotMatch(listing,/Sample writing|equation specimen/);
    await unlink(postFile);
    await buildSite({contentDir,dist:output});
    await assert.rejects(access(path.join(output,'a-new-post.html')));
    assert.match(await readFile(path.join(output,'index.html'),'utf8'),/No posts yet/);
    assert.doesNotMatch(await readFile(path.join(output,'writing.html'),'utf8'),/a-new-post|Sample writing/);
  } finally {
    // Only remove the test directory created above, inside this repo's ignored artifacts folder.
    const relative=path.relative(artifactDir,temporary);
    assert.ok(relative.startsWith('editing-test-')&&!relative.includes(path.sep));
    await rm(temporary,{recursive:true,force:true});
  }
});

test('Sample labels follow the writing metadata and disappear when a piece is made real',()=>{
  const source='---\ntitle: Example\ndate: 2026-10-10\nsample: true\n---\nExample text.';
  const sample=parsePost(source,'example');
  assert.match(writing({name:'Author'},writingCopy,[sample]),/Sample writing for preview/);
  assert.doesNotMatch(home({givenNames:'An',familyName:'Author'},homeCopy,[sample]),/example.html/);
  const actual=parsePost(source.replace('sample: true','sample: false'),'example');
  assert.doesNotMatch(writing({name:'Author'},writingCopy,[actual]),/Sample writing for preview/);
  assert.match(home({givenNames:'An',familyName:'Author'},homeCopy,[actual]),/example.html/);
});

test('New font preferences and independent motif color survive initialization',async()=>{
  const script=await readFile(path.join(root,'src/assets/appearance.js'),'utf8');
  for(const font of ['newsreader','spectral','alegreya','crimsontext']){
    const dataset={theme:'paper',accent:'blue',font:'garamond',motifColor:'accent'};
    vm.runInNewContext(script,{document:{documentElement:{dataset}},localStorage:{getItem:()=>JSON.stringify({font,motifColor:'burgundy'})},location:{search:''},URLSearchParams});
    assert.equal(dataset.font,font);
    assert.equal(dataset.motifColor,'burgundy');
    assert.equal(dataset.accent,'blue');
  }
  const dataset={font:'newsreader',motifColor:'burgundy'};
  vm.runInNewContext(script,{document:{documentElement:{dataset}},localStorage:{getItem:()=>JSON.stringify({font:'spectral',motifColor:'invalid'})},location:{search:'?font=alegreya'},URLSearchParams});
  assert.equal(dataset.font,'alegreya');
  assert.equal(dataset.motifColor,'burgundy');
});
