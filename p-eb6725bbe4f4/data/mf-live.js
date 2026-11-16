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
const cr0=L.credit; if(cr0) L.credit=()=>{ const c=cr0(); const lim=L.S().credit&&L.S().credit.limit; if(lim==null||!isFinite(lim)) return Object.assign({},c,{limit:null,avail:null}); return c; };
L.ui.catLoading=true;

const norm=(id,p)=>{ const en=nz(p.en,nz(p.name,id)); const pk=Array.isArray(p.pk)?p.pk:[p.pk,p.pk]; const u=Array.isArray(p.u)?p.u:['',''];
  const pr=(typeof p.pr==='number'&&isFinite(p.pr)&&p.pr>0)?p.pr:null;     /* 0 / missing = price not available, never guessed */
  const st=['in','low','out'].includes(p.stock)?p.stock:'out';            /* unknown stock is never shown as available */
  return Object.assign({},p,{id,en:String(en),ar:String(nz(p.ar,en)),pk:[nz(pk[0],'—'),nz(pk[1],nz(pk[0],'—'))],u:[nz(u[0],''),nz(u[1],nz(u[0],''))],pr,stock:st,g:nz(p.g,'box'),cat:nz(p.cat,'other'),moq:(p.moq>0?p.moq:1)}); };
API.get('/catalog/preview-data').then(j=>{ const d=(j&&j.data&&j.data.P)?j.data:j; if(!d||!d.P) throw new Error('bad shape');
  Object.entries(d.P).forEach(([id,p])=>{ if(p&&typeof p==='object') RAW[id]=norm(id,p); });
  (d.CATS||[]).forEach(c=>{ if(!Array.isArray(c)) return; const nm=Array.isArray(c[2])?c[2]:[c[2],c[2]]; const en=nz(nm[0],String(c[0])); CATS.push([String(c[0]),nz(c[1],'box'),[en,nz(nm[1],en)],c[3]||null]); });
  const known=new Set(CATS.map(c=>c[0])); if(Object.values(RAW).some(p=>!known.has(p.cat))) CATS.push(['other','box',['Other','أخرى'],null]);
  L.ui.catLoading=false; API.catalogCount=Object.keys(RAW).length; prune(); if(MF.booted) L.rr();
}).catch(e=>{ L.ui.catLoading=false; L.ui.catError=e.status===401?'auth':'err'; if(MF.booted) L.rr(); });

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
const ROLE=r=>({customer:'owner',customer_admin:'owner',branch_manager:'bm',buyer:'buyer',cashier:'cashier',salesman:'sales',sales:'sales',van:'van',driver:'driver',storekeeper:'store',accountant:'acct',finance:'acct',manager:'mgr',admin:'admin',affiliate:'aff'})[r]||'owner';
const signedIn=j=>{ const u=(j&&(j.data||j))||{}; const roles=u.roles||(u.user&&u.user.roles)||[]; const S=L.S(); S.me=u.user||u; L.save(); L.login(ROLE(roles[0])); };
L.ui.meTried=false;
ACT.otp=()=>{ L.clearBad(); const ph=L.val('phone').replace(/\D/g,''); if(!/^5\d{8}$/.test(ph)){ L.bad('phone',t('Enter 9 digits starting with 5','أدخل 9 أرقام تبدأ بـ 5')); L.focusBad(); return; }
  L.ui.busy=true; L.rr();
  API.request('POST','/auth/otp/request',{mobile:'+966'+ph,purpose:'login'}).then(j=>{ const d=(j&&j.data)||j||{}; L.ui.busy=false; L.ui.otp=ph; L.ui.ch=d.challenge_id; L.rr(); setTimeout(()=>{ const o=document.querySelector('[name=code]'); o&&o.focus(); },50); },
   e=>{ L.ui.busy=false; L.rr(); if(!e.notEnabled){ L.bad('phone',(MF.C&&MF.C.ar&&e.message_ar)||e.message||t('Could not send the code. Try again.','تعذّر إرسال الرمز. حاول مرة أخرى.')); L.focusBad(); } }); };
ACT.verify=()=>{ L.clearBad(); const c=L.val('code').replace(/\D/g,''); if(c.length<4){ L.bad('code',t('Enter the code from the SMS','أدخل الرمز من الرسالة')); L.focusBad(); return; }
  let dev=''; try{ dev=sessionStorage.getItem('mf-dev')||(crypto.randomUUID?crypto.randomUUID():String(Date.now())); sessionStorage.setItem('mf-dev',dev); }catch(x){}
  API.request('POST','/auth/otp/verify',{challenge_id:L.ui.ch,code:c,device_id:dev}).then(j=>{ L.ui.otp=null; const tk=j&&(j.token||(j.data&&j.data.token)); if(tk) API.setSession(tk); return API.get('/me').then(signedIn,()=>signedIn(j)); },
   e=>{ if(!e.notEnabled){ L.bad('code',(MF.C&&MF.C.ar&&e.message_ar)||e.message||t('That code isn’t right.','الرمز غير صحيح.')); L.focusBad(); } }); };
L.def('app.login',{render:(c)=>{
  if(!L.ui.meTried){ L.ui.meTried=true; API.get('/me').then(signedIn,()=>{}); }
  let h=`<div class="lv-hero"><span class="lv-logo" aria-hidden="true">${I('store',30)}</span><p class="lv-k">MENAFoods</p><h2 class="disp">${t('Wholesale food for your business','مواد غذائية بالجملة لمنشأتك')}</h2><p>${t('Development preview with the live Zoho catalogue.','معاينة التطوير مع كتالوج زوهو الحي.')}</p><div class="btns lv-mini">${L.ab(c.ar?'English':'العربية','lang',null,{k:'sec',sm:true,ic:'globe'})}</div></div>`;
  h+=H.sec(t('Sign in with your mobile','الدخول برقم الجوال'),`<div class="card pad">${L.ui.otp?L.fld('code',t('Enter the code','أدخل الرمز'),{req:true,ltr:true,im:'numeric',max:6,ac:'one-time-code',hint:t(`Sent by SMS to +966 ${esc(L.ui.otp)}`,`أُرسل برسالة نصية إلى ‎+966 ${esc(L.ui.otp)}`)})+H.btns(L.ab(t('Verify & sign in','تحقق وادخل'),'verify'),L.ab(t('Change number','غيّر الرقم'),'otpback',null,{k:'sec'})):L.fld('phone',t('Mobile number','رقم الجوال'),{req:true,ltr:true,im:'tel',pre:'+966',ph:'5X XXX XXXX',max:12,ac:'tel-national'})+H.btns(L.ab(L.ui.busy?t('Sending…','جارٍ الإرسال…'):t('Send code','أرسل الرمز'),'otp',null,{dis:!!L.ui.busy}))}</div>`,{raw:true});
  h+=H.sec('',`<div class="card grp"><a class="row" href="/app/"><span class="ic brand" aria-hidden="true">${I('key',20)}</span><span class="b"><span class="t">${t('Already have a MENAFoods login?','لديك حساب في MENAFoods؟')}</span><span class="s">${t('Sign in on the MENAFoods app page, then come back here','سجّل الدخول من صفحة تطبيق MENAFoods ثم ارجع إلى هنا')}</span></span><span class="chev">${I('chev',18)}</span></a></div>`,{raw:true});
  return h; }});
/* account page: no sample-account switcher, no demo controls */
L.def('app.me',{t:['Account','الحساب'],render:(c)=>{ const me=L.S().me||{}; const nm=nz(c.ar?nz(me.name_ar,me.name):me.name,t('Your account','حسابك'));
  let h=H.sec('',`<div class="card pad acct"><span class="av" aria-hidden="true">${esc(String(nm).slice(0,1))}</span><span style="flex:1;min-width:0"><h2>${esc(nm)}</h2><span class="s">${esc(nz(me.mobile,nz(me.email,'')))}</span></span></div>`,{raw:true});
  h+=H.sec(t('Language','اللغة'),L.radio('lang',[['ar','العربية'],['en','English']],c.lang,t('Language','اللغة')));
  h+=H.sec(t('Appearance','المظهر'),L.radio('theme',[['light',t('Light','فاتح')],['dark',t('Dark','داكن')]],c.theme,t('Theme','المظهر')));
  return {b:h,dock:L.ab(t('Sign out','تسجيل الخروج'),'logout',null,{k:'sec',ic:'key'})}; }});
const lo0=ACT.logout; ACT.logout=(a,b,e)=>{ API.request('POST','/auth/logout',{}).catch(()=>{}).then(()=>{ try{ API.setSession(null); }catch(x){} lo0?lo0(a,b,e):L.logout(); }); };
/* more: no "switch account / reset" wording */
const more1=MF.SCR.more&&MF.SCR.more.render; if(more1) MF.SCR.more.render=c=>more1(c).replace(t('Switch account, language, theme, offline, reset','تبديل الحساب واللغة والمظهر وعدم الاتصال وإعادة الضبط'),t('Account, language, theme','الحساب واللغة والمظهر'));

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
