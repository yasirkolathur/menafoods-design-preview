/* MENAFoods · WORKING PREVIEW layer (front-end only). Sample data, state saved in this browser (localStorage). No real backends, prices or stock. */
(function(){
'use strict';
const MF=window.MF; if(!MF) return;
let framed=false; try{ framed = !!(window.frameElement && window.frameElement.id==='f'); }catch(e){}
if(framed || /(^|[?&#])proto=1/.test(location.search)) return;
MF.LIVE=true;
const {t,tt,H,M,N,I,G,LTR,href}=MF; const P0=()=>MF.DATA.P;
const L=MF.L={};               /* live namespace */
const KEY='mf-live-v2:'+(location.pathname.replace(/\/[^/]*$/,'').split('/').pop()||'app');
const now=()=>Date.now(); const MIN=60000;
const r2=v=>Math.round(v*100)/100;
L.r2=r2;

/* ---------------- seed ---------------- */
function seed(){ const n=now(); const day=86400000;
 const S={ver:2, created:n, session:null, offline:false, prefs:{},
  cart:{}, favs:['p1','p2','p4','p11'],
  lists:[{id:'L1',n:['Tuesday kitchen basket','سلة المطبخ للثلاثاء'],items:{p1:4,p2:2,p3:3,p4:4,p5:2,p7:1}},{id:'L2',n:['Weekend bakery top-up','تزويد المخبز للعطلة'],items:{p6:2,p4:3,p11:1}}],
  par:{p1:6,p2:4,p3:5,p4:10,p5:3,p7:2}, onhand:{p1:4,p2:3,p3:5,p4:8,p5:1,p7:1}, parLog:[],
  credit:{limit:15000},
  orders:[
   {id:'58213',ts:n-3*day,by:'owner',branch:'Olaya',items:{p1:6,p2:4,p4:10,p11:4},pay:'credit',fixed:3,po:'PO-OL-1182',inv:'INV-2026-0433',pts:0},
   {id:'58190',ts:n-10*day,by:'buyer',branch:'Olaya',items:{p3:10,p8:6,p7:2},pay:'credit',fixed:3,inv:'INV-2026-0419',pts:0}],
  invoices:[
   {no:'INV-2026-0412',order:'58150',d:n-37*day,due:n-4*day,amt:2140,paid:0,cr:0},
   {no:'INV-2026-0419',order:'58190',d:n-10*day,due:n+20*day,amt:0,paid:0,cr:0},
   {no:'INV-2026-0433',order:'58213',d:n-3*day,due:n+27*day,amt:0,paid:0,cr:0},
   {no:'INV-2026-0388',order:'58101',d:n-50*day,due:n-20*day,amt:1806.5,paid:1806.5,cr:0}],
  payments:[{id:'RC-2026-0201',ts:n-21*day,amt:1806.5,m:'mada',inv:['INV-2026-0388']}],
  cns:[],
  points:1240, ptsLog:[{ts:n-3*day,d:279,why:['Order #58213','الطلب ‎#58213']},{ts:n-10*day,d:96,why:['Order #58190','الطلب ‎#58190']},{ts:n-30*day,d:865,why:['Earlier orders','طلبات سابقة']}],
  myRewards:[], refs:[{n:'Qahwat Al Hay',st:'joined',ts:n-6*day},{n:'Bayt Al Kunafa',st:'invited',ts:n-2*day}],
  apps:[{id:'CA-2026-030',ts:n-3*3600000,by:'cust',cust:['Qahwat Al Hay (sample)','قهوة الحي (عينة)'],amt:8000,why:'branch',buy:9500,note:'',st:'acct',route:'acct',log:[{ts:n-3*3600000,who:'cust',k:'submit'}]},{id:'CA-2026-029',ts:n-1*day,by:'cust',cust:['Bayt Al Kunafa (sample)','بيت الكنافة (عينة)'],amt:14000,why:'season',buy:22000,note:'',st:'mgr',route:'mgr',log:[{ts:n-1*day,who:'cust',k:'submit'},{ts:n-20*3600000,who:'acct',k:'acct-rec',txt:'Good payment history; recommend.'}]}], tickets:[], chat:null,
  disputes:[{id:'C-2294',inv:'INV-2026-0433',ts:n-1*day,by:'owner',lines:[{sku:'p1',q:6,billed:185,exp:175}],note:['Contract price for rice is 175','سعر العقد للأرز 175'],st:'open'}],
  hub:{exp:[{id:'E1',ts:n-2*day,amt:420,cat:'utilities',note:['Electricity · Olaya','كهرباء · العليا'],by:'owner'},{id:'E2',ts:n-5*day,amt:1250,cat:'rent',note:['Storage unit','وحدة تخزين'],by:'owner'},{id:'E3',ts:n-1*day,amt:86,cat:'supplies',note:['Cleaning supplies','مواد تنظيف'],by:'cashier'}],
   bills:[{id:'B1',sup:['Al Safi Dairy (sample)','ألبان الصافي (عينة)'],amt:1840,due:n+3*day,paid:0},{id:'B2',sup:['Fresh Greens Co. (sample)','شركة الخضار الطازجة (عينة)'],amt:960,due:n-1*day,paid:0},{id:'B3',sup:['Gas supplier (sample)','مورد الغاز (عينة)'],amt:310,due:n+9*day,paid:0}],
   cash:[{id:'K1',ts:n-4*3600000,k:'open',amt:500,note:['Opening float','رصيد افتتاحي']},{id:'K2',ts:n-3*3600000,k:'sale',amt:1240,m:'cash',note:['Lunch sales','مبيعات الغداء']},{id:'K3',ts:n-2*3600000,k:'sale',amt:2310,m:'mada',note:['Lunch sales · mada','مبيعات الغداء · مدى']},{id:'K4',ts:n-90*MIN,k:'exp',amt:45,cat:'supplies',note:['Ice','ثلج']}]},
  field:{acts:[{ts:n-2*day,who:'Faisal',k:'visit',txt:['Visit · menu change discussed','زيارة · نوقش تغيير القائمة']}],scart:{}},
  van:{stock:{p1:8,p2:10,p3:12,p4:6,p7:10,p8:12,p10:6},cart:{},inv:[],seq:1041,cust:['Baqala Al Noor','بقالة النور']},
  route:[
   {id:'s1',n:['Al Wadi Restaurant · Olaya','مطعم الوادي · العليا'],addr:['King Fahd Rd','طريق الملك فهد'],order:'58205',items:{p1:4,p4:6},otp:'4821',st:'done',ts:n-150*MIN},
   {id:'s2',n:['Bayt Al Kunafa','بيت الكنافة'],addr:['Olaya St','شارع العليا'],order:'58207',items:{p6:2,p11:2},otp:'1937',st:'done',ts:n-110*MIN},
   {id:'s3',n:['Shawarma Al Nakheel','شاورما النخيل'],addr:['Tahlia St','شارع التحلية'],order:'58209',items:{p5:3,p7:2},otp:'5520',st:'done',ts:n-70*MIN},
   {id:'s4',n:['Sufra Catering','سفرة للتموين'],addr:['Prince Sultan Rd','طريق الأمير سلطان'],order:'58236',items:{p2:3,p4:10,p5:4},otp:'4821',st:'next',cold:true},
   {id:'s5',n:['Qahwat Al Hay','قهوة الحي'],addr:['Al Malqa','الملقا'],order:'58238',items:{p4:4,p9:2},otp:'7702',st:'todo'},
   {id:'s6',n:['Mataam Al Bahr','مطعم البحر'],addr:['Hittin','حطين'],order:'58239',items:{p1:2,p3:4,p10:1},otp:'3318',st:'todo'}],
  picks:[
   {id:'PL-0912',truck:'12',wave:2,st:'open',lines:[{sku:'p1',q:10,bin:'B-04-2',got:0},{sku:'p2',q:6,bin:'B-07-1',got:0},{sku:'p4',q:14,bin:'C-01-3',got:0,cold:true},{sku:'p5',q:7,bin:'F-02-1',got:0,cold:true},{sku:'p7',q:4,bin:'D-11-4',got:0}]},
   {id:'PL-0913',truck:'09',wave:2,st:'open',lines:[{sku:'p3',q:12,bin:'A-03-2',got:0},{sku:'p6',q:5,bin:'B-02-1',got:0},{sku:'p8',q:8,bin:'A-05-3',got:0}]},
   {id:'PL-0905',truck:'07',wave:1,st:'dispatched',lines:[{sku:'p1',q:8,bin:'B-04-2',got:8},{sku:'p2',q:10,bin:'B-07-1',got:10}]}],
  notifs:[{id:'n0',ts:n-20*MIN,ic:'receipt',txt:['Invoice INV-2026-0412 is 4 days overdue','الفاتورة INV-2026-0412 متأخرة 4 أيام'],go:['b.invoice',{no:'INV-2026-0412'}],read:false}],
  seq:{order:58241,ticket:2297,cn:74,app:31,pay:202,exp:10,cash:10,inv:440}
 };
 S.tickets=[{id:'C-2291',ts:n-2*day,by:'owner',topic:'damaged',order:'58213',sku:'p4',q:2,txt:['2 cases of milk arrived crushed and leaking','وصل كرتونا حليب مهروسين ومسربين'],photos:2,st:'resolved',done:n-1*day,agent:'Sara',ev:[{ts:n-2*day,who:'sys',k:'recv'},{ts:n-2*day+4*MIN,who:'agent',k:'assign'},{ts:n-2*day+30*MIN,who:'agent',txt:['Credit request sent to Finance','أُرسل طلب الإشعار الدائن للمالية']},{ts:n-1*day,who:'sys',k:'resolved',cn:'CN-2026-0074',amt:143.52}],csat:null}];
 S.cns.push({no:'CN-2026-0074',inv:'INV-2026-0433',amt:143.52,ts:n-1*day,why:['Request C-2291 · damaged milk','الطلب C-2291 · حليب تالف']});
 return S; }

/* ---------------- store ---------------- */
let S; try{ S=JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){ S=null; }
if(!S||S.ver!==2) S=seed();
L.S=()=>S;
const save=L.save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} };
L.reset=()=>{ const keep={session:S.session,prefs:S.prefs}; S=seed(); Object.assign(S,keep); MF.cart=S.cart; save(); };
MF.cart=S.cart;

/* ---------------- small helpers ---------------- */
const hp=L.hp=()=>{ const h=location.hash.replace(/^#\/?/,''); const i=h.indexOf('?'); const q=Object.fromEntries(new URLSearchParams(i<0?'':h.slice(i+1))); q.id=i<0?h:h.slice(0,i); return q; };
const esc=L.esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const loc=()=>MF.C&&MF.C.ar?'ar-SA-u-nu-latn':'en-GB';
const tm=L.tm=ts=>`<span class="num">${new Intl.DateTimeFormat(loc(),{hour:'numeric',minute:'2-digit'}).format(new Date(ts))}</span>`;
const dt=L.dt=(ts,o)=>`<span class="num">${new Intl.DateTimeFormat(loc(),o||{day:'numeric',month:'short'}).format(new Date(ts))}</span>`;
const ago=L.ago=ts=>{ const s=Math.max(0,Math.round((now()-ts)/1000)); if(s<50) return t('just now','الآن'); const m=Math.round(s/60); if(m<60) return t(`${m} min ago`,`قبل ${m} د`); const h=Math.round(m/60); if(h<24) return t(`${h} h ago`,`قبل ${h} س`); return dt(ts); };
const pn=L.pn=sku=>MF.pn(P0()[sku]);
const go=L.go=(id,q)=>{ location.hash=href(id,q||{}); };
const toast=L.toast=m=>MF.toast(m);
const T2=L.T2=pair=>Array.isArray(pair)?tt(pair):pair;
L.notify=(ic,txt,goTo)=>{ S.notifs.unshift({id:'n'+now()+Math.random().toString(36).slice(2,5),ts:now(),ic,txt,go:goTo||null,read:false}); S.notifs=S.notifs.slice(0,40); };
L.isStaff=()=>MF.ROLES[(MF.C||{}).role]&&MF.ROLES[MF.C.role].grp==='staff';
L.sampleTag=()=>`<span class="pill neu">${t('Sample data','بيانات تجريبية')}</span>`;
/* form field with a name + error slot (validation) */
let LID=0;
L.fld=(name,label,o={})=>{ const id='lf'+(++LID); const err=`<span class="err" id="${id}e" hidden>${I('alert',16)}<span></span></span>`; const hint=o.hint?`<span class="hint" id="${id}h">${o.hint}</span>`:'';
 const a=`id="${id}" name="${name}" aria-describedby="${o.hint?id+'h ':''}${id}e"${o.req?' required aria-required="true"':''}`;
 let ctl; if(o.sel) ctl=`<select class="inp" ${a}>${o.sel.map(([v,l])=>`<option value="${v}"${v===o.val?' selected':''}>${l}</option>`).join('')}</select>`;
 else if(o.ta) ctl=`<textarea class="inp" rows="3" dir="auto" ${a} placeholder="${o.ph||''}">${esc(o.val||'')}</textarea>`;
 else ctl=`<input class="inp${o.ltr?' ltrin':''}" type="${o.type||'text'}" ${o.ltr?'dir="ltr"':'dir="auto"'} value="${esc(o.val==null?'':o.val)}" ${o.im?`inputmode="${o.im}"`:''} ${o.ac?`autocomplete="${o.ac}"`:'autocomplete="off"'} ${o.ph?`placeholder="${o.ph}"`:''} ${o.max?`maxlength="${o.max}"`:''} ${a}>`;
 const pre=o.pre==='SAR'?`<span class="pre"><span class="sar" aria-hidden="true"></span><span class="vh">${t('SAR','ريال')}</span></span>`:o.pre?`<span class="pre">${o.pre}</span>`:'';
 return `<div class="field" data-f="${name}"><label for="${id}">${label}${o.req?` <span class="req">${t('required','مطلوب')}</span>`:''}</label>${pre?`<div class="inpw">${pre}${ctl}</div>`:ctl}${hint}${err}</div>`; };
L.val=name=>{ const el=document.querySelector(`[name="${name}"]`); if(!el) return ''; if(el.type==='checkbox') return el.checked; if(el.type==='radio'){ const c=document.querySelector(`[name="${name}"]:checked`); return c?c.value:''; } return el.value.trim(); };
L.bad=(name,msg)=>{ const f=document.querySelector(`[data-f="${name}"]`); if(!f) return; f.classList.add('bad'); const inp=f.querySelector('[name]'); inp&&inp.setAttribute('aria-invalid','true'); const e=f.querySelector('.err'); if(e){ e.hidden=false; e.querySelector('span').textContent=msg; } };
L.clearBad=()=>document.querySelectorAll('.field.bad').forEach(f=>{ f.classList.remove('bad'); const i=f.querySelector('[name]'); i&&i.removeAttribute('aria-invalid'); const e=f.querySelector('.err'); e&&(e.hidden=true); });
L.focusBad=()=>{ const f=document.querySelector('.field.bad [name]'); f&&f.focus(); };
L.radio=(name,opts,cur,label)=>`<fieldset class="radios"><legend class="vh">${label}</legend>${opts.map(([v,l,s,e])=>{ const id='lf'+(++LID); return `<div class="row rad"><input type="radio" name="${name}" id="${id}" value="${v}"${v===cur?' checked':''}><span class="b"><label class="t" for="${id}">${l}</label>${s?`<span class="s">${s}</span>`:''}</span>${e?`<span class="e">${e}</span>`:''}</div>`; }).join('')}</fieldset>`;
L.check=(name,label,on,sub)=>{ const id='lf'+(++LID); return `<div class="row tog" data-f="${name}"><input class="cb" type="checkbox" name="${name}" id="${id}"${on?' checked':''}><span class="b"><label class="t" for="${id}">${label}</label>${sub?`<span class="s">${sub}</span>`:''}<span class="err" hidden>${I('alert',16)}<span></span></span></span></div>`; };
L.sw=(act,label,on,sub)=>{ const id='lf'+(++LID); return `<div class="row tog"><span class="b"><label class="t" for="${id}">${label}</label>${sub?`<span class="s">${sub}</span>`:''}</span><input class="sw" type="checkbox" role="switch" id="${id}" data-act="${act}"${on?' checked':''}></div>`; };
L.chipsA=(act,opts,cur,label)=>`<div class="chips" role="group" aria-label="${label}">${opts.map(([v,l])=>`<button type="button" class="chip" aria-pressed="${Array.isArray(cur)?cur.includes(v):v===cur}" data-act="${act}" data-arg="${v}">${l}</button>`).join('')}</div>`;
L.ab=(label,act,arg,o={})=>`<button type="button" class="btn ${o.k||'pri'}${o.sm?' sm':''}${o.block?' block':''}" data-act="${act}"${arg!=null?` data-arg="${esc(arg)}"`:''}${o.dis?' disabled aria-disabled="true"':''}${o.lbl?` aria-label="${o.lbl}"`:''}>${o.ic?I(o.ic,20):''}<span>${label}</span></button>`;
L.stepA=(act,key,q,name,o={})=>q>0||o.always?`<div class="step on"><button type="button" data-act="${act}" data-arg="${key}:-1" aria-label="${t('Decrease','إنقاص')} ${name}">${I(q<=1&&!o.always?'trash':'minus',18)}</button><span class="num q" aria-live="polite">${q}</span><button type="button" data-act="${act}" data-arg="${key}:1" aria-label="${t('Increase','زيادة')} ${name}">${I('plus',18)}</button></div>`:`<button type="button" class="add" data-act="${act}" data-arg="${key}:1" aria-label="${t('Add','أضف')} ${name}">${I('plus',20)}<span>${t('Add','أضف')}</span></button>`;

/* ---------------- accounts ---------------- */
L.ACC=[
 ['owner','Faisal Al-Harbi','فيصل الحربي',['Owner · Al Wadi Restaurant','المالك · مطعم الوادي'],'customer'],
 ['bm','Huda Al-Qahtani','هدى القحطاني',['Branch manager · Olaya','مديرة فرع · العليا'],'customer'],
 ['buyer','Ahmed Saleh','أحمد صالح',['Buyer · Olaya kitchen','مشترٍ · مطبخ العليا'],'customer'],
 ['cashier','Mona Al-Otaibi','منى العتيبي',['Cashier · Al Nakheel Shawarma','كاشير · شاورما النخيل'],'customer'],
 ['sales','Faisal Al-Dosari','فيصل الدوسري',['Salesperson · Riyadh North','مندوب مبيعات · شمال الرياض'],'staff'],
 ['van','Yousef Al-Shehri','يوسف الشهري',['Van sales · Van 07','بيع بالفان · فان 07'],'staff'],
 ['driver','Omar Al-Mutairi','عمر المطيري',['Driver · Truck 12','سائق · شاحنة 12'],'staff'],
 ['store','Khalid Al-Ghamdi','خالد الغامدي',['Storekeeper · Riyadh DC','أمين مستودع · مستودع الرياض'],'staff'],
 ['acct','Noura Al-Zahrani','نورة الزهراني',['Accountant · credit desk','محاسبة · مكتب الائتمان'],'staff'],
 ['mgr','Saad Al-Rashid','سعد الراشد',['Manager · credit committee','مدير · لجنة الائتمان'],'staff'],
 ['admin','Lina Al-Faisal','لينا الفيصل',['Admin · MENAFoods','مسؤولة النظام · MENAFoods'],'staff'],
 ['aff','Noura (affiliate)','نورة (شريكة)',['Outside affiliate','شريكة تسويق خارجية'],'outside']];
L.acc=role=>L.ACC.find(a=>a[0]===role)||L.ACC[0];
L.home=role=>{ const R=MF.ROLES[role]; return R&&R.nav.length?R.nav[0][1]:'ob.welcome'; };
L.login=(role)=>{ S.session={role,ts:now()}; save(); const q={role,lang:hp().lang||S.prefs.lang||null,theme:hp().theme||S.prefs.theme||null}; Object.keys(q).forEach(k=>{ if(!q[k]) delete q[k]; }); const s=new URLSearchParams(q).toString(); location.hash=`#/${L.home(role)}?${s}`; setTimeout(()=>toast(t(`Signed in as ${L.acc(role)[1]}`,`تم الدخول باسم ${L.acc(role)[2]}`)),60); };
L.logout=()=>{ S.session=null; save(); const q=new URLSearchParams(); const p=hp(); if(p.lang) q.set('lang',p.lang); if(p.theme) q.set('theme',p.theme); location.hash='#/app.login'+(q.toString()?'?'+q:''); };

/* ---------------- action registry ---------------- */
const ACT=L.ACT={};
L.rr=()=>{ const y=scrollY; const ae=document.activeElement; const key=ae&&(ae.dataset.act?`[data-act="${ae.dataset.act}"][data-arg="${ae.dataset.arg||''}"]`:ae.id?'#'+ae.id:null); MF.render(false); post(); scrollTo(0,y); if(key){ try{ const el=document.querySelector(key); el&&el.focus({preventScroll:true}); }catch(e){} } };
ACT.login=a=>L.login(a);
ACT.logout=()=>L.logout();
ACT.lang=()=>{ const p=hp(); const nl=(MF.C&&MF.C.ar)?'en':'ar'; S.prefs.lang=nl; save(); MF.setParam('lang',nl); };
ACT.setlang=a=>{ S.prefs.lang=a; save(); MF.setParam('lang',a); };
ACT.settheme=a=>{ S.prefs.theme=a; save(); MF.setParam('theme',a); };
ACT.offline=(a,el)=>{ S.offline=el&&el.type==='checkbox'?el.checked:!S.offline; save(); if(!S.offline&&L.flushQueue) L.flushQueue(); else toast(t('Offline mode on · changes wait on this device','وضع عدم الاتصال · تنتظر التغييرات على الجهاز')); L.rr(); };
ACT.reset=()=>{ if(!ACT.reset.armed){ ACT.reset.armed=true; toast(t('Tap again to reset all demo data','اضغط مرة أخرى لإعادة ضبط بيانات العرض')); setTimeout(()=>ACT.reset.armed=false,4000); return; } ACT.reset.armed=false; L.reset(); toast(t('Demo data reset','تمت إعادة ضبط بيانات العرض')); L.rr(); };
ACT.nav=a=>{ const [id,qs]=a.split('?'); go(id,Object.fromEntries(new URLSearchParams(qs||''))); };
ACT.otp=()=>{ L.clearBad(); const ph=L.val('phone').replace(/\D/g,''); if(!/^5\d{8}$/.test(ph)){ L.bad('phone',t('Enter 9 digits starting with 5','أدخل 9 أرقام تبدأ بـ 5')); L.focusBad(); return; } L.ui.otp=ph; L.rr(); toast(t('Sample code sent: 4821','أُرسل رمز تجريبي: 4821')); setTimeout(()=>{ const o=document.querySelector('[name=code]'); o&&o.focus(); },50); };
ACT.verify=()=>{ L.clearBad(); const c=L.val('code'); if(c!=='4821'){ L.bad('code',t('That code isn’t right. The sample code is 4821.','الرمز غير صحيح. الرمز التجريبي 4821.')); L.focusBad(); return; } L.ui.otp=null; L.login('owner'); };
L.ui={};

/* capture clicks before the prototype runtime */
document.addEventListener('click',e=>{
 if(!MF.booted) return;
 const q=e.target.closest('[data-q]');
 if(q){ e.stopPropagation(); e.preventDefault(); const [sku,d]=q.dataset.q.split(':'); L.addCart(sku,Number(d)); return; }
 const a=e.target.closest('[data-act]');
 if(a&&!a.disabled){ if(a.tagName!=='INPUT') e.preventDefault(); e.stopPropagation(); const f=ACT[a.dataset.act]; if(f) f(a.dataset.arg, a, e); else toast(t('Done','تم')); return; }
 const back=e.target.closest('header a.bk, header a[data-back]');
 if(back && L.navStack.length>1){ e.preventDefault(); history.back(); return; }
},true);
document.addEventListener('change',e=>{ const a=e.target.closest('input[type=checkbox][data-act],select[data-act]'); if(a){ /* handled in click for checkbox; selects here */ if(a.tagName==='SELECT'){ const f=ACT[a.dataset.act]; f&&f(a.value,a,e); } } },true);
document.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const i=e.target.closest('input[data-enter]'); if(i){ e.preventDefault(); const f=ACT[i.dataset.enter]; f&&f(i.value,i,e); } } });

/* cart */
L.addCart=(sku,d,silent)=>{ const p=P0()[sku]; if(!p) return; if(p.stock==='out'&&d>0){ toast(t('Out of stock — we’ll notify you','نفد المخزون — سننبهك')); return; } const q=Math.max(0,(S.cart[sku]||0)+d); if(q) S.cart[sku]=q; else delete S.cart[sku]; save(); if(!silent){ L.rr(); const T=MF.cartTot(); toast(q?t(`${pn(sku)} · ${q} in cart · ${T.n} items`,`${pn(sku)} · ${q} في السلة · ${T.n} قطع`):t(`Removed ${pn(sku)}`,`أُزيل ${pn(sku)}`)); } };

/* ---------------- history-aware back ---------------- */
L.navStack=JSON.parse(sessionStorage.getItem('mf-nav')||'[]');
function track(){ const h=location.hash.split('?')[0]; const st=L.navStack; if(st.length>1&&st[st.length-2]===h) st.pop(); else if(st[st.length-1]!==h) st.push(h); if(st.length>40) st.splice(0,st.length-40); sessionStorage.setItem('mf-nav',JSON.stringify(st)); }

/* ---------------- tick: simulated time ---------------- */
L.ticks=[];
L.tick=()=>{ let ch=false; L.ticks.forEach(f=>{ if(f()) ch=true; }); if(ch) save(); return ch; };
setInterval(()=>{ if(!MF.booted||document.hidden) return; const ch=L.tick(); if(ch){ const ae=document.activeElement; const typing=ae&&(ae.tagName==='INPUT'||ae.tagName==='TEXTAREA'||ae.tagName==='SELECT'); if(!typing && !document.querySelector('.sheet')) L.rr(); } },3000);

/* ---------------- overrides of prototype blocks ---------------- */
const btn0=H.btn;
H.btn=(label,o={})=>{ if(!o.go&&!o.st&&!o.toast) o=Object.assign({},o,{toast:t('Done · saved in this demo','تم · محفوظ في هذا العرض')}); return btn0(label,o); };

/* ---------------- screen helpers ---------------- */
L.def=(id,patch)=>{ const d=MF.SCR[id]; if(!d){ return; } Object.assign(d,patch); if(patch.r) d.r=patch.r.split(' '); return d; };
L.scr=(id,def)=>{ if(MF.SCR[id]){ L.def(id,def); return; } MF.S(id,def); };

/* ---------------- LOGIN ---------------- */
const ALLR='owner bm buyer cashier sales van driver store acct mgr admin aff guest';
L.scr('app.login',{a:'onboarding',r:ALLR,t:['Sign in','تسجيل الدخول'],noSeg:true,
 render:(c)=>{ const grp=(g,title)=>H.sec(title,L.ACC.filter(a=>a[4]===g).map(([r,en,ar,ctx])=>`<button type="button" class="row" data-act="login" data-arg="${r}"><span class="avs" aria-hidden="true">${(c.ar?ar:en).slice(0,1)}</span><span class="b"><span class="t">${c.ar?ar:en}</span><span class="s">${tt(ctx)}</span></span><span class="chev">${I('chev',18)}</span></button>`).join(''));
  let h=`<div class="lv-hero"><span class="lv-logo" aria-hidden="true">${I('store',30)}</span><p class="lv-k">MENAFoods</p><h2 class="disp">${t('Wholesale food for your business','مواد غذائية بالجملة لمنشأتك')}</h2><p>${t('Working preview: everything you do is saved on this device only. Sample businesses, prices and stock.','نسخة تجريبية تعمل: كل ما تفعله يُحفظ على هذا الجهاز فقط. منشآت وأسعار ومخزون تجريبية.')}</p><div class="btns lv-mini">${L.ab(c.ar?'English':'العربية','lang',null,{k:'sec',sm:true,ic:'globe'})}${L.ab(c.theme==='dark'?t('Light','فاتح'):t('Dark','داكن'),'settheme',c.theme==='dark'?'light':'dark',{k:'sec',sm:true,ic:c.theme==='dark'?'sun':'moon'})}</div></div>`;
  h+=H.sec(t('Sign in with your mobile','الدخول برقم الجوال'),`<div class="card pad">${L.ui.otp?L.fld('code',t('Enter the 4-digit code','أدخل الرمز المكون من 4 أرقام'),{req:true,ltr:true,im:'numeric',max:4,ac:'one-time-code',hint:t(`Sent to +966 ${L.ui.otp} · sample code 4821`,`أُرسل إلى ‎+966 ${L.ui.otp} · الرمز التجريبي 4821`)})+H.btns(L.ab(t('Verify & sign in','تحقق وادخل'),'verify'),L.ab(t('Change number','غيّر الرقم'),'otpback',null,{k:'sec'})):L.fld('phone',t('Mobile number','رقم الجوال'),{req:true,ltr:true,im:'tel',pre:'+966',ph:'5X XXX XXXX',max:12,ac:'tel-national',hint:t('Any 9 digits starting with 5 (sample). Signs you in as the owner.','أي 9 أرقام تبدأ بـ 5 (تجريبي). يدخلك كمالك.')})+H.btns(L.ab(t('Send code','أرسل الرمز'),'otp'))}</div>`,{raw:true});
  h+=`<p class="lv-or"><span>${t('or pick a sample account','أو اختر حسابًا تجريبيًا')}</span></p>`;
  h+=grp('customer',t('Customers','العملاء'))+grp('staff',t('MENAFoods staff','موظفو MENAFoods'))+grp('outside',t('Partners','الشركاء'));
  h+=H.sec('',H.row({ic:'store',tone:'brand',t:t('New business? Create an account','منشأة جديدة؟ أنشئ حسابًا'),s:t('Sign-up flow (prototype screens)','مسار التسجيل (شاشات نموذجية)'),go:'ob.welcome',q:{role:'guest'}}));
  return h; }});
ACT.otpback=()=>{ L.ui.otp=null; L.rr(); };

/* ---------------- ACCOUNT & DEMO CONTROLS ---------------- */
L.scr('app.me',{a:'settings',r:ALLR,t:['Account & demo','الحساب والعرض'],back:'more',noSeg:true,
 render:(c)=>{ const a=L.acc(c.role); const th=c.theme;
  let h=H.sec('',`<div class="card pad acct"><span class="av" aria-hidden="true">${(c.ar?a[2]:a[1]).slice(0,1)}</span><span style="flex:1;min-width:0"><h2>${c.ar?a[2]:a[1]}</h2><span class="s">${tt(a[3])}</span></span>${L.sampleTag()}</div>`,{raw:true});
  h+=H.sec(t('Switch account','تبديل الحساب'),`<div class="card grp">${L.ACC.map(([r,en,ar,ctx])=>`<button type="button" class="row" data-act="login" data-arg="${r}"${r===c.role?' aria-current="true"':''}><span class="avs" aria-hidden="true">${(c.ar?ar:en).slice(0,1)}</span><span class="b"><span class="t">${c.ar?ar:en}</span><span class="s">${tt(ctx)}</span></span>${r===c.role?H.pill('ok',t('Signed in','مسجّل')):`<span class="chev">${I('chev',18)}</span>`}</button>`).join('')}</div>`,{raw:true});
  h+=H.sec(t('Language','اللغة'),L.radio('lang',[['ar','العربية',t('Right to left','من اليمين لليسار')],['en','English',t('Left to right','من اليسار لليمين')]],c.lang,t('Language','اللغة')));
  h+=H.sec(t('Appearance','المظهر'),L.radio('theme',[['light',t('Light','فاتح')],['dark',t('Dark','داكن')]],th,t('Theme','المظهر')));
  h+=H.sec(t('Demo controls','أدوات العرض'),L.sw('offline',t('Simulate offline','محاكاة عدم الاتصال'),S.offline,t('Orders, invoices and messages wait on the device and send when you switch back','تنتظر الطلبات والفواتير والرسائل على الجهاز وتُرسل عند العودة'))+H.row({ic:'clock',tone:'brand',t:t('Fast-forward 1 hour','تقديم الوقت ساعة'),s:t('Advances order status, request replies and timers','يقدّم حالة الطلبات وردود الطلبات والمؤقتات'),end:L.ab(t('Advance','قدّم'),'ff',null,{sm:true,k:'sec'})})+H.row({ic:'refresh',tone:'warn',t:t('Reset demo data','إعادة ضبط بيانات العرض'),s:t('Clears orders, cart, requests and points on this device','يمسح الطلبات والسلة والطلبات والنقاط على هذا الجهاز'),end:L.ab(t('Reset','إعادة ضبط'),'reset',null,{sm:true,k:'out'})}));
  h+=H.note(t('Working preview · front-end only · sample data saved in this browser. No real payments, prices, stock or messages are sent.','نسخة تجريبية تعمل · واجهة فقط · بيانات تجريبية محفوظة في هذا المتصفح. لا تُرسل مدفوعات أو أسعار أو مخزون أو رسائل حقيقية.'));
  return {b:h,dock:L.ab(t('Sign out','تسجيل الخروج'),'logout',null,{k:'sec',ic:'key'})}; }});
document.addEventListener('change',e=>{ const r=e.target; if(r.type==='radio'&&MF.C&&MF.C.id==='app.me'){ if(r.name==='lang') ACT.setlang(r.value); if(r.name==='theme') ACT.settheme(r.value); } if(r.type==='radio'&&MF.C&&MF.C.id==='set.prefs'){ if(r.name==='lang') ACT.setlang(r.value); if(r.name==='theme') ACT.settheme(r.value); } });
ACT.ff=()=>{ L.shift(60*MIN); toast(t('Moved 1 hour ahead','تقدّم الوقت ساعة')); L.rr(); };
L.shift=ms=>{ /* move all timestamps back = time passes */ const mv=o=>{ if(!o||typeof o!=='object') return; if(Array.isArray(o)){ o.forEach(mv); return; } Object.keys(o).forEach(k=>{ if((k==='ts'||k==='at')&&typeof o[k]==='number') o[k]-=ms; else if(typeof o[k]==='object') mv(o[k]); }); }; ['orders','tickets','apps','chat'].forEach(k=>mv(S[k])); L.tick(); save(); };
L.def('set.prefs',{render:(c)=>H.sec(t('Language','اللغة'),L.radio('lang',[['ar','العربية'],['en','English']],c.lang,t('Language','اللغة')))+H.sec(t('Appearance','المظهر'),L.radio('theme',[['light',t('Light','فاتح')],['dark',t('Dark','داكن')]],c.theme,t('Theme','المظهر')))+H.sec(t('Dates & numbers','التواريخ والأرقام'),H.kv([[t('Primary calendar','التقويم الأساسي'),t('Gregorian','ميلادي')],[t('Secondary','الثانوي'),t('Hijri (Umm al-Qura)','هجري (أم القرى)')],[t('Currency','العملة'),M(1234.5)]]))});

/* "More": account card + demo controls first */
const more0=MF.SCR.more.render;
L.def('more',{render:(c)=>{ const a=L.acc(c.role); return H.sec('',H.rows([{av:(c.ar?a[2]:a[1]).slice(0,1),t:c.ar?a[2]:a[1],s:t('Switch account, language, theme, offline, reset','تبديل الحساب واللغة والمظهر وعدم الاتصال وإعادة الضبط'),go:'app.me'},{ic:'msg',tone:'brand',t:t('Help & support','المساعدة والدعم'),go:'cc.home'}]))+more0(c).replace(/^<section class="sec\s*"><div class="card pad acct">[\s\S]*?<\/section>/,''); }});

/* ---------------- post-render polish ---------------- */
function post(){
 const c=MF.C; if(!c) return;
 document.documentElement.classList.add('lv');
 const f=document.querySelector('.foot'); if(f) f.innerHTML=`${I('info',14)}<span>${t('Working preview · sample data saved on this device · not real prices or stock','نسخة تجريبية تعمل · بيانات تجريبية محفوظة على هذا الجهاز · ليست أسعارًا أو مخزونًا حقيقيًا')} · <a class="lv-u" href="${href('app.me')}">${t('Demo controls','أدوات العرض')}</a></span>`;
 /* header: language toggle + account on root screens */
 const tb=document.querySelector('header.tb .tbr'); const root=document.querySelector('header.tb.root');
 if(tb && c.id!=='app.login'){ const sp=tb.querySelector('.sp,.sp0'); const lang=`<button type="button" class="ib" data-act="lang" aria-label="${c.ar?'EN — Switch to English':'ع — التبديل إلى العربية'}"><span class="lvl" aria-hidden="true">${c.ar?'EN':'ع'}</span></button>`;
  if(root){ const me=tb.querySelector(`a[href*="#/more"]`); if(me){ me.setAttribute('href',href('app.me')); me.setAttribute('aria-label',t('Account, switch role, demo controls','الحساب وتبديل الدور وأدوات العرض')); } else if(c.role!=='guest') sp&&sp.insertAdjacentHTML('afterend',`<a class="ib" href="${href('app.me')}" aria-label="${t('Account, switch role, demo controls','الحساب وتبديل الدور وأدوات العرض')}">${I('user')}</a>`); sp&&sp.insertAdjacentHTML('afterend',lang); }
  const bk=document.querySelector('header.tb a.ib[href^="#/"]:first-child, header.tb .tbr > a.ib:first-child'); if(bk && !root) bk.setAttribute('data-back','1');
 }
 /* unread badge on bell */
 const un=S.notifs.filter(n=>!n.read).length; document.querySelectorAll('a[href*="#/n.center"] .dot').forEach(d=>{ if(!un) d.remove(); });
 document.querySelectorAll('a[href*="#/n.center"][aria-label]').forEach(a=>a.setAttribute('aria-label',un?t(`Notifications, ${un} new`,`الإشعارات، ${un} جديدة`):t('Notifications','الإشعارات')));
 if(S.offline && !document.querySelector('.offbar')){ const m=document.querySelector('main'); m&&m.insertAdjacentHTML('afterbegin',`<div class="offbar" role="status">${I('wifioff',16)}<span>${t('Offline (simulated) · changes wait on this device','غير متصل (محاكاة) · تنتظر التغييرات على الجهاز')}</span><button type="button" class="lv-on" data-act="offline">${t('Go online','اتصل')}</button></div>`); }
 if(L.post) L.post.forEach(fn=>fn(c));
}
L.post=[]; L.postFn=post;

/* ---------------- boot ---------------- */
const boot0=MF.boot;
MF.boot=()=>{
 const p=hp();
 if(p.role && MF.ROLES[p.role] && p.role!=='guest'){ if(!S.session||S.session.role!==p.role){ S.session={role:p.role,ts:now()}; save(); } }
 const pub=['app.login','ob.welcome','ob.phone','ob.otp','ob.cr','ob.vat','ob.business','ob.review','rx.join','rx.kyc','cc.home','cc.topics','cc.article','cc.chat','cc.callback','cc.whatsapp'];
 if(!S.session && p.role!=='guest' && !pub.includes(p.id)){ const q=new URLSearchParams(); const lang=p.lang||S.prefs.lang; const th=p.theme||S.prefs.theme; if(lang) q.set('lang',lang); if(th) q.set('theme',th); history.replaceState(null,'','#/app.login'+(q.toString()?'?'+q:'')); }
 else if(S.session && (!p.role || !p.id)){ const q=new URLSearchParams(location.hash.split('?')[1]||''); q.set('role',S.session.role); if(!q.get('lang')&&S.prefs.lang) q.set('lang',S.prefs.lang); if(!q.get('theme')&&S.prefs.theme) q.set('theme',S.prefs.theme); const id=p.id&&MF.SCR[p.id]&&p.id!=='app.login'?p.id:L.home(S.session.role); history.replaceState(null,'','#/'+id+'?'+q); }
 L.tick(); track(); MF.booted=true; MF.render(false); post();
};
window.addEventListener('hashchange',()=>{ track(); const p=hp(); if(p.role&&MF.ROLES[p.role]&&p.role!=='guest'&&(!S.session||S.session.role!==p.role)){ S.session={role:p.role,ts:now()}; save(); } post(); });
})();
