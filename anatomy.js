// VERIFY WITH VET: all landmarks are approximate starter content. Edit ONLY this file to change anatomy.
// Positions are relative to ribs: {fromRib,toRib,d} (intercostal spaces, d: 0 dorsal..1 ventral). Absolute {x,y} also allowed.
const TBC = 'Landmark to be confirmed by veterinarian';
const BODY = 'M95 95Q100 70 130 68L280 72Q315 78 318 110Q318 140 290 150L130 150Q100 148 95 120Z M95 95L58 58Q42 48 26 62L20 78Q30 92 56 94L100 125 M130 150V215M150 150V215M270 150V215M290 150V215';
const LAYOUT = { x1: 135, x2: 290, top: 76, bottom: 146, slope: 14 }; // tune these when artwork changes
const ord = n => n + (['th','st','nd','rd'][(n % 100 > 10 && n % 100 < 14) ? 0 : Math.min(n % 10, 4) % 4] || 'th');
const trachea = { id:'trachea', label:'Trachea', side:'ventral', sites:[
  {id:'larynx', label:'Larynx', instruction:'Ventral neck midline, just behind the jaw over the larynx.', pos:{x:70,y:88}},
  {id:'mid', label:'Mid-cervical', instruction:'Ventral neck midline, halfway along the neck.', pos:{x:88,y:100}},
  {id:'inlet', label:'Thoracic inlet', instruction:'Ventral midline at the thoracic inlet, in front of the first rib.', pos:{x:104,y:118}}]};
const placeholder = (id, label, side, pos) => ({ id, label, side, sites:[{ id:id+'1', label:label+' ('+side+')', instruction:TBC, pos }] });

// Dog lungs: grid of cranial/mid/caudal x dorsal/ventral
const dogLungs = side => ({ id:'lungs', label:'Lungs', side, sites:
  [['cran','Cranial',3,5],['mid','Mid',6,8],['caud','Caudal',9,11]].flatMap(([k,n,a,b]) =>
    [['D','dorsal',0.25],['V','ventral',0.65]].map(([c,h,d]) => ({
      id:k+c, label:`${n} ${h}`, pos:{fromRib:a,toRib:b,d},
      instruction:`${side==='left'?'Left':'Right'} side, ${ord(a)}-${ord(b)} intercostal space, ${h} half of the thorax.` }))) });

function generic(extra = []) {
  return [placeholder('lungs','Lungs','left',{fromRib:6,toRib:8,d:0.4}), placeholder('lungs','Lungs','right',{fromRib:6,toRib:8,d:0.4}),
          placeholder('heart','Heart','left',{fromRib:4,toRib:6,d:0.7}), placeholder('heart','Heart','right',{fromRib:4,toRib:6,d:0.7}), trachea, ...extra];
}
const ANATOMY = {
  dog: { label:'Dog', ribCount:13, path:BODY, ribLayout:LAYOUT, targets:[ dogLungs('left'), dogLungs('right'),
    { id:'heart', label:'Heart', side:'left', sites:[
      {id:'pulm', label:'Pulmonic valve', pos:{fromRib:3,toRib:3,d:0.7}, instruction:'Left side, 3rd intercostal space at the costochondral junction, lower third of the thorax.'},
      {id:'aort', label:'Aortic valve', pos:{fromRib:4,toRib:4,d:0.7}, instruction:'Left side, 4th intercostal space, lower third of the thorax.'},
      {id:'mitr', label:'Mitral valve', pos:{fromRib:5,toRib:5,d:0.7}, instruction:'Left side, 5th intercostal space at the costochondral junction, lower third of the thorax.'}]},
    { id:'heart', label:'Heart', side:'right', sites:[
      {id:'tric', label:'Tricuspid valve', pos:{fromRib:3,toRib:4,d:0.65}, instruction:'Right side, 3rd-4th intercostal space.'}]}, trachea ] },
  cat: { label:'Cat', ribCount:13, path:BODY, ribLayout:LAYOUT, targets:generic() },
  horse: { label:'Horse', ribCount:18, path:BODY, ribLayout:LAYOUT, targets:generic(
    [['ul','Upper left','left',130,0.3],['ll','Lower left','left',130,0.8],['ur','Upper right','right',130,0.3],['lr','Lower right','right',130,0.8]]
      .map(([id,l,s,x,d]) => ({ ...placeholder('abd','Abdomen',s,{x:x+ (id[1]==='l'?0:0)+ 60*(l.startsWith('Upper')?0:1) +120, y:150+ (d>0.5?25:0)}),
        sites:[{id:'q'+id, label:l+' quadrant', instruction:TBC, pos:{x:210+(l.startsWith('Upper')?-30:40), y:l.includes('Upper')?140:170}}] }))) },
  cattle: { label:'Cattle', ribCount:13, path:BODY, ribLayout:LAYOUT, targets:generic(
    [placeholder('rumen','Rumen','left',{x:260,y:120})]) }
};
