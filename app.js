// VetAcoustics Phase 1 - vanilla JS SPA
const $ = s => document.querySelector(s);
const LS = { get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}, set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)) };
const esc = s => String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const btn = 'rounded-2xl bg-teal-600 text-white px-6 font-semibold active:scale-95 transition';

/* ---------- Mock analysis lookup (species + target) ---------- */
const SOUNDS = {
  dog_heart:{sound:'Systolic murmur',diffs:['Mitral valve disease','Dilated cardiomyopathy','Innocent flow murmur'],tests:['Echocardiogram','Thoracic radiographs','NT-proBNP']},
  dog_lungs:{sound:'Crackles',diffs:['Pulmonary edema','Pneumonia','Chronic bronchitis'],tests:['Thoracic radiographs','CBC/chemistry']},
  cat_lungs:{sound:'Wheezes',diffs:['Feline asthma','Bronchitis','Heartworm disease'],tests:['Thoracic radiographs','Bronchoscopy / BAL']},
  cat_heart:{sound:'Gallop rhythm',diffs:['Hypertrophic cardiomyopathy','Hyperthyroidism','Anemia'],tests:['Echocardiogram','Blood pressure','T4']},
  horse_lungs:{sound:'Wheezes',diffs:['Equine asthma','Pneumonia','Pleuropneumonia'],tests:['Endoscopy','Tracheal wash','Thoracic ultrasound']},
  cattle_lungs:{sound:'Crackles',diffs:['Bovine respiratory disease','Pneumonia','Lungworm'],tests:['Thoracic ultrasound','Nasal swab PCR']},
  horse_abdomen:{sound:'Reduced borborygmi',diffs:['Ileus','Colic (impaction)','Colitis'],tests:['Rectal exam','Abdominal ultrasound']},
  cattle_rumen:{sound:'Reduced rumen motility',diffs:['Rumen atony','Displaced abomasum','Traumatic reticuloperitonitis'],tests:['Ping test','Rumen fluid analysis']},
  dog_trachea:{sound:'Stridor',diffs:['Tracheal collapse','Laryngeal paralysis','Foreign body'],tests:['Fluoroscopy','Laryngeal exam']},
  default:{sound:'Normal breath sounds',diffs:['No significant abnormality','Mild upper airway noise','Artifact'],tests:['Repeat auscultation','Clinical exam']}
};

/* ---------- DATA LAYER: the ONLY place touching visit storage ---------- */
const DataService = {
  async saveVisit(v){ // PHASE 2: replace with fetch('/api/visits',{method:'POST',body:JSON.stringify(v)})
    const a=LS.get('va_visits',[]); v.id=v.id||'v'+Date.now()+Math.random().toString(36).slice(2,5); v.date=v.date||new Date().toISOString(); a.unshift(v); LS.set('va_visits',a); return v; },
  async getVisits(){ // PHASE 2: replace with fetch('/api/visits')
    return LS.get('va_visits',[]); },
  async getVisit(id){ // PHASE 2: replace with fetch('/api/visits/'+id)
    return (await this.getVisits()).find(v=>v.id===id); },
  async analyzeAudio(blob,meta){ // PHASE 2: replace with fetch('/api/analyze',{method:'POST',body:formData})
    await new Promise(r=>setTimeout(r,3000));
    const e=SOUNDS[meta.species+'_'+meta.target]||SOUNDS.default;
    return {...e, confidence:55+Math.round(Math.random()*40)}; }
};

/* ---------- Theme ---------- */
const applyTheme = d => document.documentElement.classList.toggle('dark', d);
applyTheme(LS.get('va_dark', matchMedia('(prefers-color-scheme: dark)').matches));
$('#theme').onclick = () => { const d=!document.documentElement.classList.contains('dark'); applyTheme(d); LS.set('va_dark',d); };

/* ---------- Router ---------- */
const S = { step:1, species:null, target:null, side:'left', site:null, ribs:true, patient:'', notes:'', result:null, file:'' };
function go(id){
  document.querySelectorAll('.view').forEach(v=>{ if(v.id!==id){v.classList.add('hide');setTimeout(()=>v.id!==cur&&v.classList.add('hidden'),350);} });
  cur=id; const el=$('#'+id); el.classList.remove('hidden'); requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.remove('hide')));
  ({dash:renderDash,visit:renderVisit,history:renderHistory})[id]?.();
}
let cur='dash';
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ if(b.dataset.go==='visit'){S.step=1;S.species=S.target=S.site=null;} go(b.dataset.go); });

/* ---------- Dashboard / History ---------- */
const visitRow = v => `<div class="glass rounded-2xl p-4 flex justify-between"><div><b>${esc(v.patient)}</b> <span class="text-slate-500">${esc(v.species)} · ${esc(v.targetLabel||v.target)} · ${esc(v.side)} · ${esc(v.site)}</span></div><div class="text-sm text-slate-500">${new Date(v.date).toLocaleDateString()}</div></div>`;
async function renderDash(){
  const vs=await DataService.getVisits(), h=new Date().getHours(), g=h<12?'Good morning':h<18?'Good afternoon':'Good evening', wk=Date.now()-7*864e5;
  $('#dash').innerHTML=`<h1 class="text-3xl font-bold my-4">${g}, Doctor</h1>
  <button id="startNew" class="${btn} w-full py-8 text-2xl">Start New Auscultation</button>
  <div class="grid grid-cols-2 gap-4 my-4"><div class="glass rounded-2xl p-4"><div class="text-3xl font-bold text-teal-600">${vs.length}</div>Total recordings</div><div class="glass rounded-2xl p-4"><div class="text-3xl font-bold text-teal-600">${vs.filter(v=>new Date(v.date)>wk).length}</div>This week</div></div>
  <h2 class="font-semibold mb-2">Recent visits</h2><div class="space-y-2">${vs.slice(0,5).map(visitRow).join('')}</div>`;
  $('#startNew').onclick=()=>document.querySelector('[data-go=visit]').click();
}
async function renderHistory(){ const vs=await DataService.getVisits(); $('#history').innerHTML=`<h1 class="text-2xl font-bold my-4">History</h1><div class="space-y-2">${vs.map(visitRow).join('')||'No visits yet.'}</div>`; }

/* ---------- Guided selector (data-driven from anatomy.js) ---------- */
function toXY(sp,p){ if(p.x!=null) return p; const L=sp.ribLayout, r=(p.fromRib+p.toRib)/2+.5, d=p.d;
  return { x:L.x1+(r-1)*(L.x2-L.x1)/(sp.ribCount-1)+L.slope*d, y:L.top+d*(L.bottom-L.top) }; }
const sitesFor = () => ANATOMY[S.species].targets.filter(t=>t.id===S.target&&(t.side===S.side||t.side==='ventral')).flatMap(t=>t.sites);
function silhouette(){
  const sp=ANATOMY[S.species], L=sp.ribLayout, N=sp.ribCount, sites=sitesFor(); let ribs='';
  if(S.ribs){ for(let i=1;i<=N;i++){ const x=L.x1+(i-1)*(L.x2-L.x1)/(N-1);
      ribs+=`<path d="M${x} ${L.top}Q${x+L.slope*.2} ${(L.top+L.bottom)/2} ${x+L.slope} ${L.bottom}" stroke="#94a3b8" stroke-width="1" fill="none" opacity=".7"/>`;
      if(i<N) ribs+=`<text x="${x+(L.x2-L.x1)/(N-1)/2}" y="${L.top-4}" font-size="7" text-anchor="middle" fill="#64748b">${i}</text>`; } }
  const pts=sites.map(s=>({s,...toXY(sp,s.pos)}));
  const glow=pts.map(p=>`<circle class="glow" cx="${p.x}" cy="${p.y}" r="22" fill="#14b8a6" opacity=".55"/>`).join('');
  const mk=pts.map(p=>`<g><circle cx="${p.x}" cy="${p.y}" r="${S.site&&S.site.id===p.s.id?7:4}" fill="${S.site&&S.site.id===p.s.id?'#ef4444':'#0f766e'}" stroke="#fff" stroke-width="1.5"/></g>`).join('');
  return `<svg viewBox="0 0 400 240" class="w-full"><path d="${sp.path}" fill="none" stroke="#0d9488" stroke-width="3" stroke-linejoin="round"/>${ribs}${glow}${mk}</svg>`;
}
function renderVisit(){
  const el=$('#visit');
  if(S.step===1){
    el.innerHTML=`<h1 class="text-2xl font-bold my-4">Step 1 · Choose species</h1><div class="grid grid-cols-2 gap-4">${Object.entries(ANATOMY).map(([k,v])=>
      `<button data-sp="${k}" class="card-pick glass rounded-3xl p-4 text-center"><img src="assets/animals/${k}.svg" alt="${v.label}" class="w-full"><b class="text-xl">${v.label}</b></button>`).join('')}</div>`;
    el.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>{ el.querySelectorAll('.card-pick').forEach(c=>c.classList.add(c===b?'chosen':'gone'));
      setTimeout(()=>{S.species=b.dataset.sp;S.target='lungs';S.site=null;S.step=2;renderVisit();},400); });
    return;
  }
  const sp=ANATOMY[S.species], labels=[...new Map(sp.targets.map(t=>[t.id,t.label]))];
  const sites=sitesFor();
  if(S.step===2){
    el.innerHTML=`<h1 class="text-2xl font-bold my-4">Step 2 · What to listen to (${sp.label})</h1>
    <div class="glass rounded-3xl p-4">${silhouette()}
      <div class="flex flex-wrap gap-2 my-3">${labels.map(([id,l])=>`<button class="chip ${id===S.target?'on':''}" data-t="${id}">${l}</button>`).join('')}</div>
      <div class="flex flex-wrap gap-2"><button class="chip ${S.side==='left'?'on':''}" data-side="left">Left</button><button class="chip ${S.side==='right'?'on':''}" data-side="right">Right</button><button class="chip ${S.ribs?'on':''}" id="ribT">Ribs</button>
      <button class="${btn} ml-auto" id="next">Continue</button></div>
      <p class="text-xs text-slate-500 mt-3">Landmarks are approximate - verify with the supervising veterinarian</p></div>`;
    el.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{S.target=b.dataset.t;S.site=null;renderVisit();});
    el.querySelectorAll('[data-side]').forEach(b=>b.onclick=()=>{S.side=b.dataset.side;S.site=null;renderVisit();});
    $('#ribT').onclick=()=>{S.ribs=!S.ribs;renderVisit();};
    $('#next').onclick=()=>{S.site=sitesFor()[0];S.step=3;renderVisit();};
    return;
  }
  // Step 3: placement instructions
  S.site=sitesFor().find(s=>S.site&&s.id===S.site.id)||sitesFor()[0];
  el.innerHTML=`<h1 class="text-2xl font-bold my-4">Step 3 · Placement</h1>
  <div class="grid md:grid-cols-2 gap-4"><div class="glass rounded-3xl p-4">${silhouette()}</div>
  <div class="glass rounded-3xl p-4 space-y-3">
    <div class="flex flex-wrap gap-2">${sitesFor().map(s=>`<button class="chip ${s.id===S.site?.id?'on':''}" data-s="${s.id}">${esc(s.label)}</button>`).join('')}</div>
    <p class="text-lg font-medium">${esc(S.site?.instruction)}</p>
    <ul class="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300"><li>Part the hair to expose the skin</li><li>Firm, steady stethoscope contact</li><li>Keep the animal and your hand still</li></ul>
    <input id="pat" placeholder="Patient name" value="${esc(S.patient)}" class="w-full rounded-xl px-3 bg-white/70 dark:bg-slate-700">
    <textarea id="notes" placeholder="Notes (optional)" class="w-full rounded-xl px-3 bg-white/70 dark:bg-slate-700">${esc(S.notes)}</textarea>
    <p class="text-xs text-slate-500">Landmarks are approximate - verify with the supervising veterinarian</p>
    <div class="flex gap-2"><button id="back" class="chip">Back</button><button id="go" class="${btn} flex-1">Start recording at this site</button></div></div></div>`;
  el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{S.patient=$('#pat').value;S.notes=$('#notes').value;S.site=sitesFor().find(s=>s.id===b.dataset.s);renderVisit();});
  $('#back').onclick=()=>{S.step=2;renderVisit();};
  $('#go').onclick=()=>{S.patient=$('#pat').value.trim()||'Unknown';S.notes=$('#notes').value;renderRecord();go('record');};
}

/* ---------- Recording ---------- */
const R = { on:false };
const fmt = s => String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0');
function renderRecord(){
  R.url=null;
  $('#record').innerHTML=`<h1 class="text-2xl font-bold my-4">${esc(S.patient)} · ${ANATOMY[S.species].label} · ${esc(S.target)} · ${S.side} · ${esc(S.site.label)}</h1>
  <div class="glass rounded-3xl p-6 text-center space-y-4">
    <canvas id="viz" width="600" height="120" class="w-full rounded-xl bg-slate-900/80"></canvas>
    <div id="timer" class="text-4xl font-mono">00:00</div>
    <button id="rec" class="w-28 h-28 rounded-full bg-red-500 text-white font-bold rec-pulse">Start</button>
    <div id="after" class="hidden space-y-3"><audio id="player" controls class="w-full"></audio><button id="ai" class="${btn} w-full py-4">Run AI Analysis (Demo)</button></div>
    <p id="msg" class="text-sm text-slate-500"></p></div>`;
  $('#rec').onclick=toggleRec; $('#ai').onclick=runAnalysis;
}
async function toggleRec(){
  if(R.on){ R.mr.stop(); return; }
  try{
    const AC=window.AudioContext||window.webkitAudioContext; R.ctx=R.ctx||new AC(); await R.ctx.resume(); // inside tap (iOS)
    const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    const an=R.ctx.createAnalyser(); an.fftSize=128; R.ctx.createMediaStreamSource(stream).connect(an);
    const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg'].find(t=>window.MediaRecorder&&MediaRecorder.isTypeSupported(t));
    const chunks=[]; R.mr=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
    R.mr.ondataavailable=e=>e.data.size&&chunks.push(e.data);
    R.mr.onstop=()=>{ R.on=false; stream.getTracks().forEach(t=>t.stop()); cancelAnimationFrame(R.raf); clearInterval(R.tm); finish(new Blob(chunks,{type:R.mr.mimeType})); };
    R.mr.start(); R.on=true; const t0=Date.now(); $('#rec').textContent='Stop';
    R.tm=setInterval(()=>$('#timer').textContent=fmt((Date.now()-t0)/1000),250);
    const c=$('#viz'),g=c.getContext('2d'),d=new Uint8Array(an.frequencyBinCount);
    (function draw(){ R.raf=requestAnimationFrame(draw); an.getByteFrequencyData(d); g.clearRect(0,0,c.width,c.height); const w=c.width/d.length;
      d.forEach((v,i)=>{const h=v/255*c.height/2; g.fillStyle='#2dd4bf'; g.fillRect(i*w+1,c.height/2-h,w-2,h*2||2);}); })();
  }catch(e){ $('#msg').textContent='Microphone error: '+e.message; }
}
function encodeWAV(buf){ // 16-bit PCM mono
  const n=buf.length, ch=buf.numberOfChannels, out=new Float32Array(n);
  for(let c=0;c<ch;c++){const d=buf.getChannelData(c);for(let i=0;i<n;i++)out[i]+=d[i]/ch;}
  const ab=new ArrayBuffer(44+n*2), v=new DataView(ab), w=(o,s)=>[...s].forEach((x,i)=>v.setUint8(o+i,x.charCodeAt(0)));
  w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);
  v.setUint32(24,buf.sampleRate,true);v.setUint32(28,buf.sampleRate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++){const s=Math.max(-1,Math.min(1,out[i]));v.setInt16(44+i*2,s<0?s*0x8000:s*0x7fff,true);}
  return new Blob([ab],{type:'audio/wav'});
}
async function finish(blob){
  try{
    const buf=await R.ctx.decodeAudioData(await blob.arrayBuffer()), wav=encodeWAV(buf);
    const n=LS.get('va_counter',0)+1; LS.set('va_counter',n); const clean=s=>String(s).replace(/[^\w-]+/g,'');
    S.file=[ANATOMY[S.species].label,S.target,S.side,S.site.id,clean(S.patient),String(n).padStart(3,'0')].map(clean).join('_')+'.wav';
    R.url=URL.createObjectURL(wav); R.blob=wav; // kept in memory only
    const a=document.createElement('a'); a.href=R.url; a.download=S.file; document.body.appendChild(a); a.click(); a.remove();
    $('#player').src=R.url; $('#after').classList.remove('hidden'); $('#rec').textContent='Again'; $('#msg').textContent='Saved '+S.file;
  }catch(e){ $('#msg').textContent='Decode error: '+e.message; }
}

/* ---------- Results (mock) ---------- */
async function runAnalysis(){
  $('#results').innerHTML=`<div class="glass rounded-3xl p-10 text-center"><div class="scan h-3 rounded bg-teal-200 mb-4"></div><p class="text-xl">Running acoustic model...</p></div>`; go('results');
  S.result=await DataService.analyzeAudio(R.blob,{species:S.species,target:S.target});
  const r=S.result, ok=r.confidence>=70;
  $('#results').innerHTML=`<div class="glass rounded-3xl p-6 space-y-4">
    ${ok?`<div class="text-4xl font-bold text-teal-600">${r.sound}</div>`:`<div class="rounded-2xl bg-amber-100 text-amber-800 p-4 font-semibold">Inconclusive - rely on clinical judgment</div>`}
    <div><div class="text-sm mb-1">Confidence ${r.confidence}%</div><div class="h-3 rounded bg-slate-200 dark:bg-slate-700"><div id="bar" class="h-3 rounded ${ok?'bg-teal-500':'bg-amber-500'}" style="width:0;transition:width 1s"></div></div></div>
    ${ok?`<div><b>Differentials</b><ol class="list-decimal pl-5">${r.diffs.map(d=>`<li>${d}</li>`).join('')}</ol></div><div><b>Recommended tests</b><ul class="list-disc pl-5">${r.tests.map(d=>`<li>${d}</li>`).join('')}</ul></div>`:''}
    <p class="text-xs text-slate-500">AI-assisted tool. Complements, never replaces, veterinary judgment. Demo data.</p>
    <div class="flex gap-2"><button id="save" class="${btn} flex-1">Save Visit</button><button id="home" class="chip flex-1">Back to Dashboard</button></div></div>`;
  setTimeout(()=>$('#bar').style.width=r.confidence+'%',50);
  $('#save').onclick=async()=>{ await DataService.saveVisit({patient:S.patient,species:ANATOMY[S.species].label,target:S.target,targetLabel:ANATOMY[S.species].targets.find(t=>t.id===S.target).label,side:S.side,site:S.site.id,notes:S.notes,file:S.file,result:r}); $('#save').textContent='Saved ✓'; };
  $('#home').onclick=()=>go('dash');
}

/* ---------- Init (seed 3 demo visits) ---------- */
(async()=>{ if(!(await DataService.getVisits()).length){
  for(const [p,s,t,l,si] of [['Rex','Dog','heart','Heart','mitr'],['Luna','Cat','lungs','Lungs','lungs1'],['Thunder','Horse','lungs','Lungs','lungs1']])
    await DataService.saveVisit({patient:p,species:s,target:t,targetLabel:l,side:'left',site:si,notes:'Demo'}); }
  go('dash'); })();
