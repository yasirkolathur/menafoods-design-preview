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
const C=Object.assign({mode:'sample',baseUrl:'',prefix:'/server/mf_zoho_gateway/v1',erpPrefix:'/server/mf_erp_connector/v1',timeoutMs:15000},window.MF_API_CONFIG||{});
/* a URL may force sample mode (for demos), never live */
try{ if(new URLSearchParams(location.search).get('api')==='sample') C.mode='sample'; }catch(e){}
if(C.mode!=='live') C.mode='sample';
const LIVE=C.mode==='live';

/* ---------- local persistence (sample data, or the live offline cache) ---------- */
const ls={
  get(k){ try{ return JSON.parse(localStorage.getItem(k)||'null'); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); return true; }catch(e){ return false; } },
  del(k){ try{ localStorage.removeItem(k); }catch(e){} }
};
const ck=k=>LIVE?'mfapi-live:'+k:k;      /* live cache never mixes with sample data */

/* ---------- entity registry: which state paths are real business data, and their endpoints ---------- */
/* kind 'list' = array keyed by `key` (create/update per item); 'doc' = whole object (PUT); ro = read only */
const ENTITIES={
 shop:[
  {p:'cart',kind:'doc',put:'/cart'},
  {p:'favs',kind:'doc',put:'/me/favourites'},
  {p:'prefs',kind:'doc',put:'/me/preferences'},
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
function request(method,path,body,opt){
  opt=opt||{};
  if(!LIVE) return Promise.reject(Object.assign(new Error('sample mode: no network'),{code:'SAMPLE_MODE'}));
  const url=(C.baseUrl||'')+(opt.erp?C.erpPrefix:C.prefix)+path;
  const ctl=('AbortController' in window)?new AbortController():null; const tm=ctl&&setTimeout(()=>ctl.abort(),C.timeoutMs);
  const h={'Accept':'application/json','Accept-Language':document.documentElement.lang||'en'};
  if(body!==undefined) h['Content-Type']='application/json';
  if(method!=='GET') h['Idempotency-Key']=opt.idem||uid();
  if(session) h['Authorization']='Bearer '+session;   /* short-lived session token from /auth/otp/verify, memory only */
  return fetch(url,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),credentials:'include',signal:ctl&&ctl.signal})
   .then(r=>r.status===204?null:r.json().then(j=>{ if(!r.ok){ const e=new Error((j&&j.error&&j.error.message)||('HTTP '+r.status)); e.status=r.status; e.body=j; throw e; } return j; }))
   .finally(()=>tm&&clearTimeout(tm));
}

/* ---------- outbox (live only) ---------- */
const OBK='mfapi-outbox';
const outbox={ all:()=>ls.get(OBK)||[], push(op){ const a=outbox.all(); a.push(op); ls.set(OBK,a); }, set:a=>ls.set(OBK,a) };
let flushing=false;
function flush(){
  if(!LIVE||flushing||!navigator.onLine) return Promise.resolve();
  const a=outbox.all(); if(!a.length) return Promise.resolve();
  flushing=true; const op=a[0];
  return request(op.m,op.path,op.body,{idem:op.idem,erp:op.erp}).then(()=>{ outbox.set(outbox.all().slice(1)); flushing=false; return flush(); },
    e=>{ flushing=false; if(e.status&&e.status>=400&&e.status<500&&e.status!==401&&e.status!==429){ outbox.set(outbox.all().slice(1)); emit('rejected',{op,error:e.body||String(e)}); return flush(); } });
}
if(LIVE){ addEventListener('online',flush); setInterval(flush,30000); }

/* ---------- per-entity diff -> operations ---------- */
function diff(store,prev,next){
  const ops=[];
  (ENTITIES[store]||[]).forEach(e=>{ if(e.ro) return;
    const a=getP(prev,e.p), b=getP(next,e.p); if(J(a)===J(b)) return;
    if(e.kind==='doc'){ if(e.put) ops.push({m:'PUT',path:e.put,body:b,erp:e.erp}); return; }
    const A=new Map((a||[]).map(x=>[String(x&&typeof x==='object'?x[e.key]:x),x]));
    (b||[]).forEach(x=>{ const k=String(x&&typeof x==='object'?x[e.key]:x); const o=A.get(k);
      if(o===undefined){ if(e.post) ops.push({m:'POST',path:e.post,body:x,erp:e.erp}); else if(e.patch) ops.push({m:'PATCH',path:e.patch.replace('{'+e.key+'}',encodeURIComponent(k)),body:x,erp:e.erp}); }
      else if(J(o)!==J(x)&&e.patch) ops.push({m:'PATCH',path:e.patch.replace('{'+e.key+'}',encodeURIComponent(k)),body:x,erp:e.erp}); });
  });
  return ops.map(o=>Object.assign(o,{idem:uid(),ts:Date.now()}));
}

/* ---------- events ---------- */
const subs={};
const on=(ev,fn)=>{ (subs[ev]=subs[ev]||[]).push(fn); };
const emit=(ev,x)=>{ (subs[ev]||[]).forEach(f=>{ try{ f(x); }catch(e){ console.warn('[MFAPI]',ev,e); } }); };

/* ---------- stores ---------- */
const synced={};   /* last state acknowledged by the server, per store */
function store(name,key){
  const k=ck(key);
  return {
    name, key,
    read(){ const v=ls.get(k); if(LIVE&&v&&!synced[name]) synced[name]=JSON.parse(J(v)); return v; },
    write(state){
      ls.set(k,state);
      if(LIVE){ const prev=synced[name]; if(prev){ diff(name,prev,state).forEach(op=>outbox.push(op)); flush(); } synced[name]=JSON.parse(J(state)); }
      return state;
    },
    clear(){ ls.del(k); },
    /* live: fetch the server snapshot (same shape as the sample state) and hand it to the app */
    boot(apply){
      if(!LIVE) return Promise.resolve(null);
      return request('GET','/bootstrap/'+name).then(j=>{ const st=j&&j.data; if(st){ synced[name]=JSON.parse(J(st)); ls.set(k,st); apply&&apply(st); emit('boot',{store:name}); } return st; },
        e=>{ emit('offline',{store:name,error:String(e)}); return null; });
    }
  };
}
/* live mode: empty the business data in a freshly seeded state so no sample record is ever shown as real */
function strip(name,state){
  if(!LIVE||!state) return state;
  (ENTITIES[name]||[]).forEach(e=>{ const v=getP(state,e.p); if(Array.isArray(v)) setP(state,e.p,[]); else if(typeof v==='number') setP(state,e.p,0); else if(v&&typeof v==='object'&&e.kind!=='doc') setP(state,e.p,{}); });
  return state;
}
/* UI preferences (language, theme): device-local in both modes */
const pref={ get(k,d){ try{ const v=localStorage.getItem(k); return v==null?d:v; }catch(e){ return d; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };

window.MFAPI={ setSession:t=>{ session=t||null; }, mode:C.mode, live:LIVE, config:Object.freeze(Object.assign({},C)), store, strip, pref, request, flush, outbox:{size:()=>outbox.all().length}, on, ENTITIES, _diff:diff };
})();
