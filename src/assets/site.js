const root = document.documentElement;
const explorer = document.querySelector('.explorer');
const paletteDescriptions = {paper:'Cool paper against a slightly darker background.',gray:'A lower-brightness gray, with just enough separation.',night:'Neutral charcoal, pale text, and a restrained accent.'};
const storageKey = 'rafael-site-design-v2';
let portraitUrl;
let defaults;
try { defaults = await (await fetch('assets/defaults.json')).json(); } catch { defaults = {}; }
const settings = () => ({theme:root.dataset.theme,font:root.dataset.font,accent:root.dataset.accent,layout:root.dataset.layout,motif:root.dataset.motif,motifColor:root.dataset.motifColor});
function sync() {
  const current = settings();
  if (!explorer) return;
  for (const [key,value] of Object.entries(current)) {
    if (['theme','font'].includes(key)) explorer.querySelectorAll(`input[name="${key}"]`).forEach(input=>input.checked=input.value===value);
    else { const control = explorer.querySelector(`[name="${key}"]`); if(control) control.value=value; }
  }
  explorer.querySelector('.palette-description').textContent=paletteDescriptions[current.theme];
}
function save() { try {localStorage.setItem(storageKey,JSON.stringify(settings()));} catch {} }
function status(message) { if(explorer) explorer.querySelector('.explorer-status').textContent=message; }
sync();

function displayPhoto(source) {
  const image = document.querySelector('.portrait-image');
  if(!image) return;
  image.src=source; image.hidden=false; root.dataset.photo='yes';
}
try {
  const preview = sessionStorage.getItem('rafael-portrait-preview');
  if(preview && /^data:image\/(jpeg|png|webp);base64,/.test(preview)) displayPhoto(preview);
} catch {}

if(explorer) {
  const toggle = explorer.querySelector('.explorer-toggle');
  const panel = explorer.querySelector('#explorer-panel');
  function openPanel(open) { panel.hidden=!open; toggle.setAttribute('aria-expanded',String(open)); explorer.classList.toggle('is-open',open); }
  toggle.addEventListener('click',()=>openPanel(panel.hidden));
  explorer.querySelector('.close-explorer').addEventListener('click',()=>{openPanel(false);toggle.focus();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){openPanel(false);toggle.focus();}});
  explorer.addEventListener('change',event=>{
    const {name,value} = event.target;
    if(!['theme','font','accent','layout','motif','motifColor'].includes(name)) return;
    root.dataset[name]=value; sync(); save();
  });
  const photoInput = explorer.querySelector('#portrait-input');
  document.querySelector('.choose-portrait')?.addEventListener('click',()=>photoInput.click());
  photoInput.addEventListener('change',async()=>{
    const file=photoInput.files?.[0]; if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)) {status('Please choose a JPG, PNG, or WebP photo.');return;}
    if(file.size>12*1024*1024){status('Please choose a photo under 12 MB.');return;}
    if(!document.querySelector('.portrait-image')) {status('Open Home to place your portrait, then choose the photo there.');return;}
    portraitUrl=URL.createObjectURL(file);
    const image=new Image();
    image.onload=()=>{
      const canvas=document.createElement('canvas');
      const ratio=Math.min(1,1000/Math.max(image.width,image.height));
      canvas.width=image.width*ratio;canvas.height=image.height*ratio;
      canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
      const data=canvas.toDataURL('image/jpeg',.86);
      displayPhoto(data);
      if(root.dataset.layout==='compact')root.dataset.layout='margin';
      try {sessionStorage.setItem('rafael-portrait-preview',data);}catch{}
      URL.revokeObjectURL(portraitUrl);portraitUrl=null;sync();save();status('Portrait preview added to this tab.');
    };
    image.onerror=()=>{URL.revokeObjectURL(portraitUrl);portraitUrl=null;status('That image could not be opened. Try another photo.');};
    image.src=portraitUrl;
  });
  explorer.querySelector('.remove-photo').addEventListener('click',()=>{
    try{sessionStorage.removeItem('rafael-portrait-preview');}catch{}
    const image=document.querySelector('.portrait-image');
    if(defaults.portrait)displayPhoto('assets/'+defaults.portrait);
    else {if(image){image.removeAttribute('src');image.hidden=true;}root.dataset.photo='no';}
    photoInput.value='';status('Portrait preview removed.');
  });
  explorer.querySelector('.copy-design').addEventListener('click',async()=>{
    const s=settings();const fontNames={source:'Source Serif 4',garamond:'EB Garamond',baskerville:'Libre Baskerville',crimson:'Crimson Pro',newsreader:'Newsreader',spectral:'Spectral',alegreya:'Alegreya',crimsontext:'Crimson Text'};const text=`My site direction: ${s.theme} paper; ${s.accent} accent; ${fontNames[s.font]}; ${s.layout} composition; ${s.motif} motif (${s.motifColor === 'accent' ? 'matching links' : s.motifColor}).`;
    try{await navigator.clipboard.writeText(text);status('Copied — paste this combination into our chat.');}
    catch{status(text);}
  });
  explorer.querySelector('.reset-design').addEventListener('click',()=>{
    root.dataset.theme=defaults.defaultTheme||'paper';root.dataset.font=defaults.defaultFont||'crimsontext';root.dataset.accent=defaults.defaultAccent||'blue';root.dataset.layout=defaults.defaultLayout||'margin';root.dataset.motif=defaults.defaultMotif||'contours';root.dataset.motifColor=defaults.defaultMotifColor||'burgundy';
    history.replaceState(null,'',location.pathname);sync();save();status('Back to the starting point.');
  });
}
