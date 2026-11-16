/* MENAFoods buyer/staff apps — product guards (all modes) + LIVE mode wiring (only when MFAPI.live).
   Loaded after live-wire.js, before MF.boot(). Sample mode behaviour is unchanged except that
   unknown product keys can no longer crash a screen. */
(function(){
'use strict';
const MF=window.MF, L=MF&&MF.L, API=window.MFAPI; if(!MF||!MF.DATA||!L||!API) return;
const {t,H,I}=MF; const ACT=L.ACT;
const LIVE=API.isLive('shop');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nz=(v,f)=>(v==null||v===''||v==='null')?f:v;

/* ---------- 1. guard every product lookup (cart, orders, favourites, lists) ---------- */
const RAW=MF.DATA.P;
const STUB=k=>({en:'Item no longer in the catalogue',ar:'صنف لم يعد في الكتالوج',g:'box',pk:['—','—'],pr:null,u:['',''],cat:'',moq:1,stock:'out',missing:true,id:k});
/* live only: prototype screens that name sample keys (p1…p12, mk_*) or stale ids get a clearly-labelled stub instead of crashing.
   Sample mode keeps the original object untouched, so existence checks behave exactly as before. */
if(LIVE){ MF.DATA.P=new Proxy(RAW,{ get(o,k){ if(typeof k!=='string'||k in o) return o[k]; return /^(p\d+|mk_.+|\d{6,})$/.test(k)?STUB(k):undefined; } }); MF.prod=id=>MF.DATA.P[id]; }
const add0=L.addCart; L.addCart=(sku,d,silent)=>{ const p=RAW[sku]; if(!p){ if(d>0) L.toast?L.toast(t('This item is no longer in the catalogue','هذا الصنف لم يعد في الكتالوج')):0; const c=L.S().cart; if(c&&c[sku]!=null&&d<0){ delete c[sku]; L.save(); L.rr(); } return; } return add0(sku,d,silent); };
/* drop unknown keys from cart / favourites / lists once the catalogue is known */
const prune=()=>{ const S=L.S(); if(!S) return; let ch=false; Object.keys(S.cart||{}).forEach(k=>{ if(!RAW[k]){ delete S.cart[k]; ch=true; } }); if(Array.isArray(S.favs)){ const f=S.favs.filter(k=>RAW[k]); if(f.length!==S.favs.length){ S.favs=f; ch=true; } } (S.lists||[]).forEach(l=>{ if(Array.isArray(l.items)){ const a=l.items.filter(x=>RAW[Array.isArray(x)?x[0]:(x&&x.sku)||x]); if(a.length!==l.items.length){ l.items=a; ch=true; } } else if(l.items&&typeof l.items==='object'){ Object.keys(l.items).forEach(k=>{ if(!RAW[k]){ delete l.items[k]; ch=true; } }); } }); MF.cart=S.cart; if(ch) L.save(); };

/* "Calculated at checkout" whenever VAT or a price is unknown */
L.post.push(c=>{ if(!['b.cart','b.checkout'].includes(c.id)) return; const T=MF.cartTot&&MF.cartTot(); if(!T||!T.unknown||!T.n) return; const m=document.querySelector('#main'); if(!m||m.querySelector('.lv-calc')) return; const p=document.createElement('p'); p.className='why lv-calc'; p.setAttribute('role','note'); p.textContent=T.sub==null?t('Some prices are not available yet — the total is calculated at checkout.','بعض الأسعار غير متاحة بعد — يُحسب الإجمالي عند الدفع.'):t('VAT and total are calculated at checkout.','تُحسب الضريبة والإجمالي عند الدفع.'); m.insertBefore(p,m.firstChild); m.querySelectorAll('.money.na').forEach(x=>{ x.textContent=t('Calculated at checkout','يُحسب عند الدفع'); }); });

if(!LIVE){ return; }

/* =================== LIVE MODE =================== */
document.documentElement.classList.add('mf-live');
/* 2. no sample catalogue, prices, stock or credit figures — ever */
Object.keys(RAW).forEach(k=>delete RAW[k]);
const CATS=MF.DATA.CATS; CATS.length=0;
MF.DATA.credit={limit:null,used:null,avail:null,overdue:null,inv:''};
L.ui.catLoading=true;

const norm=(id,p)=>{ const en=nz(p.en,nz(p.name,id)); const pk=Array.isArray(p.pk)?p.pk:[p.pk,p.pk]; const u=Array.isArray(p.u)?p.u:['',''];
  const pr=(typeof p.pr==='number'&&isFinite(p.pr)&&p.pr>0)?p.pr:null;     /* 0 / missing = price not available, never guessed */
  const st=['in','low','out'].includes(p.stock)?p.stock:'out';            /* unknown stock is never shown as available */
  return Object.assign({},p,{id,en:String(en),ar:String(nz(p.ar,en)),pk:[nz(pk[0],'—'),nz(pk[1],nz(pk[0],'—'))],u:[nz(u[0],''),nz(u[1],nz(u[0],''))],pr,stock:st,g:nz(p.g,'box'),cat:nz(p.cat,'other'),moq:(p.moq>0?p.moq:1)}); };
API.get('/catalog/preview-data').then(j=>{ const d=(j&&j.data&&j.data.P)?j.data:j; if(!d||!d.P) throw new Error('bad shape');
  Object.entries(d.P).forEach(([id,p])=>{ if(p&&typeof p==='object') RAW[id]=norm(id,p); });
  (d.CATS||[]).forEach(c=>{ if(!Array.isArray(c)) return; const nm=Array.isArray(c[2])?c[2]:[c[2],c[2]]; const en=nz(nm[0],String(c[0])); CATS.push([String(c[0]),nz(c[1],'box'),[en,nz(nm[1],en)],c[3]||null]); });
  const known=new Set(CATS.map(c=>c[0])); if(Object.values(RAW).some(p=>!known.has(p.cat))) CATS.push(['other','box',['Other','أخرى'],null]);
  L.ui.catLoading=false; API.catalogCount=Object.keys(RAW).length; prune(); API.markReady('shop'); if(MF.booted) L.rr();
}).catch(e=>{ L.ui.catLoading=false; L.ui.catError=e.status===401?'auth':'err'; API.markReady('shop'); if(MF.booted) L.rr(); });

/* 6. hide demo-only things */
L.sampleTag=()=>'';
ACT.reset=()=>{};  ACT.ff=()=>{};
L.post.push(c=>{
  const f=document.querySelector('.foot'); if(f) f.innerHTML=`${I('info',14)}<span>${t('Development preview · live catalogue from Zoho · some actions are not enabled yet','معاينة التطوير · كتالوج حي من زوهو · بعض الإجراءات غير مفعّلة بعد')}</span>`;
  document.querySelectorAll('[data-act="reset"],[data-act="ff"],[data-act="offline"],.lv-or').forEach(b=>{ const r=b.closest('.row')||b; r.remove(); });
  document.querySelectorAll('.pill.neu').forEach(p=>{ if(/sample|تجريبي/i.test(p.textContent)) p.remove(); });
  if(['b.catalog','b.search','b.home'].includes(c.id)&&(L.ui.catLoading||L.ui.catError)){ const m=document.querySelector('#main'); if(m&&!m.querySelector('.lv-catst')){ const p=document.createElement('p'); p.className='why lv-catst'; p.setAttribute('role','status'); p.textContent=L.ui.catLoading?t('Loading the catalogue…','جارٍ تحميل الكتالوج…'):L.ui.catError==='auth'?t('Sign in to see the catalogue.','سجّل الدخول لعرض الكتالوج.'):t('The catalogue could not be loaded. Pull to refresh or try again later.','تعذّر تحميل الكتالوج. حاول مرة أخرى لاحقًا.'); m.insertBefore(p,m.firstChild); } }
});

/* real sign-in: Catalyst session cookie (from /app/) or OTP through the gateway; no sample accounts, no sample code */
L.ui.meTried=false;
ACT.otp=()=>{ L.clearBad(); const ph=L.val('phone').replace(/\D/g,''); if(!/^5\d{8}$/.test(ph)){ L.bad('phone',t('Enter 9 digits starting with 5','أدخل 9 أرقام تبدأ بـ 5')); L.focusBad(); return; }
  L.ui.busy=true; L.rr();
  API.request('POST','/auth/otp/request',{mobile:'+966'+ph,purpose:'login'}).then(j=>{ const d=(j&&j.data)||j||{}; L.ui.busy=false; L.ui.otp=ph; L.ui.ch=d.challenge_id; L.rr(); setTimeout(()=>{ const o=document.querySelector('[name=code]'); o&&o.focus(); },50); },
   e=>{ L.ui.busy=false; L.rr(); if(!e.notEnabled){ L.bad('phone',(MF.C&&MF.C.ar&&e.message_ar)||e.message||t('Could not send the code. Try again.','تعذّر إرسال الرمز. حاول مرة أخرى.')); L.focusBad(); } }); };
ACT.verify=()=>{ L.clearBad(); const c=L.val('code').replace(/\D/g,''); if(c.length<4){ L.bad('code',t('Enter the code from the SMS','أدخل الرمز من الرسالة')); L.focusBad(); return; }
  let dev=''; try{ dev=sessionStorage.getItem('mf-dev')||(crypto.randomUUID?crypto.randomUUID():String(Date.now())); sessionStorage.setItem('mf-dev',dev); }catch(x){}
  API.request('POST','/auth/otp/verify',{challenge_id:L.ui.ch,code:c,device_id:dev}).then(j=>{ L.ui.otp=null; const tk=j&&(j.token||(j.data&&j.data.token)); if(tk) API.setSession(tk); return API.get('/me').then(signedIn2,()=>signedIn2(j)); },
   e=>{ if(!e.notEnabled){ L.bad('code',(MF.C&&MF.C.ar&&e.message_ar)||e.message||t('That code isn’t right.','الرمز غير صحيح.')); L.focusBad(); } }); };
L.def('app.login',{render:(c)=>{
  if(!L.ui.meTried){ L.ui.meTried=true; API.get('/me').then(signedIn2,e=>{ const lp=e&&e.body&&e.body.error&&e.body.error.details&&e.body.error.details.login_page; if(typeof lp==='string'&&/^\/[^/]/.test(lp)){ L.ui.loginPage=lp; if(MF.booted) L.rr(); } }); }
  let h=`<div class="lv-hero"><span class="lv-logo" aria-hidden="true">${I('store',30)}</span><p class="lv-k">MENAFoods</p><h2 class="disp">${t('Wholesale food for your business','مواد غذائية بالجملة لمنشأتك')}</h2><p>${t('Development preview with the live Zoho catalogue.','معاينة التطوير مع كتالوج زوهو الحي.')}</p><div class="btns lv-mini">${L.ab(c.ar?'English':'العربية','lang',null,{k:'sec',sm:true,ic:'globe'})}</div></div>`;
  h+=H.sec(t('Sign in with your mobile','الدخول برقم الجوال'),`<div class="card pad">${L.ui.otp?L.fld('code',t('Enter the code','أدخل الرمز'),{req:true,ltr:true,im:'numeric',max:6,ac:'one-time-code',hint:t(`Sent by SMS to +966 ${esc(L.ui.otp)}`,`أُرسل برسالة نصية إلى ‎+966 ${esc(L.ui.otp)}`)})+H.btns(L.ab(t('Verify & sign in','تحقق وادخل'),'verify'),L.ab(t('Change number','غيّر الرقم'),'otpback',null,{k:'sec'})):L.fld('phone',t('Mobile number','رقم الجوال'),{req:true,ltr:true,im:'tel',pre:'+966',ph:'5X XXX XXXX',max:12,ac:'tel-national'})+H.btns(L.ab(L.ui.busy?t('Sending…','جارٍ الإرسال…'):t('Send code','أرسل الرمز'),'otp',null,{dis:!!L.ui.busy}))}</div>`,{raw:true});
  h+=H.sec('',`<div class="card grp"><a class="row" href="${esc(L.ui.loginPage||'/app/')}"><span class="ic brand" aria-hidden="true">${I('key',20)}</span><span class="b"><span class="t">${t('Already have a MENAFoods login?','لديك حساب في MENAFoods؟')}</span><span class="s">${t('Sign in on the MENAFoods app page, then come back here','سجّل الدخول من صفحة تطبيق MENAFoods ثم ارجع إلى هنا')}</span></span><span class="chev">${I('chev',18)}</span></a></div>`,{raw:true});
  return h; }});
/* account page: no sample-account switcher, no demo controls */
L.def('app.me',{t:['Account','الحساب'],render:(c)=>{ const me=L.S().me||{}; const nm=nz(c.ar?nz(me.name_ar,me.name):me.name,t('Your account','حسابك'));
  let h=H.sec('',`<div class="card pad acct"><span class="av" aria-hidden="true">${esc(String(nm).slice(0,1))}</span><span style="flex:1;min-width:0"><h2>${esc(nm)}</h2><span class="s">${esc(nz(me.mobile,nz(me.email,'')))}</span></span></div>`,{raw:true});
  const av=(L.S().me&&L.S().me.avail)||[]; if(av.length>1) h+=H.sec(t('Switch role','تبديل الدور'),`<div class="card grp">${av.map(r=>{ const R=MF.ROLES[r]; return `<button type="button" class="row" data-act="lvrole" data-arg="${r}"${r===c.role?' aria-current="true"':''}><span class="b"><span class="t">${tt(R.n)}</span></span>${r===c.role?H.pill('ok',t('Current','الحالي')):`<span class="chev">${I('chev',18)}</span>`}</button>`; }).join('')}</div>`,{raw:true});
  h+=H.sec(t('Language','اللغة'),L.radio('lang',[['ar','العربية'],['en','English']],c.lang,t('Language','اللغة')));
  h+=H.sec(t('Appearance','المظهر'),L.radio('theme',[['light',t('Light','فاتح')],['dark',t('Dark','داكن')]],c.theme,t('Theme','المظهر')));
  return {b:h,dock:L.ab(t('Sign out','تسجيل الخروج'),'logout',null,{k:'sec',ic:'key'})}; }});
const lo0=ACT.logout; ACT.logout=(a,b,e)=>{ API.request('POST','/auth/logout',{}).catch(()=>{}).then(()=>{ try{ API.setSession(null); }catch(x){} lo0?lo0(a,b,e):L.logout(); }); };
/* more: no "switch account / reset" wording */
const more1=MF.SCR.more&&MF.SCR.more.render; if(more1) MF.SCR.more.render=c=>more1(c).replace(t('Switch account, language, theme, offline, reset','تبديل الحساب واللغة والمظهر وعدم الاتصال وإعادة الضبط'),t('Account, language, theme','الحساب واللغة والمظهر'));

/* ---------- roles from /v1/me: business_role (customer side) first, then portal_roles (staff), then roles[] ---------- */
/* customer ADMIN is the branch/account manager ('bm'); BRANCH_MANAGER-style values are accepted too if the gateway ever sends them */
const BIZ={OWNER:'owner',ADMIN:'bm',BRANCH_MANAGER:'bm',MANAGER:'bm',BM:'bm',BUYER:'buyer',FINANCE:'cfin',RECEIVER:'recv',VIEWER:'viewer'};
const STAFF={ADMIN:'admin',ACCOUNTANT:'acct',SALESPERSON:'sales',SALES_DELIVERY:'van',STOREKEEPER:'store',DELIVERY:'driver'};
const BIZ_ORDER=['OWNER','ADMIN','FINANCE','BUYER','RECEIVER','VIEWER'], STAFF_ORDER=['ADMIN','ACCOUNTANT','SALESPERSON','SALES_DELIVERY','STOREKEEPER','DELIVERY'];
const up=v=>String(v==null?'':v).trim().toUpperCase().replace(/[\s-]+/g,'_');
L.rolesFromMe=me=>{ const out=[]; let seller=false;
  const hasNew=me&&(Object.prototype.hasOwnProperty.call(me,'business_role')||Array.isArray(me.portal_roles));
  if(hasNew){ let b=up(me.business_role); if(!b){ const cur=(Array.isArray(me.accounts)?me.accounts:[]).find(x=>x&&x.current); if(cur&&cur.role) b=up(cur.role); }   /* membership role on the current account */ if(b==='SELLER') seller=true; else if(BIZ[b]) out.push(BIZ[b]); else if(b) out.push('viewer');
    const pr=(me.portal_roles||[]).map(up); STAFF_ORDER.forEach(r=>{ if(pr.includes(r)) out.push(STAFF[r]); }); }
  else { const rs=(me&&me.roles||[]).map(up); if(rs.includes('SELLER')) seller=true;
    BIZ_ORDER.forEach(r=>{ if(rs.includes(r)&&!out.includes(BIZ[r])) out.push(BIZ[r]); });          /* ADMIN in roles[] = customer admin, never the staff console */
    STAFF_ORDER.filter(r=>r!=='ADMIN').forEach(r=>{ if(rs.includes(r)) out.push(STAFF[r]); });
    if(!out.length&&rs.some(r=>r&&r!=='SELLER')) out.push('viewer'); }
  return {roles:[...new Set(out)],seller}; };
/* customer-side read-only roles that do not exist in the sample */
const RO=['owner','bm','buyer'];
MF.ROLES.viewer={n:['Customer · view only','العميل · عرض فقط'],grp:'customer',ctx:['',''],nav:[['home','b.home',['Home','الرئيسية']],['grid','b.catalog',['Catalogue','المنتجات']],['box','b.orders',['Orders','الطلبات']],['user','more',['More','المزيد']]]};
MF.ROLES.recv={n:['Customer · receiving','العميل · الاستلام'],grp:'customer',ctx:['',''],nav:[['box','b.orders',['Orders','الطلبات']],['truck','b.track',['Track','التتبع']],['user','more',['More','المزيد']]]};
MF.ROLES.cfin={n:['Customer · finance','العميل · المالية'],grp:'customer',ctx:['',''],nav:[['wallet','b.finance',['Finance','المالية']],['doc','b.invoices',['Invoices','الفواتير']],['box','b.orders',['Orders','الطلبات']],['user','more',['More','المزيد']]]};
const COMMON='more app.me app.login n.center n.prefs set.prefs set.security set.help cc.home cc.topics cc.article cc.chat'.split(' ');
/* finance documents (invoices, payments, statements, credit) are for owner, branch manager and customer finance only — s-money.js FIN='owner bm' + cfin */
const GRANT={viewer:'b.home b.catalog b.search b.product b.orders b.order b.track b.pod b.returns',
  recv:'b.orders b.order b.track b.pod',
  cfin:'b.finance b.invoices b.invoice b.pay b.receipt b.statement b.credit b.hold b.returns b.orders b.order b.track cc.dispute cc.new cc.tickets cc.ticket'};
Object.entries(GRANT).forEach(([r,ids])=>{ ids.split(' ').concat(COMMON).forEach(id=>{ const d=MF.SCR[id]; if(d&&Array.isArray(d.r)&&!d.r.includes(r)) d.r.push(r); }); });
['viewer','recv'].forEach(r=>{});
const add1=L.addCart; L.addCart=(sku,d,silent)=>{ const r=MF.C&&MF.C.role; if(['viewer','recv'].includes(r)&&d>0){ L.toast(t('View-only access · ask your account owner to order','صلاحية عرض فقط · اطلب من مالك الحساب إجراء الطلب')); return; } return add1(sku,d,silent); };
/* names come from /v1/me, never from the sample cast */
const meName=(ar)=>{ const m=L.S().me||{}; const u=m.user||m; return nz(ar?nz(u.name_ar,u.name):u.name,''); };
const acctName=(ar)=>{ const m=L.S().me||{}; const a=m.account||{}; return nz(ar?nz(a.name_ar,a.name):a.name,''); };
L.acc=role=>{ const R=MF.ROLES[role]||MF.ROLES.viewer; return [role,meName(false)||t('Your account','حسابك'),meName(true)||meName(false)||'حسابك',R.n,R.grp]; };
const applyCtx=()=>{ ['owner','bm','buyer','cashier','viewer','recv','cfin'].forEach(r=>{ if(MF.ROLES[r]) MF.ROLES[r].ctx=[acctName(false)||'',acctName(true)||acctName(false)||'']; }); ['sales','van','driver','store','acct','mgr','admin'].forEach(r=>{ if(MF.ROLES[r]) MF.ROLES[r].ctx=['MENAFoods','MENAFoods']; }); };
applyCtx();
const SELLER_URL=()=>/theme-fresh-market\//.test(location.pathname)?'seller.html':'../direction-b/seller.html';
const signedIn2=j=>{ const me=(j&&j.data&&typeof j.data==='object'&&!Array.isArray(j.data))?j.data:(j||{}); const S=L.S(); S.me=me; const R=L.rolesFromMe(me); S.me.avail=R.roles; L.save(); applyCtx();
  if(!R.roles.length&&R.seller){ location.href=SELLER_URL(); return; }
  L.login(R.roles[0]||'viewer'); };
ACT.lvrole=r=>{ const av=(L.S().me&&L.S().me.avail)||[]; if(av.includes(r)) L.login(r); };
/* b.home greeting without a sample name */
L.def('b.home',{t:()=>{ const h=new Date().getHours(); const g=h<12?t('Good morning','صباح الخير'):h<18?t('Good afternoon','مساء الخير'):t('Good evening','مساء الخير'); const n=String(meName(MF.C&&MF.C.ar)||'').split(' ')[0]; return n?g+(MF.C&&MF.C.ar?'، ':', ')+n:g; }});
/* deny screen in core names "The owner (Faisal)" */
/* …and some prototype copy carries a '(sample)' tag — drop it in live mode */
const STRIP=/\s*\((Faisal|فيصل|sample|sample consent|sample rule|simulated|تجريبي|تجريبية|عينة|محاكاة|موافقة تجريبية|قاعدة تجريبية)\)/g;
/* demo-only copy → what is true in the live preview (EN and AR) */
const LIVE_TXT=[
 ['Pay on credit · Net 30','Pay on credit'],['الدفع بالآجل · 30 يومًا','الدفع بالآجل'],
 ['Simulated payment — no card details are collected and nothing is charged.','Card payments are not enabled in the preview yet.'],['دفع محاكى — لا تُجمع بيانات بطاقة ولا يتم خصم شيء.','الدفع بالبطاقة غير مفعّل في المعاينة بعد.'],
 ['Simulated payment — nothing is charged','Not enabled in the preview yet'],['دفع محاكى — لا يتم خصم شيء','غير مفعّل في المعاينة بعد'],
 ['Confirmed when funds arrive (about 30 s in this demo)','Confirmed when funds arrive'],['يتأكد عند وصول المبلغ (حوالي 30 ثانية في العرض)','يتأكد عند وصول المبلغ'],
 ['Marked paid when received (instant in this demo)','Marked paid when received'],['تُعلّم مدفوعة عند الاستلام (فوري في العرض)','تُعلّم مدفوعة عند الاستلام'],
 ['Instant · simulated','Instant'],['فوري · محاكى','فوري'],
 ['PDF download is simulated in this preview','PDF download is not enabled in the preview yet'],['تنزيل PDF محاكى في هذه النسخة','تنزيل PDF غير مفعّل في المعاينة بعد'],
 ['It may have been cleared by a demo reset.',''],['ربما حُذف عند إعادة ضبط العرض.',''],
 ['Done · saved in this demo','Saved'],['تم · محفوظ في هذا العرض','تم الحفظ'],
 ['mada •••• 4242 (sample)','Card'],['مدى •••• 4242 (تجريبية)','بطاقة'],
 ['Card (simulated)','Card'],['بطاقة (محاكاة)','بطاقة'],
 ['Rewards are samples. ',''],['المكافآت تجريبية. ',''],
 ['sent to Huda for approval','sent for approval'],['لهدى للموافقة','للموافقة'],
 ['Credit · Net 30','Credit'],['آجل · 30 يومًا','آجل'],
 ['King Fahd Rd, Riyadh · receiving 6–11 AM','Delivery address and receiving hours from your account'],['طريق الملك فهد، الرياض · الاستلام 6–11 ص','عنوان التوصيل وساعات الاستلام من حسابك']];
const liveTxt=v=>{ let o=v; LIVE_TXT.forEach(([f,r])=>{ if(o.indexOf(f)>-1) o=o.split(f).join(r); }); STRIP.lastIndex=0; o=o.replace(STRIP,''); STRIP.lastIndex=0; return o; };
L.stripSample=root=>{ if(!root) return; const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let n; while((n=w.nextNode())){ const v=n.nodeValue, o=liveTxt(v); if(o!==v) n.nodeValue=o; }
  root.querySelectorAll&&root.querySelectorAll('[aria-label],[title]').forEach(e=>{ ['aria-label','title'].forEach(k=>{ const a=e.getAttribute(k); if(a){ const o=liveTxt(a); if(o!==a) e.setAttribute(k,o); } }); });
  /* demo-only controls */
  root.querySelectorAll&&root.querySelectorAll('button,a').forEach(e=>{ if(/^(Simulate decline|محاكاة رفض|Simulate a scan|محاكاة مسح|Advance status \(demo\)|قدّم الحالة \(عرض\))$/.test((e.textContent||'').trim())) e.remove(); }); };
L.post.push(()=>{ L.stripSample(document.querySelector('#main')); });
/* checkout 'Deliver to' names the signed-in account, not the sample restaurant */
L.post.push(c=>{ if(!c||c.id!=='b.checkout') return; const m=document.querySelector('#main'); if(!m) return; const nm=acctName(!!(MF.C&&MF.C.ar))||t('Your account','حسابك'); const w=document.createTreeWalker(m,NodeFilter.SHOW_TEXT); let n; while((n=w.nextNode())){ if(/Al Wadi Restaurant — Olaya|مطعم الوادي — العليا/.test(n.nodeValue)) n.nodeValue=nm; } });
/* unit unknown → no dangling separator after 'excl. VAT' */
L.post.push(()=>{ document.querySelectorAll('#main .pu').forEach(e=>{ const n=e.querySelector('.num'); if(n&&!n.textContent.trim()){ n.remove(); e.childNodes.forEach(x=>{ if(x.nodeType===3) x.nodeValue=x.nodeValue.replace(/\s*·\s*$/,''); }); } }); });
if(window.MutationObserver) new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(x=>{ if(x.nodeType===1&&x.matches&&x.matches('.lv-sheet,.sheet,[role=dialog]')) L.stripSample(x); }))).observe(document.body||document.documentElement,{childList:true});
{ const toast0=MF.toast; MF.toast=m=>toast0(typeof m==='string'?liveTxt(m):m); }

/* links to screens this role can't open (role matrix in s-*.js / GRANT above) are shown as plain text, not dead ends */
L.post.push(c=>{ const m=document.querySelector('#main'); if(!m||!c) return; m.querySelectorAll('a[href^="#/"]').forEach(a=>{ const id=(a.getAttribute('href').match(/^#\/([^?]+)/)||[])[1]; const d=id&&MF.SCR[id]; if(d&&Array.isArray(d.r)&&!d.r.includes(c.role)){ const sp=document.createElement('div'); sp.className=a.className; sp.innerHTML=a.innerHTML; sp.querySelectorAll('.chev').forEach(x=>x.remove()); a.replaceWith(sp); } }); });

/* product images: gateway image, else a branded initials tile (never a blank box) */
(()=>{ const st=document.createElement('style'); st.textContent='.pt .img:has(.lv-pimg,.lv-ini){overflow:hidden;padding:0}img.lv-pimg{display:block;width:100%;height:100%;min-height:0;object-fit:contain;border-radius:inherit;background:#fff}.thumb:has(.lv-pimg,.lv-ini){padding:0;overflow:hidden}.lv-fb{display:contents}.lv-fb[hidden]{display:none}.lv-ini{display:grid;place-items:center;width:100%;height:100%;min-width:28px;min-height:28px;border-radius:inherit;background:linear-gradient(135deg,color-mix(in srgb,var(--c-brand,#0A6B4F) 16%,#fff),color-mix(in srgb,var(--c-brand,#0A6B4F) 6%,#fff));color:var(--c-brand,#0A6B4F);font-weight:700;letter-spacing:.02em;line-height:1;text-transform:uppercase;user-select:none}.lv-ini[data-s="s"]{font-size:11px}.lv-ini[data-s="m"]{font-size:20px}.lv-ini[data-s="l"]{font-size:40px}'; document.head.appendChild(st); })();
const okImg=u=>{ if(typeof u!=='string'||!u) return null; if(u[0]==='/'&&u[1]!=='/') return u; try{ const x=new URL(u); if(x.origin===location.origin) return x.pathname+x.search; if(/\.catalystserverless\.(com|in|eu)$/.test(x.hostname)&&/\.catalystserverless\.(com|in|eu)$/.test(location.hostname)&&x.hostname===location.hostname) return x.pathname+x.search; }catch(e){} return null; };
const initials=p=>{ const n=String((MF.C&&MF.C.ar?p.ar:p.en)||p.en||'').replace(/\([^)]*\)/g,' ').replace(/[^\p{L}\p{N}\s]/gu,' ').trim().split(/\s+/).filter(Boolean); return (n.slice(0,2).map(w=>[...w][0]).join('')||'MF'); };
const tile=(p,sz)=>`<span class="lv-ini" data-s="${sz>=80?'l':sz>=40?'m':'s'}" role="img" aria-label="${esc(MF.pn?MF.pn(p):p.en)}">${esc(initials(p))}</span>`;
L.pimg=(p,sz)=>{ if(!p) return tile({en:'MF'},sz); const u=okImg(p.img); return u?`<img class="lv-pimg" src="${esc(u)}" alt="" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="lv-fb" hidden>${tile(p,sz)}</span>`:tile(p,sz); };
L.cimg=(c,sz)=>{ const u=c&&okImg(c[3]); return u?`<img class="lv-cimg" src="${esc(u)}" alt="" loading="lazy" decoding="async" width="${sz}" height="${sz}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span hidden>${G(c[1],sz)}</span>`:G(c&&c[1]||'box',sz); };
/* list rows (search, reorder, cart, lists): product image in the thumb, missing catalogue items dropped */
{ const prow0=MF.prow; MF.prow=(id,o)=>{ const p=RAW[id]; if(!p) return ''; const h=prow0(id,o); return h?h.replace(/<span class="thumb">[\s\S]*?<\/span>/,`<span class="thumb">${L.pimg(p,28)}</span>`):h; };
  const pcard0=MF.pcard; MF.pcard=(id,o)=>RAW[id]?pcard0(id,o):''; }

/* Books documents: read-only GETs; an unmapped account or an empty list shows a clear empty state */
L.ui.fin=L.ui.fin||{};
const listOf=j=>Array.isArray(j)?j:(j&&Array.isArray(j.data))?j.data:(j&&j.data&&Array.isArray(j.data.items))?j.data.items:null;
L.loadFin=()=>{ const S=L.S(), role=S.session&&S.session.role; if(!role) return; const can=id=>{ const d=MF.SCR[id]; return d&&Array.isArray(d.r)&&d.r.includes(role); };
  if(L.ui.fin.role===role) return; L.ui.fin={role};
  const get=(path,key,map,ok)=>{ if(!ok) return Promise.resolve(); L.ui.fin[key]='loading';
    return API.request('GET',path,undefined,{quiet:true}).then(j=>{ const a=listOf(j); if(a){ const S2=L.S(); S2[key]=a.map(map).filter(x=>x&&(x.no||x.id)); L.ui.fin[key]='ok'; if(L.store&&L.store.replace) L.store.replace(S2); } else L.ui.fin[key]='none'; },
      e=>{ L.ui.fin[key]=e&&e.status===401?'auth':'none'; }); };
  Promise.all([get(API.paths.invoices,'invoices',nInv,can('b.invoices')||can('b.finance')||can('doc.view')),get(API.paths.payments,'payments',nPay,can('b.finance')||can('b.receipt')||can('b.payments')),get(API.paths.creditNotes,'cns',nCn,can('b.returns')||can('b.creditnotes'))]).then(()=>{ if(MF.booted) L.rr(); }); };
API.on('boot',()=>setTimeout(L.loadFin,0));
{ const lg=L.login; L.login=r=>{ const x=lg(r); setTimeout(L.loadFin,0); return x; }; }
{ const d=MF.SCR['b.invoices']; if(d){ const r0=d.render; d.render=c=>{ const s=L.S(); if(!(s.invoices||[]).length){ const ld=L.ui.fin.invoices==='loading'; return ld?H.empty('doc',t('Loading invoices…','جارٍ تحميل الفواتير…'),''):H.empty('doc',t('No invoices yet','لا توجد فواتير بعد'),t('Invoices from Zoho Books show here once your account is linked and invoiced.','تظهر هنا فواتير Zoho Books بعد ربط حسابك وإصدار الفواتير.')); } return r0(c); }; } }

/* preferences: device-local; sent only when the user changes one (quiet if not enabled in the preview) */
['lang','setlang','settheme'].forEach(k=>{ const f=ACT[k]; if(typeof f==='function') ACT[k]=(...a)=>{ const r=f(...a); try{ API.savePrefs(Object.assign({},L.S().prefs)); }catch(e){} return r; }; });

/* ---------- no simulated time: statuses only change when the gateway says so ---------- */
L.ticks.length=0;
ACT.oadv=()=>{}; ACT.pdf=()=>API.notice();

/* ---------- bootstrap/shop → app state (normalised; nothing invented) ---------- */
const fin=v=>v!=null&&v!==''&&isFinite(v);
const toTs=v=>v==null||v===''?null:typeof v==='number'?v:(Date.parse(v)||null);
const lc=v=>String(v==null?'':v).toLowerCase().replace(/[\s-]+/g,'_');
const lkey=l=>String(nz(l.item_id,nz(l.product_id,nz(l.sku,nz(l.id,'')))));
const OST=raw=>{ const s=lc(raw);
  if(/^(cancel+ed|void|voided)$/.test(s)) return {st:'cancelled',fixed:null};
  if(/^(rejected|declined)$/.test(s)) return {st:'rejected',fixed:null};
  if(/approval/.test(s)) return {st:'approval',fixed:null};
  if(/^(awaiting_payment|payment_pending|pending_payment)$/.test(s)) return {st:'pay',fixed:null};
  if(/^(packed|picked|ready|processing|partially_packed|picking)$/.test(s)) return {st:'ok',fixed:1};
  if(/^(shipped|dispatched|out_for_delivery|partially_shipped|in_transit)$/.test(s)) return {st:'ok',fixed:2};
  if(/^(delivered|fulfilled|completed|closed|invoiced|partially_invoiced)$/.test(s)) return {st:'ok',fixed:3};
  return {st:'ok',fixed:0}; };
const nLines=ls=>(Array.isArray(ls)?ls:[]).map(l=>{ const k=lkey(l); const q=Number(nz(l.qty,nz(l.quantity,0)))||0; const r=nz(l.rate,nz(l.price,l.unit_price)); const a=nz(l.amount,nz(l.item_total,l.total)); const nm=nz(l.name,nz(l.item_name,'')); return {k,q,rate:fin(r)?Number(r):null,amt:fin(a)?Number(a):null,name:[String(nz(nm,(RAW[k]&&RAW[k].en)||'—')),String(nz(l.name_ar,nz(nm,(RAW[k]&&RAW[k].ar)||'—')))]}; });
const nOrder=o=>{ const lines=Array.isArray(o.lines)?o.lines:Array.isArray(o.line_items)?o.line_items:Array.isArray(o.items)?o.items:null; let items={}; const lp={}, ln={}, la={};
  if(lines){ nLines(lines).forEach(l=>{ if(!l.k) return; items[l.k]=(items[l.k]||0)+l.q; if(l.rate!=null) lp[l.k]=l.rate; if(l.amt!=null) la[l.k]=(la[l.k]||0)+l.amt; ln[l.k]=l.name; }); }
  else if(o.items&&typeof o.items==='object') items=Object.assign({},o.items);
  const raw=nz(o.status,o.st); const m=OST(raw); const g=v=>fin(v)?Number(v):null;
  return {id:String(nz(o.id,nz(o.ref,nz(o.salesorder_number,nz(o.order_number,''))))),ts:toTs(nz(o.ts,nz(o.date,nz(o.created_time,o.created_at)))),items,lp,ln,la,gw:true,status:lc(raw),st:m.st,fixed:m.fixed,ns:m.fixed,
    total:g(o.total),sub_total:g(o.sub_total),tax_total:g(o.tax_total),branch:nz(o.branch_name,typeof o.branch==='string'?o.branch:(o.branch&&o.branch.name)||null),pay:nz(o.payment_mode,nz(o.pay,null)),po:nz(o.po,null),inv:nz(o.invoice_number,nz(o.inv,null)),pts:0}; };
const nInv=i=>{ const g=v=>fin(v)?Number(v):null; const total=g(nz(i.total,i.amt)), balance=g(i.balance); const ls=Array.isArray(i.lines)?i.lines:Array.isArray(i.line_items)?i.line_items:null;
  return {no:String(nz(i.no,nz(i.invoice_number,nz(i.id,'')))),order:nz(i.order,nz(i.salesorder_number,null)),d:toTs(nz(i.d,i.date)),due:toTs(nz(i.due,i.due_date)),amt:total,total,balance,paid:fin(i.paid)?Number(i.paid):(total!=null&&balance!=null?Math.round((total-balance)*100)/100:0),cr:fin(i.cr)?Number(i.cr):0,status:lc(i.status),lines:ls?nLines(ls):null,sub_total:g(i.sub_total),tax_total:g(i.tax_total)}; };
const nPay=p=>({id:String(nz(p.id,nz(p.payment_number,''))),ts:toTs(nz(p.ts,p.date)),amt:fin(nz(p.amt,nz(p.amount,p.total)))?Number(nz(p.amt,nz(p.amount,p.total))):null,m:lc(nz(p.m,nz(p.payment_mode,p.method))),ref:nz(p.reference_number,null),inv:(Array.isArray(p.inv)?p.inv:Array.isArray(p.invoices)?p.invoices.map(x=>typeof x==='object'?nz(x.invoice_number,nz(x.no,'')):x):[]).filter(Boolean).map(String)});
const nCn=n=>{ const why=Array.isArray(n.why)?n.why:[nz(n.reason,null),nz(n.reason_ar,null)]; const en=nz(why[0],'Credit note'); return {no:String(nz(n.creditnote_number,nz(n.no,nz(n.number,nz(n.invoice_number,''))))),inv:String(nz(n.inv,nz(n.invoice_number,nz(n.invoice,'')))),amt:fin(nz(n.amt,nz(n.total,n.amount)))?Number(nz(n.amt,nz(n.total,n.amount))):null,ts:toTs(nz(n.ts,n.date)),why:[String(en),String(nz(why[1],'إشعار دائن'))]}; };
API.setTransform('shop',x=>{ if(!x||typeof x!=='object') return null; const cur=L.S(); const base=JSON.parse(JSON.stringify(cur)); const A=v=>Array.isArray(v)?v:[];
  base.ver=2; base.session=cur.session; base.prefs=cur.prefs; base.me=cur.me;
  base.orders=A(x.orders).map(nOrder).filter(o=>o.id); base.invoices=A(x.invoices).map(nInv).filter(i=>i.no); base.payments=A(x.payments).map(nPay).filter(p=>p.id); base.cns=A(nz(x.cns,x.creditnotes||x.credit_notes)).map(nCn);
  const c=x.credit||{}; base.credit={limit:fin(c.limit)?Number(c.limit):null,used:fin(c.used)?Number(c.used):null,available:fin(c.available)?Number(c.available):null,hold:c.hold===true};
  if(x.cart&&typeof x.cart==='object'&&!Array.isArray(x.cart)) base.cart=x.cart; if(Array.isArray(x.favs)) base.favs=x.favs.map(String); if(Array.isArray(x.lists)) base.lists=x.lists;
  if(Array.isArray(x.notifs)) base.notifs=x.notifs.filter(n=>n&&n.txt).map(n=>({id:String(n.id),ts:toTs(n.ts)||Date.now(),ic:nz(n.ic,'bell'),txt:Array.isArray(n.txt)?[String(nz(n.txt[0],'')),String(nz(n.txt[1],nz(n.txt[0],'')))]:[String(n.txt),String(n.txt)],go:n.go||null,read:!!n.read}));
  if(fin(x.points)) base.points=Number(x.points); const OB=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{}; base.par=OB(x.par); base.onhand=OB(x.onhand);
  return base; });
/* order statuses: the screens read o.st / o.fixed, set here from the gateway `status` */
/* 12. a write the preview refuses (501) is rolled back so no phantom order or payment stays on screen */
API.on('rejected',e=>{ if(e.store!=='shop'||!e.restore) return; const S=L.S(); Object.entries(e.restore).forEach(([k,v])=>{ S[k]=v==null?(Array.isArray(S[k])?[]:v):v; }); MF.cart=S.cart; if(L.store&&L.store.replace) L.store.replace(S); if(!MF.booted) return;
  /* if the screen shows the record that was just rolled back, step back to where the action started */
  const tEl=document.querySelector('.toast'); if(tEl){ tEl.classList.remove('on'); tEl.textContent=''; }
  const sid=(location.hash.match(/^#\/([^?]+)/)||[])[1], id=qp('id');
  if(sid==='b.receipt'&&id&&!(S.payments||[]).some(p=>p.id===id)) return L.go('b.pay');
  if(['b.order','b.placed','b.track'].includes(sid)&&id&&!L.ord(id)) return L.go('b.cart');
  L.rr(); });

/* ---------- live screens ---------- */
const {LTR,M,N,G}=MF; const qp=L.qp, dt=L.dt, pn=L.pn, tt=MF.tt;
const ST4=()=>[t('Confirmed','مؤكد'),t('Picked & packed','تم التجهيز'),t('Out for delivery','خرج للتوصيل'),t('Delivered','تم التسليم')];
const lname=(o,k)=>{ const p=RAW[k]; if(p) return MF.pn?MF.pn(p):tt([p.en,p.ar]); return o.ln&&o.ln[k]?tt(o.ln[k]):t('Item','صنف'); };
const PAYM={banktransfer:['Bank transfer','تحويل بنكي'],bank_transfer:['Bank transfer','تحويل بنكي'],transfer:['Bank transfer','تحويل بنكي'],cash:['Cash','نقدًا'],check:['Cheque','شيك'],cheque:['Cheque','شيك'],creditcard:['Credit card','بطاقة ائتمان'],credit_card:['Credit card','بطاقة ائتمان'],card:['Card','بطاقة'],bankremittance:['Bank remittance','حوالة بنكية'],bank_remittance:['Bank remittance','حوالة بنكية'],others:['Other','أخرى'],other:['Other','أخرى'],mada:['mada','مدى'],credit:['On account (credit)','على الحساب (آجل)'],cod:['Cash on delivery','الدفع عند الاستلام']};
const payLabel=m=>{ const k=lc(m); return PAYM[k]?tt(PAYM[k]):'—'; };
L.payLabel=payLabel; L.norm={nInv,nPay,nCn};   /* used by the staff document views (mf-staff-docs.js) */
const stLabel=o=>{ const p=L.stPill(o); return H.pill(p[0],p[1]); };
L.def('b.order',{t:()=>t('Order #','الطلب ‎#')+(qp('id')||''),render:(c)=>{ const o=L.ord(qp('id')||''); if(!o) return H.empty('box',t('Order not found','الطلب غير موجود'),'',H.btns(H.btn(t('All orders','كل الطلبات'),{go:'b.orders'})));
  const T=L.tot(o), g=L.stage(o); let h='';
  if(o.st==='approval') h+=H.alert('warn',t('Waiting for approval','بانتظار الموافقة'),'');
  if(o.st==='rejected') h+=H.alert('bad',t('Not approved','لم تتم الموافقة'),'');
  if(g>=0) h+=H.sec(t('Status','الحالة'),`<div style="padding:14px 16px 6px">${H.hero(t('Now','الآن'),ST4()[g],'',{tone:g===3?'ok':''})}</div>`+H.tl(ST4().map((n,i)=>[i<g?'done':i===g?(g===3?'done':'now'):'next',n,''])));
  h+=H.sec('',H.kv([[t('Status','الحالة'),stLabel(o)],o.ts?[t('Placed','تاريخ الطلب'),dt(o.ts,{day:'numeric',month:'short',year:'numeric'})]:null,o.branch?[t('Branch','الفرع'),esc(o.branch)]:null,o.po?[t('Reference','المرجع'),LTR(esc(o.po))]:null,o.pay?[t('Payment','الدفع'),payLabel(o.pay)]:null].filter(Boolean)));
  const ks=Object.keys(o.items||{}); if(ks.length) h+=H.sec(t('Items','الأصناف'),ks.map(k=>{ const q=o.items[k]; const a=o.la&&o.la[k]!=null?o.la[k]:(o.lp&&o.lp[k]!=null?Math.round(o.lp[k]*q*100)/100:null); return H.row({g:(RAW[k]&&RAW[k].g)||'box',t:esc(lname(o,k)),s:`${N(q)} × ${M(o.lp&&o.lp[k])}`,end:M(a)}); }).join(''));
  h+=H.sec(t('Totals','الإجماليات'),H.kv([[t('Subtotal (excl. VAT)','المجموع الفرعي (قبل الضريبة)'),M(T.sub)],[t('VAT','الضريبة'),M(T.vat)],[t('Total incl. VAT','الإجمالي شامل الضريبة'),M(T.tot),'tot']]));
  h+=H.sec('',H.rows([o.inv?{ic:'receipt',tone:'brand',t:t('Tax invoice','فاتورة ضريبية')+' '+LTR(esc(o.inv)),go:'b.invoice',q:{no:o.inv}}:null,g>=0&&g<3?{ic:'truck',tone:'brand',t:t('Track delivery','تتبع التوصيل'),go:'b.track',q:{id:o.id}}:null,{ic:'msg',tone:'brand',t:t('Help with this order','مساعدة بخصوص هذا الطلب'),go:'cc.home'}].filter(Boolean)));
  const can=['owner','bm','buyer'].includes(c.role)&&ks.some(k=>RAW[k]&&RAW[k].stock!=='out');
  return can?{b:h,dock:L.ab(t('Reorder these items','أعد طلب هذه الأصناف'),'reorder',o.id,{ic:'refresh',block:true})}:h; }});
ACT.reorder=id=>{ const o=L.ord(id); if(!o) return; const S=L.S(); let n=0; Object.entries(o.items||{}).forEach(([k,q])=>{ const p=RAW[k]; if(p&&p.stock!=='out'){ S.cart[k]=(S.cart[k]||0)+q; n++; } }); L.save(); if(n) L.go('b.cart'); else L.toast(t('These items are not available right now','هذه الأصناف غير متاحة حاليًا')); };
L.def('b.track',{t:['Track order','تتبع الطلب'],render:(c)=>{ const id=qp('id'); const o=id?L.ord(id):L.S().orders.filter(x=>L.active(x)&&L.stage(x)>=0).sort((a,b)=>(b.ts||0)-(a.ts||0))[0]; if(!o) return H.empty('truck',t('Nothing on the way','لا شيء في الطريق'),t('Active deliveries appear here.','تظهر التوصيلات الحالية هنا.'),H.btns(H.btn(t('All orders','كل الطلبات'),{go:'b.orders'}))); const g=Math.max(0,L.stage(o));
  return H.sec('',`<div class="card pad">${H.hero(t('Order','طلب')+' #'+esc(o.id),ST4()[g],'')}</div>`,{raw:true})+H.sec(t('Progress','التقدم'),H.tl(ST4().map((n,i)=>[i<g||g===3?'done':i===g?'now':'next',n,''])))+H.btns(H.btn(t('Order details','تفاصيل الطلب'),{k:'sec',go:'b.order',q:{id:o.id}})); }});
L.def('b.invoice',{t:()=>qp('no')||t('Invoice','الفاتورة'),render:(c)=>{ const no=qp('no'); const i=L.S().invoices.find(x=>x.no===no); if(!i) return H.empty('doc',t('Invoice not found','الفاتورة غير موجودة'),'',H.btns(H.btn(t('All invoices','كل الفواتير'),{go:'b.invoices'})));
  const r=L.invRow(i), b=L.bal(i), a=L.invAmt(i);
  let h=H.sec('',H.kv([[t('Invoice','الفاتورة'),LTR(esc(i.no))],[t('Status','الحالة'),H.pill(r.pill[0],r.pill[1])],i.d?[t('Issued','الإصدار'),dt(i.d,{day:'numeric',month:'short',year:'numeric'})]:null,i.due?[t('Due','الاستحقاق'),dt(i.due,{day:'numeric',month:'short',year:'numeric'})]:null].filter(Boolean)));
  if(Array.isArray(i.lines)&&i.lines.length) h+=H.sec(t('Lines','البنود'),i.lines.map(l=>H.row({g:(RAW[l.k]&&RAW[l.k].g)||'box',t:esc(tt(l.name)),s:`${N(l.q)} × ${M(l.rate)}`,end:M(l.amt)})).join(''))+H.sec('',H.kv([[t('Subtotal','المجموع الفرعي'),M(i.sub_total)],[t('VAT','الضريبة'),M(i.tax_total)],[t('Total','الإجمالي'),M(a),'tot']]));
  else h+=H.sec('',H.kv([[t('Total incl. VAT','الإجمالي شامل الضريبة'),M(a),'tot']]));
  if(!L.invX(i)) h+=H.sec(t('Balance','الرصيد'),H.kv([[t('Paid','المدفوع'),M(i.paid)],i.cr?[t('Credit notes','الإشعارات الدائنة'),M(-i.cr)]:null,[t('Balance due','المتبقي'),M(b),'tot']].filter(Boolean)));
  const canPay=b>0&&['owner','bm','cfin'].includes(c.role);
  return canPay?{b:h,dock:H.btn(t('Pay','ادفع'),{go:'b.pay',q:{no},ic:'wallet'})}:h; }});
L.def('b.receipt',{render:(c)=>{ const id=qp('id'); const p=id&&L.S().payments.find(x=>x.id===id); if(!p) return H.empty('doc',t('Payment not found','الدفعة غير موجودة'),'',H.btns(H.btn(t('Finance','المالية'),{go:'b.finance'})));
  return H.sec('',`<div class="card pad">${H.hero(t('Payment','دفعة'),M(p.amt),LTR(esc(p.id)))}</div>`,{raw:true})+H.sec('',H.kv([[t('Method','الطريقة'),payLabel(p.m)],p.ts?[t('Date','التاريخ'),dt(p.ts,{day:'numeric',month:'short',year:'numeric'})]:null,p.ref?[t('Reference','المرجع'),LTR(esc(p.ref))]:null,[t('Invoices','الفواتير'),p.inv.length?p.inv.map(x=>LTR(esc(x))).join(', '):'—']].filter(Boolean)))+H.btns(H.btn(t('Finance','المالية'),{go:'b.finance'})); }});
L.def('b.returns',{render:()=>{ const rows=L.S().cns.map(cn=>({ic:'receipt',tone:'ok',t:t('Credit note','إشعار دائن')+' '+LTR(esc(cn.no||cn.inv||'—')),s:`${esc(tt(cn.why))}${cn.inv?' · '+t('on','على')+' '+LTR(esc(cn.inv)):''}`,end:M(cn.amt==null?null:-cn.amt)})); return rows.length?H.sec('',H.rows(rows)):H.empty('refresh',t('No credit notes yet','لا إشعارات دائنة بعد'),''); }});
const credit0=MF.SCR['b.credit'].render;
L.def('b.credit',{render:(c)=>{ const cr=L.credit(); if(!cr.none) return credit0(c);
  let h=H.sec('',`<div class="card pad">${H.hero(t('Credit','الائتمان'),t('No credit limit set','لا يوجد حد ائتماني'),t('Orders are paid on delivery or by transfer until a limit is set.','تُدفع الطلبات عند الاستلام أو بالتحويل حتى يُحدد حد ائتماني.'))}</div>`,{raw:true});
  if(cr.overdue>0) h+=H.alert('warn',t('Overdue balance','رصيد متأخر'),M(cr.overdue),{act:['owner','bm','cfin'].includes(c.role)?H.btn(t('Pay now','ادفع الآن'),{sm:true,go:'b.pay'}):''});
  h+=H.sec('',H.rows([{ic:'doc',tone:'brand',t:t('Statement & aging','الكشف وأعمار الديون'),go:'b.statement'}]));
  return c.role==='owner'?{b:h,dock:H.btn(t('Request a credit limit','اطلب حدًا ائتمانيًا'),{go:'b.creditApp',ic:'plus'})}:h; }});
L.def('b.product',{t:()=>{ const p=RAW[qp('sku')]; return p?(MF.pn?MF.pn(p):p.en):t('Product','المنتج'); },render:(c)=>{ const id=qp('sku'); const p=RAW[id]; if(!p) return H.empty('box',t('Product not found','المنتج غير موجود'),t('It may no longer be in the catalogue.','ربما لم يعد في الكتالوج.'),H.btns(H.btn(t('Catalogue','المنتجات'),{go:'b.catalog'})));
  const q=L.S().cart[id]||0; const pk=tt(p.pk);
  let h=`<div class="card pad" style="margin:0 16px 16px"><div class="pt" style="padding:0">${L.fav(id)}<div class="img" style="height:180px">${L.pimg(p,96)}</div></div><h2 class="disp" style="font-size:22px;line-height:1.35">${esc(MF.pn?MF.pn(p):p.en)}</h2><p class="why">${pk&&pk!=='—'?esc(pk)+' · ':''}${p.sku?t('SKU','الرمز')+' '+LTR(esc(p.sku)):''}</p><div class="tot" style="border:0;padding-top:6px"><span>${M(p.pr,'big')}</span>${p.pr!=null?`<small>${t('excl. VAT','قبل الضريبة')}</small>`:''}</div><p class="why">${p.pr==null?t('Price not available yet','السعر غير متاح بعد'):t('VAT calculated at checkout','تُحسب الضريبة عند الدفع')}</p>${p.stock==='out'?H.pill('bad',t('Out of stock','نفد')):p.stock==='low'?H.pill('warn',t('Low stock','كمية محدودة')):''}</div>`;
  if(Array.isArray(p.tiers)&&p.tiers.length) h+=H.sec(t('Case-pack pricing','أسعار الكرتون'),H.kv(p.tiers.filter(x=>x&&fin(x.price)).map(x=>[esc(tt(x.label||[String(x.min||''),String(x.min||'')])),M(Number(x.price))])));
  const det=[[t('Minimum order','الحد الأدنى للطلب'),N(p.moq||1)]]; if(p.storage) det.push([t('Storage','التخزين'),esc(tt(Array.isArray(p.storage)?p.storage:[p.storage,p.storage]))]); h+=H.sec(t('Details','التفاصيل'),H.kv(det));
  const view=['viewer','recv'].includes(c.role);
  return (p.stock==='out'||view)?h:{b:h,dock:`<div class="dt"><small>${q?t(`${q} in cart`,`${q} في السلة`):t('excl. VAT','قبل الضريبة')}</small>${M(p.pr==null?null:p.pr*Math.max(q,1))}</div>${H.stepper(id,q,MF.pn?MF.pn(p):p.en)}`}; }});
/* ---------- finance documents hub (doc.view) + payments and credit-note lists — owner, branch manager, customer finance ---------- */
const FINR=['owner','bm','cfin'];
const dshort=ts=>ts?dt(ts,{day:'numeric',month:'short',year:'numeric'}):'—';
const payRow=p=>({ic:'wallet',tone:'ok',t:`${LTR(esc(p.id))} · ${M(p.amt)}`,s:`${dshort(p.ts)} · ${payLabel(p.m)}`,go:'b.receipt',q:{id:p.id}});
const cnRow=cn=>({ic:'receipt',tone:'ok',t:t('Credit note','إشعار دائن')+' '+LTR(esc(cn.no||'—')),s:`${esc(tt(cn.why))}${cn.inv?' · '+t('on','على')+' '+LTR(esc(cn.inv)):''}${cn.ts?' · '+dshort(cn.ts):''}`,end:M(cn.amt==null?null:-cn.amt),go:cn.inv&&L.S().invoices.some(i=>i.no===cn.inv)?'b.invoice':null,q:cn.inv?{no:cn.inv}:null});
const finState=k=>(L.ui.fin||{})[k]==='loading';
const listOrEmpty=(rows,key,ic,en,ar,sub)=>rows.length?H.rows(rows):finState(key)?H.empty(ic,t('Loading…','جارٍ التحميل…'),''):H.empty(ic,t(en,ar),sub);
const BOOKS_SUB=()=>t('Documents from Zoho Books show here once your account is linked.','تظهر هنا مستندات Zoho Books بعد ربط حسابك.');
L.scr('b.payments',{a:'invoices',r:FINR.join(' '),t:['Payments','المدفوعات'],back:'doc.view',noSeg:true,
  render:()=>{ const P=(L.S().payments||[]).slice().sort((a,b)=>(b.ts||0)-(a.ts||0)); return H.sec('',listOrEmpty(P.map(payRow),'payments','wallet','No payments yet','لا توجد مدفوعات بعد',BOOKS_SUB())); }});
L.scr('b.creditnotes',{a:'invoices',r:FINR.join(' '),t:['Credit notes','الإشعارات الدائنة'],back:'doc.view',noSeg:true,
  render:()=>{ const C=(L.S().cns||[]).slice().sort((a,b)=>(b.ts||0)-(a.ts||0)); return H.sec('',listOrEmpty(C.map(cnRow),'cns','receipt','No credit notes yet','لا توجد إشعارات دائنة بعد',BOOKS_SUB())); }});
{ const dv=MF.SCR['doc.view']; if(dv){ dv.r=FINR.slice(); dv.noSeg=true; dv.v=null; dv.acts=null;
  dv.t=()=>t('Invoices & payments','الفواتير والمدفوعات');
  try{ Object.defineProperty(dv,'back',{value:'more',writable:true,configurable:true}); }catch(e){ dv.back='more'; }
  dv.render=c=>{ const k=qp('k'), id=qp('id');
    /* a single document opens its live screen; PDFs are not enabled in the preview yet */
    const rep=(to,q)=>{ setTimeout(()=>location.replace(MF.href(to,q||{})),0); return H.empty('doc',t('Opening…','جارٍ الفتح…'),''); };   /* replace: Back does not loop */
    if(id&&k==='receipt') return rep('b.receipt',{id,k:null,back:null});
    if(id&&(!k||k==='invoice')) return rep('b.invoice',{no:id,id:null,k:null,back:null});
    if(k==='statement') return rep('b.statement',{k:null,id:null,back:null});
    const s=L.S(); const inv=(s.invoices||[]).slice().sort((a,b)=>(b.d||0)-(a.d||0)), pay=(s.payments||[]).slice().sort((a,b)=>(b.ts||0)-(a.ts||0)), cns=(s.cns||[]).slice().sort((a,b)=>(b.ts||0)-(a.ts||0));
    return H.sec(t('Invoices','الفواتير'),listOrEmpty(inv.slice(0,5).map(L.invRow),'invoices','doc','No invoices yet','لا توجد فواتير بعد',BOOKS_SUB()),{act:inv.length?[t('All invoices','كل الفواتير'),'b.invoices']:null})
     +H.sec(t('Payments','المدفوعات'),listOrEmpty(pay.slice(0,5).map(payRow),'payments','wallet','No payments yet','لا توجد مدفوعات بعد',''),{act:pay.length?[t('All payments','كل المدفوعات'),'b.payments']:null})
     +H.sec(t('Credit notes','الإشعارات الدائنة'),listOrEmpty(cns.slice(0,5).map(cnRow),'cns','receipt','No credit notes yet','لا توجد إشعارات دائنة بعد',''),{act:cns.length?[t('All credit notes','كل الإشعارات الدائنة'),'b.creditnotes']:null})
     +H.sec('',H.rows([{ic:'doc',tone:'brand',t:t('Statement of account','كشف الحساب'),go:'b.statement'}])); };
} }
/* ---------- only screens backed by live data are shown; the rest say so (no sample cast in live mode) ---------- */
const LIVE_OK=new Set(('lv.staff doc.view b.payments b.creditnotes b.home b.catalog b.search b.product b.cart b.checkout b.orders b.order b.track b.finance b.invoices b.invoice b.pay b.receipt b.statement b.credit b.hold b.creditApp b.limit b.returns b.lists b.reorder b.par '+COMMON.join(' ')).split(' '));
Object.entries(MF.SCR).forEach(([id,d])=>{ if(!d||LIVE_OK.has(id)||/^ob\./.test(id)) return; d.__lvT0=d.t; d.t=()=>t('Not available yet','غير متاح بعد'); d.v=null; d.noSeg=true;
  d.render=c=>H.empty('lock',t('Not available in the preview yet','غير متاح في المعاينة بعد'),t('This screen will show live data once it is switched on.','ستعرض هذه الشاشة بيانات حية عند تفعيلها.'),H.btns(H.btn(t('Help & support','المساعدة والدعم'),{k:'sec',go:'cc.home'}))); d.__lvBlocked=true; });
/* header account link: no 'demo controls' wording in live mode */
const ACCT_LBL={'Account, switch role, demo controls':'Account, switch role','الحساب وتبديل الدور وأدوات العرض':'الحساب وتبديل الدور'};
const fixAcct=()=>document.querySelectorAll('[aria-label]').forEach(e=>{ const v=ACCT_LBL[e.getAttribute('aria-label')]; if(v) e.setAttribute('aria-label',v); });
L.post.push(()=>{ fixAcct(); setTimeout(fixAcct,0); });
/* ---------- navigation: tabs whose screen is not live yet stay visible but disabled ---------- */
const blocked=id=>{ const d=MF.SCR[id]; return !d||!!d.__lvBlocked; };
L.post.push(()=>{ document.querySelectorAll('nav.nb a.tab').forEach(a=>{ const id=(a.getAttribute('href').match(/^#\/([^?]+)/)||[])[1]; if(!id||!blocked(id)) return;
  const sp=document.createElement('span'); sp.className='tab lv-soon-tab'; sp.setAttribute('aria-disabled','true'); sp.innerHTML=a.innerHTML; sp.querySelectorAll('.bdg,.vh').forEach(x=>x.remove());   /* sample counts */
  const tl=sp.querySelector('.tl'); const tag=`<span class="lv-tag">${t('Coming soon','قريبًا')}</span>`; if(tl) tl.insertAdjacentHTML('afterend',tag); else sp.insertAdjacentHTML('beforeend',tag);
  a.replaceWith(sp); }); });
(()=>{ const st=document.createElement('style'); st.textContent='.lv-soon-tab{cursor:default;opacity:.55;position:relative}.lv-soon-tab .lv-tag{display:block;font-size:9.5px;line-height:1.1;font-weight:600;letter-spacing:.01em;padding:1px 5px;border-radius:999px;background:var(--c-surface-2,#eee);color:var(--c-text-2,#555);margin-top:1px;white-space:nowrap}'; document.head.appendChild(st); })();
/* landing: the role's first live tab; a portal role with no live tab lands on a clear staff home */
{ const home0=L.home; L.home=role=>{ const R=MF.ROLES[role]; if(!R||!R.nav||!R.nav.length) return home0(role); const ok=R.nav.map(n=>n[1]).find(id=>!blocked(id)&&id!=='more'); return ok||'lv.staff'; }; }
const STAFF_TOOLS={acct:['Finance tools are coming to the preview soon','أدوات المالية قادمة قريبًا'],sales:['Sales tools are coming to the preview soon','أدوات المبيعات قادمة قريبًا'],van:['Sales and delivery tools are coming to the preview soon','أدوات البيع والتوصيل قادمة قريبًا'],driver:['Delivery tools are coming to the preview soon','أدوات التوصيل قادمة قريبًا'],store:['Warehouse tools are coming to the preview soon','أدوات المستودع قادمة قريبًا'],admin:['Admin tools are coming to the preview soon','أدوات الإدارة قادمة قريبًا'],mgr:['Approval tools are coming to the preview soon','أدوات الاعتماد قادمة قريبًا']};
L.scr('lv.staff',{a:'home',r:'sales van driver store acct mgr admin',t:['Home','الرئيسية'],noSeg:true,
  render:c=>{ const R=MF.ROLES[c.role]||{nav:[]}; const h=STAFF_TOOLS[c.role]||['Your tools are coming to the preview soon','أدواتك قادمة قريبًا'];
    const tools=(R.nav||[]).filter(n=>n[1]!=='more'&&blocked(n[1])).map(n=>`<div class="row lv-soon" aria-disabled="true"><span class="b"><span class="t">${esc(tt(n[2]))}</span></span>${H.pill('neu',t('Coming soon','قريبًا'))}</div>`).join('');
    return H.sec('',`<div class="card pad lv-empty" role="status"><h2>${t(h[0],h[1])}</h2><p class="why">${t('You are signed in. These screens will show live data once they are switched on for your role.','تم تسجيل دخولك. ستعرض هذه الشاشات بيانات حية عند تفعيلها لدورك.')}</p></div>`,{raw:true})
     +(tools?H.sec(t('Your tools','أدواتك'),`<div class="card grp">${tools}</div>`,{raw:true}):'')
     +H.sec('',H.rows([{ic:'more',tone:'brand',t:t('More','المزيد'),s:t('Account, language, theme, sign out','الحساب واللغة والمظهر وتسجيل الخروج'),go:'more'},{ic:'msg',tone:'brand',t:t('Help & support','المساعدة والدعم'),go:'cc.home'}])); }});
/* More: entries not live yet are plain text (no link, aria-disabled) with a 'Coming soon' tag */
L.post.push(c=>{ if(!c||c.id!=='more') return; const m=document.querySelector('#main'); if(!m) return;
  m.querySelectorAll('a[href^="#/"]').forEach(a=>{ const id=(a.getAttribute('href').match(/^#\/([^?]+)/)||[])[1]; const d=id&&MF.SCR[id]; if(!d||!d.__lvBlocked) return;
    const t0=d.__lvT0; const nm=typeof t0==='function'?(()=>{ try{ return t0(c); }catch(e){ return ''; } })():Array.isArray(t0)?tt(t0):(t0||'');
    const row=document.createElement('div'); row.className=(a.className||'row')+' lv-soon'; row.setAttribute('aria-disabled','true');
    /* record-specific titles (a sample customer, order or request) are not menu entries: drop them */
    if(typeof t0==='function'||!nm||/#\s*\d{3,}/.test(nm)){ a.remove(); return; }
    const nm2=String(nm||'').replace(/\s*\u200e?#\s*\d{3,}\b/g,'').trim(); /* sample record numbers in prototype titles */
    row.innerHTML=`<span class="b"><span class="t">${esc(nm2||t('Not available yet','غير متاح بعد'))}</span></span>${H.pill('neu',t('Coming soon','قريبًا'))}`;
    a.replaceWith(row); });
  m.querySelectorAll('section.sec').forEach(sec=>{ if(!sec.querySelector('.row,a,button,input')&&!sec.querySelector('.acct')) sec.remove(); }); });
(()=>{ const st=document.createElement('style'); st.textContent='.lv-soon{cursor:default;color:var(--c-text-2)}.lv-soon .t{color:var(--c-text-2)}'; document.head.appendChild(st); })();
/* pro-ops status strip: real catalogue status instead of the sample "Synced 10:42 · Zoho Books · OK · SAMPLE" */
const after0=MF.after; if(after0) MF.after=C=>{ after0(C); document.querySelectorAll('#main .fm-hero').forEach(x=>x.remove()); /* fresh-market promo banner is sample copy */ const s=document.querySelector('#main .ops'); if(!s) return; const n=API.catalogCount; s.innerHTML=n?`<span><i aria-hidden="true"></i>${t('Live','حي')}</span><span>${t('Zoho Commerce','زوهو كومرس')} · ${N(n)} ${t('items','صنف')}</span><span>${dt(Date.now(),{weekday:'short',day:'numeric',month:'short'})}</span>`:''; if(!n) s.remove(); };

/* ob.* sign-up prototypes show a masked sample mobile — hide it in live mode */
L.post.push(c=>{ if(!/^ob\./.test(c.id)) return; const m=document.querySelector('#main'); if(!m) return; const w=document.createTreeWalker(m,NodeFilter.SHOW_TEXT); let n; while((n=w.nextNode())){ if(n.nodeValue.indexOf('4821')>=0) n.nodeValue=n.nodeValue.replace(/5•\s*•••\s*4821|4821/g,'5• ••• ••••'); } });
/* live data can be empty or partial: a screen whose record does not exist shows an empty state, never a crash */
const href=MF.href||((id,q)=>'#/'+id);
Object.entries(MF.SCR).forEach(([id,d])=>{ if(!d||typeof d.render!=='function'||d.__lvWrapped) return; const r=d.render; d.__lvWrapped=true;
  if(typeof d.t==='function'){ const t0=d.t; d.t=function(){ try{ return t0.apply(this,arguments); }catch(e){ return t('Not available yet','غير متاح بعد'); } }; }
  d.render=function(c){ try{ return r.apply(this,arguments); }catch(e){ console.warn('[live] '+id+' has no data yet:',e&&e.message);
    const bk=typeof d.back==='string'?d.back:(id.startsWith('b.')?'b.home':'more');
    return H.sec('',`<div class="card pad lv-empty" role="status"><h2>${t('Nothing to show yet','لا يوجد ما يُعرض بعد')}</h2><p class="why">${t('This screen needs records that are not in the live preview yet.','تحتاج هذه الشاشة إلى سجلات غير متوفرة في المعاينة الحية بعد.')}</p><a class="btn sec" href="${href(bk,{})}">${t('Go back','رجوع')}</a></div>`,{raw:true}); } };
});
/* the gateway session expired */
API.on('auth',()=>{ const S=L.S(); if(S&&S.session){ S.session=null; L.save(); } });
})();
