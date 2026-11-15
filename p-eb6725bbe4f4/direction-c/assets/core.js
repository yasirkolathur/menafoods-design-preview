/* MENAFoods Direction C — core helpers. ALL DATA IS SAMPLE DATA (بيانات تجريبية). */
const RIYAL_PATH = "M110 97Q115 142 126.5 184.5Q138 227 156 267L582 358V1343Q614 1384 654.0 1417.0Q694 1450 737 1474V414Q737 402 733.5 391.0Q730 380 723 370L643 249Q628 227 605.0 212.0Q582 197 554 191ZM894 -16Q900 29 911.0 72.0Q922 115 940 155L1445 261Q1439 216 1427.5 173.5Q1416 131 1399 93ZM184 475Q189 520 201.0 562.5Q213 605 231 645L1445 903Q1439 858 1427.5 815.5Q1416 773 1399 732ZM894 306V1265Q927 1306 966.5 1339.0Q1006 1372 1051 1397V499L1445 583Q1439 538 1427.5 495.0Q1416 452 1399 412Z";
const RIYAL_VB = "110 -1474 1335 1490";
const S = { lang:'en', plat:'pwa', role:'customer', screen:'b-hub', state:'default', variant:null, shot:false };
const L = (en, ar) => S.lang === 'ar' ? ar : en;
const esc = s => String(s);
const NF2 = new Intl.NumberFormat('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const NF0 = new Intl.NumberFormat('en-US');
function money(n, o={}){ // riyal sign LEFT of number in every language (SAMA); amount isolated LTR; Western digits
  const neg = n<0; const v = NF2.format(Math.abs(n));
  return `<bdi class="money" dir="ltr" aria-label="${v} ${L('Saudi riyals','ريال سعودي')}"><svg class="rs" viewBox="${RIYAL_VB}" aria-hidden="true"><g transform="scale(1,-1)"><path d="${RIYAL_PATH}"/></g></svg>${neg?'−':''}${v}</bdi>${o.ex?`<span class="ex">${L('excl. VAT','غير شامل الضريبة')}</span>`:''}`;
}
const num = n => `<bdi class="num" dir="ltr">${NF0.format(n)}</bdi>`;
const ltr = s => `<bdi class="ltr" dir="ltr">${s}</bdi>`;
const TODAY = new Date(2026,10,12,15,10);
function dt(d, o={}){ // Gregorian primary, Hijri (Umm al-Qura) secondary, Western digits
  if(typeof d==='number'){ d = new Date(TODAY.getTime()+d*864e5); }
  const loc = S.lang==='ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB-u-ca-gregory';
  const g = new Intl.DateTimeFormat(loc,{day:'numeric',month:'short',year:'numeric',...(o.time?{hour:'2-digit',minute:'2-digit',hour12:false}:{})}).format(d);
  if(o.noHijri) return g;
  const h = new Intl.DateTimeFormat(S.lang==='ar'?'ar-SA-u-ca-islamic-umalqura-nu-latn':'en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'long',year:'numeric'}).format(d);
  return `${g} <span class="hijri">· ${h.replace(/ AH$/,'')}${S.lang==='ar'?'':' AH'}</span>`;
}
const time = (h,m)=> ltr(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);

/* ---------- Icons (original simple strokes, 24px grid) ---------- */
const IP = {
 home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
 inbox:'<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
 cart:'<path d="M3 4h2l2 11h11l2-8H6"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
 truck:'<path d="M2 6h11v10H2zM13 9h5l3 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
 file:'<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c1-3.5 3.5-5 7-5s6 1.5 7 5"/><path d="M16 4.5a3.5 3.5 0 010 7M18 15c2 .6 3.4 2.2 4 5"/>',
 bell:'<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 20a2 2 0 004 0"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
 check:'<path d="M4 12l5 5L20 6"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 scan:'<path d="M3 7V4h3M18 4h3v3M21 17v3h-3M6 20H3v-3M7 8v8M10 8v8M13 8v8M16 8v8"/>',
 map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
 pin:'<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z"/>',
 chat:'<path d="M4 20l1.5-4A8 8 0 1112 20a8 8 0 01-4-1z"/>',
 camera:'<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="4"/>',
 pen:'<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
 alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
 wifioff:'<path d="M3 3l18 18M8.5 16.5a5 5 0 017 0M5 12.5a10 10 0 015-2.6M14 10a10 10 0 015 2.5M2 8.5a15 15 0 015-2.8M12 5a15 15 0 0110 3.5"/><circle cx="12" cy="20" r="1"/>',
 chev:'<path d="M9 5l7 7-7 7"/>', back:'<path d="M15 5l-7 7 7 7"/>', arrow:'<path d="M4 12h16M14 6l6 6-6 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
 filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 bank:'<path d="M3 9l9-5 9 5M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>',
 upload:'<path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"/>',
 refresh:'<path d="M20 11a8 8 0 10-2 6"/><path d="M20 4v7h-7"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 store:'<path d="M3 9l2-5h14l2 5M4 9v11h16V9M3 9h18M9 20v-6h6v6"/>',
 cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.8z"/>',
 lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 17V9a4 4 0 018 0v6a4 4 0 008 0"/>',
 repeat:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 01-3 3H3"/>',
 sync:'<path d="M4 12a8 8 0 0114-5.3L20 9M20 12a8 8 0 01-14 5.3L4 15"/><path d="M20 4v5h-5M4 20v-5h5"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
 return:'<path d="M9 14l-5-5 5-5"/><path d="M4 9h11a5 5 0 010 10h-3"/>',
 note:'<path d="M5 3h14v18H5z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 warehouse:'<path d="M2 9l10-5 10 5v11H2z"/><path d="M6 20v-7h12v7M6 16h12"/>',
 image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
 history:'<path d="M3 12a9 9 0 103-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
 more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
 sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
 nafith:'<path d="M5 3h10l4 4v14H5z"/><path d="M8 15c2-2 3 1 5-1s2 0 3 0M8 9h6"/>',
 temp:'<path d="M10 14V5a2 2 0 014 0v9a4 4 0 11-4 0z"/>',
 key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
};
const FLIP = new Set(['chev','back','arrow','return']);
const ic = (n, c='') => `<svg class="i ${c} ${FLIP.has(n)?'flip':''}" viewBox="0 0 24 24" aria-hidden="true">${IP[n]||IP.more}</svg>`;

/* ---------- Components ---------- */
const chip = (tone, txt, dot=true) => `<span class="chip ${tone}">${dot?'<i class="dotc"></i>':''}${txt}</span>`;
function sla(mins, total=240){ const tone = mins<0?'bad':(mins/total<.25?'wait':'ok');
  const a=Math.abs(mins), h=Math.floor(a/60), m=a%60; const v = `${h}:${String(m).padStart(2,'0')}`;
  return `<span class="sla ${tone}" data-sla="${mins}">${ic('clock','sm')}${mins<0?L('Late ','متأخر '):''}${ltr(v)}${mins<0?'':L(' left',' متبقٍ')}</span>`; }
const kpi = (l,v,s='',tone='',go='') => `<button class="kpi ${tone}" ${go?`data-go="${go}"`:''}><span class="l">${l}</span><span class="v">${v}</span>${s?`<span class="s">${s}</span>`:''}</button>`;
function qi(o){ // queue item
  const inner = `<div class="qi tone-${o.tone||'new'} ${o.queued?'queued':''}" ${o.go?`data-go="${o.go}"`:''} role="button">
   <div class="ic">${ic(o.icon||'inbox')}</div>
   <div class="grow"><div class="t">${o.t}</div>${o.s?`<div class="s">${o.s}</div>`:''}
     <div class="meta">${o.chips||''}${o.sla!==undefined?sla(o.sla,o.total):''}${o.queued?chip('off',L('Queued offline','في قائمة الانتظار')):''}</div></div>
   ${o.act?`<div class="act">${o.act}</div>`:''}</div>`;
  if(!o.swipe) return inner;
  return `<div class="swipe ${o.swipe==='demo'?'demo':''}">${inner}<div class="sa"><button style="background:#34C759" data-act="approve">${ic('check','sm')}${L('Approve','موافقة')}</button><button style="background:#FF3B30" data-act="reject">${ic('x','sm')}${L('Reject','رفض')}</button></div></div>`;
}
const btn = (t, k='', a='') => `<button class="btn ${k}" ${a}>${t}</button>`;
const sec = (title, body, more='', moreGo='') => `<section class="sec"><div class="sec-h"><h3>${title}</h3>${more?`<button class="more" ${moreGo?`data-go="${moreGo}"`:''}>${more}</button>`:''}</div>${body}</section>`;
const li = (o) => `<button class="li" ${o.go?`data-go="${o.go}"`:''} ${o.act?`data-act="${o.act}"`:''}>${o.lead||''}<div class="grow"><div class="ttl">${o.t}</div>${o.s?`<div class="sub">${o.s}</div>`:''}</div>${o.end||''}${o.go?`<span class="chev">${ic('chev','sm')}</span>`:''}</button>`;
const list = items => `<div class="list">${items.map(li).join('')}</div>`;
const field = (label, val, o={}) => `<div class="field ${o.err?'err':''} ${o.ok?'okf':''}"><label>${label}${o.req?' *':''}</label><div class="in" ${o.ltr?'dir="ltr"':''}>${o.lead||''}<input value="${val}" ${o.ltr?'dir="ltr" inputmode="'+(o.im||'text')+'"':'dir="auto"'} ${o.ph?`placeholder="${o.ph}"`:''} aria-label="${label}"/>${o.ok?`<span class="chip ok">${ic('check','sm')}${o.okText||L('Verified','تم التحقق')}</span>`:''}${o.trail||''}</div>${o.hint?`<div class="hint">${o.hint}</div>`:''}</div>`;
const steps = (n, cur) => `<div class="stepper">${Array.from({length:n},(_,i)=>`<span class="st ${i<cur?'done':i===cur?'cur':''}"></span>`).join('')}</div>`;
function track(stages){ return `<div class="track">${stages.map(s=>`<div class="stg ${s.st}"><span class="b">${s.st==='done'?ic('check','sm'):s.st==='bad'?ic('x','sm'):s.n}</span><b>${s.t}</b><span class="tiny muted">${s.s||''}</span></div>`).join('')}</div>`; }
const approvalTrack = (cur, needMgr=true, o={}) => track([
  {n:1,t:L('Salesperson','المندوب'),s:cur>0?L('Approved','تمت الموافقة'):L('Reviewing','قيد المراجعة'),st:cur>0?'done':'cur'},
  {n:2,t:L('Accountant','المحاسب'),s:cur>1?L('Approved','تمت الموافقة'):cur===1?(o.s2||L('In review','قيد المراجعة')):'',st:cur>1?'done':cur===1?'cur':''},
  {n:3,t:L('Manager','المدير'),s:needMgr?(cur>2?L('Approved','تمت الموافقة'):cur===2?L('In review','قيد المراجعة'):L('Required > 150k','مطلوب > 150 ألف')):L('Not needed','غير مطلوب'),st:!needMgr?'skip':cur>2?'done':cur===2?'cur':''},
  {n:4,t:L('Nafith note','سند نافذ'),s:cur>3?L('Signed','موقّع'):'',st:cur>3?'done':cur===3?'cur':''},
]);
const tl = items => `<div class="timeline">${items.map(i=>`<div class="tl tone-${i.tone||'ok'}"><span class="d">${ic(i.icon||'check')}</span><div class="x"><b>${i.t}</b><div class="muted small">${i.s||''}</div></div></div>`).join('')}</div>`;
const banner = (tone, icon, html, act='') => `<div class="banner ${tone}">${ic(icon)}<div class="grow">${html}</div>${act}</div>`;
const agingBar = b => { const tot=b.reduce((a,x)=>a+x,0); const c=['--ag0','--ag1','--ag2','--ag3','--ag4'];
  return `<div class="agingbar" dir="ltr">${b.map((v,i)=>`<span style="width:${v/tot*100}%;background:var(${c[i]})"></span>`).join('')}</div>
  <div class="legend">${[L('Current','جاري'),'1–30','31–60','61–90','90+'].map((x,i)=>`<span><i style="background:var(${c[i]})"></i>${x} · ${money(b[i])}</span>`).join('')}</div>`; };
const qtyCtl = (n) => `<span class="qty" dir="ltr"><button data-q="-1" aria-label="-">−</button><span>${n}</span><button data-q="1" aria-label="+">+</button></span>`;
const filters = (arr, on=0) => `<div class="filters" role="tablist">${arr.map((f,i)=>`<button class="${i===on?'on':''}" data-filter>${f[0]}${f[1]!==undefined?`<span class="n">${f[1]}</span>`:''}</button>`).join('')}</div>`;
const tabs = (arr, on=0) => `<div class="tabs">${arr.map((t,i)=>`<button class="${i===on?'on':''}" data-tab>${t}</button>`).join('')}</div>`;
const seg = (arr,on=0) => `<div class="seg">${arr.map((t,i)=>`<button class="${i===on?'on':''}" data-seg>${t}</button>`).join('')}</div>`;
const thumb = (n='box') => `<div class="thumb">${ic(n)}</div>`;
const av = (t) => `<div class="avatar">${t}</div>`;
const kv = pairs => `<dl class="kv">${pairs.map(p=>`<dt>${p[0]}</dt><dd>${p[1]}</dd>`).join('')}</dl>`;
const card = (inner, cls='') => `<div class="card pad ${cls}">${inner}</div>`;
const hello = (h, d) => `<div class="hello"><h1 class="ios-hide">${h}</h1><div class="d">${d}</div></div>`;
const sampleTag = () => chip('inferred', L('Sample data','بيانات تجريبية'), false);
