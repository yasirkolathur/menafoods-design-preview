/* MENAFoods data adapter (MFAPI) — the ONE place screens read and write data.
   Every app (buyer apps, customer care, seller apps, ERP connector) loads state with
   MFAPI.store(name,key).read() and saves with .write(state). Nothing else touches storage.

   mode 'sample' (default, public preview): state lives in this browser only (localStorage), seeded
                 with clearly-labelled sample data. No network calls.
   mode 'live'   : state is a cache of the Catalyst gateway. On start the app boots from
                 GET {prefix}/bootstrap/{store}; every write is diffed per entity (ENTITIES below)
                 and sent as POST/PATCH/PUT with an Idempotency-Key. Failed calls wait in an
                 outbox and are retried when the device is back online. No keys in the front end:
                 requests use credentials:'include' (httpOnly session cookie from OTP login).
   See /research/zoho-live-data-map.md (workspace) for each endpoint's Zoho app, module and shape. */
(function(){
'use strict';
const C=Object.assign({mode:'auto',baseUrl:'',prefix:'/server/mf_zoho_gateway/v1',erpPrefix:'/server/mf_erp_connector/v1',timeoutMs:15000},window.MF_API_CONFIG||{});
/* Gateway paths used by the screens — the ONE place to change them (or override with MF_API_CONFIG.paths).
   Relative to `prefix`. Staff document views add ?{customerParam}=<id>. */
const PATHS=Object.freeze(Object.assign({
  staffCustomers:'/staff/customers',   // GET ?q=  → {data:[{id,name,name_ar?,customer_number?}]}
  invoices:'/invoices',                // GET [?customer_id=] → {data:[{no,date,due,total,balance,status,lines?}]}
  payments:'/payments',                // GET [?customer_id=] → {data:[{id,ts,amount,method,invoices[]}]}
  'payments.cash.request':'/payments/cash/request', // POST {amount,currency,invoice_ids,staff_id,staff_role,otp_target} → {request_id,status,otp_sent_to,expires_at}
  'payments.cash.verify':'/payments/cash/verify',   // POST {request_id,otp} → {payment_id,receipt_id,status,amount,received_by,ts}
  creditNotes:'/credit-notes',         // GET [?customer_id=] → {data:[{no,invoice,amount,date,reason,reason_ar?}]}
  catalogPreview:'/catalog/preview-data', // GET [?page=1&limit=40] → {P,CATS?,page,pages,total,has_more,...}; no params = full list
  customerParam:'customer_id'
},C.paths||{}));
/* Live mode turns on ONLY when
   (a) the page itself is served by the Catalyst preview host (same origin as the gateway), or
   (b) the URL asks for ?mode=live — then the gateway is called on a RELATIVE path of the current origin.
   No Catalyst URL is ever hard-coded, so the public GitHub Pages site can never call it. ?api=sample always wins. */
const QS=(()=>{ try{ return new URLSearchParams(location.search); }catch(e){ return new URLSearchParams(); } })();
const onCatalyst=/\.catalystserverless\.(com|in|eu)$/i.test(location.hostname||'') && /^\/(server|app)\//.test(location.pathname||'');
let mode=C.mode;
if(mode!=='sample'&&mode!=='live') mode=(onCatalyst||QS.get('mode')==='live')?'live':'sample';
if(QS.get('api')==='sample') mode='sample';
C.mode=mode; C.baseUrl='';                 /* always same-origin / relative */
const LIVE=mode==='live';
const LIVE_STORES={shop:true};             /* seller apps (mkt) stay on sample data for now */
const isLive=name=>LIVE&&!!LIVE_STORES[name];
const T=(en,ar)=>((document.documentElement.lang||'').slice(0,2)==='ar'||/[?&]lang=ar/.test(location.hash))?ar:en;
const NOT_IN_PREVIEW=['Not available in the preview yet','غير متاح في المعاينة بعد'];
const isNotEnabled=(status,body)=>{ const e=body&&body.error; const code=typeof e==='string'?e:(e&&e.code); return code==='not_enabled_in_preview'||(status===501&&!!e); };

/* ---------- local persistence (sample data, or the live offline cache) ---------- */
const ls={
  get(k){ try{ return JSON.parse(localStorage.getItem(k)||'null'); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); return true; }catch(e){ return false; } },
  del(k){ try{ localStorage.removeItem(k); }catch(e){} }
};
const ck=(k,name)=>isLive(name)?'mfapi-live:'+k:k;      /* live cache never mixes with sample data */

/* ---------- entity registry: which state paths are real business data, and their endpoints ---------- */
/* kind 'list' = array keyed by `key` (create/update per item); 'doc' = whole object (PUT); ro = read only */
const ENTITIES={
 shop:[
  {p:'cart',kind:'doc',put:'/cart'},
  {p:'favs',kind:'doc',put:'/me/favourites'},
  {p:'prefs',kind:'doc',local:true},   /* sent only on an explicit change, see savePrefs */
  {p:'lists',kind:'list',key:'id',post:'/lists',patch:'/lists/{id}'},
  {p:'par',kind:'doc',put:'/stock/par-levels'},
  {p:'onhand',kind:'doc',put:'/stock/counts'},
  {p:'orders',kind:'list',key:'id',post:'/orders',patch:'/orders/{id}'},
  {p:'payments',kind:'list',key:'id',post:'/payments'},
  {p:'apps',kind:'list',key:'id',post:'/approvals',patch:'/approvals/{id}'},
  {p:'tickets',kind:'list',key:'id',post:'/care/tickets',patch:'/care/tickets/{id}'},
  {p:'disputes',kind:'list',key:'id',post:'/invoices/disputes',patch:'/invoices/disputes/{id}'},
  {p:'refs',kind:'list',key:'n',post:'/rewards/referrals'},
  {p:'myRewards',kind:'list',key:'id',post:'/rewards/redemptions'},
  {p:'hub.exp',kind:'list',key:'id',post:'/hub/expenses',patch:'/hub/expenses/{id}'},
  {p:'hub.bills',kind:'list',key:'id',post:'/hub/bills',patch:'/hub/bills/{id}'},
  {p:'hub.cash',kind:'doc',put:'/hub/cash-drawer'},
  {p:'field.acts',kind:'list',key:'id',post:'/field/activities'},
  {p:'van.inv',kind:'list',key:'id',post:'/van/invoices'},
  {p:'route',kind:'list',key:'id',patch:'/driver/deliveries/{id}'},
  {p:'picks',kind:'list',key:'id',patch:'/warehouse/picks/{id}'},
  {p:'notifs',kind:'list',key:'id',patch:'/notifications/{id}'},
  {p:'wire.branches',kind:'list',key:'id',post:'/branches'},
  {p:'wire.team',kind:'list',key:'id',post:'/team/invites'},
  {p:'wire.callback',kind:'doc',put:'/care/callback'},
  /* read-only in the app: changed only by the gateway (Books / Commerce / CRM) */
  {p:'invoices',ro:1},{p:'cns',ro:1},{p:'credit',ro:1},{p:'points',ro:1},{p:'ptsLog',ro:1},{p:'chat',ro:1}
 ],
 mkt:[
  {p:'me',kind:'doc',put:'/seller/me'},
  {p:'products',kind:'list',key:'id',post:'/seller/products',patch:'/seller/products/{id}'},
  {p:'orders',kind:'list',key:'id',patch:'/seller/orders/{id}'},
  {p:'promos',kind:'list',key:'id',post:'/seller/promotions',patch:'/seller/promotions/{id}'},
  {p:'msgs',kind:'list',key:'id',post:'/seller/messages'},
  {p:'reviews',kind:'list',key:'id',patch:'/seller/reviews/{id}'},
  {p:'tickets',kind:'list',key:'id',post:'/seller/tickets',patch:'/seller/tickets/{id}'},
  {p:'team',kind:'list',key:'id',post:'/seller/team',patch:'/seller/team/{id}'},
  {p:'settings',kind:'doc',put:'/seller/settings'},
  {p:'erp.conn',kind:'doc',put:'/connections/current',erp:1},
  {p:'erp.conflicts',kind:'list',key:'id',patch:'/connections/current/conflicts/{id}',erp:1},
  {p:'payouts',ro:1},{p:'comm',ro:1},{p:'sellers',ro:1}
 ]
};
const getP=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
const setP=(o,p,v)=>{ const ks=p.split('.'); let a=o; for(let i=0;i<ks.length-1;i++){ if(a[ks[i]]==null) return; a=a[ks[i]]; } a[ks[ks.length-1]]=v; };
const J=x=>JSON.stringify(x===undefined?null:x);

/* ---------- network (live only) ---------- */
let session=null;   /* never persisted; the gateway may instead set an httpOnly cookie */
const uid=()=>(crypto&&crypto.randomUUID)?crypto.randomUUID():('k'+Date.now()+Math.random().toString(36).slice(2));
/* Catalyst web SDK access token (the preview gate and /app/ use the same one). Kept in memory only for
   a few minutes — never stored, logged or sent anywhere except same-origin gateway calls. */
let tokC=null,tokAt=0,tokP=null;
const fmtTok=t=>{ if(!t) return null; t=String(t).trim(); if(!t) return null; return /^(Zoho-oauthtoken|Bearer)\s+/i.test(t)?t:'Zoho-oauthtoken '+t; };
function sdkToken(force){
  const pv=window.__mfpvAuth; if(pv&&typeof pv.token==='function') return Promise.resolve().then(()=>pv.token(!!force)).then(fmtTok,()=>null);
  const a=window.catalyst&&window.catalyst.auth; if(!a||typeof a.generateAuthToken!=='function') return Promise.resolve(null);
  if(!force&&tokC&&Date.now()-tokAt<45*60*1000) return Promise.resolve(tokC);
  if(tokP) return tokP;
  tokP=Promise.race([Promise.resolve().then(()=>a.generateAuthToken()),new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),6000))])
    .then(r=>{ const u=r&&Object.prototype.hasOwnProperty.call(r,'content')?r.content:r; tokC=fmtTok((r&&r.access_token)||(u&&u.access_token)); tokAt=Date.now(); return tokC; },()=>null)
    .then(v=>{ tokP=null; return v; });
  return tokP;
}
const sameOrig=u=>{ try{ return new URL(u,location.href).origin===location.origin; }catch(e){ return false; } };
/* in-flight + short memo for boot GETs so /me, catalogue and bootstrap are started once and shared */
const inflight={}, memo={};
const bootKey=path=>{ try{ const u=new URL(path, 'http://local'); const clean=u.pathname; if(/\/me$/.test(clean)) return clean; if(/\/bootstrap\/[^/]+$/.test(clean)) return clean; if(/\/catalog\/preview-data$/.test(clean)) return clean+u.search; }catch(e){ const q=String(path||'').split('?'); const clean=q[0]; if(/\/me$/.test(clean)||/\/bootstrap\/[^/?]+$/.test(clean)) return clean; if(/\/catalog\/preview-data$/.test(clean)) return String(path||''); } return null; };
function hdrs(r){ const o={}; try{ r.headers.forEach((v,k)=>{ o[String(k).toLowerCase()]=v; }); }catch(e){} return o; }
function request(method,path,body,opt){
  opt=opt||{};
  if(!LIVE) return Promise.reject(Object.assign(new Error('sample mode: no network'),{code:'SAMPLE_MODE'}));
  const url=(C.baseUrl||'')+(opt.erp?C.erpPrefix:C.prefix)+path;
  const mk=(method==='GET'&&body===undefined)?bootKey(url):null;
  if(mk&&!opt.nomemo){
    if(inflight[mk]) return inflight[mk];
    const hit=memo[mk]; if(hit&&Date.now()-hit.t<15000) return Promise.resolve(hit.j);
  }
  const idem=method!=='GET'?(opt.idem||uid()):null;
  const send=(tk,retried)=>{
    const ctl=('AbortController' in window)?new AbortController():null; const tm=ctl&&setTimeout(()=>ctl.abort(),C.timeoutMs);
    const h={'Accept':'application/json','Accept-Language':document.documentElement.lang||'en'};
    if(body!==undefined) h['Content-Type']='application/json';
    if(idem) h['Idempotency-Key']=idem;
    if(session) h['Authorization']='Bearer '+session;   /* short-lived session token from /auth/otp/verify, memory only */
    else if(tk) h['Authorization']=tk;                   /* Catalyst SDK token, same origin only */
    if(opt.headers) Object.keys(opt.headers).forEach(k=>{ if(opt.headers[k]!=null) h[k]=opt.headers[k]; });
    return fetch(url,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),credentials:'include',cache:'no-store',signal:ctl&&ctl.signal})
     .then(r=>{ if(r.status===401&&tk&&!retried&&!session) return sdkToken(true).then(t2=>t2&&t2!==tk?send(t2,true):r); return r; })
     .finally(()=>tm&&clearTimeout(tm));
  };
  const wrap=(r,j)=>{ const headers=hdrs(r), etag=headers.etag||headers['etag']||'', retryAfter=headers['retry-after']; return {status:r.status, headers, etag, data:j, retryAfter}; };
  const tkP=(!session&&sameOrig(url))?sdkToken(false):Promise.resolve(null);
  const run=tkP.then(tk=>send(tk,false))
   .then(r=>{
     if(r.status===304){ const w=wrap(r,null); if(opt.allow304||opt.meta) return w; const e=new Error('HTTP 304'); e.status=304; e.headers=w.headers; e.etag=w.etag; throw e; }
     if(r.status===204) return (opt.meta||opt.allow304)?wrap(r,null):null;
     return r.json().catch(()=>null).then(j=>{
       if(!r.ok){ const er=j&&j.error; const e=new Error((er&&er.message)||(typeof er==='string'?er:'')||('HTTP '+r.status)); e.status=r.status; e.body=j; e.code=typeof er==='string'?er:(er&&er.code)||''; e.message_ar=er&&er.message_ar; e.notEnabled=isNotEnabled(r.status,j); e.headers=hdrs(r); e.retryAfter=e.headers['retry-after']; if(e.notEnabled&&!opt.quiet) notice(path,e); throw e; }
       if(mk) memo[mk]={t:Date.now(),j};
       return (opt.meta||opt.allow304)?wrap(r,j):j;
     });
   });
  if(mk){ inflight[mk]=run; run.finally(()=>{ if(inflight[mk]===run) delete inflight[mk]; }).catch(()=>{}); }
  return run;
}
/* catalogue pages: compact ETag + body (sessionStorage, evict on quota, IndexedDB fallback).
   Key matches the URL exactly: ?page={page}&limit={limit} → mfapi-cat:p{page}l{limit}.
   If-None-Match is sent only when a reusable body is in hand (a 304 has no body). */
const CAT_PF='mfapi-cat:';
const catQL=(page,limit)=>{
  if(page==null||limit==null) return {page:0,limit:0,q:''};
  const p=Math.max(1,parseInt(page,10)||1), l=Math.min(100,Math.max(1,parseInt(limit,10)||40));
  return {page:p,limit:l,q:'?page='+p+'&limit='+l};
};
const CAT_SK=(page,limit)=>CAT_PF+'p'+page+'l'+limit;
const catMem={};
const packP=P=>{ const o={}; if(!P||typeof P!=='object') return o;
  Object.keys(P).forEach(id=>{ const p=P[id]; if(!p||typeof p!=='object') return;
    o[id]=[p.en,p.ar,p.g,p.pk,p.pr,p.u,p.cat,p.moq,p.stock,p.img,p.sku,p.vid,p.live]; }); return o; };
const unpackP=P=>{ const o={}; if(!P||typeof P!=='object') return o;
  Object.keys(P).forEach(id=>{ const p=P[id];
    if(Array.isArray(p)) o[id]={en:p[0],ar:p[1],g:p[2],pk:p[3],pr:p[4],u:p[5],cat:p[6],moq:p[7],stock:p[8],img:p[9],sku:p[10],vid:p[11],live:p[12]};
    else if(p&&typeof p==='object') o[id]=p; }); return o; };
const packBody=b=>{ if(!b||typeof b!=='object') return b;
  return {P:packP(b.P),CATS:b.CATS,page:b.page,limit:b.limit,pages:b.pages,total:b.total,has_more:b.has_more,next_page:b.next_page,count:b.count,source:b.source,build_id:b.build_id,built_at:b.built_at,age_s:b.age_s,stale:b.stale,ordering_disabled:b.ordering_disabled,cache:b.cache,note:b.note}; };
const unpackRec=r=>{ if(!r||typeof r!=='object') return null;
  const body=r.body; if(!body||typeof body!=='object') return {etag:r.etag||'', body:null, t:r.t||0};
  const P=unpackP(body.P); return {etag:r.etag||'', t:r.t||0, body:Object.assign({},body,{P})}; };
let catDbP=null;
function catDb(){ if(catDbP) return catDbP; if(!window.indexedDB){ catDbP=Promise.resolve(null); return catDbP; }
  catDbP=new Promise(res=>{ try{ const q=indexedDB.open('mfapi-cat',1);
    q.onupgradeneeded=()=>{ try{ if(!q.result.objectStoreNames.contains('pages')) q.result.createObjectStore('pages'); }catch(e){} };
    q.onsuccess=()=>res(q.result); q.onerror=()=>res(null); }catch(e){ res(null); } }); return catDbP; }
function catIdbGet(k){ return catDb().then(db=>new Promise(res=>{ if(!db) return res(null);
  try{ const q=db.transaction('pages','readonly').objectStore('pages').get(k); q.onsuccess=()=>res(q.result||null); q.onerror=()=>res(null); }catch(e){ res(null); } })); }
function catIdbSet(k,v){ return catDb().then(db=>new Promise(res=>{ if(!db) return res(false);
  try{ const q=db.transaction('pages','readwrite').objectStore('pages').put(v,k); q.onsuccess=()=>res(true); q.onerror=()=>res(false); }catch(e){ res(false); } })); }
function catSsList(){ const a=[]; try{ for(let i=0;i<sessionStorage.length;i++){ const k=sessionStorage.key(i); if(k&&k.indexOf(CAT_PF)===0){ let t=0,n=0; try{ const r=JSON.parse(sessionStorage.getItem(k)||'null'); t=(r&&r.t)||0; n=(sessionStorage.getItem(k)||'').length; }catch(e){} a.push({k,t,n}); } } }catch(e){} return a; }
function catEvict(keep){ const a=catSsList().filter(x=>x.k!==keep).sort((x,y)=>x.t-y.t||y.n-x.n); let n=0;
  for(let i=0;i<a.length&&n<4;i++){ try{ sessionStorage.removeItem(a[i].k); n++; }catch(e){} } return n; }
function catSsWrite(k,rec){ const raw=JSON.stringify(rec);
  try{ sessionStorage.setItem(k,raw); return true; }
  catch(e){ const quota=e&&(e.name==='QuotaExceededError'||e.code===22||e.code===1014||/quota/i.test(e.name||'')||/quota/i.test(e.message||''));
    if(!quota) return false; catEvict(k);
    try{ sessionStorage.setItem(k,raw); return true; }catch(e2){ try{ sessionStorage.removeItem(k); }catch(x){} return false; } } }
function catReadSync(page,limit){ const k=CAT_SK(page,limit); if(catMem[k]&&catMem[k].body) return catMem[k];
  try{ const rec=unpackRec(JSON.parse(sessionStorage.getItem(k)||'null')); if(rec&&rec.body){ catMem[k]=rec; return rec; } }catch(e){} return null; }
function catRead(page,limit){ const hit=catReadSync(page,limit); if(hit&&hit.body) return Promise.resolve(hit);
  const k=CAT_SK(page,limit);
  return catIdbGet(k).then(raw=>{ const rec=unpackRec(raw); if(rec&&rec.body){ catMem[k]=rec; try{ catSsWrite(k,{etag:rec.etag,t:rec.t,v:1,body:packBody(rec.body)}); }catch(e){} return rec; } return null; }); }
function catWrite(page,limit,etag,body){ if(!etag||!body||!body.P) return; const k=CAT_SK(page,limit);
  const rec={etag,t:Date.now(),v:1,body:packBody(body)}; catMem[k]={etag,t:rec.t,body:unpackRec(rec).body};
  if(!catSsWrite(k,rec)) catIdbSet(k,rec); }
function unwrapCat(j){ if(!j||typeof j!=='object') return j; if(j.P) return j; if(j.data&&j.data.P) return j.data; return j.data||j; }
function getCatalog(page,limit,opt){
  opt=opt||{};
  const base=PATHS.catalogPreview||PATHS.catalog||'/catalog/preview-data';
  const ql=catQL(page,limit);
  return catRead(ql.page,ql.limit).then(cached=>{
    const headers={}; if(cached&&cached.etag&&cached.body) headers['If-None-Match']=cached.etag;
    return request('GET',base+ql.q,undefined,{quiet:opt.quiet!==false, headers, allow304:true, nomemo:!!opt.nomemo||(ql.page>1)}).then(res=>{
      if(res&&res.status===304&&cached&&cached.body) return {status:304, etag:cached.etag, data:cached.body, fromCache:true, headers:res.headers||{}};
      const data=unwrapCat(res&&Object.prototype.hasOwnProperty.call(res,'data')?res.data:res);
      const etag=(res&&res.etag)||'';
      if(data&&data.P) catWrite(ql.page||data.page||0, ql.limit||data.limit||0, etag, data);
      return {status:(res&&res.status)||200, etag, data, fromCache:false, headers:(res&&res.headers)||{}};
    });
  });
}

/* ---------- outbox (live only) ---------- */
const OBK='mfapi-outbox';
const outbox={ all:()=>ls.get(OBK)||[], push(op){ const a=outbox.all(); a.push(op); ls.set(OBK,a); }, set:a=>ls.set(OBK,a) };
let flushing=false;

function flush(){
  if(!LIVE||flushing||!navigator.onLine) return Promise.resolve();
  const a=outbox.all(); if(!a.length) return Promise.resolve();
  flushing=true; const op=a[0];
  return request(op.m,op.path,op.body,{idem:op.idem,erp:op.erp}).then(()=>{ const rest=outbox.all().slice(1); outbox.set(rest); if(op.batch&&!rest.some(x=>x.batch===op.batch)) delete batches[op.batch]; flushing=false; return flush(); },
    e=>{ flushing=false; if(e.notEnabled||(e.status&&e.status>=400&&e.status<500&&e.status!==401&&e.status!==429)){ const rest=outbox.all().slice(1).filter(x=>!op.batch||x.batch!==op.batch); outbox.set(rest); const b=op.batch&&batches[op.batch]; delete batches[op.batch]; emit('rejected',{op,store:op.store,restore:b?b.restore:null,error:e.body||String(e),notEnabled:!!e.notEnabled}); return flush(); } });
}
if(LIVE){ addEventListener('online',flush); setInterval(flush,30000); setTimeout(flush,1500); }

/* ---------- per-entity diff -> operations ---------- */
function diff(store,prev,next){
  const ops=[];
  (ENTITIES[store]||[]).forEach(e=>{ if(e.ro||e.local) return;
    const a=getP(prev,e.p), b=getP(next,e.p); if(J(a)===J(b)) return;
    if(e.kind==='doc'){ if(e.put) ops.push({m:'PUT',path:e.put,body:b,erp:e.erp}); return; }
    const A=new Map((a||[]).map(x=>[String(x&&typeof x==='object'?x[e.key]:x),x]));
    (b||[]).forEach(x=>{ const k=String(x&&typeof x==='object'?x[e.key]:x); const o=A.get(k);
      if(o===undefined){ if(e.post) ops.push({m:'POST',path:e.post,body:x,erp:e.erp}); else if(e.patch) ops.push({m:'PATCH',path:e.patch.replace('{'+e.key+'}',encodeURIComponent(k)),body:x,erp:e.erp}); }
      else if(J(o)!==J(x)&&e.patch) ops.push({m:'PATCH',path:e.patch.replace('{'+e.key+'}',encodeURIComponent(k)),body:x,erp:e.erp}); });
  });
  return ops.map(o=>Object.assign(o,{idem:uid(),ts:Date.now()}));
}

/* ---------- 'not enabled in the preview' (HTTP 501): final, never retried, shown inline ---------- */
function notice(path,e){
  emit('notenabled',{path,code:'not_enabled_in_preview',status:e&&e.status});
  try{
    let n=document.getElementById('mfapi-notice')||notice.n;
    if(!n){ n=document.createElement('div'); n.id='mfapi-notice'; n.setAttribute('role','status'); n.setAttribute('aria-live','polite');
      n.style.cssText='position:fixed;inset-inline:12px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:9999;background:#1f2937;color:#fff;border-radius:12px;padding:12px 44px 12px 14px;font:500 14px/1.4 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25);max-width:560px;margin-inline:auto';
      document.body.appendChild(n); }
    n.innerHTML='<strong></strong><span style="display:block;opacity:.85;font-weight:400"></span><button type="button" aria-label="'+T('Dismiss','إغلاق')+'" style="position:absolute;inset-inline-end:6px;top:6px;background:none;border:0;color:#fff;font-size:20px;width:36px;height:36px;cursor:pointer">×</button>';
    n.querySelector('strong').textContent=T(NOT_IN_PREVIEW[0],NOT_IN_PREVIEW[1]);
    n.querySelector('span').textContent=T('Nothing was changed. This action will work once it is switched on.','لم يتغير شيء. سيعمل هذا الإجراء عند تفعيله.');
    if(!n.isConnected) document.body.appendChild(n);
    notice.n=n; const done=()=>{ n.remove(); notice.n=null; };
    n.querySelector('button').onclick=done;
    /* screens re-render document.body — keep the notice on screen until it times out or is dismissed */
    if(!notice.mo&&window.MutationObserver){ notice.mo=new MutationObserver(()=>{ if(notice.n&&!notice.n.isConnected&&document.body) document.body.appendChild(notice.n); }); notice.mo.observe(document.body,{childList:true}); }
    clearTimeout(notice.t); notice.t=setTimeout(done,8000);
  }catch(x){}
}
/* ---------- boot readiness + transforms (the app registers them once its catalogue is ready) ---------- */
const batches={}, transforms={}, readyP={}, readyR={};
const whenReady=name=>{ if(!readyP[name]){ readyP[name]=new Promise(r=>{ readyR[name]=r; setTimeout(r,20000); }); } return readyP[name]; };
const markReady=name=>{ whenReady(name); readyR[name](); };
/* ---------- events ---------- */
const subs={};
const on=(ev,fn)=>{ (subs[ev]=subs[ev]||[]).push(fn); };
const emit=(ev,x)=>{ (subs[ev]||[]).forEach(f=>{ try{ f(x); }catch(e){ console.warn('[MFAPI]',ev,e); } }); };

/* ---------- stores ---------- */
const synced={};   /* last state acknowledged by the server, per store */
function store(name,key){
  const k=ck(key,name);
  return {
    name, key,
    read(){ return ls.get(k); },   /* live: the diff base is set only from the server snapshot (boot), never from this device's cache */
    write(state){
      ls.set(k,state);
      if(isLive(name)){ const prev=synced[name]; if(prev){ const ops=diff(name,prev,state); if(ops.length){ const bid='b'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); const restore={}; new Set([...Object.keys(prev),...Object.keys(state)]).forEach(x=>{ if(x==='session'||x==='prefs') return; if(J(prev[x])!==J(state[x])) restore[x]=prev[x]===undefined?null:JSON.parse(J(prev[x])); }); batches[bid]={restore}; ops.forEach(op=>{ op.batch=bid; op.store=name; outbox.push(op); }); flush(); } } synced[name]=JSON.parse(J(state)); }
      return state;
    },
    clear(){ ls.del(k); },
    replace(state){ ls.set(k,state); if(isLive(name)) synced[name]=JSON.parse(J(state)); return state; },
    /* live: fetch the server snapshot (same shape as the sample state) and hand it to the app */
    boot(apply){
      if(!isLive(name)) return Promise.resolve(null);
      /* apply as soon as the snapshot is back and the store transform is registered — do not wait for the catalogue */
      return request('GET','/bootstrap/'+name).then(j=>whenReady(name+':xform').then(()=>j)).then(j=>{ let st=(j&&j.data&&typeof j.data==='object'&&!Array.isArray(j.data))?j.data:j; if(st&&transforms[name]){ try{ st=transforms[name](st); }catch(x){ console.warn('[MFAPI] transform',x); st=null; } } if(st){ synced[name]=JSON.parse(J(st)); ls.set(k,st); apply&&apply(st); emit('boot',{store:name}); } return st; },
        e=>{ emit(e.status===401?'auth':'offline',{store:name,error:String(e),status:e.status}); return null; });
    }
  };
}
/* live mode: empty the business data in a freshly seeded state so no sample record is ever shown as real */
function strip(name,state){
  if(!isLive(name)||!state) return state;
  (ENTITIES[name]||[]).forEach(e=>{ const v=getP(state,e.p); if(Array.isArray(v)) setP(state,e.p,[]); else if(typeof v==='number') setP(state,e.p,0); else if(v&&typeof v==='object'&&e.kind!=='doc') setP(state,e.p,{}); });
  return state;
}
/* UI preferences (language, theme): device-local in both modes */
const pref={ get(k,d){ try{ const v=localStorage.getItem(k); return v==null?d:v; }catch(e){ return d; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };

const get=(path)=>request('GET',path);
/* preferences: saved on this device; sent to the gateway only when the user changes one. Quiet on failure;
   once the gateway answers 501 we stop sending for this browser session. */
function savePrefs(p){
  if(!LIVE||!isLive('shop')) return Promise.resolve(null);
  try{ if(sessionStorage.getItem('mfapi-prefs-off')) return Promise.resolve(null); }catch(e){}
  return request('PUT','/me/preferences',p||{},{quiet:true}).catch(e=>{ if(e&&e.notEnabled){ try{ sessionStorage.setItem('mfapi-prefs-off','1'); }catch(x){} } return null; });
}
window.MFAPI={ paths:PATHS, savePrefs, setTransform:(n,f)=>{ transforms[n]=f; }, markReady, whenReady, setSession:t=>{ session=t||null; Object.keys(memo).forEach(k=>{ if(/\/me$/.test(k)) delete memo[k]; }); }, mode:C.mode, live:LIVE, isLive, onCatalyst, vatKnown:false, get, getCatalog, notice:()=>notice('',{}), NOT_IN_PREVIEW, config:Object.freeze(Object.assign({},C)), store, strip, pref, request, flush, outbox:{size:()=>outbox.all().length}, on, ENTITIES, _diff:diff, _catCache:{key:CAT_SK,ql:catQL,read:catRead,readSync:catReadSync,write:catWrite,pack:packBody,unpack:unpackRec,mem:catMem,evict:catEvict} };
/* start independent boot reads as soon as this file runs so they overlap the remaining scripts */
if(LIVE){ Promise.resolve().then(()=>{ request('GET','/me',undefined,{quiet:true}).then(j=>{ try{ sessionStorage.setItem('mfapi-me-cache',JSON.stringify({t:Date.now(),j})); }catch(e){} },()=>{}); getCatalog(1,40,{quiet:true}).catch(()=>{}); }); }
})();
