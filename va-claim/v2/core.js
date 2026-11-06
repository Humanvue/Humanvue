/* Retirement Plan v2: money only. Personal numbers come from the data saved inside this file (S.fin); the code holds none. */
const KEY='retplan2.v1';
const TABS2=[];
let S;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money0=n=>(+n||0).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
const money2=n=>(+n||0).toLocaleString('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2});
const fmtK=n=>{const a=Math.abs(n),s=n<0?'−':'';return a>=1e6?`${s}$${(a/1e6).toFixed(2)}M`:a>=1000?`${s}$${(a/1000).toFixed(a>=100000?0:1)}k`:`${s}$${Math.round(a)}`;};
const pct1=x=>`${(x*100).toFixed(1)}%`;
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const ymIdx=s=>{const [y,m]=String(s).split('-').map(Number);return y*12+m-1;};
const ym=i=>`${MON[((i%12)+12)%12]} ${Math.floor(i/12)}`;
const idxYM=i=>`${Math.floor(i/12)}-${String(i%12+1).padStart(2,'0')}`;
const DAY=864e5,dayNum=(y,m,d)=>Math.round(Date.UTC(y,m,d)/DAY),dayDate=n=>new Date(n*DAY);
const dayOfIdx=i=>dayNum(Math.floor(i/12),i%12,1),idxOfDay=n=>{const d=dayDate(n);return d.getUTCFullYear()*12+d.getUTCMonth();};
const fmtDay=n=>{const d=dayDate(n);return `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;};
const todayNum=()=>{const d=new Date();return dayNum(d.getFullYear(),d.getMonth(),d.getDate());};
function ageAt(x){const b=ymIdx(S&&S.fin&&S.fin.born||'1970-01');const i=typeof x==='number'?(x>3000?x:x*12+5):ymIdx(x);return Math.floor((i-b)/12);}

/* ---------- Saving: browser storage plus a copy inside this HTML file ---------- */
function blank(){return{rev:0,savedAt:0,tab:'time',ch:{},hidden:{},view:null,fin:null};}
function embedded(){try{const o=JSON.parse($('#rpdata').textContent);return o&&o.fin?o:null;}catch(e){return null;}}
function load(){SRC0=document.documentElement.outerHTML;let loc=null;try{const r=localStorage.getItem(KEY);if(r)loc=JSON.parse(r);}catch(e){}
  const emb=embedded(),pick=loc&&emb?((emb.rev||0)>(loc.rev||0)?emb:(loc.rev||0)>(emb.rev||0)?loc:(+loc.savedAt||0)>=(+emb.savedAt||0)?loc:emb):loc||emb;
  S=Object.assign(blank(),pick||{});FILE.savedAt=emb?emb.savedAt||1:0;}
let SRC0='';
const FILE={handle:null,savedAt:0,busy:false,timer:null};
function fileCopy(){const json=JSON.stringify(S).replace(/</g,'\\u003c');return '<!doctype html>\n'+SRC0.replace(/(<script id="rpdata" type="application\/json">)[\s\S]*?(<\/script>)/,(m,a,b)=>a+json+b);}
function idb(){return new Promise((ok,no)=>{try{const r=indexedDB.open('retplan2-file',1);r.onupgradeneeded=()=>r.result.createObjectStore('h');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);}catch(e){no(e);}});}
async function idbGet(){try{const db=await idb();return await new Promise(ok=>{const q=db.transaction('h').objectStore('h').get('file');q.onsuccess=()=>ok(q.result||null);q.onerror=()=>ok(null);});}catch(e){return null;}}
async function idbPut(h){try{const db=await idb();db.transaction('h','readwrite').objectStore('h').put(h,'file');}catch(e){}}
async function writeFile(){if(!FILE.handle||FILE.busy)return false;FILE.busy=true;
  try{const w=await FILE.handle.createWritable();await w.write(fileCopy());await w.close();FILE.savedAt=S.savedAt;FILE.busy=false;renderFileBar();return true;}
  catch(e){FILE.busy=false;FILE.handle=null;renderFileBar();return false;}}
async function saveToFile(){S.savedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}
  const name=(S.appName||'Retirement Plan v2')+'.html';
  if(window.showSaveFilePicker){try{if(!FILE.handle){const old=await idbGet();if(old&&(await old.requestPermission({mode:'readwrite'}))==='granted')FILE.handle=old;}
      if(!FILE.handle){FILE.handle=await showSaveFilePicker({suggestedName:name,types:[{description:'Retirement plan',accept:{'text/html':['.html']}}]});idbPut(FILE.handle);}
      if(await writeFile()){toast('Saved into the file');return;}}catch(e){if(e&&e.name==='AbortError')return;}}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([fileCopy()],{type:'text/html'}));a.download=name;document.body.appendChild(a);a.click();a.remove();
  FILE.savedAt=S.savedAt;renderFileBar();toast('Saved a new copy to Downloads');}
function renderFileBar(){const el=$('#fileBar');if(!el)return;const dirty=(S.savedAt||0)>(FILE.savedAt||0);
  el.innerHTML=`<div class="filebar ${dirty?'dirty':''}"><span class="small">${FILE.handle?'<b>Auto-save is on.</b> Every change is written into this file.':dirty?'<b>You have changes not saved in the file yet.</b> They are kept in this browser too.':'<b>Your data is saved inside this file.</b> Nothing is uploaded.'}</span><button class="btn sm ${dirty&&!FILE.handle?'primary':''}" id="saveFile">${FILE.handle?'Save now':'Save to file'}</button></div>`;
  $('#saveFile').onclick=saveToFile;}
let saveTimer;
function save(){S.savedAt=Date.now();clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}
  if(FILE.handle){clearTimeout(FILE.timer);FILE.timer=setTimeout(writeFile,1200);}else renderFileBar();},200);}
function toast(msg){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(t._h);t._h=setTimeout(()=>t.hidden=true,1800);}

/* ---------- Choices shared by every tab ---------- */
const CH_DEF={date:'2027-09-30',rp:'mab',rn:'term',job:'rn',emp:'civ',city:'tc',va:'est',pt:'no',ptf:'.6',adj:'off',adjn:'4',stop:'65',ss:'67',dx:'half',mx:'0',dnp:'cash',dollars:'future'};
function ch(){S.ch=Object.assign({},CH_DEF,S.ch||{});return S.ch;}
function plan2(){return Object.assign({},ch());}
function seg(key,opts,cls){const V=ch();return `<div class="seg ${cls||''}" role="group">${opts.map(([v,n])=>`<button class="btn sm ${V[key]===v?'on':''}" data-ch="${key}" data-val="${v}" aria-pressed="${V[key]===v}">${n}</button>`).join('')}</div>`;}
function gBar(){const F=S.fin;if(!F)return'';const V=ch();
  const opt=Object.keys(F.ret.options).sort().map(d=>[d,F.ret.options[d].label]);
  const g=(side,lab,body)=>`<div class="g g-${side}"><span class="eyebrow-s">${lab}</span>${body}</div>`;
  return `<div class="gbar" role="group" aria-label="Choices used on every tab">
   ${g('duty','Retire from AGR',seg('date',opt))}
   ${g('duty','Retired pay estimate',seg('rp',[['mab','Army calculator'],['pts','Points ÷ 360']]))}
   ${g('study','Start nursing',seg('rn',[['jun','Jun 2027 (on leave)'],['jul','Jul 2027 (on leave)'],['term','Terminal leave'],['after','After retiring']]))}
   ${g('study','Nursing job',seg('job',[['rn','BSN RN'],['np','PMHNP (DNP)']]))}
   ${g('study','Employer',seg('emp',[['civ','Hospital'],['va','The VA']]))}
   ${V.emp==='va'?'':g('study','City',seg('city',[['tc','Twin Cities'],['roch','Rochester']]))}
   ${g('duty','VA rating',seg('va',[['est',`Estimate (${F.va.est}%)`],['50','50%'],['100','100%']]))}
   <details class="g g-money more"${S.moreOpen?' open':''}><summary class="eyebrow-s">More choices: later work, Social Security, debts</summary><div class="gbar in">
    ${g('study','Part time from age',seg('pt',[['no','Never'],['55','55'],['60','60'],['62','62']]))}
    ${V.pt==='no'?'':g('study','Part-time hours',seg('ptf',[['.6','0.6 (3 shifts)'],['.4','0.4 (2 shifts)'],['.2','PRN']]))}
    ${g('study','Teach nursing (adjunct)',seg('adj',[['off','No'],['50','From 50'],['55','From 55'],['60','From 60']]))}
    ${V.adj==='off'?'':g('study','Courses a year',seg('adjn',[['2','2'],['4','4'],['6','6']]))}
    ${g('study','Stop working at',seg('stop',[['62','62'],['65','65'],['67','67'],['70','70']]))}
    ${g('money','Social Security at',seg('ss',[['62','62'],['67','67'],['70','70']]))}
    ${g('money','Extra toward debt',seg('dx',[['none','None'],['half','Half of what is left'],['all','All of it']]))}
    ${g('money','Extra on the mortgage',seg('mx',[['0','None'],['250','$250'],['500','$500'],['1000','$1,000']]))}
    ${V.job==='np'?g('study','Pay for the DNP with',seg('dnp',[['cash','Take-home'],['loan','Federal loans']])):''}
    ${g('money','Show money in',seg('dollars',[['future','Future dollars'],['today',"Today's dollars"]]))}
   </div></details>
  </div>`;}
function bindGbar(){$$('[data-ch]').forEach(b=>b.onclick=()=>{ch()[b.dataset.ch]=b.dataset.val;MODEL=null;save();render();});
  const d=$('.gbar details.more');if(d)d.ontoggle=()=>{S.moreOpen=d.open;};}

/* ---------- Pay and tax tables (2026) ---------- */
const JOBS={rn:{name:'BSN RN',tc:[90000,100860],roch:[83000,106510]},np:{name:'PMHNP',tc:[140000,161000],roch:[125000,140000]}};
const VA_NURSE={rn:{table:[[90469,2714],[106752,3202],[116359,3490]],promo:[[2,1]],g0:0},np:{table:[[111359,3340],[131400,3942],[143226,4296]],promo:[[3,2]],g0:1},stepsAt:[1,2,3,5,7,9,12,15,18,21,24]};
function vaNursePay(job,yrs){const T=VA_NURSE[job],rate=(g,st)=>T.table[g][0]+T.table[g][1]*(st-1),earned=t=>VA_NURSE.stepsAt.filter(x=>x<=t).length;
  let g=T.g0,st=1,since=0;for(const [at,to] of T.promo){if(yrs<at)break;st=Math.min(12,st+earned(at-since));const before=rate(g,st);g=to;let n=1;while(n<12&&rate(g,n)<=before)n++;st=n;since=at;}
  st=Math.min(12,st+earned(yrs-since));return rate(g,st);}
const TAX={fedStd:16100,fed65:2050,fed:[[12400,.10],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[640600,.35],[1/0,.37]],mnStd:15300,mn:[[33310,.0535],[109430,.068],[203150,.0785],[1/0,.0985]],ssBase:184500};
const VA_RATE={10:180.42,20:356.66,30:552.47,40:795.84,50:1132.90,60:1435.02,70:1808.45,80:2102.15,90:2362.30,100:3938.58}; // single veteran, Dec 2025 rates
const TRICARE_SELECT=186.96,PART_B=202.90,INFL=.025,COLA=.025,RAISE=.03;
function bracketTax(x,br){let t=0,lo=0;for(const [top,r] of br){if(x<=lo)break;t+=(Math.min(x,top)-lo)*r;lo=top;}return t;}
const SS_F={62:.70,67:1,70:1.24};

/* ---------- Retired pay ---------- */
function retPay(V){const F=S.fin,O=F.ret.options[V.date]||F.ret.options[Object.keys(F.ret.options)[0]];
  if(V.rp==='pts'){const mult=Math.min(.75,.025*O.points/360);return{mult,high3:O.high3,gross:O.high3*mult,how:`${(O.points/360).toFixed(2)} years from ${O.points.toLocaleString()} points ÷ 360`};}
  const mo=ymIdx(V.date.slice(0,7))-ymIdx(F.ret.asd),mult=.025*mo/12;
  return{mult,high3:O.mabHigh3,gross:O.mabHigh3*mult,how:`${Math.floor(mo/12)} years ${mo%12} months of service from your May 2006 active service date, as the Army calculator counts it`};}

/* ---------- The month-by-month model ---------- */
let MODEL=null;
function rnStartIdx(V){const F=S.fin,rm=ymIdx(V.date.slice(0,7)),O=F.ret.options[V.date],tl=ymIdx((O.termStart||V.date).slice(0,7));
  return {jun:ymIdx('2027-06'),jul:ymIdx('2027-07'),term:tl,after:rm+1}[V.rn]??rm+1;}
function model(){if(MODEL)return MODEL;const F=S.fin,V=ch();
  const born=ymIdx(F.born),start=ymIdx(F.start),end=born+12*90+6,rm=ymIdx(V.date.slice(0,7)),O=F.ret.options[V.date];
  const tl=ymIdx((O.termStart||V.date).slice(0,7)),rn0=rnStartIdx(V),npI=ymIdx(F.dnp.npStart),age=i=>(i-born)/12;
  const RP=retPay(V),vaPct=V.va==='est'?F.va.est:+V.va,vaBase=VA_RATE[vaPct]||0;
  const ptI=V.pt==='no'?1e9:born+12*+V.pt,stopI=born+12*+V.stop,adjI=V.adj==='off'?1e9:born+12*+V.adj,adjEnd=born+12*Math.max(+V.stop,70);
  const ssI=born+12*+V.ss,ss0=F.ss67*SS_F[V.ss];
  const debts=F.debts.map(d=>({...d,b:d.bal,end:null}));
  const M=F.mortgage;let mb=M.bal;for(let i=ymIdx(M.balAt);i<start;i++)mb=Math.max(0,mb+mb*M.rate/12-M.pi);let mEnd=null;
  const rows=[];let short=0,cum=0;
  const dnpOn=V.job==='np',dS=ymIdx(F.dnp.start),dE=ymIdx(F.dnp.end),lS=ymIdx(F.dnp.loanStart);
  const work=V.job==='np'?'np':'rn',hosp=JOBS[work][V.city]||JOBS[work].tc;
  const jobPay=(i)=>{ // yearly salary in month i
    const isNp=dnpOn&&i>=npI,j=isNp?'np':'rn',s0=isNp?Math.max(npI,rn0):rn0,yrs=Math.max(0,Math.floor((i-s0)/12)),cal=Math.floor(i/12);
    if(V.emp==='va'){let f=1;for(let y=2027;y<=cal;y++)f*=y===2027?1:1.02;return{j,yrs,sal:vaNursePay(j,yrs)*f};}
    const H=JOBS[j][V.city]||JOBS[j].tc;return{j,yrs,sal:yrs<3?H[0]+(H[1]-H[0])*yrs/3:H[1]*Math.pow(1+RAISE,yrs-3)};};
  for(let i=start;i<=end;i++){const yrsFrom=(i-start)/12,infl=Math.pow(1+INFL,yrsFrom),a=age(i);
    const col=Math.pow(1+COLA,Math.max(0,Math.floor(i/12)-Math.floor((rm+1)/12)));
    const inc={},net={};let gross=0,takeHome=0,notes=[];
    // AGR pay
    if(i<=rm){const extra=i>ymIdx(F.agr.tspLoanEnd)?F.agr.tspLoanMo:0;inc.agr=F.agr.basic+F.agr.allow;net.agr=F.agr.net+extra;}
    // nursing pay
    let job=null;
    if(i>=rn0&&i<stopI){const P=jobPay(i);let fte=1;
      if(i<tl)fte=.5; // working on leave days before terminal leave
      if(i>=ptI)fte=+V.ptf;
      const sal=P.sal*fte;job={...P,fte,sal};inc.job=sal/12;}
    // adjunct teaching: paid over the school months
    if(i>=adjI&&i<adjEnd&&[0,1,2,3,8,9,10,11].includes(i%12)){const per=adjPerCourse(V);inc.adj=per*+V.adjn*Math.pow(1+INFL,Math.max(0,Math.floor(i/12)-2026))/8;}
    // retired pay and VA pay
    if(i>rm){inc.ret=RP.gross*col;const va=vaBase*col;inc.va=va;if(vaPct<50)inc.ret=Math.max(0,inc.ret-va);}
    if(i>=ssI)inc.ss=ss0*Math.pow(1+COLA,Math.max(0,Math.floor(i/12)-2026));
    gross=Object.values(inc).reduce((s,x)=>s+x,0);
    // taxes on everything but AGR (AGR take-home is your real deposit)
    const f=Math.pow(1+INFL,Math.max(0,Math.floor(i/12)-2026)),wages=(inc.job||0)+(inc.adj||0);
    const fedInc=12*(wages+(inc.ret||0)+(inc.ss||0)*.85),std=(TAX.fedStd+(a>=65?TAX.fed65:0))*f;
    let fed=0,mn=0,fica=0,ret401=0,health=0;
    if(i>rm||inc.job){const agrPart=i<=rm?12*F.agr.basic:0;
      const tot=bracketTax(Math.max(0,(fedInc+agrPart)/f-std/f),TAX.fed)*f/12,base=i<=rm?bracketTax(Math.max(0,agrPart/f-std/f),TAX.fed)*f/12:0;fed=tot-base;
      mn=bracketTax(Math.max(0,12*wages/f-TAX.mnStd),TAX.mn)*f/12;fica=Math.min(wages,TAX.ssBase*f/12)*.062+wages*.0145;ret401=(inc.job||0)*.05;
      if(i>rm)health=a>=65?PART_B*infl:TRICARE_SELECT/12*infl;}
    takeHome=(net.agr||0)+(gross-(inc.agr||0))-fed-mn-fica-ret401-health;
    // spending
    const seg={};
    F.bills.forEach(b=>{if(b.end&&i>ymIdx(b.end))return;seg['b:'+b.name]=b.amt*infl;});
    F.living.forEach(l=>{seg['l:'+l.k]=l.v*infl;});
    if(dnpOn&&V.dnp==='cash'&&i>=dS&&i<=dE)seg['s:DNP school (tuition and fees you pay)']=F.dnp.cashMo;
    if(dnpOn&&V.dnp==='loan'&&i>=lS&&i<lS+120)seg['s:DNP federal loan payment']=F.dnp.loanMo;
    // mortgage
    if(mb>0){const it=mb*M.rate/12,pay=Math.min(mb+it,M.pi+(+V.mx||0));mb=Math.max(0,mb+it-pay);seg['h:PennyMac mortgage']=pay+M.escrow*infl;if(mb<=0&&mEnd===null)mEnd=i;}
    else seg['h:Property tax and home insurance']=M.escrow*infl;
    const fixed=Object.values(seg).reduce((s,x)=>s+x,0);
    // debts: minimums, then extra to the highest rate
    debts.forEach(d=>{if(d.b>0)d.b+=d.b*d.apr/12;});let paid=0;
    debts.forEach(d=>{if(d.b>0){const p=Math.min(d.pay,d.b);d.b-=p;paid+=p;seg['d:'+d.name]=(seg['d:'+d.name]||0)+p;}});
    let left=takeHome-fixed-paid;
    if(left>0&&V.dx!=='none'){let room=V.dx==='all'?left:left/2;for(const d of debts.filter(d=>d.b>.5).sort((x,y)=>y.apr-x.apr)){if(room<=0)break;const p=Math.min(room,d.b);d.b-=p;room-=p;paid+=p;left-=p;seg['d:'+d.name]=(seg['d:'+d.name]||0)+p;}}
    if(left<0){const c=debts.find(d=>d.id===F.shortfallTo)||debts[0];c.b+=-left;if(c.end!==null)c.end=null;short+=-left;notes.push('short');}
    debts.forEach(d=>{if(d.b<=.5&&d.end===null&&d.b!==-1){d.b=0;d.end=i;}});
    cum+=left;
    rows.push({i,age:a,inc,gross,net:takeHome,fed,mn,fica,ret401,health,seg,spend:fixed+paid,left,cum,job,bal:debts.map(d=>d.b),mort:mb});
  }
  const debtFree=rows.find(r=>r.bal.every(b=>b<=.5));
  MODEL={rows,start,end,rm,tl,rn0,npI,RP,vaPct,debts,mEnd,short,debtFree:debtFree?debtFree.i:null,born,ptI,stopI,adjI,ssI,V};
  return MODEL;}
function dv(v,i){const F=S.fin;return ch().dollars==='today'?v/Math.pow(1+INFL,Math.max(0,(i-ymIdx(F.start))/12)):v;}

/* ---------- Key dates ---------- */
function keyDates(){const F=S.fin,V=ch(),m=model(),b=m.born,O=F.ret.options[V.date],out=[];
  const add=(day,side,t,pri,x)=>out.push({day,side,t,pri,x:x||''});const d1=i=>dayOfIdx(i);
  const dd=s=>{const [y,mo,da]=s.split('-').map(Number);return dayNum(y,mo-1,da||1);};
  add(todayNum(),'today','Today',0);
  (F.events||[]).forEach(e=>add(dd(e.at),e.side,e.t,e.pri||2,e.x));
  add(dd(V.date),'duty','Retire from AGR',1,`Last day on AGR orders. Retired pay ${money0(m.RP.gross)} a month before tax (${pct1(m.RP.mult)} of ${money0(m.RP.high3)}).`);
  if(O.outproc)add(dd(O.outproc),'duty','Out-process at Fort McCoy',1);
  if(O.termStart)add(dd(O.termStart),'duty','Terminal leave starts',1,'Still paid by the Army; nursing pay can overlap.');
  add(d1(m.rm+1)+0,'duty','Retired pay and VA pay start',1,'First payments arrive on the 1st of the next month.');
  add(d1(m.rn0),'study',`Start nursing${m.rn0<m.tl?' (part time while on leave)':''}`,1,'Needs your RN license and, while still on AGR orders, approval for outside work.');
  if(V.job==='np'){add(dd(F.dnp.start+'-01'),'study','DNP school starts',1);add(dd(F.dnp.end+'-28'),'study','DNP done, then boards',2);add(d1(m.npI),'study','Start as a PMHNP',1);}
  m.debts.forEach(d=>{if(d.end)add(d1(d.end),'money',`${d.short||d.name} paid off`,3);});
  if(m.debtFree)add(d1(m.debtFree),'money','Debt free (besides the mortgage)',1);
  if(m.mEnd)add(d1(m.mEnd),'money','Mortgage paid off',2);
  if(m.ptI<1e9&&m.ptI<m.stopI)add(d1(m.ptI),'study',`Go part time (${V.ptf==='.2'?'PRN':V.ptf+' FTE'})`,1);
  if(m.adjI<1e9)add(d1(m.adjI),'study','Start teaching nursing as an adjunct',1);
  add(d1(m.stopI),'study','Stop nursing work',1);
  add(d1(m.ssI),'money',`Social Security starts (age ${V.ss})`,1);
  [[45,'Turn 45'],[50,'Turn 50: catch-up savings allowed'],[55,'Turn 55: Rule of 55 for 403(b)/TSP'],[60,'Turn 60: bigger catch-up (60 to 63)'],[62,'Turn 62: earliest Social Security'],[65,'Turn 65: Medicare, TRICARE For Life'],[67,'Turn 67: full Social Security age'],[70,'Turn 70: Social Security maxes out'],[75,'Turn 75: required withdrawals start'],[80,'Turn 80'],[85,'Turn 85'],[90,'Turn 90']]
    .forEach(([a,t])=>add(dayNum(Math.floor((b+12*a)/12),(b+12*a)%12,1),'age',t,a%10===0||a===65||a===67?2:3));
  add(dayNum(Math.floor((b+12*59+6)/12),(b+12*59+6)%12,1),'age','Age 59½: no 10% penalty on IRAs and TSP',2);
  return out.sort((x,y)=>x.day-y.day);}

/* ---------- Segment colors ---------- */
const GROUPS={d:{n:'Debts',h:[8,28]},h:{n:'Home',h:[210,215]},b:{n:'Bills',h:[42,52]},l:{n:'Living',h:[170,190]},s:{n:'School',h:[200,205]}};
function segKeys(){const m=model(),ks=new Set();m.rows.forEach(r=>Object.keys(r.seg).forEach(k=>ks.add(k)));const order='dhbls';return [...ks].sort((a,b)=>order.indexOf(a[0])-order.indexOf(b[0])||a.localeCompare(b));}
function segColor(k,list){const g=GROUPS[k[0]]||GROUPS.l,same=list.filter(x=>x[0]===k[0]),n=same.indexOf(k),t=same.length>1?n/(same.length-1):0;
  const hue=g.h[0]+(g.h[1]-g.h[0])*t,dark=matchMedia('(prefers-color-scheme: dark)').matches&&document.documentElement.dataset.theme!=='light';
  return `hsl(${hue.toFixed(0)} ${k[0]==='l'?28:62}% ${(dark?62:44)+t*(dark?-22:26)}%)`;}

/* ---------- The zoomable timeline ---------- */
const TL={w:1200,h:500,pad:{l:62,r:14,t:96,b:30}};
function tlRange(){const F=S.fin,m=model(),min=dayOfIdx(m.start),max=dayOfIdx(m.end+1);
  if(!S.view){S.view={a:todayNum()-10,b:dayOfIdx(m.rm+4)};}let {a,b}=S.view;const span=Math.max(14,Math.min(max-min,b-a));
  if(a<min){a=min;}if(a+span>max)a=max-span;return{a,b:a+span,min,max};}
function buckets(R){const m=model(),span=R.b-R.a,mode=span<=120?'day':span<=365*7?'month':'year',out=[];
  if(mode==='day'){for(let n=Math.floor(R.a);n<Math.ceil(R.b);n++){const d=dayDate(n),i=d.getUTCFullYear()*12+d.getUTCMonth(),row=m.rows[i-m.start];if(!row)continue;
      const dim=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate(),dom=d.getUTCDate(),seg={};let g=0,net=0;
      const dueOn=day=>Math.min(day,dim)===dom;
      // income events
      if(row.inc.agr&&(dom===1||dom===15))g+=row.inc.agr/2;
      const nonAgrGross=row.gross-(row.inc.agr||0),agrNet=row.inc.agr?S.fin.agr.net+(i>ymIdx(S.fin.agr.tspLoanEnd)?S.fin.agr.tspLoanMo:0):0,otherNet=row.net-agrNet;
      if(row.inc.agr&&(dom===1||dom===15))net=agrNet/2;
      if(nonAgrGross>0){const jobShare=(row.inc.job||0)/nonAgrGross;
        if(dom===1){g+=nonAgrGross*(1-jobShare);net+=otherNet*(1-jobShare);}
        if(row.inc.job&&d.getUTCDay()===5&&Math.floor((n-dayNum(2027,0,1))/7)%2===0){const per=12/26;g+=row.inc.job*per;net+=otherNet*jobShare*per;}}
      Object.entries(row.seg).forEach(([k,v])=>{const day=segDay(k);if(day?dueOn(day):true)seg[k]=day?v:v/dim;});
      out.push({a:n,b:n+1,lab:fmtDay(n),gross:dv(g,i),net:dv(net,i),seg:Object.fromEntries(Object.entries(seg).map(([k,v])=>[k,dv(v,i)])),i,unit:'day'});}}
  else if(mode==='month'){const i0=idxOfDay(R.a),i1=idxOfDay(R.b-1);for(let i=i0;i<=i1;i++){const row=m.rows[i-m.start];if(!row)continue;
      out.push({a:dayOfIdx(i),b:dayOfIdx(i+1),lab:ym(i),gross:dv(row.gross,i),net:dv(row.net,i),seg:Object.fromEntries(Object.entries(row.seg).map(([k,v])=>[k,dv(v,i)])),i,row,unit:'month'});}}
  else{const y0=dayDate(R.a).getUTCFullYear(),y1=dayDate(R.b-1).getUTCFullYear();for(let y=y0;y<=y1;y++){const rs=m.rows.filter(r=>Math.floor(r.i/12)===y);if(!rs.length)continue;const n=rs.length,seg={};
      rs.forEach(r=>Object.entries(r.seg).forEach(([k,v])=>seg[k]=(seg[k]||0)+dv(v,r.i)/n));
      out.push({a:Math.max(dayNum(y,0,1),dayOfIdx(m.start)),b:Math.min(dayNum(y+1,0,1),dayOfIdx(m.end+1)),lab:`${y} (age ${Math.floor((y*12+6-m.born)/12)})`,gross:rs.reduce((s,r)=>s+dv(r.gross,r.i),0)/n,net:rs.reduce((s,r)=>s+dv(r.net,r.i),0)/n,seg,i:rs[0].i,unit:'year'});}}
  return{mode,list:out};}
function segDay(k){const F=S.fin,name=k.slice(2);if(k[0]==='l'||k[0]==='s')return 0;if(k[0]==='h')return F.mortgage.day||1;
  const b=F.bills.find(x=>x.name===name)||F.debts.find(x=>x.name===name);return b&&b.day||1;}
function tlSvg(){const R=tlRange(),B=buckets(R),{w,h,pad}=TL,keys=segKeys(),hid=S.hidden||{};
  const X=n=>pad.l+(n-R.a)/(R.b-R.a)*(w-pad.l-pad.r);
  const tops=B.list.map(b=>Math.max(b.gross,b.net,Object.entries(b.seg).filter(([k])=>!hid[k]).reduce((s,[,v])=>s+v,0)));
  const maxY=Math.max(100,...tops)*1.08,Y=v=>h-pad.b-(v/maxY)*(h-pad.t-pad.b);
  const step=niceStep(maxY/5);let grid='';for(let v=0;v<=maxY;v+=step)grid+=`<line class="grid" x1="${pad.l}" x2="${w-pad.r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="ax" x="${pad.l-6}" y="${Y(v)+4}" text-anchor="end">${fmtK(v)}</text>`;
  // x ticks
  let xt='';const span=R.b-R.a;
  if(B.mode==='day'){for(let n=Math.ceil(R.a);n<R.b;n++){const d=dayDate(n);const lab=span<=21||d.getUTCDate()===1||(span<=60&&d.getUTCDay()===1);if(lab)xt+=`<text class="ax" x="${X(n+.5)}" y="${h-10}" text-anchor="middle">${d.getUTCDate()===1||n===Math.ceil(R.a)?MON[d.getUTCMonth()]+' ':''}${d.getUTCDate()}</text>`;}}
  else if(B.mode==='month'){const every=span>365*3?6:span>365*1.5?3:1;B.list.forEach(b=>{if(b.i%every===0)xt+=`<text class="ax" x="${X((b.a+b.b)/2)}" y="${h-10}" text-anchor="middle">${b.i%12===0||every>=6?ym(b.i):MON[b.i%12]}</text>`;});}
  else{const yrs=B.list.length,every=yrs>40?10:yrs>20?5:yrs>10?2:1;B.list.forEach(b=>{const y=Math.floor(b.i/12);if(y%every===0)xt+=`<text class="ax" x="${X((b.a+b.b)/2)}" y="${h-10}" text-anchor="middle">${y}</text>`;});}
  // bars
  let bars='';B.list.forEach((b,k)=>{const x0=X(b.a),x1=X(b.b),bw=Math.max(1,(x1-x0)*.78),bx=x0+(x1-x0-bw)/2;let acc=0;
    keys.forEach(key=>{const v=b.seg[key];if(!v||hid[key])return;const y0=Y(acc),y1=Y(acc+v);acc+=v;bars+=`<rect x="${bx.toFixed(1)}" y="${y1.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0,y0-y1).toFixed(1)}" fill="${segColor(key,keys)}"/>`;});});
  // income lines (or income bars on the day view)
  let lines='';
  if(B.mode==='day'){B.list.forEach(b=>{if(!b.gross)return;const x0=X(b.a),x1=X(b.b),cx=(x0+x1)/2;lines+=`<line x1="${cx}" x2="${cx}" y1="${Y(b.gross)}" y2="${Y(0)}" stroke="var(--ink)" stroke-width="2" stroke-dasharray="3 2"/><circle cx="${cx}" cy="${Y(b.gross)}" r="3.5" fill="var(--ink)"/><circle cx="${cx}" cy="${Y(b.net)}" r="4.5" fill="var(--good)"/>`;});}
  else{const pts=f=>B.list.map(b=>`${X((b.a+b.b)/2).toFixed(1)},${Y(f(b)).toFixed(1)}`).join(' ');
    lines=`<polyline class="ln" points="${pts(b=>b.gross)}" stroke="var(--ink)" stroke-dasharray="5 3"/><polyline class="ln" points="${pts(b=>b.net)}" stroke="var(--good)" stroke-width="3"/>`;}
  // key-date markers
  const pri=span>365*12?1:span>365*2.5?2:3;let mk='';const ends=[0,0,0,0,0,0];const K=keyDates().filter(e=>e.day>=R.a&&e.day<=R.b&&e.pri<=pri).sort((x,y)=>x.pri-y.pri||x.day-y.day);
  const placed=[];K.forEach(e=>{const x=X(e.day),lw=e.t.length*6.4+14;let r=ends.findIndex((v,k)=>placed.every(p=>p.r!==k||x>p.x1+6||x+lw<p.x0-6));if(x+lw>w-pad.r&&r>=0){/* label runs off the right edge: draw it to the left */}
    const left=x+lw>w-pad.r,x0=left?x-lw:x,x1=left?x:x+lw;r=ends.findIndex((v,k)=>placed.every(p=>p.r!==k||x0>p.x1+6||x1<p.x0-6));const show=r>=0;if(show)placed.push({r,x0,x1});const y=12+(show?r:0)*14;e._l=left;e._s=show;e._y=y;e._x=x;});
  K.sort((x,y)=>x.day-y.day).forEach(e=>{const x=e._x,y=e._y;
    const c=e.side==='duty'?'var(--duty)':e.side==='study'?'var(--study)':e.side==='age'?'var(--ink-3)':e.side==='today'?'var(--bad)':'var(--accent)';
    mk+=`<g class="mk" data-mk="${e.day}"><line x1="${x}" x2="${x}" y1="${y+3}" y2="${h-pad.b}" stroke="${c}" stroke-width="1.4" stroke-dasharray="${e.side==='today'?'':'4 3'}"/><circle cx="${x}" cy="${y}" r="4" fill="${c}"/>${e._s?`<text x="${e._l?x-6:x+6}" y="${y+4}" class="mklab" fill="${c}" text-anchor="${e._l?'end':'start'}">${esc(e.t)}</text>`:''}<title>${esc(fmtDay(e.day)+': '+e.t+(e.x?'. '+e.x:''))}</title></g>`;});
  const unit=B.mode==='day'?'per day':B.mode==='month'?'per month':'per month, yearly average';
  TL.B=B;TL.R=R;TL.X=X;
  return `<svg viewBox="0 0 ${w} ${h}" class="viz tl" id="tlsvg" role="img" aria-label="Income and spending from ${fmtDay(R.a)} to ${fmtDay(R.b)}">${grid}<line class="zero" x1="${pad.l}" x2="${w-pad.r}" y1="${Y(0)}" y2="${Y(0)}"/>${bars}${lines}${mk}${xt}<line class="xh" id="tlxh" x1="0" x2="0" y1="${pad.t}" y2="${h-pad.b}" style="display:none"/></svg>`;}
function niceStep(x){const p=Math.pow(10,Math.floor(Math.log10(Math.max(1,x)))),n=x/p;return (n<1.5?1:n<3?2:n<7?5:10)*p;}
function tlLegend(){const keys=segKeys(),hid=S.hidden||{},by={};keys.forEach(k=>(by[k[0]]=by[k[0]]||[]).push(k));
  return `<div class="tl-legend"><div class="lgrow"><span class="lg"><i style="background:var(--ink);height:3px;width:16px"></i>Gross income</span><span class="lg"><i style="background:var(--good);height:4px;width:16px"></i>Take-home (net)</span><span class="small muted">Bars: every bill and account. Click a name to hide or show it.</span></div>
   ${Object.entries(by).map(([g,ks])=>`<div class="lgrow"><b class="small">${GROUPS[g].n}</b>${ks.map(k=>`<button class="lgb ${hid[k]?'off':''}" data-seg="${esc(k)}"><i style="background:${segColor(k,keys)}"></i>${esc(k.slice(2))}</button>`).join('')}</div>`).join('')}</div>`;}
function tlTip(b){const keys=segKeys(),hid=S.hidden||{},tot=Object.entries(b.seg).filter(([k])=>!hid[k]).reduce((s,[,v])=>s+v,0);
  const rows=Object.entries(b.seg).filter(([k,v])=>v>0.5&&!hid[k]).sort((x,y)=>y[1]-x[1]);
  const u=b.unit==='day'?'':b.unit==='year'?' a month (average)':' this month';
  return `<b>${esc(b.lab)}</b>${b.unit!=='month'?'':`<div class="small muted">${b.row&&b.row.job?`Nursing ${b.row.job.fte<1?b.row.job.fte+' FTE':'full time'} · `:''}age ${Math.floor((b.i-model().born)/12)}</div>`}
   <div class="tr"><i style="background:var(--ink)"></i><span>Gross income${u}</span><b>${money0(b.gross)}</b></div><div class="tr"><i style="background:var(--good)"></i><span>Take-home</span><b>${money0(b.net)}</b></div>
   <div class="tr"><i style="background:var(--line)"></i><span>Bills and debts</span><b>${money0(tot)}</b></div>${b.unit!=='day'?`<div class="tr"><i></i><span>Left over</span><b class="${b.net-tot>=0?'pos':'neg'}">${money0(b.net-tot)}</b></div>`:''}
   <hr>${rows.slice(0,14).map(([k,v])=>`<div class="tr"><i style="background:${segColor(k,keys)}"></i><span>${esc(k.slice(2))}</span><b>${money0(v)}</b></div>`).join('')}${rows.length>14?`<div class="small muted">and ${rows.length-14} more</div>`:''}`;}
function drawTl(){const el=$('#tlwrap');if(!el)return;el.querySelector('.tlsvg').innerHTML=tlSvg();const R=TL.R;
  $('#tlrange').textContent=`${fmtDay(R.a)} to ${fmtDay(R.b)} · ${TL.B.mode==='day'?'amounts per day':TL.B.mode==='month'?'amounts per month':'per month, averaged over each year'}`;bindTlSvg();}
function setView(a,b){S.view={a,b};drawTl();clearTimeout(setView.t);setView.t=setTimeout(()=>save(),400);}
function bindTlSvg(){const svg=$('#tlsvg'),tip=$('#tltip'),xh=$('#tlxh');if(!svg)return;const {w,pad}=TL;
  const toDay=e=>{const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*w;return TL.R.a+(x-pad.l)/(w-pad.l-pad.r)*(TL.R.b-TL.R.a);};
  svg.onmousemove=e=>{if(TL.drag)return;const d=toDay(e),b=TL.B.list.find(b=>d>=b.a&&d<b.b);if(!b){tip.hidden=true;xh.style.display='none';return;}
    const x=TL.X((b.a+b.b)/2);xh.setAttribute('x1',x);xh.setAttribute('x2',x);xh.style.display='';tip.innerHTML=tlTip(b);tip.hidden=false;
    const r=svg.getBoundingClientRect(),wr=$('#tlwrap').getBoundingClientRect(),px=e.clientX-wr.left;tip.style.left=Math.min(px+14,wr.width-tip.offsetWidth-4)+'px';tip.style.top=(e.clientY-wr.top+14)+'px';};
  svg.onmouseleave=()=>{tip.hidden=true;xh.style.display='none';};
  svg.onwheel=e=>{e.preventDefault();const d=toDay(e),R=TL.R,k=Math.exp((e.deltaY||e.deltaX)*.0015);let a=d-(d-R.a)*k,b=d+(R.b-d)*k;if(b-a<14){const c=(a+b)/2;a=c-7;b=c+7;}setView(a,b);};
  svg.onpointerdown=e=>{TL.drag={x:e.clientX,a:TL.R.a,b:TL.R.b};svg.setPointerCapture(e.pointerId);tip.hidden=true;};
  svg.onpointermove=e=>{if(!TL.drag)return;const r=svg.getBoundingClientRect(),dd=(e.clientX-TL.drag.x)/r.width*w/(w-pad.l-pad.r)*(TL.drag.b-TL.drag.a);if(Math.abs(e.clientX-TL.drag.x)>2){TL.moved=true;setView(TL.drag.a-dd,TL.drag.b-dd);}};
  svg.onpointerup=e=>{const moved=TL.moved;TL.drag=null;TL.moved=false;if(!moved){const mk=e.target.closest('[data-mk]');if(mk){const c=+mk.dataset.mk,s=TL.R.b-TL.R.a;setView(c-s/6,c+s*5/6);}}};
  svg.ondblclick=e=>{const d=toDay(e),s=(TL.R.b-TL.R.a)/3;setView(d-s/2,d+s/2);};}
function vTime(){const F=S.fin,m=model(),V=ch(),O=F.ret.options[V.date],first=m.rows.find(r=>r.i===m.rm+1),ft=m.rows.find(r=>r.i>m.rm&&r.job&&r.job.fte===1)||first;
  const tile=(l,b,s,side)=>`<div class="tile ${side||''}"><div class="eyebrow-s">${l}</div><div class="tbig">${b}</div><div class="small muted">${s}</div></div>`;
  const before=m.rows.filter(r=>r.i<=m.rm),shortMo=before.filter(r=>r.left<0).length;
  const presets=[['1 month',30],['3 months',91],['To retirement',null],['2 years',730],['10 years',3652],['30 years',10957],['Whole life',1e6]];
  return `<div class="stack">
   <div class="tiles">
    ${tile('Army retired pay',money0(m.RP.gross),`a month before tax, ${V.rp==='mab'?'Army calculator':'points ÷ 360'} (${pct1(m.RP.mult)})`,'duty')}
    ${tile('VA disability',money0(VA_RATE[m.vaPct]||0),`a month at ${m.vaPct}%, tax free`,'duty')}
    ${tile('Take-home after AGR',money0(ft?ft.net:0),`a month in ${ym(ft?ft.i:m.rm+1)}, with nursing pay`,'study')}
    ${tile('Left over before retiring',money0(before.reduce((s,r)=>s+r.left,0)),shortMo?`${shortMo} months short; the gap goes on Capital One`:'from now to retirement','money')}
    ${tile('Debt free',m.debtFree?ym(m.debtFree):'later','besides the mortgage','money')}
   </div>
   ${V.rp==='mab'?`<p class="small">Retired pay uses the Army calculator method from your MyArmyBenefits printout: ${esc(m.RP.how)}, times a ${money0(m.RP.high3)} High-3 average. ${esc(F.ret.mabNote||'')}</p>`:`<p class="small warnbox">Points ÷ 360 counts your reserve points as service years, so it comes out higher than the Army calculator. HRO's service computation decides which is right.</p>`}
   <div class="panel stack" id="tlwrap">
    <div class="row" style="justify-content:space-between"><h2>Your money, day by day to decades</h2><span class="small muted" id="tlrange"></span></div>
    <div class="row">${presets.map(([n,d])=>`<button class="btn sm" data-zoom="${d===null?'ret':d}">${n}</button>`).join('')}<span class="small muted">Scroll or pinch on the chart to zoom, drag to move, click a marker to jump to it.</span></div>
    <div class="tlsvg chart-wrap"></div><div class="tip" id="tltip" hidden></div>
    ${tlLegend()}
   </div>
   <div class="panel stack"><h3>Key dates</h3><div class="kd">${keyDates().filter(e=>e.side!=='today').map(e=>`<button class="kdb ${e.side}" data-go="${e.day}"><span class="mono">${fmtDay(e.day)}</span><b>${esc(e.t)}</b>${e.x?`<span class="small muted">${esc(e.x)}</span>`:''}</button>`).join('')}</div></div>
  </div>`;}
function bindTime(){drawTl();
  $$('[data-zoom]').forEach(b=>b.onclick=()=>{const m=model(),t=todayNum(),z=b.dataset.zoom;if(z==='ret')return setView(t-10,dayOfIdx(m.rm+3));const n=+z;if(n>=1e6)return setView(dayOfIdx(m.start),dayOfIdx(m.end+1));setView(t-Math.min(10,n*.05),t+n);});
  $$('[data-seg]').forEach(b=>b.onclick=()=>{const k=b.dataset.seg;S.hidden=S.hidden||{};S.hidden[k]=!S.hidden[k];save();b.classList.toggle('off');drawTl();});
  $$('[data-go]').forEach(b=>b.onclick=()=>{const c=+b.dataset.go,s=Math.max(90,TL.R?TL.R.b-TL.R.a:365);setView(c-s/6,c+s*5/6);$('#tlwrap').scrollIntoView({behavior:'smooth',block:'start'});});}

/* ---------- Up to retirement: month by month ---------- */
function vNow(){const F=S.fin,m=model(),rows=m.rows.filter(r=>r.i<=m.rm+3),keys=segKeys();
  const sum=(r,g)=>Object.entries(r.seg).filter(([k])=>k[0]===g).reduce((s,[,v])=>s+v,0);
  const ev=keyDates();const evIn=i=>ev.filter(e=>e.side!=='age'&&e.side!=='today'&&idxOfDay(e.day)===i).map(e=>e.t);
  const tb=rows.map(r=>`<tr class="${r.i===m.rm?'yr':''}"><td>${ym(r.i)}${evIn(r.i).length?`<div class="small muted">${esc(evIn(r.i).join(' · '))}</div>`:''}</td><td>${money0(dv(r.gross,r.i))}</td><td>${money0(dv(r.net,r.i))}</td><td>${money0(dv(sum(r,'d'),r.i))}</td><td>${money0(dv(sum(r,'h'),r.i))}</td><td>${money0(dv(sum(r,'b'),r.i))}</td><td>${money0(dv(sum(r,'l')+sum(r,'s'),r.i))}</td><td class="${r.left>=0?'pos':'neg'}">${money0(dv(r.left,r.i))}</td></tr>`).join('');
  const r0=m.rows[0],rR=m.rows.find(r=>r.i===m.rm);
  const acct=F.debts.map((d,k)=>`<tr><td>${esc(d.name)}${d.est?' <span class="small muted">(estimate)</span>':''}</td><td>${(d.apr*100).toFixed(2)}%</td><td>${money0(d.bal)}</td><td>${money0(rR?rR.bal[k]:0)}</td><td>${m.debts[k].end?ym(m.debts[k].end):'later'}</td></tr>`).join('');
  return `<div class="stack"><h2>From now to retirement</h2>
   <p class="muted">Every month from ${ym(m.start)} to ${ym(m.rm+3)}, using the choices at the top. AGR take-home is your real deposit, about ${money0(F.agr.net)} a month (${money0(F.agr.net+F.agr.tspLoanMo)} once the TSP loans end).</p>
   <div class="panel stack"><div class="tbl-wrap"><table class="mtbl"><thead><tr><th>Month</th><th>Gross</th><th>Take-home</th><th>Debts</th><th>Home</th><th>Bills</th><th>Living${ch().job==='np'?' and school':''}</th><th>Left over</th></tr></thead><tbody>${tb}</tbody></table></div>
   <p class="small muted">Debts include extra payments from what is left over (${ch().dx==='none'?'none':ch().dx==='half'?'half':'all'}). When a month comes up short, the plan adds the gap to Capital One.</p></div>
   <div class="panel stack"><h3>Every account</h3><div class="tbl-wrap"><table class="mtbl"><thead><tr><th>Account</th><th>Rate</th><th>Owed now</th><th>At retirement</th><th>Paid off</th></tr></thead><tbody>${acct}<tr><td>${esc('PennyMac mortgage')}</td><td>${(F.mortgage.rate*100).toFixed(2)}%</td><td>${money0(model().rows[0].mort)}</td><td>${money0(rR?rR.mort:0)}</td><td>${m.mEnd?ym(m.mEnd):'later'}</td></tr></tbody></table></div></div>
   <div class="panel stack"><h3>Bills each month</h3><div class="pl-list">${F.bills.map(b=>`<div class="pl-row"><div><b>${esc(b.name)}</b><div class="small muted">due about the ${b.day}${['st','nd','rd'][((b.day+90)%100-10)%10-1]||'th'}${b.end?`, ends ${ym(ymIdx(b.end))}`:''}${b.note?` · ${esc(b.note)}`:''}</div></div><div class="amt">${money2(b.amt)}</div></div>`).join('')}${F.living.map(l=>`<div class="pl-row"><div><b>${esc(l.k)}</b><div class="small muted">${esc(l.note||'spread over the month')}</div></div><div class="amt">${money0(l.v)}</div></div>`).join('')}</div></div>
  </div>`;}

/* ---------- Work later: part time and teaching ---------- */
function adjPerCourse(V){const P=typeof WORKDATA!=='undefined'&&WORKDATA.adjunct&&WORKDATA.adjunct.pay&&WORKDATA.adjunct.pay.perCredit;const c=P?(V.job==='np'?P.typical:P.low):1650;return c*3;} // a 3-credit course; with only a BSN, practical nursing programs pay the lower college rate
function vWork(){const W=typeof WORKDATA!=='undefined'?WORKDATA:{},A=W.adjunct||{},m=model(),V=ch();
  const src=u=>{if(!u)return'';const h=String(u).match(/https?:\/\/([^\/\s]+)/);return h?` <a class="small muted" href="${esc(String(u).split(' ')[0])}" target="_blank" rel="noopener">${esc(h[1].replace(/^www\./,''))}</a>`:` <span class="small muted">(${esc(u)})</span>`;};
  const list=a=>Array.isArray(a)?`<ul class="small">${a.map(x=>`<li>${x.label?`<b>${esc((x.age?x.age+': ':'')+x.label)}.</b> `:x.option?`<b>${esc(x.option)}.</b> `:''}${esc(x.text||'')}${x.uncertain?' <span class="chip warn">confirm</span>':''}${src(x.source)}</li>`).join('')}</ul>`:'';
  const r=m.rows.find(x=>x.i===m.ptI)||null,pc=A.pay&&A.pay.perCredit,ch2=A.pay&&A.pay.clinicalHourly;
  return `<div class="stack"><h2>Working later: part time and teaching</h2>
   <p class="muted">Turn these on at the top under <b>More choices</b>. The timeline, the To retirement tab and every total change with them.</p>
   <div class="tiles">
    <div class="tile study"><div class="eyebrow-s">Part time</div><div class="tbig">${V.pt==='no'?'Off':`From ${V.pt}`}</div><div class="small muted">${r?`${money0(r.inc.job||0)} a month gross, ${money0(r.net)} take-home in ${ym(r.i)}`:'Pick an age under More choices'}</div></div>
    <div class="tile study"><div class="eyebrow-s">Teaching nursing</div><div class="tbig">${V.adj==='off'?'Off':`From ${V.adj}`}</div><div class="small muted">${V.adj==='off'?`About ${money0(adjPerCourse(V))} per 3-credit course today`:`${V.adjn} courses a year, about ${money0(adjPerCourse(V)*+V.adjn)} a year in today's dollars`}</div></div>
    <div class="tile study"><div class="eyebrow-s">Stop working</div><div class="tbig">${V.stop}</div><div class="small muted">${ym(m.stopI)}</div></div>
   </div>
   ${A.requirements?`<div class="panel study stack"><h3>What it takes to teach nursing in Minnesota</h3><p class="small muted">${esc(A.requirements.rule||'')}</p>${list(A.requirements.facts)}</div>`:''}
   ${A.pay?`<div class="panel study stack"><h3>What teaching pays</h3><div class="tiles">${pc?`<div class="tile"><div class="eyebrow-s">Adjunct, per credit</div><div class="tbig">${money0(pc.low)} to ${money0(pc.high)}</div><div class="small muted">Minnesota State; a 3-credit course is about ${money0(pc.low*3)} to ${money0(pc.high*3)}</div></div>`:''}${ch2?`<div class="tile"><div class="eyebrow-s">Clinical instructor</div><div class="tbig">$${ch2.low} to $${ch2.high}</div><div class="small muted">an hour, typical $${ch2.typical}</div></div>`:''}</div>${list([...(pc&&pc.facts||[]),...(ch2&&ch2.facts||[]),...(A.pay.fullTimeBenchmark&&A.pay.fullTimeBenchmark.facts||[])])}</div>`:''}
   ${A.schools?`<div class="panel study stack"><h3>Nursing programs near you</h3><div class="tbl-wrap"><table class="mtbl"><thead><tr><th>School</th><th>City</th><th>Programs</th><th style="text-align:left">Teach with a BSN?</th></tr></thead><tbody>${A.schools.map(s=>`<tr><td>${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`:esc(s.name)}</td><td>${esc(s.city||'')}</td><td>${esc(Array.isArray(s.programs)?s.programs.join(', '):s.programs||'')}</td><td style="text-align:left;white-space:normal;min-width:16rem">${s.teachesWithBsn?'<b>Likely</b>':'Needs an MSN or DNP for most roles'}${s.note?`<div class="small muted">${esc(s.note)}</div>`:''}</td></tr>`).join('')}</tbody></table></div></div>`:''}
   ${A.whereToFind?`<div class="panel study stack"><h3>Where to find openings</h3>${list(A.whereToFind)}</div>`:''}
   ${A.tips?`<div class="panel study stack"><h3>Tips</h3>${list(A.tips)}</div>`:''}
   ${W.nursePay?`<div class="panel study stack"><h3>Nurse pay in Minnesota</h3>${list([...(W.nursePay.rn||[]),...(W.nursePay.newGrad||[]),...(W.nursePay.np||[])])}<h3>Part-time options</h3>${list(W.nursePay.partTime)}</div>`:''}
   ${W.workOnLeave?`<div class="panel duty stack"><h3>Starting nursing while still on AGR leave</h3>${list(W.workOnLeave.facts)}<h3>License timing</h3>${list(W.workOnLeave.licenseTiming)}${list(W.workOnLeave.practical)}<p class="small warnbox">Ask HRO in writing before you start a civilian job while on AGR orders, even on leave.</p></div>`:''}
   ${W.milestones?`<div class="panel money stack"><h3>Age milestones</h3>${list(W.milestones)}${W.minnesota?`<h3>Minnesota taxes</h3>${list(W.minnesota)}`:''}</div>`:''}
   <p class="small muted">Facts checked ${esc(W.checked||'2026')}. Confirm pay and rules with each school and employer.</p>
  </div>`;}

/* ---------- Data and backup ---------- */
function vData(){return `<div class="stack"><h2>Your data</h2>
  <div class="panel stack"><p>Everything stays on this Mac. <b>Save to file</b> writes your choices inside this HTML file. Nothing is uploaded, and this app never contacts the Army, DFAS or the VA.</p>
  <div class="row"><button class="btn" id="copyB">Copy backup</button><button class="btn" id="resetView">Reset the chart zoom</button></div></div>
  <div class="panel stack"><h3>What this version leaves out</h3><p class="small">The VA claim tools stay in your first version, Kurt's Retirement Plan. This one is only money.</p></div></div>`;}
function bindData(){$('#copyB').onclick=()=>{navigator.clipboard.writeText(JSON.stringify(S)).then(()=>toast('Backup copied'));};$('#resetView').onclick=()=>{S.view=null;save();toast('Zoom reset');};}

/* ---------- A simple line chart other tabs can use ---------- */
function lineChart(cfg){const W=720,H=cfg.height||260,p={l:56,r:12,t:12,b:28},L=cfg.labels||[],n=L.length;if(!n)return'';
  const all=[];const stack=cfg.stack;const acc=new Array(n).fill(0);const ser=cfg.series.map(s=>{const v=s.values.map((x,k)=>stack?(acc[k]+=+x||0):+x||0);all.push(...v);return{...s,v};});
  const mx=Math.max(1,...all),mn=Math.min(0,...all),X=k=>p.l+(n<2?0:k/(n-1))*(W-p.l-p.r),Y=v=>H-p.b-(v-mn)/(mx-mn)*(H-p.t-p.b),fm=cfg.yfmt||fmtK;
  const st=niceStep((mx-mn)/4);let g='';for(let v=Math.ceil(mn/st)*st;v<=mx;v+=st)g+=`<line class="grid" x1="${p.l}" x2="${W-p.r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="ax" x="${p.l-6}" y="${Y(v)+4}" text-anchor="end">${fm(v)}</text>`;
  const ev=Math.max(1,Math.ceil(n/8));const xl=L.map((t,k)=>k%ev===0||k===n-1?`<text class="ax" x="${X(k)}" y="${H-8}" text-anchor="middle">${esc(t)}</text>`:'').join('');
  const body=ser.slice().reverse().map(s=>{const pts=s.v.map((v,k)=>`${X(k).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');return (s.fill?`<polygon points="${X(0)},${Y(mn)} ${pts} ${X(n-1)},${Y(mn)}" fill="${s.color}" opacity=".18"/>`:'')+`<polyline class="ln" points="${pts}" stroke="${s.color}" ${s.dash?'stroke-dasharray="5 4"':''}/>`;}).join('');
  return `<div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" class="viz" role="img" aria-label="${esc(cfg.aria||'Chart')}">${g}${body}${xl}</svg><div class="legend">${cfg.series.map(s=>`<span class="lg"><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div></div>`;}

/* ---------- Tabs and drawing ---------- */
TABS2.push({id:'time',name:'Timeline',order:10,view:vTime,bind:bindTime},{id:'now',name:'To retirement',order:20,view:vNow,bind:()=>{}},{id:'work',name:'Work later',order:30,view:vWork,bind:()=>{}},{id:'data',name:'Data',order:99,view:vData,bind:bindData});
function render(){if(!S.fin){$('#main').innerHTML='<div class="panel">No plan data is in this file yet.</div>';return;}
  const T=TABS2.slice().sort((a,b)=>a.order-b.order);if(!T.find(t=>t.id===S.tab))S.tab='time';
  $('#tabs').innerHTML=T.map(t=>`<button role="tab" aria-selected="${S.tab===t.id}" data-tab="${t.id}">${esc(t.name)}</button>`).join('');
  $$('#tabs [data-tab]').forEach(b=>b.onclick=()=>{S.tab=b.dataset.tab;save();render();scrollTo(0,0);});
  renderFileBar();const an=S.appName||'Retirement Plan v2';$('#appName').textContent=an;document.title=an;
  const t=T.find(x=>x.id===S.tab);
  try{$('#main').innerHTML=`<section class="view">${S.tab==='data'?'':gBar()}${t.view()}</section>`;bindGbar();t.bind();}
  catch(e){console.error(e);$('#main').innerHTML=`<section class="view"><div class="panel warnbox"><h2>This tab hit a problem</h2><p class="small">${esc(e&&e.message||e)}</p><p>Your data is safe.</p></div></section>`;}}
document.addEventListener('DOMContentLoaded',()=>{load();render();});
