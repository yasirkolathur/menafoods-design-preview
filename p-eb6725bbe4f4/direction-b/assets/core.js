/* MENAFoods Direction B — core (router, i18n, formatting, chrome, states). Prototype; sample data only. */
const RIYAL_VB="35 -604 568 624";const RIYAL_D="M45 37Q47 56 52.0 73.0Q57 90 64 107L239 144V540Q253 557 269.0 570.5Q285 584 303 594V166Q303 162 301.0 157.5Q299 153 297 148L264 99Q252 81 227 75ZM367 -10Q369 9 373.5 27.0Q378 45 385 61L593 104Q591 86 586.0 68.5Q581 51 574 35ZM75 192Q77 210 82.5 227.5Q88 245 95 262L593 367Q591 349 586.0 331.5Q581 314 574 297ZM367 122V508Q381 525 397.0 539.0Q413 553 431 563V202L593 236Q591 218 586.0 200.5Q581 183 574 166Z";
const ICONS={
home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/>',
box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
truck:'<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6 8-6s7 1.5 8 6"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c.8-3.6 3.7-5 7-5s6.2 1.4 7 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.4 2.2 4 5"/>',
bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
chev:'<path d="m9 6 6 6-6 6"/>',back:'<path d="M15 6l-6 6 6 6"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
check:'<path d="m5 12 5 5 9-10"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
download:'<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
file:'<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
camera:'<path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>',
pen:'<path d="M3 21c3-1 4-3 6-3s2 2 4 2 3-2 5-2M15 4l5 5-9 9H6v-5z"/>',
phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2"/>',
chat:'<path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.6A8 8 0 1 1 21 12z"/><path d="M9 10.5c.5 2 2 3.5 4.5 4.5l1-1.2 1.6.8"/>',
pin:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
nav:'<path d="m3 11 18-8-8 18-2-8z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
wifioff:'<path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.7M14 10.3A10 10 0 0 1 19 13M2 9a15 15 0 0 1 4.2-2.6M10.7 5A15 15 0 0 1 22 9"/><circle cx="12" cy="20" r=".5"/>',
refresh:'<path d="M20 11a8 8 0 0 0-14.8-4M4 4v4h4M4 13a8 8 0 0 0 14.8 4M20 20v-4h-4"/>',
filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',scan:'<path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M7 8v8M10 8v8M13 8v8M17 8v8"/>',
list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',chart:'<path d="M3 21h18M6 17V10M11 17V5M16 17v-4M21 17V8"/>',
shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',wallet:'<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><circle cx="16" cy="14.5" r="1.2"/>',
cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
magic:'<path d="m4 20 11-11M14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM19 11l.6 1.4L21 13l-1.4.6L19 15l-.6-1.4L17 13l1.4-.6z"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',logout:'<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>',
store:'<path d="M3 9 5 4h14l2 5M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v8h14v-8M10 21v-5h4v5"/>',
receipt:'<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h8"/>',
eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',
trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',sync:'<path d="M20 11a8 8 0 0 0-14.8-4M4 4v4h4M4 13a8 8 0 0 0 14.8 4M20 20v-4h-4"/>',
cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>',
more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',note:'<path d="M5 3h10l4 4v14H5z"/><path d="M9 9h6M9 13h6M9 17h4"/>',
return:'<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',swap:'<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',bank:'<path d="M3 10 12 4l9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>',
id:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.5 1.7-2 3-2s2.4.5 3 2M14 10h4M14 13h3"/>',
stamp:'<path d="M9 3h6v6l2 3H7l2-3zM5 15h14v3H5zM7 21h10"/>',book:'<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-5a3 3 0 0 0-3 3"/><path d="M20 4v14h-6"/>',
heart:'<path d="M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z"/>',bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
hand:'<path d="M7 11V5a1.5 1.5 0 0 1 3 0v5M10 10V3.5a1.5 1.5 0 0 1 3 0V10M13 10V4.5a1.5 1.5 0 0 1 3 0V11M16 11V7.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.5-2.7L2.7 15a1.5 1.5 0 0 1 2.3-2l2 2"/>'
};
function I(n,c=''){return `<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`}
const FLIP=new Set(['chev','back','arrow','return','logout','nav']);
function IC(n,c=''){return I(n,(FLIP.has(n)?'flip-rtl ':'')+c)}

/* ---------- prefs ---------- */
const S={
  lang:null, plat:'pwa', view:'mobile', role:'customer', screen:'c.home', state:'default', step:0, shot:false,
  qty:{}, toast:null, overlay:null, ui:{}
};
function detectLang(){
  const saved=localStorage.getItem('mf.lang'); if(saved) return {lang:saved,src:'saved override'};
  const l=(navigator.languages&&navigator.languages[0])||navigator.language||'en';
  return {lang:/^ar\b/i.test(l)?'ar':'en',src:'device ('+l+')'};
}
const L=(en,ar)=>S.lang==='ar'?ar:en;
/* ---------- formatting ---------- */
function money(n,opt={}){
  const s=new Intl.NumberFormat('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Math.abs(n));
  const neg=n<0?'-':'';
  return `<span class="money" aria-label="${neg}${s} ${L('Saudi riyals','ريال سعودي')}"><svg class="sar" viewBox="${RIYAL_VB}" aria-hidden="true"><path fill="currentColor" transform="scale(1,-1)" d="${RIYAL_D}"/></svg>${neg}${s}</span>`;
}
function num(n){return `<span class="ltr">${new Intl.NumberFormat('en-US').format(n)}</span>`}
const BASE=new Date('2026-11-12T12:00:00+03:00');
function dayOff(d){const x=new Date(BASE);x.setDate(x.getDate()+d);return x}
function gdate(d,o={day:'numeric',month:'short',year:'numeric'}){
  return new Intl.DateTimeFormat(S.lang==='ar'?'ar-SA-u-ca-gregory-nu-latn':'en-GB-u-ca-gregory',{...o,timeZone:'Asia/Riyadh'}).format(d)}
function hdate(d){return new Intl.DateTimeFormat(S.lang==='ar'?'ar-SA-u-ca-islamic-umalqura-nu-latn':'en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Riyadh'}).format(d).replace(/ AH$/,'')+(S.lang==='ar'?'':' AH')}
function dual(d,o){return `<span>${gdate(d,o)}</span> <span class="muted xs">· ${hdate(d)}</span>`}
function wday(d){return gdate(d,{weekday:'long'})}
function phone(p){return `<span class="ltr">${p}</span>`}
function nm(o){return `<bdi>${S.lang==='ar'?(o.ar||o.en):(o.en||o.ar)}</bdi>`}
/* ---------- small components ---------- */
const chip=(t,c='')=>`<span class="chip ${c}">${t}</span>`;
const btn=(t,c='',act='',ic='')=>`<button class="btn ${c}" data-act="${act}">${ic?IC(ic,'sm'):''}${t}</button>`;
function li({lead='',title='',meta='',trail='',act='',chev=true,cls=''}){
  return `<div class="li ${cls}" ${act?`data-act="${act}" style="cursor:pointer"`:''}>${lead}<div class="sp"><div class="ttl">${title}</div>${meta?`<div class="meta">${meta}</div>`:''}</div>${trail}${chev&&act?`<span class="muted">${IC('chev','sm')}</span>`:''}</div>`}
const av=(t,bg)=>`<div class="av" style="background:${bg||'var(--henna-300)'}">${t}</div>`;
const secH=(t,a='',act='')=>`<div class="sec-h"><h2>${t}</h2>${a?`<button class="link" data-act="${act}">${a}</button>`:''}</div>`;
const banner=(type,ic,t,b='',acts='')=>`<div class="banner ${type}">${I(ic)}<div class="sp"><div class="bt">${t}</div>${b?`<div>${b}</div>`:''}${acts?`<div class="btnrow" style="margin-top:8px">${acts}</div>`:''}</div></div>`;
const assist=(t,acts='')=>`<div class="assist"><div class="ava">${I('magic','sm')}</div><div class="sp"><div class="small">${t}</div>${acts?`<div class="btnrow" style="margin-top:8px">${acts}</div>`:''}</div></div>`;
const kpi=(l,v,s='')=>`<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div>${s?`<div class="xs muted">${s}</div>`:''}</div>`;
const bar=(p,c='')=>`<div class="bar ${c}"><i style="width:${p}%"></i></div>`;
const steps=(n,cur)=>`<div class="steps">${Array.from({length:n},(_,i)=>`<i class="${i<cur?'d':i===cur?'c':''}"></i>`).join('')}</div>`;
function tl(items){return `<div class="tl">${items.map(x=>`<div class="tli ${x.s||''}"><div class="dotc">${x.s==='done'?I('check'):x.s==='bad'?I('x'):''}</div><div class="b">${x.t}</div>${x.m?`<div class="small muted">${x.m}</div>`:''}${x.x||''}</div>`).join('')}</div>`}
function qty(id,def){const v=S.qty[id]??def;return `<div class="qty"><button data-q="${id}" data-d="-1" aria-label="-">−</button><span>${v}</span><button data-q="${id}" data-d="1" aria-label="+">+</button></div>`}
function field(label,inner,hint='',hc=''){return `<div class="field"><label>${label}</label>${inner}${hint?`<div class="hint ${hc}">${hint}</div>`:''}</div>`}
function inp(val,{dir='auto',cls='',ph='',pre='',suf=''}={}){return `<div class="inp ${cls}">${pre}<input dir="${dir}" value="${val}" placeholder="${ph}">${suf}</div>`}
const cb=(on,t,m='')=>`<div class="checkrow"><div class="cb ${on?'on':''}">${on?I('check'):''}</div><div class="sp"><div>${t}</div>${m?`<div class="xs muted">${m}</div>`:''}</div></div>`;
const radio=(on,t,m='',act='')=>`<div class="radio ${on?'on':''}" data-act="${act}"><div class="rd"></div><div class="sp"><div class="b">${t}</div>${m?`<div class="small muted">${m}</div>`:''}</div></div>`;
function primary(label,act,ic='check',opt={}){
  if(S.plat==='android'&&!opt.noFab) return `<button class="fab" data-act="${act}">${I(ic)}${label}</button>`;
  return `<div class="sticky">${opt.extra||''}<button class="btn block" data-act="${act}" ${opt.dis?'disabled':''}>${label}</button></div>`;
}
function sticky(html){return `<div class="sticky">${html}</div>`}

/* ---------- registry ---------- */
const SC={};const ORDER=[];
function screen(id,o){SC[id]={id,...o};ORDER.push(id)}
const ROLES={
 auth:{en:'Auth & access',ar:'الدخول والوصول',nav:null},
 customer:{en:'Customer / buyer & approver',ar:'العميل / المشتري والمعتمد',nav:[['c.home','home','Home','الرئيسية'],['c.catalog','search','Catalog','المنتجات'],['c.cart','cart','Cart','السلة'],['c.orders','box','Orders','الطلبات'],['c.profile','user','Account','حسابي']]},
 sales:{en:'Salesperson',ar:'مندوب المبيعات',nav:[['s.customers','users','Customers','العملاء'],['s.visit','pin','Visits','الزيارات'],['s.suggest','magic','Insights','اقتراحات'],['s.creditReview','shield','Credit','الائتمان'],['s.targets','target','Targets','الأهداف']]},
 van:{en:'Sales + delivery (van)',ar:'المبيعات والتوصيل (الفان)',nav:[['v.route','route','Route','المسار'],['v.stock','box','Van stock','مخزون الفان'],['v.sale','receipt','Sell','بيع'],['v.collect','cash','Collect','تحصيل'],['v.pod','camera','Deliver','تسليم']]},
 driver:{en:'Delivery driver',ar:'سائق التوصيل',nav:[['d.route','route','Route','المسار'],['d.stop','pin','Stop','الوقفة'],['d.returns','return','Returns','المرتجعات'],['d.sync','sync','Sync','المزامنة']]},
 store:{en:'Storekeeper',ar:'أمين المستودع',nav:[['k.picklist','list','Pick lists','قوائم التجهيز'],['k.pick','scan','Pick & scan','تجهيز ومسح'],['k.dispatch','truck','Dispatch','التسليم للشحن'],['k.receiving','download','Receiving','الاستلام']]},
 acc:{en:'Accountant / credit',ar:'المحاسب / الائتمان',nav:[['a.approvals','shield','Approvals','الموافقات'],['a.aging','chart','Aging','الأعمار'],['a.collections','cash','Collections','التحصيل'],['a.zoho','sync','Zoho','زوهو']]},
 admin:{en:'Admin / manager',ar:'المدير / الإدارة',nav:[['m.approvals','shield','Approvals','الموافقات'],['m.users','users','Users','المستخدمون'],['m.rules','list','Rules','القواعد'],['m.catalog','box','Catalog','الكتالوج'],['m.audit','history','Audit','السجل']]},
 c360:{en:'Customer 360 (staff)',ar:'ملف العميل 360 (للموظفين)',nav:null}
};
const STATES=[['default','Default'],['empty','Empty'],['loading','Loading'],['error','Error'],['offline','Offline'],['denied','No access']];
/* ---------- states ---------- */
function skeleton(lay){
  const r=(h,w='100%',m=12)=>`<div class="sk" style="height:${h}px;width:${w};margin-bottom:${m}px"></div>`;
  if(lay==='form') return r(14,'40%',8)+r(48)+r(14,'50%',8)+r(48)+r(14,'35%',8)+r(48)+r(120);
  if(lay==='list') return r(40)+Array.from({length:6},()=>`<div class="row" style="margin-bottom:14px"><div class="sk" style="width:48px;height:48px;border-radius:14px"></div><div class="sp">${r(14,'70%',6)}${r(12,'45%',0)}</div></div>`).join('');
  if(lay==='dash') return `<div class="kpis">${r(70,'100%',0)}${r(70,'100%',0)}${r(70,'100%',0)}${r(70,'100%',0)}</div>`+r(160)+r(200);
  if(lay==='detail') return r(180)+r(22,'70%')+r(14,'40%')+r(120)+r(120);
  return r(150)+r(18,'40%')+`<div class="row">${r(190,'48%',0)}${r(190,'48%',0)}</div>`+r(18,'50%',12)+r(120);
}
function stateView(sc){
  const e=sc.empty||{}, er=sc.err||{};
  if(S.state==='loading') return `<div aria-busy="true" aria-label="${L('Loading','جارٍ التحميل')}">${skeleton(sc.layout||'cards')}</div>`;
  if(S.state==='empty') return `<div class="state"><div class="ill">${I(e.ic||'box')}</div><h2>${L(...(e.t||['Nothing here yet','لا يوجد شيء هنا بعد']))}</h2><p>${L(...(e.b||['When there is something to show, it will appear here.','سيظهر هنا أي جديد فور توفره.']))}</p>${e.cta?`<button class="btn" data-act="${e.act||''}" style="margin-top:8px">${L(...e.cta)}</button>`:''}</div>`;
  if(S.state==='error') return `<div class="state err"><div class="ill">${I('alert')}</div><h2>${L(...(er.t||["We couldn't load this","تعذّر تحميل هذه الصفحة"]))}</h2><p>${L(...(er.b||['Nothing you entered is lost. Check your connection and try again.','لم يضِع أي شيء أدخلته. تحقق من الاتصال ثم أعد المحاولة.']))}</p><div class="btnrow" style="margin-top:8px"><button class="btn" data-act="state:default">${I('refresh','sm')}${L('Try again','إعادة المحاولة')}</button><button class="btn out" data-act="t:Support ticket drafted (sample)~تم تجهيز طلب دعم (تجريبي)">${L('Contact support','تواصل مع الدعم')}</button></div><div class="xs muted" style="margin-top:6px">${L('Error ref','رقم الخطأ')}: <span class="ltr">MF-ERR-${(sc.id.length*137)%900+100}</span></div></div>`;
  if(S.state==='denied') return `<div class="state deny"><div class="ill">${I('lock')}</div><h2>${L("You don't have access to this","ليست لديك صلاحية لهذه الصفحة")}</h2><p>${L(...(sc.denyMsg||['Your role does not include this. Ask your account owner or MENAFoods admin to grant it.','دورك الحالي لا يشمل هذه الصفحة. اطلب الصلاحية من مالك الحساب أو مدير منافع للأغذية.']))}</p><button class="btn" data-act="t:Access request sent to owner (sample)~أُرسل طلب الصلاحية إلى المالك (تجريبي)" style="margin-top:8px">${L('Request access','طلب صلاحية')}</button></div>`;
  let pre='';
  if(S.state==='offline') pre=`<div class="banner offline">${I('wifioff')}<div class="sp"><div class="bt">${L("You're offline","أنت غير متصل")}</div><div class="small">${L('Showing what was saved at 08:42. Your actions are queued and will send automatically.','نعرض آخر نسخة محفوظة 08:42. إجراءاتك محفوظة في قائمة الانتظار وستُرسل تلقائيًا.')}</div><div style="margin-top:6px"><span class="qbadge">${I('clock','sm')} ${L('3 actions queued','3 إجراءات في الانتظار')}</span></div></div></div>`;
  return pre+sc.render();
}
/* ---------- chrome ---------- */
function topbar(sc){
  const t=L(sc.en,sc.ar), sub=sc.sub?sc.sub():'';
  const back=sc.back?`<button class="iconbtn" data-act="go:${sc.back}" aria-label="${L('Back','رجوع')}">${IC('back')}</button>`:'';
  const actsHtml=(sc.acts||['lang','bell']).map(a=>a==='lang'?`<button class="langpill" data-act="lang" aria-label="${L('Switch language','تغيير اللغة')}">${S.lang==='ar'?'EN':'ع'}</button>`:a==='bell'?`<button class="iconbtn" data-act="go:c.notifications" aria-label="${L('Notifications','الإشعارات')}">${I('bell')}<span class="dot">3</span></button>`:`<button class="iconbtn" data-act="${a[1]}" aria-label="${a[0]}">${I(a[0])}</button>`).join('');
  if(S.plat==='ios'&&S.view!=='desktop'){
    return `<div class="topbar"><div class="row1">${sc.back?`<button class="back" data-act="go:${sc.back}">${IC('back')}${L('Back','رجوع')}</button>`:''}<div class="sp"></div>${actsHtml}</div><h1 class="large">${t}</h1>${sub?`<div class="small muted">${sub}</div>`:''}</div>`;
  }
  if(S.plat==='android'&&S.view!=='desktop'){
    return `<div class="topbar">${back||`<button class="iconbtn" aria-label="menu">${I('menu')}</button>`}<div class="ttl"><h1>${t}</h1>${sub?`<div class="sub">${sub}</div>`:''}</div>${actsHtml}</div>`;
  }
  return `<div class="topbar">${back||(S.view==='desktop'?'':`<div class="logo" aria-label="MENAFoods">${S.lang==='ar'?'م':'M'}</div>`)}<div class="ttl"><h1>${t}</h1>${sub?`<div class="sub">${sub}</div>`:''}</div>${actsHtml}</div>`;
}
function bnav(sc){
  const r=ROLES[sc.role]; if(!r||!r.nav||sc.nonav) return '';
  const cur=sc.nav||sc.id;
  const items=r.nav.map(([id,ic,en,ar])=>`<button class="${cur===id?'on':''}" data-act="go:${id}"><span class="ind">${I(ic)}</span><span>${L(en,ar)}</span>${id==='c.cart'?`<span class="cnt">5</span>`:''}</button>`).join('');
  const brand=`<div class="brand"><div class="logo">${S.lang==='ar'?'م':'M'}</div>${L('MENAFoods','منافع للأغذية')}</div>`;
  return `<nav class="bnav" aria-label="${L('Main','الرئيسية')}">${S.view==='desktop'?brand:''}${items}</nav>`;
}
function statusbar(){
  if(S.plat==='android') return `<div class="statusbar"><span>15:10</span><span>▾ ▴ ▮</span></div>`;
  if(S.plat==='ios') return `<div class="statusbar"><span>3:10</span><span class="isl"></span><span>●●● ▮</span></div>`;
  return `<div class="statusbar"><span>15:10</span><span>▮</span></div>`;
}
function overlayHtml(){
  if(!S.overlay) return '';
  const o=OV[S.overlay]?OV[S.overlay]():null; if(!o) return '';
  const acts=o.actions||[];
  if(S.plat==='android'||S.view==='desktop') return `<div class="scrim" style="align-items:center" data-act="close"><div class="dialog" onclick="event.stopPropagation()"><h2>${o.title}</h2><div class="muted">${o.body||''}</div>${o.html||''}<div class="acts">${acts.map(a=>`<button class="btn ${a[2]==='primary'?'':'ghost'} sm" data-act="${a[1]}">${a[0]}</button>`).join('')}</div></div></div>`;
  if(S.plat==='ios'&&!o.html) return `<div class="scrim" style="align-items:center" data-act="close"><div class="alert-ios" onclick="event.stopPropagation()"><div class="bd"><div class="b" style="font-size:17px">${o.title}</div><div class="small" style="margin-top:4px">${o.body||''}</div></div>${acts.map(a=>`<button data-act="${a[1]}" style="${a[2]==='primary'?'font-weight:600':''}${a[2]==='danger'?';color:#D70015':''}">${a[0]}</button>`).join('')}</div></div>`;
  return `<div class="scrim" data-act="close"><div class="sheet" onclick="event.stopPropagation()"><div class="grab"></div><h2 class="disp" style="font-size:19px;margin-bottom:6px">${o.title}</h2><div class="muted small">${o.body||''}</div>${o.html||''}<div class="btnrow" style="margin-top:14px;flex-direction:column">${acts.map(a=>`<button class="btn ${a[2]==='primary'?'':a[2]==='danger'?'danger':'out'} block" data-act="${a[1]}">${a[0]}</button>`).join('')}</div></div></div>`;
}
const OV={};
function renderApp(){
  const sc=SC[S.screen]||SC['c.home'];
  const desk=S.view==='desktop';
  const cls=['app',S.plat,desk?'desk':'',sc.nonav||!(ROLES[sc.role]||{}).nav?'nonav':''].join(' ');
  const toast=S.toast?`<div class="toast" role="status">${I(S.state==='offline'?'clock':'check','sm')}<div class="sp">${S.toast}</div><button class="link" data-act="close">${L('OK','حسنًا')}</button></div>`:'';
  const ribbon=`<div class="sample-ribbon">بيانات تجريبية · Sample data</div>`;
  const content=`<main class="content" id="content">${stateView(sc)}</main>`;
  const inner=desk?`${bnav(sc)}<div class="main">${topbar(sc)}${content}</div>`:`${statusbar()}${topbar(sc)}${content}${bnav(sc)}`;
  return `<div class="${cls}" dir="${S.lang==='ar'?'rtl':'ltr'}" lang="${S.lang==='ar'?'ar-SA':'en'}">${ribbon}${inner}${overlayHtml()}${toast}</div>`;
}

/* ---------- router + viewer ---------- */
function parseHash(){
  const h=location.hash.replace(/^#\/?/,''); const [id,q]=h.split('?'); const p=new URLSearchParams(q||'');
  if(id&&SC[id]) S.screen=id;
  S.state=p.get('state')||'default'; S.step=+(p.get('step')||0);
  if(p.get('plat')) S.plat=p.get('plat'); if(p.get('view')) S.view=p.get('view');
  if(p.get('lang')) {S.lang=p.get('lang');S.langSrc='URL'}
  if(p.get('ov')) S.overlay=p.get('ov'); else S.overlay=null;
  if(p.get('ui')) p.get('ui').split(',').forEach(k=>S.ui[k]=true);
  S.shot=p.get('shot')==='1'; document.body.classList.toggle('shot',S.shot);
  S.role=SC[S.screen].role;
}
function setHash(){
  const p=new URLSearchParams();
  if(S.state!=='default')p.set('state',S.state); if(S.step)p.set('step',S.step);
  p.set('plat',S.plat); if(S.view!=='mobile')p.set('view',S.view);
  if(S.overlay)p.set('ov',S.overlay);
  history.replaceState(null,'',`#/${S.screen}?${p}`);
}
const PLAT_NOTES={
 pwa:{en:['Brand header with logo + language pill + bell','Bottom nav on mobile; left/right side rail on desktop (mirrors in RTL)','Primary action = full-width sticky button above nav','Confirmations = bottom sheet (mobile) / centered modal (desktop)','Toasts top-center; install prompt card on Home','Offline via service worker; queued actions badge'],ar:[]},
 android:{en:['M3 status bar, small top app bar (leading nav icon, title, trailing actions)','M3 navigation bar with pill active indicator (3–5 destinations)','Primary action = extended FAB on trailing edge (left in RTL) above the nav bar','M3 dialogs (28dp corners) for confirms; snackbars bottom, above FAB','Pill-shaped buttons; outlined text fields; segmented buttons','System back gesture; Noto Sans Arabic is the system Arabic fallback'],ar:[]},
 ios:{en:['iOS status bar with Dynamic Island','Large title that collapses on scroll; text "Back" button with chevron (flips in RTL)','Translucent tab bar; tab bar never hidden in hierarchy','Primary action = sticky button; confirmations = alert / action sheet; forms in sheets with grabber','Swipe actions on list rows (approve / reject, call)','Native build uses SF Arabic / SF Pro; prototype uses bundled fonts'],ar:[]}
};
function viewerHtml(){
  const sc=SC[S.screen];
  const groups=Object.entries(ROLES).map(([k,r])=>{const ids=ORDER.filter(i=>SC[i].role===k);return `<div class="vgroup"><h3>${r.en} · <span dir="rtl">${r.ar}</span> <small>(${ids.length})</small></h3>${ids.map(i=>`<a href="#/${i}" class="${i===S.screen?'on':''}" data-vgo="${i}"><span>${SC[i].en}</span><small>${SC[i].code||''}</small></a>`).join('')}</div>`}).join('');
  const seg=(k,opts)=>`<div class="seg">${opts.map(([v,l])=>`<button class="${S[k]===v?'on':''}" data-vset="${k}:${v}">${l}</button>`).join('')}</div>`;
  const notes=(sc.notes||[]);
  return `<aside class="vpanel"><h1>MENAFoods · Direction B</h1><div class="sub">Smart Basket / Guided Assistant — clickable prototype<br><span class="badge-sample">بيانات تجريبية · Sample data only</span></div>
  <div class="ctl"><label class="t">Language (default from navigator.language)</label>${seg('lang',[['ar','العربية RTL'],['en','English LTR']])}<div class="xs" style="color:#CDB89C;margin-top:4px">Source: ${S.langSrc}. <a href="#" data-vreset style="color:#F3C574">Reset to device</a></div></div>
  <div class="ctl"><label class="t">Platform</label>${seg('plat',[['pwa','PWA'],['android','Android M3'],['ios','iOS HIG']])}</div>
  <div class="ctl"><label class="t">Viewport</label>${seg('view',[['mobile','Mobile 390'],['desktop','Desktop 1280']])}</div>
  <div class="ctl"><label class="t">State</label>${seg('state',STATES.map(([v,l])=>[v,l]))}</div>
  ${groups}</aside>`;
}
function notesHtml(){
  const sc=SC[S.screen];const pn=PLAT_NOTES[S.plat].en;
  return `<aside class="vnotes"><h2>${sc.en} <span class="muted" dir="rtl" style="font-weight:400">· ${sc.ar}</span></h2><div class="xs muted">Role: ${ROLES[sc.role].en} · id <code>${sc.id}</code></div>
  ${sc.notes?`<h4>What this screen does</h4><ul>${sc.notes.map(n=>`<li>${n}</li>`).join('')}</ul>`:''}
  <h4>States covered</h4><ul><li>Default, Empty, Loading (skeleton), Error (retry + ref, input kept), Offline (cached copy + queued actions), No access (request access).</li>${sc.stateNotes?`<li>${sc.stateNotes}</li>`:''}</ul>
  <h4>${{pwa:'PWA',android:'Android (Material 3)',ios:'iOS (HIG)'}[S.plat]} deltas</h4><ul>${pn.map(n=>`<li>${n}</li>`).join('')}</ul>
  <h4>Bilingual rules on this screen</h4><ul><li>Western digits 0–9 in both languages; riyal sign (U+20C1, bundled SVG) left of the number, never mirrored.</li><li>Prices excl. VAT; VAT 15% shown at checkout/invoices.</li><li>Gregorian dates first, Hijri (Umm al-Qura) secondary.</li><li>SKUs, phones, IBAN, CR/VAT numbers in LTR isolates; names use &lt;bdi&gt;.</li></ul></aside>`;
}
function render(){
  const v=document.getElementById('viewer');
  v.setAttribute('data-ui-dir',S.lang==='ar'?'rtl':'ltr');
  const dev=S.view==='desktop'?'desktop':S.plat;
  v.innerHTML=viewerHtml()+`<section class="stage"><div class="device ${dev} ${S.plat}">${S.view==='desktop'?`<div class="browserbar">● ● ● <span class="url">app.menafoods.example/${S.screen.replace('.','/')} — PWA (prototype, not deployed)</span></div>`:''}<div class="screen" id="screen">${renderApp()}</div></div></section>`+notesHtml();
  isolateRanges(document.getElementById('screen'));
  const a=v.querySelector('.vgroup a.on'); if(a&&!S.shot&&!S._scrolled){a.scrollIntoView({block:'center'});S._scrolled=true}
  setHash();
}
function toast(en,ar){S.toast=(S.state==='offline'?L('Queued: ','في الانتظار: '):'')+L(en,ar);render();clearTimeout(S._tt);S._tt=setTimeout(()=>{S.toast=null;render()},3200)}
function act(a){
  for(const part of a.split('|')){
    const [k,...r]=part.split(':');const v=r.join(':');
    if(k==='go'){S.screen=v;S.role=SC[v].role;S.overlay=null;S.step=0;if(S.state!=='offline')S.state='default';document.getElementById('screen')&&0}
    else if(k==='step'){S.step=Math.max(0,S.step+(+v));}
    else if(k==='stepto'){S.step=+v}
    else if(k==='t'){const [en,ar]=v.split('~');S.overlay=null;toast(en,ar||en);return}
    else if(k==='ov'){S.overlay=v}
    else if(k==='close'){S.overlay=null;S.toast=null}
    else if(k==='lang'){S.lang=S.lang==='ar'?'en':'ar';localStorage.setItem('mf.lang',S.lang);S.langSrc='saved override'}
    else if(k==='state'){S.state=v}
    else if(k==='ui'){S.ui[v]=!S.ui[v]}
    else if(k==='plat'){S.plat=v}
  }
  render();
}
document.addEventListener('click',e=>{
  const q=e.target.closest('[data-q]'); if(q){const id=q.dataset.q;const d=+q.dataset.d;const cur=S.qty[id]??+(q.parentElement.querySelector('span').textContent);S.qty[id]=Math.max(0,cur+d);render();return}
  const vs=e.target.closest('[data-vset]'); if(vs){const [k,v]=vs.dataset.vset.split(':');S[k]=v;if(k==='lang'){localStorage.setItem('mf.lang',v);S.langSrc='saved override'}S.overlay=null;render();return}
  const vg=e.target.closest('[data-vgo]'); if(vg){e.preventDefault();S.screen=vg.dataset.vgo;S.role=SC[S.screen].role;S.step=0;S.overlay=null;render();return}
  if(e.target.closest('[data-vreset]')){e.preventDefault();localStorage.removeItem('mf.lang');const d=detectLang();S.lang=d.lang;S.langSrc=d.src;render();return}
  const sw=e.target.closest('[data-swipe]'); if(sw&&S.plat==='ios'){sw.classList.toggle('revealed');return}
  const el=e.target.closest('[data-act]'); if(el&&el.dataset.act){e.preventDefault();act(el.dataset.act)}
});
function boot(){const d=detectLang();S.lang=d.lang;S.langSrc=d.src;parseHash();render();window.__ready=true}
window.addEventListener('DOMContentLoaded',()=>{document.fonts&&document.fonts.ready.then(boot)||boot()});

/* Bidi guard: numeric ranges like 7–10 or 1–30 must not reorder inside RTL text → wrap in LTR isolates. */
function isolateRanges(root){
  if(!root) return; const re=/\d[\d,.]*\s?[–-]\s?\d[\d,.]*(\s?%)?/g;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); const hits=[];
  while(w.nextNode()){const n=w.currentNode; if(re.test(n.nodeValue)&&!n.parentElement.closest('.ltr,.money,svg,input,[dir=ltr]')) hits.push(n); re.lastIndex=0;}
  for(const n of hits){const span=document.createElement('span'); span.innerHTML=n.nodeValue.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])).replace(re,m=>`<span class="ltr">${m}</span>`); n.replaceWith(...span.childNodes);}
}
