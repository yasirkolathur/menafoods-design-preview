/* MENAFoods Direction A — core (router, i18n, formatting, chrome, states). SAMPLE DATA ONLY. */
(function(){
const MF = window.MF = {screens:{}, order:[], roles:{}};
const LS = {get:k=>{try{return localStorage.getItem(k)}catch(e){return null}}, set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};

// ---------- language: device default, persisted override ----------
function deviceLang(){const l=(navigator.languages&&navigator.languages[0])||navigator.language||'en';return /^ar\b/i.test(l)?'ar':'en'}
MF.S = {
  lang: LS.get('mf.lang') || deviceLang(),
  langSource: LS.get('mf.lang') ? 'saved' : 'device',
  plat: LS.get('mf.plat') || 'pwa',
  view: 'mobile', state:'default', variant:null, screen:'b.home', sub:null,
  overlay:null, toast:null, cart:{}, cmdk:false, sku:'MF-RIC-1010'
};
const S = MF.S;
MF.L = (en, ar) => S.lang==='ar' ? ar : en;
const L = MF.L;

// ---------- formatting ----------
const RIYAL_VB='0 0 1124.14 1256.39';
const RIYAL_P=['M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z','M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z'];
MF.riyal = () => `<svg class="riyal" viewBox="${RIYAL_VB}" role="img" aria-label="${L('SAR','ريال سعودي')}"><path d="${RIYAL_P[0]}"/><path d="${RIYAL_P[1]}"/></svg>`;
const nf2 = new Intl.NumberFormat('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const nf0 = new Intl.NumberFormat('en-US');
// Riyal sign always LEFT of the number (SAMA), inside an LTR isolate; Western digits in AR and EN.
MF.money = (n, o={}) => { const neg=n<0; return `<span class="money${o.cls?' '+o.cls:''}" dir="ltr">${MF.riyal()}&nbsp;${neg?'-':''}${nf2.format(Math.abs(n))}</span>` };
MF.num = n => `<span class="num">${nf0.format(n)}</span>`;
MF.pct = n => `<span class="num">${n}%</span>`;
const greg = {en:new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Riyadh'}),ar:new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Riyadh'})};
const hij = {en:new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Riyadh'}),ar:new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Riyadh'})};
const wk = {en:new Intl.DateTimeFormat('en-GB',{weekday:'short',timeZone:'Asia/Riyadh'}),ar:new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{weekday:'long',timeZone:'Asia/Riyadh'})};
MF.date = (iso, o={}) => { const d=new Date(iso+'T12:00:00+03:00'); const g=greg[S.lang].format(d); const w=o.wd?wk[S.lang].format(d)+' ':''; return o.nohijri? `<span>${w}${g}</span>` : `<span>${w}${g} <span class="muted small">· ${hij[S.lang].format(d)}</span></span>` };
MF.dateG = iso => greg[S.lang].format(new Date(iso+'T12:00:00+03:00'));
MF.ltr = s => `<bdi dir="ltr" class="mono">${s}</bdi>`;
MF.auto = s => `<bdi dir="auto">${s}</bdi>`;
MF.phone = s => `<bdi dir="ltr" class="num">${s}</bdi>`;

// ---------- icons (simple stroke set) ----------
const IP = {
 home:'<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>', list:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>',
 cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/>',
 box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>', truck:'<path d="M1 6h13v10H1zM14 10h4l3 3v3h-7z"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
 file:'<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>', user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>', users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c1-3.5 3.6-5 7-5s6 1.5 7 5M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.4 2.2 4 5"/>',
 bell:'<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>', search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
 chev:'<path d="m9 6 6 6-6 6"/>', back:'<path d="M15 6l-6 6 6 6"/>', arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>', check:'<path d="m5 12 5 5 9-10"/>', x:'<path d="M6 6l12 12M18 6 6 18"/>',
 alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>', info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>', wifioff:'<path d="M2 8.5a15 15 0 0 1 5-3M22 8.5A15 15 0 0 0 11 4.6M5 12a10 10 0 0 1 4-2.3M19 12a10 10 0 0 0-3-2M8.5 15.5a5 5 0 0 1 7 0M12 19.5v.01M3 3l18 18"/>',
 camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/>', pen:'<path d="M4 20h4L20 8l-4-4L4 16z"/>', phone:'<path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
 nav:'<path d="m3 11 18-8-8 18-2-8z"/>', scan:'<path d="M3 7V3h4M17 3h4v4M21 17v4h-4M7 21H3v-4M7 8v8M11 8v8M14 8v8M17 8v8"/>', plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
 lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', upload:'<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',
 refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>', filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>', more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
 map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>', wallet:'<path d="M3 7h18v13H3z"/><path d="M3 7l13-4v4M16 13h2"/>', chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>', settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
 whatsapp:'<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .8c-1-.5-1.8-1.3-2.3-2.3l.8-1-1-2z"/>', star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>', sync:'<path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5"/>', grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>', return:'<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>', globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>', pin:'<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>', note:'<path d="M4 4h16v12l-4 4H4z"/><path d="M16 20v-4h4M8 9h8M8 13h5"/>',
 printer:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>', battery:'<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2M5 10v4"/>',
 bt:'<path d="m7 7 10 10-5 4V3l5 4L7 17"/>', history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>', share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
 qr:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM14 20h2M20 14v2"/>', conflict:'<path d="M7 4v10M7 14l-3-3M7 14l3-3M17 20V10M17 10l-3 3M17 10l3 3"/>'
};
const FLIP = new Set(['chev','back','arrow','return','nav']);
MF.ic = (n, cls='') => `<svg class="i ${FLIP.has(n)?'flip':''} ${cls}" data-i="${n}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${IP[n]||''}</svg>`;
MF.IP = IP;
const ic = MF.ic;

// ---------- registry ----------
MF.role = (id, def) => { MF.roles[id] = def };
MF.screen = (def) => { const had = !!MF.screens[def.id]; MF.screens[def.id] = Object.assign(had&&def.extend?MF.screens[def.id]:{}, def);
  if (!had) { if (def.insertAfter && MF.order.includes(def.insertAfter)) MF.order.splice(MF.order.indexOf(def.insertAfter)+1,0,def.id); else MF.order.push(def.id); } };
MF.patch = (id, o) => { if (MF.screens[id]) Object.assign(MF.screens[id], o); };
MF.wide = () => S.view==='desktop' || S.view==='tablet' || S.view==='tabletL';
MF.tablet = () => S.view==='tablet' || S.view==='tabletL';

// ---------- routing ----------
function parseHash(){
  const h = location.hash.replace(/^#\/?/,''); const [path, q] = h.split('?');
  if (path && MF.screens[path]) S.screen = path;
  const p = new URLSearchParams(q||'');
  if (p.get('lang')) { S.lang = p.get('lang')==='ar'?'ar':'en'; }
  if (p.get('plat')) S.plat = p.get('plat');
  if (p.get('view')) S.view = p.get('view');
  S.state = p.get('state') || 'default';
  S.variant = p.get('v') || null; S.sub = p.get('sub') || null;
  S.overlay = p.get('ov') || null; if (p.get('sku')) S.sku = p.get('sku');
  if (p.get('shot')) document.body.classList.add('shot');
  S.lowbat = p.get('bat')==='low'; S.collapsed = p.get('scrolled')==='1';
}
MF.go = (id, extra={}) => {
  const p = new URLSearchParams(); const sc = MF.screens[id];
  const view = extra.view || (sc && sc.desk && S.view==='desktop' ? 'desktop' : S.view);
  p.set('view', view); if (extra.state) p.set('state', extra.state);
  if (extra.v) p.set('v', extra.v); if (extra.sub) p.set('sub', extra.sub); if (extra.ov) p.set('ov', extra.ov);
  if (document.body.classList.contains('shot')) p.set('shot','1');
  location.hash = '#/' + id + '?' + p.toString();
};
function syncHash(){ const p=new URLSearchParams(); p.set('view',S.view); if(S.state!=='default')p.set('state',S.state); if(S.variant)p.set('v',S.variant); if(S.sub)p.set('sub',S.sub); if(S.overlay)p.set('ov',S.overlay); if(document.body.classList.contains('shot'))p.set('shot','1'); history.replaceState(null,'','#/'+S.screen+'?'+p.toString()); }

// ---------- generic states ----------
const skel = kind => {
  const r = (h,w='100%',m=8) => `<div class="sk" style="height:${h}px;width:${w};margin-bottom:${m}px"></div>`;
  if (kind==='form') return r(18,'40%',14)+[1,2,3,4,5].map(()=>r(12,'30%',6)+r(40)).join('')+r(44,'100%',0);
  if (kind==='dash') return `<div class="grid g2">${[1,2,3,4].map(()=>r(72,'100%',0)).join('')}</div><div style="height:14px"></div>`+[1,2,3,4,5].map(()=>r(46)).join('');
  if (kind==='detail') return r(26,'60%',10)+r(14,'40%',18)+r(120)+r(46)+r(46)+r(46);
  return r(40,'100%',14)+`<div class="list">`+[1,2,3,4,5,6,7].map(()=>`<div class="li"><div class="sk" style="width:40px;height:40px"></div><div class="grow">${r(12,'70%',6)}${r(10,'45%',0)}</div><div class="sk" style="width:80px;height:30px"></div></div>`).join('')+`</div>`;
};
MF.stateView = (sc) => {
  const st = S.state;
  if (st==='loading') { const t = sc.loadingMsg ? sc.loadingMsg() : L('Loading…','جارٍ التحميل…'); return `<div role="status" aria-busy="true"><span class="sr">${t}</span>${skel(sc.kind||'list')}<p class="small muted" style="text-align:center;margin-top:10px" aria-hidden="true">${t}</p></div>`; }
  if (st==='empty') { const e = sc.empty ? sc.empty() : {}; return `<div class="state" role="status"><div class="ic">${ic(e.icon||'list')}</div><h3>${e.t||L('Nothing here yet','لا يوجد شيء بعد')}</h3><p>${e.b||''}</p>${e.cta?`<button class="btn pri" data-go="${e.go||''}">${e.cta}</button>`:''}</div>`; }
  if (st==='error') { const e = sc.error ? sc.error() : {}; return `<div class="state" role="alert"><div class="ic" style="background:var(--bad-bg);color:var(--bad)">${ic('alert')}</div><h3>${e.t||L("Couldn't load this","تعذّر تحميل هذه الصفحة")}</h3><p>${e.b||L('Your data is safe. Check the connection and try again. If it keeps failing, support can trace this code.','بياناتك محفوظة. تحقق من الاتصال وحاول مرة أخرى. إذا تكرر الخطأ يمكن للدعم تتبع هذا الرمز.')}</p>${e.extra||''}<code dir="ltr" translate="no">ERR-${(sc.id||'').toUpperCase().replace('.','-')}-${e.code||'503'} · ${MF.dateG('2026-11-12')} 15:10 AST</code><div class="row wrap" style="justify-content:center"><button class="btn pri" data-act="retry">${ic('refresh')} ${e.retry||L('Try again','حاول مرة أخرى')}</button>${e.alt?`<button class="btn" ${e.altGo?`data-go="${e.altGo}"`:`data-act="toast:${e.alt}"`}>${e.alt}</button>`:''}<button class="btn" data-act="toast:${L('Support ticket draft opened (prototype)','تم فتح مسودة تذكرة دعم (نموذج)')}">${L('Contact support','تواصل مع الدعم')}</button></div></div>`; }
  if (st==='denied') return `<div class="state" role="alert"><div class="ic">${ic('lock')}</div><h3>${L("You don't have access","ليست لديك صلاحية")}</h3><p>${sc.deniedMsg?sc.deniedMsg():L('This screen needs a different role or business access. Ask your account owner or a MENAFoods admin.','هذه الشاشة تتطلب دوراً أو صلاحية منشأة مختلفة. اطلب ذلك من مالك الحساب أو مسؤول ميناء فودز.')}</p><button class="btn" data-go="auth.picker">${L('Switch business / role','تبديل المنشأة أو الدور')}</button></div>`;
  return null;
};
MF.offlineBar = (sc) => { const o = (sc&&sc.offline) ? sc.offline() : {}; return `<div class="offline" role="status">${ic('wifioff')}<span class="grow"><b>${L('Offline','غير متصل')}</b> · ${o.msg||L('3 actions queued — they send automatically when you reconnect. Prices & stock shown from 14:52.','3 إجراءات في الانتظار وستُرسل تلقائياً عند عودة الاتصال. الأسعار والمخزون من الساعة 14:52.')}</span>${o.q===false?'':`<button class="offbtn" data-act="toast:${o.q||L('Queue: 2 qty edits, 1 note','قائمة الانتظار: تعديلا كمية، ملاحظة واحدة')}">${L('Queue','الانتظار')}</button>`}</div>`; };

// ---------- chrome ----------
function navFor(sc){ const r = MF.roles[sc.role]; return r ? r.nav : []; }
function appbar(sc){
  const title = sc.title(); const back = sc.back; const plat = S.plat;
  const acts = (sc.acts ? sc.acts() : '') ;
  const langBtn = S.lang==='ar' ? `<button class="langbtn" data-act="lang" lang="en" aria-label="EN · English">EN</button>` : `<button class="langbtn" data-act="lang" lang="ar" aria-label="ع · العربية">ع</button>`;
  if (plat==='ios') {
    return `<header class="appbar ${S.collapsed?'collapsed':''}"><div class="row">${back?`<a href="#" class="back" data-go="${back}">${ic('back')} ${L('Back','رجوع')}</a>`:`<span class="grow small muted">${sc.ctx?sc.ctx():''}</span>`}<span class="inline-title" aria-hidden="true">${title}</span><span class="acts">${acts}${langBtn}</span></div><h1 class="large" tabindex="-1">${title}</h1>${sc.sub?`<div class="small muted sub2">${sc.sub()}</div>`:''}</header>`;
  }
  return `<header class="appbar ${S.collapsed?'scrolled':''}">${back?`<button class="iconbtn" data-go="${back}" aria-label="${L('Back','رجوع')}">${ic('back')}</button>`:(plat==='android'&&!MF.wide()?`<button class="iconbtn" aria-label="${L('Menu','القائمة')}" data-act="toast:${L('Navigation drawer (prototype)','درج التنقل (نموذج)')}">${ic('list')}</button>`:'')}<div class="title"><h1 tabindex="-1">${title}</h1>${sc.sub?`<span class="sub">${sc.sub()}</span>`:''}</div>${acts}${langBtn}</header>`;
}
function bottomNav(sc){
  const items = navFor(sc); if (!items.length) return '';
  return `<nav class="bnav" aria-label="${L('Main','الرئيسية')}">${items.map(it=>{const on = (sc.nav||sc.id)===it.id; const b = it.badge?`<span class="badge" aria-label="${it.badge} ${L('new','جديد')}">${it.badge}</span>`:''; return `<a href="#/${it.go}" class="${on?'on':''}" ${on?'aria-current="page"':''} data-go="${it.go}">${S.plat==='android'?`<span class="pill">${ic(it.icon)}</span>`:ic(it.icon)}${b}<span>${it.label()}</span></a>`}).join('')}</nav>`;
}
function sideNav(sc){
  const items = navFor(sc); const r = MF.roles[sc.role];
  return `<nav class="side" aria-label="${L('Main','الرئيسية')}"><div class="logo"><i aria-hidden="true">MF</i><span>${L('MENAFoods','ميناء فودز')}</span></div>${items.map((it,i)=>{const on=(sc.nav||sc.id)===it.id;return `<a href="#/${it.go}" class="${on?'on':''}" ${on?'aria-current="page"':''} data-go="${it.go}">${S.plat==='android'?`<span class="pill">${ic(it.icon)}</span>`:ic(it.icon)}<span>${it.label()}</span><span class="kbd" aria-hidden="true">g ${i+1}</span></a>`}).join('')}<div class="foot">${r?r.label():''}<br>${L('Ctrl K · command palette','Ctrl K · لوحة الأوامر')}</div></nav>`;
}
function primary(sc){
  if (!sc.primary || S.state==='loading' || S.state==='denied' || S.state==='error' || S.state==='empty') return '';
  const p = sc.primary(); if (!p) return ''; if (S.state==='offline' && sc.offline && sc.offline().pri) Object.assign(p, sc.offline().pri);
  const attrs = p.go?`data-go="${p.go}"`:`data-act="${p.act||''}"`;
  if (S.plat==='android' && p.fab!==false) return `<button class="fab" ${attrs}>${ic(p.icon||'arrow')}<span>${p.label}</span></button>`;
  if (S.plat==='ios') return `<div class="iostb"><div class="sum">${p.sum||''}</div><button class="btn pri" ${attrs} ${p.disabled?'disabled':''}>${p.label}</button></div>`;
  return `<div class="pbar"><div class="sum">${p.sum||''}</div><button class="btn pri" ${attrs} ${p.disabled?'disabled':''}>${p.label}${p.kbd&&MF.wide()?` <span class="kbd" aria-hidden="true">${p.kbd}</span>`:''}</button></div>`;
}
function overlay(sc){
  if (!S.overlay || !sc.overlays || !sc.overlays[S.overlay]) return '';
  const o = sc.overlays[S.overlay]();
  if (o.type==='dialog') {
    if (S.plat==='ios') return `<div class="scrim" data-act="close"><div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t" onclick="event.stopPropagation()"><div class="strong" id="dlg-t" style="padding:0 16px">${o.title}</div><div class="small" style="padding:4px 16px 0">${o.body}</div><div class="acts"><button data-act="close">${o.cancel||L('Cancel','إلغاء')}</button><button data-act="${o.okAct||'close'}">${o.ok}</button></div></div></div>`;
    return `<div class="scrim" data-act="close"><div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t" onclick="event.stopPropagation()"><h3 id="dlg-t" style="margin:0 0 8px;font-size:${S.plat==='android'?'22px':'17px'};font-weight:${S.plat==='android'?400:600}">${o.title}</h3><div class="small" style="color:var(--ink-2)">${o.body}</div><div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn ghost" data-act="close">${o.cancel||L('Cancel','إلغاء')}</button><button class="btn ${S.plat==='android'?'ghost':'pri'}" data-act="${o.okAct||'close'}">${o.ok}</button></div></div></div>`;
  }
  return `<div class="scrim" data-act="close"><div class="sheet ${o.detent?'d-'+o.detent:''}" role="dialog" aria-modal="true" aria-label="${o.label||L('Details','التفاصيل')}" onclick="event.stopPropagation()"><div class="grab" aria-hidden="true"></div><button class="iconbtn sheet-x" data-act="close" aria-label="${L('Close','إغلاق')}">${ic('x')}</button>${o.body}</div></div>`;
}
function statusbar(){ const bat = S.lowbat ? '8% ▯' : '▮'; const t = S.plat==='pwa' ? `<span>🔒 app.menafoods.sa</span><span>15:10</span>` : `<span>15:10</span><span>▂▄▆ 5G ${bat}</span>`; return `<div class="statusbar" aria-hidden="true">${t}</div>`; }
function pane2(sc){ if (!MF.tablet() || !sc.pane2 || S.state!=='default') return ''; return `<section class="pane p2" aria-label="${L('Details','التفاصيل')}">${sc.pane2()}</section>`; }

MF.render = () => {
  const sc = MF.screens[S.screen] || MF.screens['b.home'];
  document.documentElement.lang = S.lang; // studio chrome stays LTR; app follows lang
  const dev = document.getElementById('device');
  dev.className = `device ${S.view}`; document.getElementById('stagewrap').className = `plat-${S.plat}`;
  const stateHtml = MF.stateView(sc);
  let body = stateHtml || sc.render();
  const off = S.state==='offline' ? MF.offlineBar(sc) : '';
  const desk = MF.wide(); const useSide = desk && !(S.plat==='ios' && S.view==='tablet');
  const p2 = pane2(sc); if (p2) body = `<div class="panes"><section class="pane p1">${body}</section>${p2}</div>`;
  const chromeLess = sc.noChrome;
  const inner = `${S.view!=='desktop'?statusbar():''}<div class="sample-rb">${L('Sample data — fake businesses, prices and stock','بيانات تجريبية — منشآت وأسعار ومخزون وهمية')}</div>${off}
   <div class="app-body">${useSide&&!chromeLess&&navFor(sc).length?sideNav(sc):''}<div class="main">${chromeLess?'':appbar(sc)}<main class="content" id="content" aria-label="${L('Content','المحتوى')}">${body}</main>${primary(sc)}${!useSide&&!chromeLess?bottomNav(sc):''}${overlay(sc)}<div class="live" role="status" aria-live="polite" aria-atomic="true">${S.toast?`<div class="toast">${ic('check')}<span>${S.toast}</span><button class="tbtn" data-act="untoast">${L('Undo','تراجع')}</button></div>`:''}</div></div></div>${S.cmdk?cmdk():''}`;
  dev.innerHTML = `<div class="app" lang="${S.lang}" dir="${S.lang==='ar'?'rtl':'ltr'}">${inner}</div>`;
  renderStudio(sc); syncHash();
  if (sc.after) sc.after(dev);
  MF.enhance(dev.querySelector('.app'));
  const ct = dev.querySelector('.content'); if (ct) { ct.addEventListener('scroll', ()=>{ const c = ct.scrollTop>24; if (c!==!!S.collapsed){ S.collapsed=c; const ab=dev.querySelector('.appbar'); if(ab){ab.classList.toggle('collapsed',c&&S.plat==='ios');ab.classList.toggle('scrolled',c&&S.plat!=='ios');} } }, {passive:true}); }
  if (MF._prevOv && !S.overlay && MF._lastScreen===S.screen && !document.body.classList.contains('shot')) { const op = dev.querySelector(`[data-act="ov:${MF._prevOv}"]`); if (op) { op.focus(); MF._prevOv=null; MF._lastScreen=S.screen; return; } }
  MF._prevOv = S.overlay;
  const ov = dev.querySelector('.sheet,.dialog'); if (ov && !document.body.classList.contains('shot')) { const f = ov.querySelector('button,[href],input,textarea,[tabindex]'); if (f) f.focus(); }
  else if (MF._lastScreen && MF._lastScreen!==S.screen && !document.body.classList.contains('shot')) { const h = dev.querySelector('.appbar h1, .appbar .large, h1.h'); if (h) { h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); } }
  MF._lastScreen = S.screen;
};
function cmdk(){ return `<div class="scrim" data-act="cmdk" style="align-items:flex-start"><div class="cmdk" role="dialog" aria-modal="true" aria-label="${L('Command palette','لوحة الأوامر')}" onclick="event.stopPropagation()"><input aria-label="${L('Command palette','لوحة الأوامر')}" placeholder="${L('Jump to screen, customer or SKU…','انتقل إلى شاشة أو عميل أو صنف…')}" autofocus><div class="list" style="border:0;border-radius:0;max-height:360px;overflow:auto">${MF.order.filter(id=>MF.screens[id].role===MF.screens[S.screen].role||id==='c.360').slice(0,9).map(id=>`<div class="li" data-go="${id}"><span class="grow">${MF.screens[id].title()}</span><span class="kbd">↵</span></div>`).join('')}</div></div></div>`; }

// ---------- studio (designer chrome; English, LTR) ----------
const STATES = ['default','empty','loading','error','offline','denied'];
function renderStudio(sc){
  const nav = document.getElementById('snav');
  if (!nav.dataset.built || nav.dataset.lang!==S.lang) {
    let html=''; let lastRole=null; let k=0;
    MF.order.forEach(id=>{ const s=MF.screens[id]; if (s.role!==lastRole){ lastRole=s.role; const r=MF.roles[s.role]; html+=`<h4>${r?r.studio:s.role}</h4>`; } k++; html+=`<a href="#/${id}?view=${s.desk?'desktop':'mobile'}" data-id="${id}"><span>${s.studio}</span><span class="k">${id}</span></a>`; });
    nav.innerHTML = html; nav.dataset.built='1'; nav.dataset.lang=S.lang;
  }
  nav.querySelectorAll('a').forEach(a=>a.classList.toggle('on', a.dataset.id===S.screen));
  const seg = (name, vals, cur, labels) => `<div class="seg" data-seg="${name}">${vals.map((v,i)=>`<button class="${v===cur?'on':''}" data-v="${v}">${labels?labels[i]:v}</button>`).join('')}</div>`;
  document.getElementById('ctl').innerHTML =
   `<label>Lang</label>${seg('lang',['ar','en'],S.lang,['العربية RTL','English LTR'])}<span style="color:#9A9A93;font-size:11px">(${S.langSource==='saved'?'saved override':'from navigator.language'})</span>
    <label>Platform</label>${seg('plat',['pwa','android','ios'],S.plat,['PWA','Android M3','iOS HIG'])}
    <label>View</label>${seg('view',['mobile','tablet','tabletL','desktop','reflow'],S.view,['Mobile 390','Tablet 834','Tablet 1194','Desktop 1280','Reflow 320'])}
    <label>State</label>${seg('state',STATES,S.state)}`;
  const n = document.getElementById('notes');
  const vars = sc.variants ? sc.variants() : null;
  n.innerHTML = `<h5>${sc.studio}</h5><div class="muted" style="margin-bottom:10px">${MF.roles[sc.role]?MF.roles[sc.role].studio:''} · <code>${sc.id}</code></div>
   ${vars?`<h5>Variants</h5><div class="vrow">${vars.map(v=>`<button class="${(S.variant||vars[0][0])===v[0]?'on':''}" data-variant="${v[0]}">${v[1]}</button>`).join('')}</div>`:''}
   ${sc.subs?`<h5>Steps / tabs</h5><div class="vrow">${sc.subs().map(v=>`<button class="${(S.sub||sc.subs()[0][0])===v[0]?'on':''}" data-sub="${v[0]}">${v[1]}</button>`).join('')}</div>`:''}
   ${sc.overlays?`<h5>Overlays</h5><div class="vrow">${Object.keys(sc.overlays).map(k=>`<button class="${S.overlay===k?'on':''}" data-ov="${k}">${k}</button>`).join('')}</div>`:''}
   <h5>What this screen does</h5><ul>${(sc.notes||[]).map(x=>`<li>${x}</li>`).join('')}</ul>
   <h5>Platform deltas</h5><ul>${(sc.deltas||MF.defaultDeltas).map(x=>`<li>${x}</li>`).join('')}</ul>
   <h5>States (bespoke copy)</h5><ul>${['empty','error','offline','denied'].map(k=>{const f=sc[k==='denied'?'deniedMsg':k]; if(!f) return ''; const o=f(); return `<li><b>${k}</b>: ${typeof o==='string'?o:(o.t||o.msg||'')}</li>`}).join('')}</ul>
   ${sc.a11y?`<h5>Accessibility</h5><ul>${sc.a11y.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}`;
}
MF.defaultDeltas = ['<b>PWA</b>: compact header, sticky bottom action bar, sidebar on desktop, keyboard shortcuts.','<b>Android M3</b>: top app bar, nav bar with pill indicator, extended FAB for the primary action, snackbars, 28dp dialogs.','<b>iOS HIG</b>: large title, text back button, tab bar, bottom toolbar for the primary action, sheets & alerts, swipe actions on rows.'];

// ---------- events ----------
document.addEventListener('click', e => {
  if (e.target.closest('a[href="#"]')) e.preventDefault();
  const seg = e.target.closest('[data-seg] button');
  if (seg){ const name = seg.parentElement.dataset.seg, v = seg.dataset.v;
    if (name==='lang'){ S.lang=v; S.langSource='saved'; LS.set('mf.lang',v); }
    if (name==='plat'){ S.plat=v; LS.set('mf.plat',v); }
    if (name==='view') S.view=v; if (name==='state') S.state=v; MF.render(); return; }
  const vb = e.target.closest('[data-variant]'); if (vb){ S.variant=vb.dataset.variant; MF.render(); return; }
  const sb = e.target.closest('[data-sub]'); if (sb && !sb.closest('.app')){ S.sub=sb.dataset.sub; MF.render(); return; }
  const ob = e.target.closest('[data-ov]'); if (ob && !ob.closest('.app')){ S.overlay = S.overlay===ob.dataset.ov?null:ob.dataset.ov; MF.render(); return; }
  const g = e.target.closest('[data-go]'); if (g && g.dataset.go){ e.preventDefault(); S.overlay=null; S.toast=null; S.cmdk=false; const [id,q]=g.dataset.go.split('?'); const p=new URLSearchParams(q||''); MF.go(id,{v:p.get('v'),sub:p.get('sub'),ov:p.get('ov'),state:p.get('state')}); return; }
  const a = e.target.closest('[data-act]'); if (a){ const act=a.dataset.act; if (a.dataset.sku) S.sku=a.dataset.sku;
    if (act==='lang'){ S.lang = S.lang==='ar'?'en':'ar'; S.langSource='saved'; LS.set('mf.lang',S.lang); }
    else if (act==='close'){ S.overlay=null; }
    else if (act==='cmdk'){ S.cmdk=false; }
    else if (act==='retry'){ S.state='loading'; MF.render(); setTimeout(()=>{S.state='default';MF.render()},700); return; }
    else if (act==='untoast'){ S.toast=null; }
    else if (act==='noop'){ }
    else if (act.startsWith('toast:')){ S.overlay=null; S.toast=act.slice(6); setTimeout(()=>{S.toast=null;MF.render()},2600); }
    else if (act.startsWith('ov:')){ S.overlay=act.slice(3); }
    else if (act.startsWith('sub:')){ S.sub=act.slice(4); }
    else if (act.startsWith('v:')){ S.variant=act.slice(2); }
    else if (act.startsWith('qty:')){ const [,sku,d]=act.split(':'); MF.setQty(sku,(MF.qty(sku))+(+d)); }
    else if (MF.actions[act]) MF.actions[act](a);
    MF.render(); }
});
document.addEventListener('change', e => { const q=e.target.closest('[data-qty]'); if(q){ MF.setQty(q.dataset.qty, Math.max(0, parseInt(String(q.value).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)))||0)); MF.render(); } });
document.addEventListener('keydown', e => {
  if ((e.key==='Enter'||e.key===' ') && e.target.matches('.app [role=button],.app [role=link],.app [role=tab],.app [role=option]') ) { e.preventDefault(); e.target.click(); return; }
  if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); S.cmdk=!S.cmdk; MF.render(); return; }
  if (e.key==='Tab' && (S.overlay||S.cmdk)){ const ov=document.querySelector('#device .sheet,#device .dialog,#device .cmdk'); if(ov){ const f=[...ov.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null); if(f.length){ const a=document.activeElement; if(e.shiftKey&&(a===f[0]||!ov.contains(a))){e.preventDefault();f[f.length-1].focus();} else if(!e.shiftKey&&(a===f[f.length-1]||!ov.contains(a))){e.preventDefault();f[0].focus();} } } }
  if (e.key==='Escape'){ if (S.cmdk||S.overlay){ S.cmdk=false; S.overlay=null; MF.render(); } return; }
  if (e.target.matches('input,textarea,select')) return;
  if (e.key==='/'){ const s=document.querySelector('.app .search input'); if(s){e.preventDefault();s.focus();} }
  if (/^[1-6]$/.test(e.key) && MF.lastG && Date.now()-MF.lastG<800){ const it=navFor(MF.screens[S.screen])[+e.key-1]; if(it) MF.go(it.go); }
  if (e.key==='g') MF.lastG=Date.now();
});
MF.actions = {};
MF.qty = sku => S.cart[sku] ?? 0;
MF.setQty = (sku, n) => { S.cart[sku] = Math.max(0,n); };
window.addEventListener('hashchange', ()=>{ parseHash(); MF.render(); });
MF.boot = () => { parseHash(); if(!location.hash) S.view='mobile'; MF.render(); };
})();
