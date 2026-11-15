/* MENAFoods · Fresh Market ⇄ Marketplace seller bridge (WORKING PREVIEW, front-end only, SAMPLE DATA).
   1) Approved, active seller listings from seller.html are added to this buyer app's catalogue (ids mk_*).
   2) When a buyer order here contains seller items, a seller order is created in the seller app (same browser storage).
   3) The buyer order page shows the seller's live fulfilment status. */
(function(){
'use strict';
const MF=window.MF, L=MF&&MF.L; if(!MF||!MF.DATA||!L) return;
const KEY='mf-mkt:'+(location.pathname.replace(/\/[^/]*$/,'').split('/').pop()||'app');
/* live mode: marketplace orders are split and routed server-side by the gateway, so the browser bridge is off */
if(MFAPI.live) return;
const ST=MFAPI.store('mkt',KEY);
const read=()=>ST.read();
const write=M=>ST.write(M);
const {t,tt,H,M:MM,N,LTR,href}=MF; const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const r2=v=>Math.round(v*100)/100;
const sName=(M,id,ar)=>{ if(id==='s1'){ const p=M.me.profile||{}; return ar?(p.ar||p.en||''):(p.en||''); } const s=M.sellers.find(x=>x.id===id)||{}; return ar?s.ar:s.en; };
const promo=(M,p)=>(M.promos||[]).find(x=>x.st==='active'&&x.kind==='disc'&&x.sel===p.sel&&(x.scope==='all'||x.scope===p.id));
const spons=(M,p)=>(M.promos||[]).some(x=>x.st==='active'&&x.kind==='spon'&&x.sel===p.sel&&x.pid===p.id);
const unit=(M,p,q)=>{ let b=p.pr; const d=promo(M,p); if(d) b=r2(b*(1-d.pct/100)); let pct=0; (p.tiers||[]).forEach(x=>{ if(q>=x.from) pct=Math.max(pct,x.pct); }); return {u:r2(b*(1-pct/100)),pct}; };
let SIG='';
const inject=()=>{ const M0=read(); const P=MF.DATA.P; const sig=M0?JSON.stringify([M0.products,M0.sellers.map(s=>s.st),M0.promos,M0.me&&M0.me.profile]):''; if(sig===SIG) return false; SIG=sig;
 Object.keys(P).filter(k=>k.indexOf('mk_')===0).forEach(k=>delete P[k]); if(!M0) return true;
 const ok=new Set(M0.sellers.filter(s=>s.st==='approved').map(s=>s.id));
 M0.products.filter(p=>p.st==='active'&&ok.has(p.sel)).forEach(p=>{ const u=unit(M0,p,p.moq).u;
  P['mk_'+p.id]={en:p.en,ar:p.ar||p.en,g:p.g,pk:[`${p.pack[0]} · by ${sName(M0,p.sel)}`,`${p.pack[1]||p.pack[0]} · من ${sName(M0,p.sel,1)}`],pr:u,u:[`min. ${p.moq} case${p.moq>1?'s':''}`,`الحد الأدنى ${p.moq} كرتون`],cat:p.cat,moq:p.moq,stock:p.qty<=0?'out':p.qty<p.moq*5?'low':'in',sp:spons(M0,p)?1:0,sku:p.sku||(p.fs&&p.fs.sku)||'',mk:{id:p.id,sel:p.sel}}; });
 return true; };
inject();
/* forward buyer orders that contain seller items */
const forward=()=>{ const s=L.S&&L.S(); if(!s||!s.orders) return; const M0=read(); if(!M0) return; M0.fwd=M0.fwd||[]; let changed=false;
 s.orders.forEach(o=>{ if(M0.fwd.includes(o.id)) return; if(['queued','approval','rejected','cancelled'].includes(o.st)) return; const keys=Object.keys(o.items||{}).filter(k=>k.indexOf('mk_')===0); if(!keys.length) return;
  const by={}; keys.forEach(k=>{ const p=M0.products.find(x=>'mk_'+x.id===k); if(p) (by[p.sel]=by[p.sel]||[]).push([p,o.items[k]]); });
  Object.keys(by).forEach(sel=>{ const id=String(++M0.seq.o); const W=[['7–9 AM','7–9 ص'],['9–11 AM','9–11 ص'],['2–4 PM','2–4 م']]; const w=W[(o.win||[0,0])[1]]||W[0]; const d=new Date(o.ts+((o.win||[0])[0]+1)*864e5).toLocaleDateString('en-GB',{timeZone:'Asia/Riyadh',day:'numeric',month:'short'});
   M0.orders.unshift({id,sel,ts:Date.now()+(M0.shift||0),st:'new',src:'app',appOrd:o.id,buyer:{en:'Al Wadi Restaurant',ar:'مطعم الوادي'},addr:['King Fahd Rd, Riyadh (sample)','طريق الملك فهد، الرياض (تجريبي)'],win:[`${d} · ${w[0]}`,`${d} · ${w[1]}`],pay:o.pay,items:by[sel].map(([p,q])=>({pid:p.id,en:p.en,ar:p.ar,g:p.g,cat:p.cat,pack:p.pack,q,unit:MF.DATA.P['mk_'+p.id]?MF.DATA.P['mk_'+p.id].pr:p.pr,tier:0})),tl:{new:Date.now()+(M0.shift||0)}});
   M0.notifs.unshift({id:'n'+Date.now()+sel,who:sel==='s1'?'seller':'admin',ic:'box',txt:[`New order #${id} from the MENAFoods app (order #${o.id}) — accept within 2 business hours`,`طلب جديد ‎#${id} من تطبيق منافودز (الطلب ‎#${o.id}) — اقبله خلال ساعتي عمل`],go:'s.order?id='+id,ts:Date.now(),read:false});
  });
  M0.fwd.push(o.id); changed=true; });
 if(changed){ write(M0); SIG=''; inject(); } };
setInterval(forward,1500);
/* guard: seller minimum order quantity at checkout */
const ACT=L.ACT; const place0=ACT.place;
const moqBad=()=>{ const s=L.S(); return Object.keys(s.cart).filter(k=>k.indexOf('mk_')===0&&MF.DATA.P[k]&&s.cart[k]<MF.DATA.P[k].moq); };
if(place0) ACT.place=function(){ const bad=moqBad(); if(bad.length){ L.toast&&L.toast(t(`Minimum order: ${MF.DATA.P[bad[0]].moq} cases for ${MF.DATA.P[bad[0]].en}`,`الحد الأدنى: ${MF.DATA.P[bad[0]].moq} كرتون لـ ${MF.DATA.P[bad[0]].ar}`)); return; } const r=place0.apply(this,arguments); setTimeout(forward,50); return r; };
/* page hooks */
const qp=k=>new URLSearchParams(location.hash.split('?')[1]||'').get(k);
const STORE={ambient:['Ambient · dry, below 25 °C','عادي · جاف، أقل من 25 °م'],chilled:['Chilled · 0–4 °C','مبرد · 0–4 °م'],frozen:['Frozen · −18 °C or colder','مجمد · −18 °م أو أبرد']};
const OST={new:['info',['Waiting for seller to accept','بانتظار قبول البائع']],accepted:['warn',['Seller is preparing','البائع يجهّز الطلب']],packed:['warn',['Packed','تم التجهيز']],pickup:['warn',['Packed · courier booked','مُجهّز · حُجز المندوب']],shipped:['info',['On the way','في الطريق']],delivered:['ok',['Delivered','تم التسليم']],rejected:['bad',['Rejected by seller','رفضه البائع']]};
L.post.push(c=>{ inject(); const M0=read(); if(!M0) return; const main=document.querySelector('main')||document.body;
 if(c.id==='b.product'){ const k=qp('sku'); if(!k||k.indexOf('mk_')!==0||!MF.DATA.P[k]) return; const p=M0.products.find(x=>'mk_'+x.id===k); if(!p) return;
  [...main.querySelectorAll('.sec-h h2')].forEach(h=>{ if(/Case-pack pricing|أسعار الكرتون/.test(h.textContent)){ const sec=h.closest('section'); const rows=[[t(`${p.moq}+ cases (minimum)`,`${p.moq}+ كرتون (الحد الأدنى)`),MM(unit(M0,p,p.moq).u)]].concat((p.tiers||[]).map(x=>[t(`${x.from}+ cases`,`${x.from}+ كرتون`),MM(unit(M0,p,x.from).u)+' '+H.pill('ok','−'+x.pct+'%')]));
   sec.outerHTML=H.sec(t('Seller’s wholesale pricing','أسعار الجملة من البائع'),H.kv(rows)+`<p class="why" style="padding:0 16px 12px">${t('This cart charges the minimum-order price; volume tiers apply when you check out with this seller.','تحتسب هذه السلة سعر الحد الأدنى؛ تُطبّق شرائح الكمية عند الدفع لدى هذا البائع.')}</p>`); } });
  const R=(M0.reviews||[]).filter(r=>r.sel===p.sel); const avg=R.length?(R.reduce((a,r)=>a+r.stars,0)/R.length).toFixed(1)+' ★ · '+R.length:t('New seller','بائع جديد');
  main.insertAdjacentHTML('beforeend',H.sec(t('Meet your seller','تعرّف على البائع'),H.kv([[t('Sold by','يبيعه'),esc(document.documentElement.lang==='ar'?sName(M0,p.sel,1):sName(M0,p.sel))],[t('Rating','التقييم'),esc(avg)],[t('Storage','التخزين'),tt(STORE[p.storage]||STORE.ambient)],[t('Best before (current stock)','الانتهاء (المخزون الحالي)'),LTR(p.exp||'—')],[t('Seller checks','تحقق البائع'),(M0.me&&M0.me.reg&&['cr','vat','sfda','addr'].every(k=>M0.me.reg[k]&&M0.me.reg[k].st==='ok')&&p.sel==='s1')?t('Registry-checked (Wathq, ZATCA, SFDA, SPL) on ','تم التحقق من السجلات (واثق، زاتكا، الهيئة، العنوان الوطني) في ')+LTR(new Date(M0.me.reg.cr.ts).toISOString().slice(0,10)):t('Documents submitted — registry check pending','المستندات مقدّمة — التحقق من السجلات قيد الانتظار')]])+`<p style="padding:0 16px 12px"><a class="lnk" href="seller.html#/b.store?id=${esc(p.sel)}">${t('View seller’s shop','عرض متجر البائع')}</a></p>`)); }
 if(c.id==='b.cart'||c.id==='b.checkout'){ const bad=moqBad(); if(bad.length){ const first=main.querySelector('.sec'); const html=H.alert('warn',t('Seller minimum order not met','لم يتحقق الحد الأدنى للبائع'),bad.map(k=>`${esc(MF.DATA.P[k][document.documentElement.lang==='ar'?'ar':'en'])}: ${t('minimum','الحد الأدنى')} ${MF.DATA.P[k].moq}`).join(' · '),{role:'alert'}); if(first) first.insertAdjacentHTML('beforebegin',html); } }
 if(c.id==='b.order'){ const id=qp('id'); const L2=(M0.orders||[]).filter(o=>o.appOrd===id); if(!L2.length) return; main.insertAdjacentHTML('beforeend',H.sec(t('Marketplace seller items','أصناف بائعي السوق'),L2.map(o=>{ const st=OST[o.st]||['mut',[o.st,o.st]]; return H.kv([[t('Seller','البائع'),esc(document.documentElement.lang==='ar'?sName(M0,o.sel,1):sName(M0,o.sel))],[t('Seller order','طلب البائع'),LTR('#'+o.id)],[t('Status','الحالة'),H.pill(st[0],tt(st[1]))],o.ship&&o.ship.trk?[t('Tracking #','رقم التتبع'),LTR(o.ship.trk)]:null].filter(Boolean)); }).join('')+`<p style="padding:0 16px 12px"><a class="lnk" href="seller.html#/b.order?id=${esc(L2[0].id)}">${t('Track, message or rate the seller','تتبّع أو راسل أو قيّم البائع')}</a></p>`)); }
});
window.addEventListener('storage',e=>{ if(e.key===KEY){ if(inject()&&L.rr&&!document.querySelector('.lv-sheet')) L.rr(); } });
})();
