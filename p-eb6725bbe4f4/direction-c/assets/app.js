/* MENAFoods Direction C — app runtime (routing, platform/lang, states, interactions). Prototype only. */
const ROLES = {
 auth:{en:'Auth & access',ar:'الدخول والصلاحيات',nav:[]},
 customer:{en:'Customer / buyer',ar:'العميل / المشتري',nav:[['hub','home','Today','اليوم','b-hub',2],['catalog','grid','Catalog','الكتالوج','b-catalog'],['orders','box','Orders','الطلبات','b-orders'],['finance','file','Finance','المالية','b-finance',1],['more','user','Account','الحساب','b-profile']],extra:[]},
 sales:{en:'Salesperson',ar:'المندوب',nav:[['hub','inbox','My day','يومي','s-hub',5],['customers','users','Customers','العملاء','s-customers'],['orders','cart','Order','طلب','s-order'],['targets','target','Targets','الأهداف','s-targets']],extra:[]},
 van:{en:'Sales + delivery (van)',ar:'مبيعات وتوصيل (شاحنة)',nav:[['hub','route','Route','المسار','v-hub'],['stock','box','Van stock','المخزون','v-stock'],['sell','cart','Sell','بيع','v-sale'],['collect','cash','Collect','تحصيل','v-collect'],['sync','sync','Sync','مزامنة','d-sync']],extra:['d-sync']},
 driver:{en:'Delivery driver',ar:'السائق',nav:[['hub','route','Route','المسار','d-hub'],['stop','pin','Stop','المحطة','d-stop'],['sync','sync','Sync','مزامنة','d-sync',3]],extra:[]},
 store:{en:'Storekeeper',ar:'أمين المستودع',nav:[['hub','inbox','Queue','المهام','k-hub',3],['pick','scan','Pick','تجهيز','k-pick'],['dispatch','truck','Dispatch','تسليم','k-dispatch'],['receive','warehouse','Receive','استلام','k-receive']],extra:[]},
 accountant:{en:'Accountant',ar:'المحاسب',nav:[['hub','inbox','Hub','المهام','a-hub',6],['credit','shield','Credit','الائتمان','a-credit',2],['aging','chart','Aging','الأعمار','a-aging'],['collect','cash','Collect','التحصيل','a-collect'],['more','more','More','المزيد','a-statements']],extra:['c360']},
 admin:{en:'Admin / manager',ar:'المسؤول / المدير',nav:[['hub','inbox','Hub','المهام','m-hub',1],['approvals','shield','Approvals','الاعتمادات','m-credit',1],['users','users','Users','المستخدمون','m-users'],['rules','sliders','Rules','القواعد','m-rules'],['more','more','More','المزيد','m-settings']],extra:['c360','a-zoho']},
};
const byId = id => SCREENS.find(s=>s.id===id);
const screensFor = r => SCREENS.filter(s=>s.role===r).map(s=>s.id).concat(ROLES[r].extra||[]).concat(r==='sales'?[]:[]);
const OFFQ = () => ({customer:[L('Cart changes (3 items)','تعديلات السلة (3 أصناف)')],sales:[L('Visit note · Habba Coffee','ملاحظة زيارة · مقهى حبة بن'),L('Order draft · Al-Nada','مسودة طلب · الندى')],van:[L('Invoice INV-S-V0731','الفاتورة INV-S-V0731'),L('Receipt RC-S-2207','الإيصال RC-S-2207')],driver:[L('POD · stop 4','إثبات · المحطة 4'),L('Return · chicken carton','مرتجع · كرتون دجاج')],store:[L('Pick confirmations (4 lines)','تأكيدات تجهيز (4 أسطر)')],accountant:[L('Hold decision','قرار إيقاف')],admin:[L('Role change draft','مسودة تغيير صلاحية')],auth:[]});

function parseHash(){ const h=new URLSearchParams(location.hash.slice(1)); return Object.fromEntries(h.entries()); }
function initLang(h){
  if(h.l==='ar'||h.l==='en'){ S.lang=h.l; try{localStorage.setItem('mf.lang',h.l)}catch(e){} return; }
  let saved=null; try{saved=localStorage.getItem('mf.lang')}catch(e){}
  const dev=((navigator.languages&&navigator.languages[0])||navigator.language||'en').toLowerCase();
  S.lang = saved || (dev.startsWith('ar')?'ar':'en');   // saved override beats device language
}
function setLang(l){ if(l==='auto'){ try{localStorage.removeItem('mf.lang')}catch(e){}; S.lang=(navigator.language||'en').toLowerCase().startsWith('ar')?'ar':'en'; } else { S.lang=l; try{localStorage.setItem('mf.lang',l)}catch(e){} } syncHash(); render(); }
function syncHash(){ const p=new URLSearchParams({r:S.role,s:S.screen,st:S.state,v:S.variant||'',l:S.lang,p:S.plat}); if(S.shot)p.set('shot','1'); history.replaceState(null,'','#'+p.toString()); try{parent.postMessage({mf:1,r:S.role,s:S.screen,st:S.state,v:S.variant||'',l:S.lang,p:S.plat},'*')}catch(e){} }
function go(target){ const [id,v]=target.split('?'); const sc=byId(id); if(!sc) return; if(!screensFor(S.role).includes(id)) S.role=sc.role; S.screen=id; S.variant=v||null; S.state='default'; syncHash(); render(); window.scrollTo(0,0); }

function skeleton(kind){ const b=(h,w='100%')=>`<div class="sk" style="height:${h}px;width:${w}"></div>`;
  if(kind==='dash') return `${b(26,'60%')}${b(14,'40%')}<div class="kpis">${b(78)}${b(78)}${b(78)}${b(78)}</div>${b(18,'30%')}${[1,2,3].map(()=>b(84)).join('')}`;
  if(kind==='form') return `${b(8)}${[1,2,3,4].map(()=>`${b(12,'30%')}${b(46)}`).join('')}${b(52)}`;
  if(kind==='detail') return `${b(110)}${b(60)}${b(18,'30%')}${b(160)}${b(52)}`;
  return `${b(44)}${b(30,'70%')}${[1,2,3,4,5,6].map(()=>`<div class="row">${b(48,'48px')}<div class="grow stack">${b(14,'70%')}${b(12,'45%')}</div></div>`).join('')}`; }
function stateBlock(tone, icon, t, b, actions){ return `<div class="state tone-${tone}"><div class="art">${ic(icon)}</div><h2>${t}</h2><p>${b}</p>${actions||''}</div>`; }

function body(sc){
  const st=S.state;
  if(st==='loading') return `<div aria-busy="true" aria-label="${L('Loading','جارٍ التحميل')}" class="stack" style="gap:14px">${skeleton(sc.kind)}</div>`;
  if(st==='empty'){ const e=sc.empty||['Nothing here yet','لا يوجد شيء بعد','When there’s something to do, it will show up here.','عندما توجد مهام ستظهر هنا.'];
    return stateBlock('hold','inbox',L(e[0],e[1]),L(e[2],e[3]),e[4]?btn(L(e[4],e[5]),''):''); }
  if(st==='error'){ const e=sc.error||['Something went wrong','حدث خطأ','We couldn’t load this screen. Your work is safe — try again.','تعذّر تحميل هذه الشاشة. عملك محفوظ — حاول مرة أخرى.'];
    return stateBlock('bad','alert',L(e[0],e[1]),L(e[2],e[3]),`<div class="row">${btn(ic('refresh','sm')+L('Try again','أعد المحاولة'),'','data-act="retry"')}${btn(L('Contact support','تواصل مع الدعم'),'sec')}</div><p class="tiny muted">${L('Error ref','مرجع الخطأ')} ${ltr('ERR-S-7F21')}</p>`); }
  if(st==='denied') return stateBlock('hold','lock',L('You don’t have access to this','ليست لديك صلاحية لهذه الشاشة'),L('Your role ('+ROLES[S.role].en+') can’t open this. Ask your owner or admin to grant it.','دورك ('+ROLES[S.role].ar+') لا يسمح بفتحها. اطلب من المالك أو المسؤول منحك الصلاحية.'),btn(L('Request access','اطلب الصلاحية'),'sec','data-act="send"'));
  let html = sc.render(S.variant);
  if(st==='offline'){ const q=OFFQ()[S.role]||[]; html = (q.length?banner('off','wifioff',`<b>${L('You’re offline — showing data saved at 14:02','أنت دون اتصال — نعرض بيانات محفوظة 14:02')}</b><br>${L('Queued to sync','بانتظار المزامنة')}: ${q.join(' · ')}`):banner('off','wifioff',`<b>${L('You’re offline','أنت دون اتصال')}</b> — ${L('reconnect to continue.','أعد الاتصال للمتابعة.')}`)) + html; }
  return html;
}
function navRoot(){ const r=ROLES[S.role]; const sc=byId(S.screen); return r.nav.find(n=>n[4]===S.screen) || r.nav.find(n=>n[0]===sc.nav) || r.nav[0]; }
function render(){
  const sc=byId(S.screen); const role=ROLES[S.role];
  document.documentElement.lang=S.lang; document.documentElement.dir=S.lang==='ar'?'rtl':'ltr';
  document.documentElement.className=`plat-${S.plat}`;
  document.title=`MENAFoods · ${L(sc.title[0],sc.title[1])} · Direction C`;
  const active=navRoot(); const isRoot=role.nav.some(n=>n[4]===S.screen);
  const back = (!isRoot && (sc.back || (active&&active[4]))) || '';
  const navBtns = role.nav.map(n=>`<button class="${active&&active[0]===n[0]?'on':''}" data-go="${n[4]}" aria-label="${L(n[2],n[3])}">${S.plat==='android'?`<span class="pill">${ic(n[1])}</span>`:ic(n[1])}<span>${L(n[2],n[3])}</span>${n[5]?`<span class="badge">${n[5]}</span>`:''}</button>`).join('');
  const fab = sc.fab ? (S.plat==='android'?`<button class="fab" ${sc.fab[3]?`data-go="${sc.fab[3]}"`:'data-act="save"'}>${ic(sc.fab[0])}${L(sc.fab[1],sc.fab[2])}</button>`:'') : '';
  const iosTrail = sc.fab && S.plat==='ios' ? `<button class="iconbtn" style="color:var(--brand)" ${sc.fab[3]?`data-go="${sc.fab[3]}"`:''} aria-label="${L(sc.fab[1],sc.fab[2])}">${ic(sc.fab[0])}</button>` : '';
  const notifGo = S.role==='customer'?'b-notifs':(role.nav[0]||[])[4]||'';
  const title=L(sc.title[0],sc.title[1]);
  document.getElementById('root').innerHTML = `<div class="app">
   ${role.nav.length?`<nav class="sidenav" aria-label="${L('Main','الرئيسية')}"><div class="brand"><div class="logo" style="background:var(--brand);width:30px;height:30px;border-radius:8px;display:grid;place-items:center;font-size:12px">MF</div>MENAFoods<span class="tiny" style="opacity:.6">${L(role.en,role.ar)}</span></div>${role.nav.map(n=>`<button class="${active&&active[0]===n[0]?'on':''}" data-go="${n[4]}">${ic(n[1])}${L(n[2],n[3])}${n[5]?`<span class="badge">${n[5]}</span>`:''}</button>`).join('')}${S.role==='sales'||S.role==='accountant'||S.role==='admin'?`<button data-go="c360">${ic('user')}${L('Customer 360','ملف العميل 360')}</button>`:''}<div class="foot">${L('Sample data · Direction C prototype','بيانات تجريبية · نموذج الاتجاه C')}</div></nav>`:''}
   <div class="main">
    <div class="sample-ribbon">${L('Sample data — prototype, not real prices or stock','بيانات تجريبية — نموذج أولي، ليست أسعاراً أو مخزوناً حقيقياً')}</div>
    <header class="topbar">${back?`<button class="iconbtn" data-go="${back}" aria-label="${L('Back','رجوع')}">${ic(S.plat==='ios'?'back':'back')}</button>`:(role.nav.length?'':'<div class="logo">MF</div>')}
     <div class="title">${S.plat==='ios'&&!back&&role.nav.length?'':title}</div>
     ${iosTrail}<button class="langbtn" data-act="lang-toggle" aria-label="Language">${S.lang==='ar'?'EN':'ع'}</button>
     ${role.nav.length?`<button class="iconbtn" data-go="${notifGo}" aria-label="${L('Notifications','الإشعارات')}">${ic('bell')}<span class="dot">3</span></button>`:''}</header>
    ${S.state==='offline'?`<div class="offbar">${ic('wifioff','sm')}${L('Offline · changes will sync automatically','دون اتصال · ستتم مزامنة التغييرات تلقائياً')}<button data-act="retry">${L('Retry','أعد')}</button></div>`:''}
    <main class="content" id="content">${S.plat==='ios'?`<h1 class="largetitle">${title}</h1>`:''}${body(sc)}</main>
    ${role.nav.length?`<nav class="bottomnav">${navBtns}</nav>`:''}${S.state==='default'||S.state==='offline'?fab:''}
   </div></div>`;
}
/* ---------- Overlays ---------- */
function toast(msg, undo=true){ document.querySelectorAll('.toast').forEach(t=>t.remove()); const t=document.createElement('div'); t.className='toast'; t.innerHTML=`${ic('check','sm')}<span>${msg}</span>${undo?`<button>${L('Undo','تراجع')}</button>`:''}`; document.body.appendChild(t); setTimeout(()=>t.remove(),3800); }
function confirmSheet(kind){
  const M={approve:[L('Approve?','تأكيد الاعتماد؟'),L('This moves it to the next step and notifies everyone involved.','ينقله للخطوة التالية ويُبلغ جميع المعنيين.'),L('Approve','اعتماد'),''],
   reject:[L('Reject?','تأكيد الرفض؟'),L('Pick a reason — it’s shared respectfully with the requester.','اختر سبباً — يُشارك بلطف مع مقدم الطلب.'),L('Reject','رفض'),'danger'],
   return:[L('Return for info?','إعادة لطلب معلومات؟'),L('Say exactly what’s missing.','حدّد بدقة ما الناقص.'),L('Return','إعادة'),'warn'],
   hold:[L('Put account on hold?','إيقاف الحساب؟'),L('Customer can still order on cash. Reason is shown to them.','يستطيع العميل الطلب نقداً. يظهر له السبب.'),L('Hold','إيقاف'),'danger'],
   release:[L('Release hold?','الإفراج عن الحساب؟'),L('Credit ordering resumes immediately.','يُستأنف الطلب الآجل فوراً.'),L('Release','إفراج'),'']}[kind];
  const s=document.createElement('div'); s.className='scrim'; s.innerHTML=`<div class="sheet" role="dialog" aria-modal="true"><span class="grab"></span><h3>${M[0]}</h3><p class="muted" style="margin:0">${M[1]}</p>${kind!=='approve'&&kind!=='release'?filters([[L('Missing document','مستند ناقص')],[L('Over policy','خارج السياسة')],[L('Other','أخرى')]]):''}${field(L('Comment','تعليق'),'')}<div class="grid2">${btn(L('Cancel','إلغاء'),'sec','data-close')}${btn(M[2],M[3],'data-done')}</div></div>`;
  document.body.appendChild(s);
  s.addEventListener('click',e=>{ if(e.target===s||e.target.closest('[data-close]')) s.remove(); if(e.target.closest('[data-done]')){ s.remove(); toast(S.state==='offline'?L('Saved offline — will sync','حُفظ دون اتصال — ستتم المزامنة'):L('Done · everyone notified','تم · أُبلغ الجميع')); }});
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-act]'); const g=e.target.closest('[data-go]');
  if(a){ e.preventDefault(); e.stopPropagation(); const k=a.dataset.act;
    if(k==='lang-toggle') return setLang(S.lang==='ar'?'en':'ar');
    if(k==='lang-ar') return setLang('ar'); if(k==='lang-en') return setLang('en'); if(k==='lang-auto') return setLang('auto');
    if(['approve','reject','return','hold','release'].includes(k)) return confirmSheet(k);
    if(k==='retry'){ S.state='loading'; render(); setTimeout(()=>{S.state='default'; syncHash(); render();},700); return; }
    const msg={add:L('Added to cart','أُضيف للسلة'),submit:L('Sent','تم الإرسال'),confirm:L('Confirmed','تم التأكيد'),save:L('Saved','تم الحفظ'),deliver:L('Delivered · POD saved','تم التسليم · حُفظ الإثبات'),send:L('Sent on WhatsApp','أُرسل عبر واتساب')}[k]||L('Done','تم');
    return toast(S.state==='offline'?L('Queued offline · ','في الانتظار · ')+msg:msg); }
  const q=e.target.closest('[data-q]'); if(q){ e.stopPropagation(); const sp=q.parentElement.querySelector('span'); sp.textContent=Math.max(0,(+sp.textContent||0)+(+q.dataset.q)); return; }
  const f=e.target.closest('[data-filter],[data-tab],[data-seg]'); if(f){ [...f.parentElement.children].forEach(c=>c.classList.remove('on')); f.classList.add('on'); return; }
  if(g){ e.preventDefault(); go(g.dataset.go); }
});
function applyHash(){ const h=parseHash(); initLang(h); if(h.p) S.plat=h.p; if(h.r&&ROLES[h.r]) S.role=h.r; if(h.s&&byId(h.s)) S.screen=h.s; else S.screen=screensFor(S.role)[0]; S.state=h.st||'default'; S.variant=h.v||null; S.shot=!!h.shot; render(); }
window.addEventListener('hashchange',applyHash);
setInterval(()=>{ document.querySelectorAll('[data-sla]').forEach(el=>{}); },60000);
applyHash();
