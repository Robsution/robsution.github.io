import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parsePost } from '../tools/content.mjs';
import { writing, shell, home } from '../tools/templates.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');

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
  assert.throws(()=>parsePost('---\ntitle: Test\ndate: 2026-10-10\n---\n$\\notARealCommand{x}$','test'));
});
test('All built page links and resources resolve, including under a project subpath',async()=>{
  const pages=(await readdir(dist)).filter(name=>name.endsWith('.html'));
  for(const required of ['index.html','research.html','writing.html','teaching.html','making.html']) assert.ok(pages.includes(required));
  for(const retired of ['talks.html','projects.html','cv.html']) assert.ok(!pages.includes(retired));
  for(const page of pages){
    const html=await readFile(path.join(dist,page),'utf8');
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${page} needs one main heading`);
    assert.match(html,/aria-current="page"/);
    assert.match(html,/<a class="cv-link" href="assets\/cv-2026-05.pdf" download/);
    assert.doesNotMatch(html,/Physics · WashU|data-writing-label|writingLabel/);
    for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
      const url=match[1];
      if(url.startsWith('mailto:')||url.startsWith('#'))continue;
      assert.ok(!url.startsWith('/')&&!url.includes('://'),`Asset is not project-relative: ${url}`);
      const resolved=path.resolve(dist,path.dirname(page),url.split('#')[0]);
      await access(resolved);
    }
  }
  const css=await readFile(path.join(dist,'assets/style.css'),'utf8');
  for(const match of css.matchAll(/url\(([^)]+)\)/g))await access(path.join(dist,'assets',match[1]));
});
test('Specimen and historical CV are clearly identified',async()=>{
  const article=await readFile(path.join(dist,'typesetting-a-thought.html'),'utf8');
  assert.match(article,/not an essay or a statement of Rafael/);
  const home=await readFile(path.join(dist,'index.html'),'utf8');
  assert.match(home,/Download CV \(May 2026 PDF\)/);
  const research=await readFile(path.join(dist,'research.html'),'utf8');
  assert.match(research,/May 2026 CV lists this project as ongoing/);
  const pdf=await readFile(path.join(dist,'assets/cv-2026-05.pdf'));
  assert.equal(pdf.subarray(0,5).toString(),'%PDF-');
});

test('Public pages keep the chosen design without preview controls or preference scripts',async()=>{
  const site=JSON.parse(await readFile(path.join(root,'content/site.json'),'utf8'));
  const publicSite={...site,previewTools:false};
  const html=shell(publicSite,'index.html','Home',home(publicSite));
  assert.doesNotMatch(html,/Explore the design|Try a photograph|Your portrait|portrait-input|assets\/appearance\.js|assets\/site\.js|noindex/);
  assert.match(html,/data-font="crimsontext"/);
  assert.match(html,/data-theme="paper"/);
  assert.match(html,/data-accent="blue"/);
  assert.match(html,/data-motif-color="burgundy"/);
  const withPortrait={...publicSite,portrait:'portrait.jpg'};
  assert.match(home(withPortrait),/src="assets\/portrait\.jpg"/);
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
  const html=writing([
    {slug:'new-paper',title:'Academic example',date:'2026-10-10',section:'academic'},
    {slug:'older-post',title:'Informal example',date:'2026-09-01',section:'posts'}
  ]);
  assert.ok(html.indexOf('Informal example')<html.indexOf('Academic example'));
  assert.ok(html.indexOf('id="posts"')<html.indexOf('id="academic"'));
  assert.equal(parsePost('---\ntitle: A post\ndate: 2026-10-10\n---\nText','a-post').section,'posts');
  assert.throws(()=>parsePost('---\ntitle: A post\ndate: 2026-10-10\nsection: typo\n---\nText','a-post'));
});

test('Combined teaching page preserves both multi-year Princeton roles',async()=>{
  const html=await readFile(path.join(dist,'teaching.html'),'utf8');
  for(const text of ['FEB 2023–MAY 2024','SEP 2023–DEC 2024','Undergraduate Course Assistant','Physics Department Peer Tutor','PHY103','PHY104','Quantum Mechanics I & II','id="talks"','OCTOBER 2026 · PLANNED']) assert.ok(html.includes(text),text);
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
