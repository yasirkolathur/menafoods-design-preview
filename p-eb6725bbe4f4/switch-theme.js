/* MENAFoods design preview · "Switch theme / تغيير النمط" control. SAMPLE DATA ONLY.
   One persistent control on every screen: opens a theme picker that keeps the current
   screen (or the closest module) and the current language, lists the modules of the
   current theme, and links back to the theme selection page. No network calls. */
(function(){
'use strict';
if(window.__mfSwitch||window.top!==window) return; window.__mfSwitch=true;
const me=document.currentScript&&document.currentScript.src||'';
const BASE=me?me.replace(/[^/]*$/,''):location.href.replace(/p-eb6725bbe4f4\/.*$/,'p-eb6725bbe4f4/');
const rel=location.href.split(/[?#]/)[0].slice(BASE.length); // e.g. direction-b/seller.html
const parts=rel.split('/'); const FOLDER=parts[0]||''; const SUB=parts.length>2?parts[1]:''; let PAGE=parts[parts.length-1]||'index.html';
const THEME=SUB==='concepts'?'v3-concepts':FOLDER;
const A_IDS='auth.signin auth.otp auth.picker auth.lang b.home b.catalog b.product b.cart b.checkout b.submitted b.approvalReq b.approverInbox b.orders b.orderDetail b.finance b.creditApp b.creditStatus b.branches b.notifications b.profile s.customers s.visit s.order s.suggestions s.creditReview s.targets v.route v.stock v.sale v.collect v.pod d.route d.stop d.pod d.failed d.returns d.sync k.picklist k.pick k.shortage k.dispatch k.receiving a.approvals a.zoho a.aging a.holds a.collections a.statements m.approvals m.users m.rules m.catalog m.settings m.audit c.360'.split(' ');
const LIVE={login:'app.login',home:'b.home',catalog:'b.catalog',cart:'b.cart',orders:'b.orders',credit:'b.credit',sales:'s.today',van:'v.route',driver:'d.route',store:'k.lists',acct:'a.inbox',admin:'ad.overview',rewards:'re.home',hub:'bh.home',cashbook:'cb.today',care:'cc.home',drive:'set.drive'};
const AM={login:'auth.signin',home:'b.home',catalog:'b.catalog',cart:'b.cart',orders:'b.orders',credit:'b.creditStatus',sales:'s.customers',van:'v.route',driver:'d.route',store:'k.picklist',acct:'a.approvals',admin:'m.approvals'};
const LROLE={sales:'sales',van:'van',driver:'driver',store:'store',acct:'acct',admin:'admin',cashbook:'cashier',home:'owner',catalog:'owner',cart:'owner',orders:'owner',credit:'owner',rewards:'owner',hub:'owner'};
const SELLER={seller:'s.welcome',erp:'s.conn',sadmin:'a.sellers'};
const TH=[
 {id:'redesign-v3',g:'t',e:'live',n:['Calm Commerce · v3','التجارة الهادئة · الإصدار 3'],tag:['Approved','معتمد'],m:LIVE},
 {id:'theme-souq-modern',g:'t',e:'live',n:['Souq Modern','السوق العصري'],m:LIVE},
 {id:'theme-pro-ops',g:'t',e:'live',n:['Pro Ops','العمليات الاحترافية'],m:LIVE},
 {id:'theme-fresh-market',g:'t',e:'live',seller:1,n:['Fresh Market','السوق الطازج'],m:Object.assign({},LIVE,SELLER)},
 {id:'direction-a-v2',g:'t',e:'a',ids:null,n:['Direction A v2 · Reorder-first','الاتجاه A الإصدار 2'],m:Object.assign({},AM,{rewards:'h.rewards',hub:'h.hub',cashbook:'cb.today'})},
 {id:'direction-a',g:'t',e:'a',ids:A_IDS,n:['Direction A · Quiet Pro','الاتجاه A · احترافي هادئ'],m:AM},
 {id:'direction-b',g:'t',e:'b',seller:1,n:['Direction B · Smart Basket','الاتجاه B · السلة الذكية'],m:Object.assign({login:'a.signin',home:'c.home',catalog:'c.catalog',cart:'c.cart',orders:'c.orders',credit:'c.credit',sales:'s.customers',van:'v.route',driver:'d.route',store:'k.picklist',acct:'a.approvals',admin:'m.approvals',drive:'c.drive'},SELLER)},
 {id:'direction-c',g:'t',e:'c',seller:1,n:['Direction C · Role Command Hubs','الاتجاه C · لوحات قيادة حسب الدور'],m:Object.assign({login:'auth/auth-phone',home:'customer/b-hub',catalog:'customer/b-catalog',cart:'customer/b-cart',orders:'customer/b-orders',credit:'customer/b-credit-status',sales:'sales/s-hub',van:'van/v-hub',driver:'driver/d-hub',store:'store/k-hub',acct:'accountant/a-hub',admin:'admin/m-hub',drive:'customer/b-drive'},SELLER)},
 {id:'business-hub',g:'p',e:'a',n:['Business Hub · mini ERP','مركز الأعمال · ERP مصغر'],m:{hub:'bh.home',cashbook:'bh.daybook',sales:'st.portfolio',admin:'st.admin'}},
 {id:'rewards-earn',g:'p',e:'a',n:['Rewards & Earn','المكافآت والربح'],m:{rewards:'re.home',admin:'rm.overview',sales:'rs.earn'}},
 {id:'v3-concepts',g:'p',e:'k',n:['Calm Commerce · first concept','التجارة الهادئة · المفهوم الأول'],m:{home:'home',cart:'cart',sales:'c360'}}
];
const MOD={drive:['Drive Mode','وضع القيادة'],login:['Sign in','تسجيل الدخول'],home:['Buyer home','الرئيسية للمشتري'],catalog:['Catalogue','المنتجات'],cart:['Cart & checkout','السلة وإتمام الطلب'],orders:['Orders','الطلبات'],credit:['Credit & invoices','الائتمان والفواتير'],sales:['Salesperson','المندوب'],van:['Van sales','البيع بالفان'],driver:['Delivery driver','سائق التوصيل'],store:['Warehouse','المستودع'],acct:['Accountant · credit desk','المحاسب · مكتب الائتمان'],admin:['Admin','الإدارة'],rewards:['Rewards & Earn','المكافآت والربح'],hub:['Business Hub','مركز الأعمال'],cashbook:['Cash book','دفتر النقدية'],care:['Customer care','خدمة العملاء'],seller:['Seller app','تطبيق البائع'],erp:['ERP Connector','موصل ERP'],sadmin:['Marketplace admin','إدارة السوق'],studio:['Design studio · all screens','استوديو التصميم · كل الشاشات']};
const cur=TH.find(t=>t.id===THEME);
const hq=()=>{ const h=location.hash.replace(/^#\/?/,''); const i=h.indexOf('?'); return {id:i<0?h:h.slice(0,i),q:new URLSearchParams(i<0?'':h.slice(i+1))}; };
function lang(){
  const s=new URLSearchParams(location.search), h=hq(), hp=new URLSearchParams(location.hash.slice(1));
  const v=s.get('lang')||h.q.get('lang')||hp.get('l')||h.q.get('l');
  if(v==='ar'||v==='en') return v;
  const d=document.documentElement; if((d.lang||'').startsWith('ar')||d.dir==='rtl') return 'ar';
  const dev=document.querySelector('#viewer .app[dir][lang]')||document.querySelector('.device [dir]'); if(dev&&dev.getAttribute('dir')==='rtl') return 'ar';
  try{ const m=localStorage.getItem('mfp.lang'); if(m==='ar'||m==='en') return m; }catch(e){}
  return 'en';
}
/* where am I: {mod, key} where key is an engine-specific route that can be kept exactly */
function here(){
  if(!cur) return {mod:'home'};
  if(PAGE==='seller.html'){ const id=hq().id||'s.welcome'; return {mod:id.startsWith('s.conn')?'erp':id.startsWith('a.')?'sadmin':'seller',key:location.hash||'#/s.welcome',eng:'mkt'}; }
  if(cur.e==='live'){ const id=hq().id||'b.home'; if(id==='set.drive') return {mod:'drive',key:id,eng:'live',studio:PAGE==='index.html'}; const sc=window.MF&&MF.SCR&&MF.SCR[id]; const a=sc&&sc.a;
    const byA={onboarding:'login',home:'home',search:'catalog',product:'catalog',cart:'cart',reorder:'home',orders:'orders',credit:'credit',invoices:'credit',team:'home',c360:'sales',sales:'sales',van:'van',driver:'driver',store:'store',backoffice:'acct',admin:'admin',rewards:'rewards',hub:'hub',cashbook:'cashbook',care:'care',notifications:'home',settings:'home'};
    return {mod:byA[a]||pre(id),key:id,eng:'live',studio:PAGE==='index.html'}; }
  if(cur.e==='c'){ const p=new URLSearchParams(location.hash.slice(1)); const r=p.get('r')||'customer', s=p.get('s')||'';
    if(s==='b-drive') return {mod:'drive',eng:'c',studio:PAGE==='index.html'};
    const byR={auth:'login',customer:/catalog|product/.test(s)?'catalog':/cart|checkout/.test(s)?'cart':/order/.test(s)?'orders':/credit|finance|nafith/.test(s)?'credit':'home',sales:'sales',van:'van',driver:'driver',store:'store',accountant:'acct',admin:'admin'};
    return {mod:byR[r]||'home',eng:'c',studio:PAGE==='index.html'}; }
  if(cur.e==='k'){ const s=new URLSearchParams(location.hash.slice(1)).get('s')||'home'; return {mod:s==='c360'?'sales':s==='cart'?'cart':'home'}; }
  const id=hq().id; if(id==='c.drive') return {mod:'drive',key:id,eng:'b'}; if(THEME==='business-hub') return {mod:/^bh\.(daybook|open|handover|close)/.test(id)?'cashbook':id==='st.admin'?'admin':id.startsWith('st.')?'sales':'hub'};
  if(THEME==='rewards-earn') return {mod:'rewards'};
  if(cur.e==='b'&&/^a\.(signin|otp|picker|lang)$/.test(id)) return {mod:'login'};
  return {mod:pre(id||'b.home'),key:id,eng:cur.id==='direction-b'?'b':'a'};
}
function pre(id){
  if(/^(auth|app\.login|ob\.)/.test(id)) return 'login';
  if(/^[bc]\.(catalog|product|search|scan|usual)/.test(id)) return 'catalog';
  if(/^[bc]\.(cart|checkout|submitted|approvalReq)/.test(id)) return 'cart';
  if(/^[bc]\.(orders?|orderDetail|track|pod)/.test(id)) return 'orders';
  if(/^[bc]\.(finance|credit|invoice|statement|hold|pay)/.test(id)) return 'credit';
  if(/^(s|c\.360|st)\./.test(id)||id==='c.360') return 'sales';
  if(/^v\./.test(id)) return 'van'; if(/^d\./.test(id)) return 'driver'; if(/^k\./.test(id)) return 'store';
  if(/^a\./.test(id)) return 'acct'; if(/^(h\.rewards|m\.loyalty|re\.|rx\.|rs\.|rm\.)/.test(id)) return 'rewards';
  if(/^(m\.|ad\.)/.test(id)) return 'admin'; if(/^(h\.|bh\.)/.test(id)) return 'hub'; if(/^cb\./.test(id)) return 'cashbook'; if(/^cc\./.test(id)) return 'care';
  return 'home';
}
function url(t,route,L,opt){ // route: engine-specific id for t
  opt=opt||{}; const B=BASE+(t.id==='v3-concepts'?'redesign-v3/concepts/':t.id+'/');
  if(opt.seller) return B+'seller.html?lang='+L+(route.startsWith('#')?route:'#/'+route);
  if(t.e==='live'){ const k=Object.keys(LIVE).find(x=>LIVE[x]===route); const r=!opt.studio&&LROLE[k]?'&role='+LROLE[k]:''; return B+(opt.studio?'index.html':'app.html')+'#/'+route+'?lang='+L+r; }
  if(t.e==='c'){ const [r,s]=route.split('/'); return B+(opt.studio?'index.html':'app.html')+'#r='+r+'&s='+s+'&l='+L; }
  if(t.e==='k') return B+'index.html#s='+route+'&l='+L;
  return B+'index.html#/'+route+'?lang='+L;
}
/* destination in theme t for the current place; returns {href, exact, mod} */
function dest(t,h,L){
  const studio=!!h.studio;
  if(h.eng==='mkt'&&t.seller) return {href:url(t,h.key.replace(/[?&]lang=[a-z]+/,''),L,{seller:1}),exact:1,mod:h.mod};
  if(h.eng==='live'&&t.e==='live') { const q=hq().q; q.set('lang',L); return {href:BASE+t.id+'/'+(studio?'index.html':'app.html')+'#/'+h.key+'?'+q,exact:1,mod:h.mod}; }
  if(h.eng==='c'&&t.e==='c') { const p=new URLSearchParams(location.hash.slice(1)); p.set('l',L); return {href:BASE+t.id+'/'+PAGE+'#'+p,exact:1,mod:h.mod}; }
  if(h.eng==='a'&&t.e==='a'&&h.key&&(t.id==='direction-a'||t.id==='direction-a-v2')&&(!t.ids||t.ids.includes(h.key))) { const q=hq().q; q.set('lang',L); return {href:BASE+t.id+'/index.html#/'+h.key+'?'+q,exact:1,mod:h.mod}; }
  if(h.eng==='b'&&t.id==='direction-b'&&h.key) { const q=hq().q; q.set('lang',L); return {href:BASE+t.id+'/index.html#/'+h.key+'?'+q,exact:1,mod:h.mod}; }
  let mod=h.mod; if(!t.m[mod]) mod=Object.keys(t.m)[0]==='login'?'home':Object.keys(t.m)[0];
  if(!t.m[mod]) mod=Object.keys(t.m)[0];
  const r=t.m[mod]; const sel=!!SELLER[mod];
  return {href:url(t,r,L,{seller:sel&&t.seller,studio:studio&&!sel}),exact:0,mod};
}
function mods(t,L){ // module switcher for theme t
  const out=Object.keys(t.m).map(k=>({k,href:url(t,t.m[k],L,{seller:!!SELLER[k]&&t.seller})}));
  if(t.e==='live'||t.e==='c') out.push({k:'studio',href:url(t,t.m.home,L,{studio:1})});
  return out;
}
/* ---------- UI (shadow DOM so host styles never leak in or out) ---------- */
const host=document.createElement('div'); host.id='mf-switch'; host.setAttribute('data-mf','switch');
const root=host.attachShadow({mode:'open'});
const CSS=`:host{all:initial}
*{box-sizing:border-box}
.fab{position:fixed;z-index:2147483600;inset-inline-start:0;top:calc(50% - 22px);min-height:44px;min-width:44px;display:inline-flex;align-items:center;gap:6px;padding:0 10px 0 8px;border:1px solid #0A6B4F;background:#0A6B4F;color:#fff;font:600 14px/1.2 Inter,"IBM Plex Sans Arabic","Noto Sans Arabic",system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.25);border-radius:0;border-start-end-radius:12px;border-end-end-radius:12px}
.fab.end{inset-inline-start:auto;inset-inline-end:0;border-radius:0;border-start-start-radius:12px;border-end-start-radius:12px}
.fab.desk{border-radius:999px;inset-inline-start:16px;padding:0 16px 0 12px}
.fab.desk.end{inset-inline-start:auto;inset-inline-end:16px}
.fab svg{width:20px;height:20px;flex:none}
.fab .lbl{white-space:nowrap}
@media (max-width:899px){.fab{font-size:12px;max-width:145px}.fab .lbl{white-space:normal}}
.fab:focus-visible,a:focus-visible,button:focus-visible{outline:3px solid #F0B35A;outline-offset:2px}
.scrim{position:fixed;inset:0;z-index:2147483601;background:rgba(10,16,13,.55);display:none}
.dlg{position:fixed;z-index:2147483602;inset-block:0;inset-inline-start:0;width:min(420px,100vw);background:#fff;color:#16201B;display:none;flex-direction:column;font:400 15px/1.45 Inter,"IBM Plex Sans Arabic","Noto Sans Arabic",system-ui,sans-serif;box-shadow:0 0 40px rgba(0,0,0,.3)}
:host([open]) .scrim,:host([open]) .dlg{display:flex}
.hd{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 12px 8px 16px;border-bottom:1px solid #E4E2DA}
h2{margin:0;font-size:19px;font-weight:700}
.x{all:unset;box-sizing:border-box;cursor:pointer;width:44px;height:44px;display:grid;place-items:center;border-radius:12px;color:#16201B}
.x:hover{background:#F0EFEA}
.bd{overflow:auto;padding:8px 16px 24px;flex:1}
.keep{margin:8px 0 4px;padding:10px 12px;border-radius:12px;background:#E6F2EC;font-size:14px}
h3{font-size:13px;font-weight:700;color:#4A5650;margin:18px 0 6px;text-transform:uppercase;letter-spacing:.04em}
:host([dir=rtl]) h3{letter-spacing:0;text-transform:none}
ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
a{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:48px;padding:8px 12px;border:1px solid #E4E2DA;border-radius:12px;color:#16201B;text-decoration:none;background:#fff}
a:hover{border-color:#0A6B4F;background:#F6FBF8}
a[aria-current]{border:2px solid #0A6B4F;background:#E6F2EC}
a .t{font-weight:600}
a small{display:block;color:#4A5650;font-size:12.5px;font-weight:400}
.chk{flex:none;color:#0A6B4F;margin-inline-start:auto}
.pill{flex:none;font-size:12px;font-weight:700;padding:2px 8px;border-radius:999px;background:#0A6B4F;color:#fff}
.pill.c{background:#FBF0DF;color:#7A4B00}
.home{background:#0A6B4F;color:#fff;border-color:#0A6B4F;font-weight:700;margin-top:12px}
.home:hover{background:#085A42}
.mods{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.mods a{min-height:44px;font-size:14px;font-weight:600}
.note{color:#4A5650;font-size:12.5px;margin:16px 0 0}
@media (prefers-color-scheme:dark){.dlg{background:#151B18;color:#EEF2EF}.x{color:#EEF2EF}.x:hover{background:#26302B}.hd{border-color:#26302B}a{background:#151B18;color:#EEF2EF;border-color:#26302B}a:hover{background:#1B2520;border-color:#3DBE8C}a[aria-current]{background:#14291F;border-color:#3DBE8C}.chk{color:#3DBE8C}a small,h3,.note{color:#A3B0A8}.keep{background:#14291F}.home{background:#3DBE8C;color:#0C100E;border-color:#3DBE8C}.home:hover{background:#56CC9C}.pill{background:#3DBE8C;color:#0C100E}.pill.c{background:#2A2010;color:#F0B35A}}
@media (prefers-reduced-motion:no-preference){.dlg{animation:in .16s ease-out}@keyframes in{from{opacity:.4;transform:translateX(-12px)}}:host([dir=rtl]) .dlg{animation-name:inr}@keyframes inr{from{opacity:.4;transform:translateX(12px)}}}`;
const ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4-4-7.4-9-7.4Z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/></svg>';
const CHK='<svg class="chk" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let opener=null, lastPlace='';
function build(){
  const L=lang(), i=L==='ar'?1:0, h=here(); const tr=(en,ar)=>i?ar:en;
  host.setAttribute('dir',i?'rtl':'ltr'); host.setAttribute('lang',L);
  const lab=tr('Switch UI / pages','تغيير الواجهة / الصفحات');
  const item=t=>{ const d=dest(t,h,L); const isCur=t.id===THEME;
    return `<li><a href="${esc(d.href)}"${isCur?' aria-current="page"':''} data-theme="${t.id}"><span><span class="t">${esc(t.n[i])}</span><small>${isCur?tr('You are here','أنت هنا'):d.exact?tr('Same screen','نفس الشاشة'):tr('Closest: ','الأقرب: ')+esc(MOD[d.mod][i])}</small></span>${isCur?CHK:''}${t.tag?`<span class="pill">${esc(t.tag[i])}</span>`:d.exact||isCur?'':`<span class="pill c">${tr('Closest','الأقرب')}</span>`}</a></li>`; };
  const ml=mods(cur||TH[0],L);
  const modName=MOD[h.mod]?MOD[h.mod][i]:'';
  root.innerHTML=`<style>${CSS}</style>
  <button class="fab" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="mfdlg" title="${esc(lab)}">${ICON}<span class="lbl">${esc(lab)}</span></button>
  <div class="scrim" part="scrim"></div>
  <div class="dlg" id="mfdlg" role="dialog" aria-modal="true" aria-labelledby="mfh">
   <div class="hd"><h2 id="mfh">${esc(lab)}</h2><button class="x" type="button" aria-label="${esc(tr('Close','إغلاق'))}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
   <div class="bd">
    <p class="keep">${cur?tr('Keeps your screen and language. Now: ','يحافظ على شاشتك ولغتك. الآن: ')+'<b>'+esc(cur.n[i])+'</b>'+(modName?' · '+esc(modName):''):tr('Pick a theme.','اختر نمطًا.')}</p>
    ${ml.length?`<h3 id="mfm">${esc(tr('Modules in this theme','الوحدات في هذا النمط'))}</h3><div class="mods" role="list" aria-labelledby="mfm">${ml.map(m=>`<a role="listitem" href="${esc(m.href)}" data-mod="${m.k}"${cur&&m.k===h.mod?' aria-current="true"':''}>${esc(MOD[m.k][i])}</a>`).join('')}</div>`:''}
    <h3 id="mft">${esc(tr('Themes','الأنماط'))}</h3><ul aria-labelledby="mft">${TH.filter(t=>t.g==='t').map(item).join('')}</ul>
    <h3 id="mfp">${esc(tr('Phase prototypes','نماذج المراحل'))}</h3><ul aria-labelledby="mfp">${TH.filter(t=>t.g==='p').map(item).join('')}</ul>
    <a class="home" href="${esc(BASE+'index.html?lang='+L)}" data-home="1">${esc(tr('All themes · theme selection page','كل الأنماط · صفحة اختيار النمط'))}</a>
    <p class="note">${esc(tr('Design preview · sample data only.','معاينة تصميم · بيانات تجريبية فقط.'))}</p>
   </div></div>`;
  const fab=root.querySelector('.fab'), dlg=root.querySelector('.dlg');
  if(lastPlace){ const [sd,yy]=lastPlace.split('|'); fab.classList.toggle('end',sd==='end'); fab.classList.toggle('desk',innerWidth>=900); fab.style.top=yy+'px'; fab.style.bottom='auto'; }
  fab.addEventListener('click',()=>open());
  root.querySelector('.x').addEventListener('click',close);
  root.querySelector('.scrim').addEventListener('click',close);
  dlg.addEventListener('keydown',e=>{ e.stopPropagation(); if(e.key==='Escape'){ e.preventDefault(); close(); return; }
    if(e.key==='Tab'){ const f=[...dlg.querySelectorAll('a,button')]; const a=root.activeElement; if(e.shiftKey&&a===f[0]){ e.preventDefault(); f[f.length-1].focus(); } else if(!e.shiftKey&&a===f[f.length-1]){ e.preventDefault(); f[0].focus(); } } });
  dlg.addEventListener('click',e=>{ const a=e.target.closest('a'); if(!a) return; try{ localStorage.setItem('mfp.lang',L); }catch(_){}
    // same document, hash-only change: force reload so the target app re-reads its state
    const u=new URL(a.href); if(u.pathname===location.pathname&&u.search===location.search){ e.preventDefault(); location.hash=u.hash; close(); setTimeout(()=>location.reload(),0); } });
}
function open(){ build(); host.setAttribute('open',''); const fab=root.querySelector('.fab'); fab.setAttribute('aria-expanded','true'); opener=fab;
  hideOthers(true); const c=root.querySelector('a[aria-current="page"]')||root.querySelector('.x'); c&&c.focus(); }
function close(){ host.removeAttribute('open'); const fab=root.querySelector('.fab'); fab&&fab.setAttribute('aria-expanded','false'); hideOthers(false); fab&&fab.focus(); }
function hideOthers(on){ [...document.body.children].forEach(el=>{ if(el===host) return; if(on){ if(!el.hasAttribute('inert')){ el.setAttribute('inert',''); el.dataset.mfInert='1'; } } else if(el.dataset.mfInert){ el.removeAttribute('inert'); delete el.dataset.mfInert; } }); }
/* keep the control off buttons, links, fields and text: try a few docking spots, pick the clearest */
const INTER='a,button,input,select,textarea,label,summary,iframe,[role=button],[role=tab],[role=link],[role=switch],[role=checkbox],[tabindex]:not([tabindex="-1"]),[data-act],[data-go],[onclick]';
function score(x,y,w,h){ let sc=0; for(const fx of [.1,.5,.9]) for(const fy of [.15,.5,.85]){ const px=x+w*fx, py=y+h*fy; if(px<0||py<0||px>=innerWidth||py>=innerHeight){ sc+=50; continue; }
  const el=document.elementFromPoint(px,py); if(!el||el===host) continue; if(el.closest(INTER)) sc+=10; else if([...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) sc+=2; } return sc; }
function place(force){ const f=root.querySelector('.fab'); if(!f||host.hasAttribute('open')||!host.isConnected) return;
  const W=innerWidth,H=innerHeight, desk=W>=900; f.classList.toggle('desk',desk);
  const w=f.offsetWidth||44, h=f.offsetHeight||44, m=desk?16:0;
  const ys=desk?[H-16-h,H*.5-h/2,H*.3,H*.7,72]:[H*.5-h/2,H*.4,H*.6,H*.3,H*.7,H*.22,H*.78];
  const sides=desk?['end','start']:['start','end']; const rtl=host.getAttribute('dir')==='rtl';
  const prevVis=f.style.visibility; f.style.visibility='hidden';
  const at=(side,y)=>{ const left=(side==='start')!==rtl; return score(left?m:W-m-w,y,w,h); };
  let cur=null; if(lastPlace&&!force){ const [sd,yy]=lastPlace.split('|'); cur={side:sd,y:+yy,s:at(sd,+yy)}; }
  let best=null; if(!cur||cur.s>0){ for(const y of ys){ for(const side of sides){ const sc=at(side,Math.round(y)); if(!best||sc<best.s) best={side,y:Math.round(y),s:sc}; if(sc===0) break; } if(best&&best.s===0) break; } }
  f.style.visibility=prevVis;
  const pick=cur&&(!best||cur.s<=best.s)?cur:best; if(!pick) return;
  const key=pick.side+'|'+pick.y; if(key===lastPlace) return; lastPlace=key;
  f.classList.toggle('end',pick.side==='end'); f.style.top=pick.y+'px'; f.style.bottom='auto';
}
window.MFSwitch={open,close,here,place,dest:(id)=>dest(TH.find(t=>t.id===id),here(),lang()),themes:TH.map(t=>t.id),lang};
function mount(){ if(!document.body) return; if(!host.isConnected) document.body.appendChild(host); if(!host.hasAttribute('open')){ lastPlace=''; build(); setTimeout(()=>place(true),60); } }
let tm=0; const re=()=>{ clearTimeout(tm); tm=setTimeout(()=>{ if(!host.hasAttribute('open')) build(); if(!host.isConnected) document.body.appendChild(host); setTimeout(()=>place(false),80); },160); };
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
window.addEventListener('hashchange',re); window.addEventListener('load',re);
// apps that rewrite <body> or switch language without a hash change
new MutationObserver(re).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
const watchBody=()=>{ if(document.body) new MutationObserver(()=>{ if(!host.isConnected) mount(); }).observe(document.body,{childList:true}); };
if(document.body) watchBody(); else document.addEventListener('DOMContentLoaded',watchBody);
setInterval(()=>{ if(document.body&&!host.isConnected) mount(); else place(false); },1500);
window.addEventListener('resize',()=>{ clearTimeout(tm); tm=setTimeout(()=>{ lastPlace=''; place(true); },200); });
})();
