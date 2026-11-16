/* MENAFoods theme · Pro Ops (re-skin of v3 screen set) · core runtime (router, i18n, money, dates, blocks, chrome, states). SAMPLE DATA ONLY. */
(function(){
'use strict';
const MF = window.MF = {SCR:{}, ORDER:[], cart:{p1:2,p2:1,p3:1}};
let AR=false, P={}, C={};
const t = MF.t = (en, ar) => AR ? ar : en;
const tt = MF.tt = (pair) => Array.isArray(pair) ? (AR ? (pair[1]==null||pair[1]===''?(pair[0]==null?'':pair[0]):pair[1]) : (pair[0]==null?(pair[1]==null?'':pair[1]):pair[0])) : (typeof pair==='function'? pair(): pair);

/* ---------- icons (outline, 24 grid, 1.75 stroke) ---------- */
const IP = {home:'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',box:'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5 12 12l9-4.5M12 12v9',wallet:'M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7V6a2 2 0 0 1 2-2h11M16 13.5h2',user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',users:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M18 14a6 6 0 0 1 4 7',search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',scan:'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 9v6M10 9v6M13 9v6M17 9v6',bell:'M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4',chev:'M9 6l6 6-6 6',back:'M15 6l-6 6 6 6',plus:'M12 5v14M5 12h14',minus:'M5 12h14',spark:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6',shield:'M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6zM8.5 12l2.5 2.5 4.5-5',truck:'M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',wifioff:'M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.7M14.5 10.4A10 10 0 0 1 19 13M2 9.5a15 15 0 0 1 4.3-2.6M10.7 6.1A15 15 0 0 1 22 9.5M12 20h.01',phone:'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',msg:'M4 5h16v11H8l-4 4z',pin:'M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',doc:'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5',cart:'M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2M9 20.5h.01M17 20.5h.01',lock:'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',alert:'M12 3 2 20h20zM12 10v4M12 17h.01',star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',check:'M5 12.5l4.5 4.5L19 7.5',hist:'M3 12a9 9 0 1 0 3-6.7M3 4v4h4M12 8v4l3 2',filter:'M4 6h16M7 12h10M10 18h4',more:'M5 12h.01M12 12h.01M19 12h.01',info:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5h.01',visit:'M4 21V8l8-5 8 5v13M9 21v-6h6v6',map:'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',cash:'M3 6h18v12H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 9v.01M18 15v.01',sync:'M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4',chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.8 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.8-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3.2 15H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 4.2V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.8 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 20.8 11H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',gift:'M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9S10.5 4 8 4a2.5 2.5 0 0 0 0 5M12 9s1.5-5 4-5a2.5 2.5 0 0 1 0 5',share:'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',qr:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2M14 18h2v2M18 18h2v2',camera:'M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',printer:'M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z',sign:'M3 17c3-4 5-9 7-9s-1 9 2 9 3-4 5-4 2 3 4 3M3 21h18',edit:'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',trash:'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',calendar:'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4',tag:'M3 12V4h8l10 10-8 8zM7.5 8.5h.01',globe:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z',moon:'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',link:'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',upload:'M12 16V4M7 9l5-5 5 5M4 20h16',download:'M12 4v12M7 11l5 5 5-5M4 20h16',key:'M15 9a4 4 0 1 0-3.5 4L4 20.5V22h3v-2h2v-2h2l1.5-1.5',receipt:'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM9 8h6M9 12h6',route:'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 15V9a4 4 0 0 1 4-4h4M18 9v6a4 4 0 0 1-4 4h-4',inbox:'M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6z',x:'M6 6l12 12M18 6 6 18',flag:'M5 21V4h11l-2 4 2 4H5',layers:'M12 3 2 8l10 5 10-5zM2 13l10 5 10-5M2 17l10 5 10-5',percent:'M19 5 5 19M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',refresh:'M20 12a8 8 0 1 1-2.3-5.7L20 8M20 3v5h-5',fingerprint:'M12 11v4M8 21c1-2 1.5-4 1.5-6a2.5 2.5 0 0 1 5 0c0 2-.5 4-1.5 6M5 18c.7-1.5 1-3 1-5a6 6 0 0 1 12 0c0 1 0 2-.2 3M17.5 21c.3-1 .5-2 .5-3',store:'M3 9l2-5h14l2 5M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v8h14v-8M10 21v-5h4v5',thermo:'M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z',mic:'M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zM5 11a7 7 0 0 0 14 0M12 18v3',sun:'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',handshake:'M3 11l4-4 5 2 5-2 4 4-7 7-2-2-2 2-2-2-2 2zM12 9l-3 3'};
const FLIP = ['chev','back','route'];
const I = MF.I = (n, s=22, cls='') => `<svg class="ic ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${AR&&FLIP.includes(n)?' style="transform:scaleX(-1)"':''}><path d="${IP[n]||IP.info}"/></svg>`;

/* ---------- product glyphs (abstract, no brand art) ---------- */
const GL = {
 sack:'<path d="M12 8h16l-2 5c5 3 7 8 7 13 0 6-5 8-13 8S7 32 7 26c0-5 2-10 7-13z" fill="var(--c-brand-weak)" stroke="var(--c-brand-text)" stroke-width="1.6"/><path d="M14 13h12" stroke="var(--c-brand-text)" stroke-width="1.6"/>',
 tin:'<rect x="10" y="9" width="20" height="25" rx="3" fill="var(--c-accent-weak)" stroke="var(--c-accent-text)" stroke-width="1.6"/><path d="M15 9V6h6v3M10 17h20" stroke="var(--c-accent-text)" stroke-width="1.6"/>',
 can:'<ellipse cx="20" cy="10" rx="9" ry="3" fill="var(--c-danger-weak)" stroke="var(--c-danger)" stroke-width="1.6"/><path d="M11 10v20c0 1.7 4 3 9 3s9-1.3 9-3V10" fill="var(--c-danger-weak)" stroke="var(--c-danger)" stroke-width="1.6"/>',
 milk:'<path d="M14 6h12v5l4 6v17H10V17l4-6z" fill="var(--c-info-weak)" stroke="var(--c-info)" stroke-width="1.6"/><path d="M10 22h20" stroke="var(--c-info)" stroke-width="1.6"/>',
 box:'<path d="M6 13l14-6 14 6v15l-14 6-14-6z" fill="var(--c-surface-sunken)" stroke="var(--c-text-2)" stroke-width="1.6"/><path d="M6 13l14 6 14-6M20 19v15" stroke="var(--c-text-2)" stroke-width="1.6"/>',
 frozen:'<rect x="8" y="8" width="24" height="24" rx="5" fill="var(--c-info-weak)" stroke="var(--c-info)" stroke-width="1.6"/><path d="M20 12v16M13 16l14 8M27 16l-14 8" stroke="var(--c-info)" stroke-width="1.6"/>',
 jar:'<rect x="11" y="12" width="18" height="22" rx="4" fill="var(--c-accent-weak)" stroke="var(--c-accent-text)" stroke-width="1.6"/><rect x="13" y="6" width="14" height="6" rx="2" fill="var(--c-surface)" stroke="var(--c-accent-text)" stroke-width="1.6"/>',
 cheese:'<path d="M6 26 30 12l4 4v12H6z" fill="var(--c-accent-weak)" stroke="var(--c-accent-text)" stroke-width="1.6"/><circle cx="17" cy="23" r="2" fill="var(--c-accent-text)"/><circle cx="26" cy="21" r="1.6" fill="var(--c-accent-text)"/>',
 egg:'<rect x="6" y="14" width="28" height="16" rx="4" fill="var(--c-surface-sunken)" stroke="var(--c-text-2)" stroke-width="1.6"/><ellipse cx="13" cy="15" rx="4" ry="5" fill="var(--c-surface)" stroke="var(--c-text-2)" stroke-width="1.6"/><ellipse cx="20" cy="14" rx="4" ry="5" fill="var(--c-surface)" stroke="var(--c-text-2)" stroke-width="1.6"/><ellipse cx="27" cy="15" rx="4" ry="5" fill="var(--c-surface)" stroke="var(--c-text-2)" stroke-width="1.6"/>'
};
const G = MF.G = (g, s=40) => MF.GX ? MF.GX(g,s) : `<svg width="${s}" height="${s}" viewBox="0 0 40 40" aria-hidden="true" focusable="false">${GL[g]||GL.box}</svg>`;

/* ---------- numbers, money, dates ---------- */
const fmt = MF.fmt = (v, d=2) => Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const M = MF.M = (v, cls='', d=2) => (v==null||v===''||!isFinite(v)) ? `<span class="money na ${cls}" title="${t('Not available yet','غير متاح بعد')}">—</span>` : `<span class="money ${cls}">${v<0?'<span aria-hidden="true">−</span><span class="vh">'+t('minus','سالب')+' </span>':''}<span class="sar" aria-hidden="true" data-glyph="&#x20C1;"></span><span class="vh">${t('SAR','ريال')} </span>${fmt(Math.abs(v), d)}</span>`;
const N = MF.N = v => `<span class="num">${typeof v==='number'?v.toLocaleString('en-US'):v}</span>`;
const LTR = MF.LTR = v => `<span class="ltr">${v}</span>`;
const Dt = MF.Dt = (y,m,d) => new Date(y,m-1,d,12);
MF.TODAY = Dt(2026,11,15);
const loc = (cal) => AR ? `ar-SA-u-ca-${cal}-nu-latn` : (cal==='gregory'?'en-GB':'en-u-ca-islamic-umalqura-nu-latn');
const greg = MF.greg = (d, o={day:'numeric',month:'short'}) => new Intl.DateTimeFormat(loc('gregory'), o).format(d);
const hij = MF.hij = (d) => new Intl.DateTimeFormat(AR?'ar-SA-u-ca-islamic-umalqura-nu-latn':'en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'long',year:'numeric'}).format(d).replace(/ AH$/,'').replace(/ هـ$/,'');
const D2 = MF.D2 = (y,m,d,o) => { const x=Dt(y,m,d); return `<span class="dual"><span class="num">${greg(x, o||{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</span> · <span class="hij">${hij(x)}</span></span>`; };
const D1 = MF.D1 = (y,m,d,o) => `<span class="num">${greg(Dt(y,m,d), o||{day:'numeric',month:'short'})}</span>`;

/* ---------- link / param helpers ---------- */
const KEEP = ['role','lang','theme','plat','size','shot'];
const href = MF.href = (id, extra={}) => { const q = new URLSearchParams(); KEEP.forEach(k=>{ if(P[k]) q.set(k,P[k]); }); Object.entries(extra).forEach(([k,v])=>{ if(v===null) q.delete(k); else q.set(k,v); }); const s=q.toString(); return `#/${id}${s?'?'+s:''}`; };
const self = MF.self = (extra) => { const q={}; ['v','sub'].forEach(k=>{ if(P[k]) q[k]=P[k]; }); return href(C.id, Object.assign(q, extra)); };

/* ---------- blocks ---------- */
const H = MF.H = {};
H.pill = (k, txt) => `<span class="pill ${k}">${txt}</span>`;
H.sug = () => `<span class="pill sug">${I('spark',14)}${t('Suggested','مقترح')}</span>`;
H.spons = () => `<span class="spons-l">${'Sponsored · إعلان'}</span>`;
H.sample = () => `<span class="pill neu">${t('Sample','عينة')}</span>`;
H.btn = (label, o={}) => { const k = o.k||'pri'; const ic = o.ic?I(o.ic,20):''; const cls=`btn ${k}${o.sm?' sm':''}${o.block?' block':''}`;
  if (o.go) return `<a class="${cls}" href="${o.go.startsWith('#')?o.go:href(o.go,o.q||{})}">${ic}<span>${label}</span></a>`;
  const data = o.st ? ` data-st="${o.st}"` : o.toast ? ` data-toast="${o.toast}"` : ` data-toast="${t('Done (prototype)','تم (نموذج أولي)')}"`;
  return `<button type="button" class="${cls}"${data}${o.dis?' disabled aria-disabled="true"':''}${o.lbl?` aria-label="${o.lbl}"`:''}>${ic}<span>${label}</span></button>`; };
H.btns = (...b) => `<div class="btns">${b.filter(Boolean).join('')}</div>`;
H.card = (body, cls='') => `<div class="card pad ${cls}">${body}</div>`;
H.sec = (title, body, o={}) => `<section class="sec ${o.wide?'wide':''} ${o.cls||''}"${o.id?` id="${o.id}"`:''}>${title?`<div class="sec-h"><h2>${title}</h2>${o.act?`<a href="${href(o.act[1], o.act[2]||{})}">${o.act[0]}</a>`:''}${o.right||''}</div>`:''}${o.raw?body:`<div class="card grp">${body}</div>`}</section>`;
H.row = (r) => { const lead = r.g ? `<span class="thumb">${G(r.g,28)}</span>` : r.ic ? `<span class="thumb ${r.tone||''}">${I(r.ic,20)}</span>` : r.av ? `<span class="avs" aria-hidden="true">${r.av}</span>` : '';
  const end = (r.pill?H.pill(r.pill[0],r.pill[1]):'') + (r.end||'');
  const inner = `${lead}<span class="b"><span class="t">${r.t}</span>${r.s?`<span class="s">${r.s}</span>`:''}${r.x||''}</span>${end?`<span class="e">${end}</span>`:''}${r.go?`<span class="chev">${I('chev',18)}</span>`:''}`;
  return r.go ? `<a class="row" href="${r.go.startsWith('#')?r.go:href(r.go, r.q||{})}">${inner}</a>` : `<div class="row ${r.cls||''}">${inner}</div>`; };
H.rows = (arr) => arr.filter(Boolean).map(H.row).join('');
H.kv = (arr, cls='') => `<dl class="kv ${cls}">${arr.filter(Boolean).map(([k,v,c])=>`<div class="${c||''}"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
H.kpis = (arr) => `<div class="kpis">${arr.map(([l,v,s,tone])=>`<div class="kpi ${tone||''}"><span class="l">${l}</span><span class="v">${v}</span>${s?`<span class="s">${s}</span>`:''}</div>`).join('')}</div>`;
H.hero = (lbl, val, sub, o={}) => `<div class="hero ${o.tone||''}"><span class="l">${lbl}</span><span class="v disp">${val}</span>${sub?`<span class="s">${sub}</span>`:''}${o.extra||''}</div>`;
H.alert = (k, title, body, o={}) => `<div class="alert ${k}" role="${o.role||'note'}"><span class="aic">${I(o.ic||({bad:'alert',warn:'clock',info:'info',ok:'check'}[k]||'info'),20)}</span><div class="ab"><b>${title}</b>${body?`<div>${body}</div>`:''}${o.act?`<div class="aa">${o.act}</div>`:''}</div></div>`;
H.note = (txt, ic='info') => `<p class="note">${I(ic,18)}<span>${txt}</span></p>`;
H.lock = (txt, ic='lock') => `<div class="lock">${I(ic,16)}<span>${txt}</span></div>`;
H.tl = (items) => `<ol class="tl">${items.map(([c,title,sub])=>`<li class="${c}"><span class="m" aria-hidden="true">${c==='done'?I('check',14):c==='hold'?'!':c==='now'?'':''}</span><div><span class="tt">${title}</span>${c==='now'?`<span class="vh"> (${t('current','الحالي')})</span>`:''}${sub?`<div class="s">${sub}</div>`:''}</div></li>`).join('')}</ol>`;
H.seg = (opts, cur, label) => `<div class="seg" role="group" aria-label="${label||t('View','العرض')}">${opts.map(([v,l])=>`<a href="${href(C.id,{v, sub:P.sub||null})}" ${v===cur?'aria-current="true"':''}>${l}</a>`).join('')}</div>`;
H.chips = (arr, cur=0, label) => `<div class="chips" role="group" aria-label="${label||t('Filters','عوامل التصفية')}">${arr.map((c,i)=>`<button type="button" class="chip" aria-pressed="${i===cur||(Array.isArray(cur)&&cur.includes(i))}" data-chip>${c}</button>`).join('')}</div>`;
let FID=0;
H.field = (label, val='', o={}) => { const id='f'+(++FID); const hint=o.hint?`<span class="hint" id="${id}h">${o.hint}</span>`:''; const err=o.err?`<span class="err" id="${id}e">${I('alert',16)}${o.err}</span>`:''; const desc=[o.hint?id+'h':'',o.err?id+'e':''].filter(Boolean).join(' ');
  const a = `id="${id}"${desc?` aria-describedby="${desc}"`:''}${o.err?' aria-invalid="true"':''}${o.req?' required aria-required="true"':''}${o.ro?' readonly':''}`;
  let ctl;
  if (o.sel) ctl = `<select class="inp" ${a}>${o.sel.map(s=>`<option${s===val?' selected':''}>${s}</option>`).join('')}</select>`;
  else if (o.ta) ctl = `<textarea class="inp" rows="3" dir="auto" ${a}>${val}</textarea>`;
  else ctl = `<input class="inp${o.ltr?' ltrin':''}" type="${o.type||'text'}" value="${String(val).replace(/"/g,'&quot;')}" ${o.ltr?'dir="ltr"':'dir="auto"'} ${o.im?`inputmode="${o.im}"`:''} ${o.ac?`autocomplete="${o.ac}"`:''} ${a}>`;
  const pre = o.pre==='SAR' ? `<span class="pre"><span class="sar" aria-hidden="true"></span><span class="vh">${t('SAR','ريال')}</span></span>` : `<span class="pre">${o.pre}</span>`;
  return `<div class="field${o.err?' bad':''}"><label for="${id}">${label}${o.req?` <span class="req">${t('required','مطلوب')}</span>`:''}</label>${o.pre?`<div class="inpw">${pre}${ctl}</div>`:ctl}${hint}${err}</div>`; };
H.toggle = (label, on, sub) => { const id='f'+(++FID); return `<div class="row tog"><span class="b"><label class="t" for="${id}">${label}</label>${sub?`<span class="s">${sub}</span>`:''}</span><input class="sw" type="checkbox" role="switch" id="${id}"${on?' checked':''}></div>`; };
H.check = (label, on, sub) => { const id='f'+(++FID); return `<div class="row tog"><input class="cb" type="checkbox" id="${id}"${on?' checked':''}><span class="b"><label class="t" for="${id}">${label}</label>${sub?`<span class="s">${sub}</span>`:''}</span></div>`; };
H.radios = (name, opts, cur=0, label) => `<fieldset class="radios"><legend class="vh">${label||name}</legend>${opts.map((o,i)=>{ const id='f'+(++FID); const [l,s,e]=Array.isArray(o)?o:[o]; return `<div class="row rad"><input type="radio" name="${name}" id="${id}"${i===cur?' checked':''}><span class="b"><label class="t" for="${id}">${l}</label>${s?`<span class="s">${s}</span>`:''}</span>${e?`<span class="e">${e}</span>`:''}</div>`; }).join('')}</fieldset>`;
H.steps = (i, labels) => `<div class="steps" aria-label="${t('Progress','التقدم')}"><div class="st-t"><span>${t('Step','الخطوة')} ${N(i)} ${t('of','من')} ${N(labels.length)}</span><b>${labels[i-1]}</b></div><div class="st-bar" aria-hidden="true">${labels.map((_,k)=>`<i class="${k<i?'on':''}"></i>`).join('')}</div></div>`;
H.meter = (parts, label) => `<div class="meter" role="img" aria-label="${label||''}">${parts.map(([w,c])=>`<i style="width:${Math.max(0,Math.min(100,w))}%;background:var(--c-${c})"></i>`).join('')}</div>`;
H.bars = (vals, labels, label, o={}) => { const mx=Math.max(...vals,1); return `<div class="bars" role="img" aria-label="${label}">${vals.map((v,i)=>`<div class="bc"><i style="height:${Math.round(v/mx*100)}%;background:var(--c-${(o.hi===i)?'accent':(o.c||'brand')})"></i><span>${labels[i]||''}</span></div>`).join('')}</div>`; };
H.ring = (pct, inner, label) => `<svg class="ring" viewBox="0 0 48 48" role="img" aria-label="${label}"><circle cx="24" cy="24" r="20" fill="none" stroke="var(--c-surface-2)" stroke-width="6"/><circle cx="24" cy="24" r="20" fill="none" stroke="var(--c-accent)" stroke-width="6" stroke-dasharray="${Math.round(pct*1.257)} 126" stroke-linecap="round" transform="rotate(-90 24 24)"/>${inner||''}</svg>`;
H.qr = (label, seed=7) => { let s=seed, cells=''; const r=()=>{ s=(s*9301+49297)%233280; return s/233280; }; const n=25; const fin=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="7" fill="none" stroke="#000" stroke-width="1"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#000"/>`;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){ if((x<8&&y<8)||(x>16&&y<8)||(x<8&&y>16)) continue; if(r()>.52) cells+=`<rect x="${x}" y="${y}" width="1" height="1"/>`; }
  return `<svg class="qr" viewBox="-2 -2 29 29" role="img" aria-label="${label}"><rect x="-2" y="-2" width="29" height="29" fill="#fff"/>${fin(.5,.5)}${fin(17.5,.5)}${fin(.5,17.5)}<g fill="#000">${cells}</g></svg>`; };
H.map = (label, stops=5) => `<svg class="map" viewBox="0 0 340 180" role="img" aria-label="${label}"><rect width="340" height="180" rx="16" fill="var(--c-surface-2)"/><path d="M0 120 C80 100 120 150 200 120 S300 60 340 80" stroke="var(--c-border-strong)" stroke-width="10" fill="none" opacity=".35"/><path d="M60 0 C70 60 40 120 90 180" stroke="var(--c-border-strong)" stroke-width="8" fill="none" opacity=".3"/><path d="M40 150 L110 110 L170 128 L230 70 L300 52" stroke="var(--c-brand)" stroke-width="4" fill="none" stroke-dasharray="2 8" stroke-linecap="round"/>${[[40,150],[110,110],[170,128],[230,70],[300,52]].slice(0,stops).map(([x,y],i)=>`<g><circle cx="${x}" cy="${y}" r="12" fill="${i<2?'var(--c-success)':i===2?'var(--c-brand)':'var(--c-surface)'}" stroke="var(--c-brand)" stroke-width="2"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="11" font-weight="700" font-family="Inter" fill="${i<=2?'var(--c-text-on-brand)':'var(--c-text)'}">${i+1}</text></g>`).join('')}</svg>`;
H.tiles = (arr) => `<div class="tiles">${arr.map(([ic,l,go,s,q])=>`<a class="tile" href="${href(go,q||{})}"><span class="ti">${I(ic,22)}</span><span class="tl1">${l}</span>${s?`<span class="ts">${s}</span>`:''}</a>`).join('')}</div>`;
H.numpad = (val) => `<div class="pad-d" aria-live="polite"><span class="vh">${t('Amount','المبلغ')}</span>${M(val,'big')}</div><div class="numpad" role="group" aria-label="${t('Number pad','لوحة الأرقام')}">${['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k=>`<button type="button" data-toast="${k}" ${k==='⌫'?`aria-label="${t('Delete','حذف')}"`:''}>${k}</button>`).join('')}</div>`;
H.empty = (art, title, body, btns='') => `<div class="emptyv">${MF.art(art)}<h2 class="disp">${title}</h2>${body?`<p>${body}</p>`:''}${btns}</div>`;
H.stepper = (sku, q, name) => q>0 ? `<div class="step on" data-sku="${sku}"><button type="button" data-q="${sku}:-1" aria-label="${t('Decrease','إنقاص')} ${name}">${I(q===1?'trash':'minus',18)}</button><span class="num q" aria-live="polite">${q}</span><button type="button" data-q="${sku}:1" aria-label="${t('Increase','زيادة')} ${name}">${I('plus',18)}</button></div>` : `<button type="button" class="add" data-q="${sku}:1" aria-label="${t('Add','أضف')} ${name}">${I('plus',20)}<span>${t('Add','أضف')}</span></button>`;
H.sheet = (title, body) => `<div class="scrim" aria-hidden="true"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="shh"><span class="grab" aria-hidden="true"></span><h2 id="shh" class="disp">${title}</h2>${body}</div>`;
H.table = (cols, rows, cap) => `<div class="tblw"><table class="tbl">${cap?`<caption class="vh">${cap}</caption>`:''}<thead><tr>${cols.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i===0?`<th scope="row">${c}</th>`:`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

/* ---------- illustrations ---------- */
MF.art = (k) => { const A = {
 basket:'<rect x="14" y="30" width="92" height="56" rx="14" fill="var(--c-brand-weak)"/><path d="M30 30l10-16h40l10 16" fill="none" stroke="var(--c-brand-text)" stroke-width="2.5" stroke-linecap="round"/><circle cx="60" cy="58" r="14" fill="var(--c-surface)" stroke="var(--c-brand-text)" stroke-width="2.5"/><path d="M60 50v8l5 4" stroke="var(--c-brand-text)" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
 box:'<path d="M20 36l40-16 40 16v40l-40 16-40-16z" fill="var(--c-brand-weak)" stroke="var(--c-brand-text)" stroke-width="2.5"/><path d="M20 36l40 16 40-16M60 52v40" stroke="var(--c-brand-text)" stroke-width="2.5" fill="none"/>',
 doc:'<rect x="34" y="12" width="52" height="72" rx="8" fill="var(--c-brand-weak)" stroke="var(--c-brand-text)" stroke-width="2.5"/><path d="M46 34h28M46 46h28M46 58h18" stroke="var(--c-brand-text)" stroke-width="2.5" stroke-linecap="round"/>',
 lock:'<rect x="32" y="40" width="56" height="44" rx="10" fill="var(--c-surface-2)" stroke="var(--c-text-2)" stroke-width="2.5"/><path d="M44 40V30a16 16 0 0 1 32 0v10" fill="none" stroke="var(--c-text-2)" stroke-width="2.5"/><circle cx="60" cy="60" r="5" fill="var(--c-text-2)"/>',
 error:'<circle cx="60" cy="48" r="32" fill="var(--c-danger-weak)"/><path d="M60 32v20M60 62v.5" stroke="var(--c-danger)" stroke-width="4" stroke-linecap="round"/>',
 ok:'<circle cx="60" cy="48" r="32" fill="var(--c-success-weak)"/><path d="M45 49l10 10 20-22" stroke="var(--c-success)" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
 off:'<circle cx="60" cy="48" r="32" fill="var(--c-warning-weak)"/><path d="M42 44a26 26 0 0 1 36 0M48 52a16 16 0 0 1 24 0M60 62v.5M40 30l40 40" stroke="var(--c-warning)" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
 inbox:'<path d="M20 50l12-28h56l12 28v30H20z" fill="var(--c-brand-weak)" stroke="var(--c-brand-text)" stroke-width="2.5"/><path d="M20 50h24l6 10h20l6-10h24" fill="none" stroke="var(--c-brand-text)" stroke-width="2.5"/>',
 star:'<circle cx="60" cy="48" r="32" fill="var(--c-accent-weak)"/><path d="M60 28l6 13 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2z" fill="var(--c-accent)"/>',
 chart:'<rect x="18" y="16" width="84" height="66" rx="12" fill="var(--c-brand-weak)"/><path d="M34 66V50M50 66V38M66 66V46M82 66V30" stroke="var(--c-brand-text)" stroke-width="6" stroke-linecap="round"/>',
 truck:'<rect x="14" y="30" width="56" height="36" rx="6" fill="var(--c-brand-weak)" stroke="var(--c-brand-text)" stroke-width="2.5"/><path d="M70 40h16l14 14v12H70z" fill="var(--c-surface)" stroke="var(--c-brand-text)" stroke-width="2.5"/><circle cx="34" cy="70" r="7" fill="var(--c-surface)" stroke="var(--c-brand-text)" stroke-width="2.5"/><circle cx="84" cy="70" r="7" fill="var(--c-surface)" stroke="var(--c-brand-text)" stroke-width="2.5"/>'};
 return `<svg class="art" viewBox="0 0 120 96" aria-hidden="true" focusable="false">${A[k]||A.box}<circle cx="98" cy="20" r="6" fill="var(--c-accent)"/></svg>`; };

/* ---------- roles & navigation ---------- */
MF.ROLES = {
 guest:{n:['New customer (sign-up)','عميل جديد (تسجيل)'],grp:'customer',ctx:['Sign-up','التسجيل'],nav:[]},
 owner:{n:['Customer · owner','العميل · المالك'],grp:'customer',ctx:['Al Wadi Restaurant · all branches','مطعم الوادي · كل الفروع'],nav:[['home','b.home',['Home','الرئيسية']],['grid','b.catalog',['Catalogue','المنتجات']],['box','b.orders',['Orders','الطلبات']],['wallet','b.finance',['Finance','المالية']],['chart','bh.home',['Hub','المركز']]]},
 bm:{n:['Customer · branch manager','العميل · مدير الفرع'],grp:'customer',ctx:['Al Wadi Restaurant · Olaya','مطعم الوادي · العليا'],nav:[['home','b.home',['Home','الرئيسية']],['grid','b.catalog',['Catalogue','المنتجات']],['box','b.orders',['Orders','الطلبات']],['inbox','b.approvals',['Approvals','الموافقات'],2],['more','more',['More','المزيد']]]},
 buyer:{n:['Customer · buyer','العميل · المشتري'],grp:'customer',ctx:['Al Wadi Restaurant · Olaya','مطعم الوادي · العليا'],nav:[['home','b.home',['Home','الرئيسية']],['grid','b.catalog',['Catalogue','المنتجات']],['spark','b.reorder',['Reorder','إعادة الطلب']],['box','b.orders',['Orders','الطلبات']],['more','more',['More','المزيد']]]},
 cashier:{n:['Customer · cashier','العميل · أمين الصندوق'],grp:'customer',ctx:['Al Nakheel Shawarma · counter','شاورما النخيل · الكاشير'],nav:[['home','cb.today',['Today','اليوم']],['plus','cb.sale',['Sale','بيع']],['receipt','cb.expense',['Expense','مصروف']],['lock','bh.close',['Close day','إغلاق اليوم']],['more','more',['More','المزيد']]]},
 sales:{n:['Salesperson','مندوب المبيعات'],grp:'staff',ctx:['Riyadh North · Faisal','شمال الرياض · فيصل'],nav:[['home','s.today',['Today','اليوم']],['users','s.customers',['Customers','العملاء']],['cart','s.order',['Order','طلب']],['wallet','rs.earn',['Earn','الأرباح']],['more','more',['More','المزيد']]]},
 van:{n:['Sales + delivery van','مندوب البيع والتوصيل (الفان)'],grp:'staff',ctx:['Van 07 · Riyadh East','فان 07 · شرق الرياض'],nav:[['route','v.route',['Route','المسار']],['box','v.stock',['Stock','المخزون']],['receipt','v.sale',['Invoice','فاتورة']],['sync','v.queue',['Queue','الانتظار'],3],['more','more',['More','المزيد']]]},
 driver:{n:['Delivery driver','سائق التوصيل'],grp:'staff',ctx:['Truck 12 · Riyadh North','شاحنة 12 · شمال الرياض'],nav:[['route','d.route',['Route','المسار']],['pin','d.stop',['Stop','المحطة']],['refresh','d.returns',['Returns','المرتجعات']],['qr','rd.earn',['Earn','اربح']],['more','more',['More','المزيد']]]},
 store:{n:['Storekeeper','أمين المستودع'],grp:'staff',ctx:['Riyadh DC · Zone B','مستودع الرياض · المنطقة B'],nav:[['layers','k.lists',['Picks','التجهيز']],['scan','k.pick',['Scan','المسح']],['download','k.receive',['Receive','الاستلام']],['truck','k.dispatch',['Dispatch','الإرسال']],['more','more',['More','المزيد']]]},
 acct:{n:['Accountant','المحاسب'],grp:'staff',ctx:['Finance · credit desk','المالية · مكتب الائتمان'],nav:[['inbox','a.inbox',['Approvals','الاعتمادات'],4],['chart','a.aging',['Aging','الأعمار']],['phone','a.collect',['Collect','التحصيل']],['doc','a.statements',['Statements','الكشوف']],['more','more',['More','المزيد']]]},
 mgr:{n:['Manager (approver)','المدير (المعتمد)'],grp:'staff',ctx:['Credit committee','لجنة الائتمان'],nav:[['inbox','m.inbox',['Approvals','الاعتمادات'],2],['chart','m.portfolio',['Portfolio','المحفظة']],['doc','m.reports',['Reports','التقارير']],['bell','n.center',['Alerts','التنبيهات']],['more','more',['More','المزيد']]]},
 admin:{n:['Admin','مسؤول النظام'],grp:'staff',ctx:['MENAFoods admin','إدارة MENAFoods'],nav:[['chart','ad.overview',['Overview','نظرة عامة']],['users','ad.users',['Users','المستخدمون']],['settings','ad.rules',['Rules','القواعد']],['gift','rm.overview',['Rewards','المكافآت']],['more','more',['More','المزيد']]]},
 aff:{n:['Outside affiliate','شريك تسويق خارجي'],grp:'outside',ctx:['Affiliate · Noura (sample)','شريكة · نورة (عينة)'],nav:[['chart','rx.dash',['Dashboard','لوحتي']],['link','rx.links',['Links','الروابط']],['wallet','rx.wallet',['Wallet','المحفظة']],['more','more',['More','المزيد']]]}
};
MF.AREAS = {onboarding:['Onboarding & sign-up','التسجيل والتحقق'],home:['Home','الرئيسية'],search:['Search & catalogue','البحث والمنتجات'],product:['Product detail','تفاصيل المنتج'],cart:['Cart & checkout','السلة وإتمام الطلب'],reorder:['Reorder & par levels','إعادة الطلب والحد الأدنى'],orders:['Orders & tracking','الطلبات والتتبع'],credit:['Credit & statements','الائتمان والكشوف'],invoices:['Invoices & payments','الفواتير والمدفوعات'],team:['Team & branch approvals','الفريق وموافقات الفروع'],c360:['Customer 360','ملف العميل 360'],sales:['Salesperson','المبيعات'],van:['Van sales','البيع بالفان'],driver:['Delivery','التوصيل'],store:['Warehouse','المستودع'],backoffice:['Credit desk & approvals','مكتب الائتمان والاعتمادات'],admin:['Admin','الإدارة'],notifications:['Notifications','الإشعارات'],settings:['Settings','الإعدادات'],rewards:['Rewards & Earn','المكافآت والأرباح'],hub:['Business Hub','مركز الأعمال'],cashbook:['Cash book','دفتر النقدية']};
const STAFF_GRANT = ['Admin','مسؤول النظام'], CUST_GRANT=['The owner (Faisal)','المالك (فيصل)'];

/* ---------- screen registry ---------- */
MF.S = (id, def) => { def.id=id; def.r = def.r.split(' '); MF.SCR[id]=def; MF.ORDER.push(id); };
MF.prod = (id) => MF.DATA.P[id];
MF.pn = (p) => AR ? p.ar : p.en;

/* ---------- param parsing ---------- */
function parse(){ const h=location.hash.replace(/^#\/?/,''); const i=h.indexOf('?'); const id=i<0?h:h.slice(0,i); const q=Object.fromEntries(new URLSearchParams(i<0?'':h.slice(i+1))); q.id=id; return q; }
const devLang = () => (navigator.language||'en').toLowerCase().startsWith('ar') ? 'ar' : 'en';

/* ---------- chrome ---------- */
function statusBar(plat){ if(plat==='pwa') return ''; const bat=`<span class="bat"><i></i></span>`; return plat==='ios' ? `<div class="sb ios" aria-hidden="true"><span>9:41</span><span class="isl"></span><span class="sbi">5G ${bat}</span></div>` : `<div class="sb and" aria-hidden="true"><span>9:41</span><span class="sbi">5G ${bat}</span></div>`; }
function topBar(def, c){ const title=tt(def.t), ctx=tt(MF.ROLES[c.role].ctx); const root=!def.back || c.tablet&&def.nav;
 const backHref = def.back ? href(def.back) : '';
 const backLbl = def.back && MF.SCR[def.back] ? tt(MF.SCR[def.back].t) : t('Back','رجوع');
 const acts = (def.acts?def.acts(c):'') + (root && c.role!=='guest' && def.id!=='n.center' ? ((MF.ROLES[c.role].nav||[]).some(n=>n[1]==='more')||def.id==='more' ? '' : `<a class="ib" href="${href('more')}" aria-label="${t('Account and all screens','الحساب وكل الشاشات')}">${I('user')}</a>`) + `<a class="ib" href="${href('n.center')}" aria-label="${t('Notifications, 3 new','الإشعارات، 3 جديدة')}">${I('bell')}<span class="dot" aria-hidden="true"></span></a>` : '');
 const sub = def.sub ? `<p class="tsub">${tt(def.sub)}</p>` : '';
 if (c.plat==='ios') { if (!def.back) return `<header class="tb ios root"><div class="tbr"><span class="ctx">${I('pin',16)}${ctx}</span><span class="sp"></span>${acts}</div><h1 class="lt disp" tabindex="-1">${title}</h1>${sub}</header>`;
   return `<header class="tb ios"><div class="tbr"><a class="bk" href="${backHref}">${I('back',22)}<span>${backLbl}</span></a><span class="sp"></span>${acts}</div><h1 class="lt sm disp" tabindex="-1">${title}</h1>${sub}</header>`; }
 if (c.plat==='android') return `<header class="tb and">${def.back?`<a class="ib flat" href="${backHref}" aria-label="${t('Back to','رجوع إلى')} ${backLbl}">${I('back')}</a>`:''}<div class="tbt"><h1 tabindex="-1">${title}</h1><span class="ctx">${ctx}</span></div>${acts}</header>${sub}`;
 if (!def.back) return `<header class="tb pwa root"><div class="tbr"><span class="ctx">${I('pin',16)}${ctx}</span><span class="sp"></span>${acts}</div><h1 class="lt disp" tabindex="-1">${title}</h1>${sub}</header>`;
 return `<header class="tb pwa"><div class="tbr"><a class="ib" href="${backHref}" aria-label="${t('Back to','رجوع إلى')} ${backLbl}">${I('back')}</a><h1 class="ttl" tabindex="-1">${title}</h1><span class="sp0"></span>${acts||'<span class="ibs" aria-hidden="true"></span>'}</div>${sub}</header>`; }
function navBar(c, def){ const R=MF.ROLES[c.role]; if(!R.nav.length) return ''; const cur = def.nav || (R.nav.find(n=>n[1]===def.id)||[])[1];
 const items = R.nav.map(([ic,id,l,badge])=>`<a class="tab" href="${href(id)}"${id===cur?' aria-current="page"':''}><span class="ind">${I(ic,c.plat==='ios'?24:22)}${badge?`<span class="bdg num" aria-hidden="true">${badge}</span>`:''}</span><span class="tl">${tt(l)}</span>${badge?`<span class="vh">, ${badge} ${t('new','جديد')}</span>`:''}</a>`).join('');
 return `<nav class="nb ${c.tablet?'rail':''}" aria-label="${t('Main','التنقل الرئيسي')}">${c.tablet?`<span class="brand" aria-hidden="true">${I('store',22)}</span>`:''}${items}</nav>`; }

/* ---------- generic states ---------- */
function skel(def){ return `<div class="skel" aria-busy="true"><p class="vh" role="status">${t('Loading','جارٍ تحميل')} ${tt(def.t)}…</p>${'<div class="sk card"><i class="w60"></i><i class="w90"></i><i class="w40"></i></div>'.repeat(3)}</div>`; }
function errorV(def){ return H.empty('error', t(`Couldn’t load ${tt(def.t)}`,`تعذّر تحميل ${tt(def.t)}`), t('Something went wrong on our side. Nothing you entered was lost. Try again, or contact support with reference MF-5D2A.','حدث خطأ من جهتنا ولم يُفقد أي شيء أدخلته. حاول مرة أخرى أو تواصل مع الدعم برقم المرجع MF-5D2A.'), H.btns(H.btn(t('Try again','حاول مرة أخرى'),{st:'default',ic:'refresh'}), H.btn(t('Contact support','تواصل مع الدعم'),{k:'sec',ic:'msg',go:'cc.chat'}))); }
function emptyV(def,c){ const e=def.empty?def.empty(c):[ 'box', t('Nothing here yet','لا يوجد شيء بعد'), t('When there is something to show, it will appear here.','عندما يتوفر شيء سيظهر هنا.') ]; return H.empty(e[0], e[1], e[2], e[3]||''); }
function deniedV(def,c){ const R=MF.ROLES[c.role]; const g = R.grp==='customer'?tt(CUST_GRANT):tt(STAFF_GRANT); return H.empty('lock', t('You don’t have access to this','لا تملك صلاحية الوصول إلى هذه الصفحة'), t(`Your role (${tt(R.n)}) can’t open “${tt(def.t)}”. ${g} can give you access.`,`دورك (${tt(R.n)}) لا يسمح بفتح «${tt(def.t)}». يمكن أن يمنحك ${g} الصلاحية.`), H.btns(H.btn(t('Request access','اطلب الصلاحية'),{toast:t('Request sent','أُرسل الطلب'),ic:'key'}), R.nav.length?H.btn(t('Go to home','العودة للرئيسية'),{k:'sec',go:R.nav[0][1]}):'')); }
function successV(def,c){ const o=def.ok?def.ok(c):[t('Done','تم'), t('Your changes are saved.','تم حفظ التغييرات.')]; const R=MF.ROLES[c.role]; return `<div role="status">${H.empty('ok', o[0], o[1], o[2]||H.btns(H.btn(t('Done','تم'),{go:(R.nav[0]||[])[1]||'ob.welcome'}), H.btn(t('Back','رجوع'),{k:'sec',st:'default'})))}</div>`; }
function offlineBar(def,c){ return `<div class="offbar" role="status">${I('wifioff',16)}<span>${t('Offline · showing data saved 10:42','غير متصل · بيانات محفوظة 10:42')}</span></div>${def.off?H.note(def.off(c),'wifioff'):''}`; }

/* ---------- render ---------- */
function render(focus){
 P = parse(); FID=0;
 const lang = P.lang || devLang(); AR = lang==='ar';
 let id = P.id; if(!MF.SCR[id]) id = 'b.home';
 const def = MF.SCR[id];
 const role = MF.ROLES[P.role] ? P.role : def.r[0];
 const plat = ['pwa','ios','android'].includes(P.plat)?P.plat:'pwa';
 const size = P.size || (innerWidth>=900?'tablet':'phone');
 const theme = P.theme || (MF.DEFAULT_THEME || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
 const allowed = def.r.includes(role) || def.r.includes('*');
 let state = P.state || 'default'; if(!allowed) state='denied';
 C = MF.C = {id, def, role, plat, size, tablet:size==='tablet', theme, lang, ar:AR, v:P.v||(def.v?def.v[0][0]:''), sub:P.sub||'', state, off:state==='offline'};
 const de = document.documentElement; de.lang=lang; de.dir=AR?'rtl':'ltr'; de.dataset.theme=theme; de.className=`plat-${plat} ${size} st-${state}`;
 let body='', dock='', fab='';
 if (state==='loading') body=skel(def); else if(state==='error') body=errorV(def); else if(state==='empty') body=emptyV(def,C); else if(state==='denied') body=deniedV(def,C); else if(state==='success') body=successV(def,C);
 else { const out = def.render(C); if (typeof out==='string') body=out; else { body=out.b; dock=out.dock||''; fab=out.fab||''; } if(state==='offline') body = offlineBar(def,C)+body; }
 if (state!=='default' && state!=='offline') { dock=''; fab=''; }
 const hasNav = MF.ROLES[role].nav.length>0 && !def.flow;
 const isProto = def.segLabel && /prototype/.test(def.segLabel[0]);
 const showSeg = def.v && !['loading','error','empty','denied','success'].includes(state) && !def.noSeg && !(isProto && P.shot==='1');
 const segs = !showSeg ? '' : isProto ? `<div class="proto"><span class="pl">${I('eye',14)}${t('Prototype view','عرض النموذج')}</span>${H.seg(def.v.map(([v,l])=>[v,tt(l)]), C.v, tt(def.segLabel))}</div>` : H.seg(def.v.map(([v,l])=>[v,tt(l)]), C.v, def.segLabel?tt(def.segLabel):undefined);
 const fabH = fab && plat==='android' ? `<a class="fab" href="${href(fab[2])}">${I(fab[1],22)}<span>${fab[0]}</span></a>` : '';
 const foot = `<p class="foot">${I('info',14)}${t('Prototype · sample data only · not real prices, stock or brand deals','نموذج أولي · بيانات تجريبية فقط · ليست أسعارًا أو مخزونًا أو صفقات حقيقية')}</p>`;
 const main = `${statusBar(plat)}${topBar(def,C)}<main id="main" class="body${def.wideBody?' wb':''}">${segs}${body}${foot}</main>${dock?`<footer class="dock">${dock}</footer>`:''}${fabH}`;
 document.body.className = `${hasNav?'has-nav':''} ${dock?'has-dock':''} ${fabH?'has-fab':''}`;
 document.body.innerHTML = C.tablet ? `<div class="shell">${hasNav?navBar(C,def):''}<div class="pane">${main}</div></div><div class="toast" role="status" aria-live="polite"></div>` : `${main}${hasNav?navBar(C,def):''}<div class="toast" role="status" aria-live="polite"></div>`;
 document.title = `${tt(def.t)} · MENAFoods Pro Ops`; if (MF.after) MF.after(C);
 if (focus) { window.scrollTo(0,0); const h=document.querySelector('h1'); h && h.focus({preventScroll:true}); }
 window.__rendered = location.hash; window.__screen = id;
}
MF.render = render;
function setParam(k,v){ const p=parse(); const q=new URLSearchParams(); Object.entries(p).forEach(([a,b])=>{ if(a!=='id') q.set(a,b); }); if(v===null) q.delete(k); else q.set(k,v); location.hash = `#/${p.id}?${q}`; }
MF.setParam = setParam;
document.addEventListener('click', e => {
 if(!MF.booted) return;
 const st = e.target.closest('[data-st]'); if (st) { setParam('state', st.dataset.st==='default'?null:st.dataset.st); return; }
 const q = e.target.closest('[data-q]'); if (q) { const [sku,d]=q.dataset.q.split(':'); MF.cart[sku]=Math.max(0,(MF.cart[sku]||0)+Number(d)); const y=scrollY; render(false); scrollTo(0,y); const nb=document.querySelector(`[data-sku="${sku}"] [data-q="${sku}:1"],[data-q="${sku}:1"]`); nb&&nb.focus(); toast(MF.cart[sku]?t(`Quantity ${MF.cart[sku]}`,`الكمية ${MF.cart[sku]}`):t('Removed','تمت الإزالة')); return; }
 const ch = e.target.closest('[data-chip]'); if (ch) { ch.setAttribute('aria-pressed', ch.getAttribute('aria-pressed')==='true'?'false':'true'); return; }
 const tb = e.target.closest('[data-toast]'); if (tb) toast(tb.dataset.toast);
});
function toast(m){ const el=document.querySelector('.toast'); if(!el) return; el.textContent=m; el.classList.add('on'); clearTimeout(toast.h); toast.h=setTimeout(()=>el.classList.remove("on"),4000); }
MF.toast = toast;
window.addEventListener('hashchange', ()=>{ if(MF.booted) render(true); });
MF.boot = () => { MF.booted=true; if(!location.hash) location.hash = '#/b.home'; render(false); };
})();
