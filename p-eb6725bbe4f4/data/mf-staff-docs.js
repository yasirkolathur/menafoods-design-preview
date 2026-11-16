/* Staff accountant and admin · customer invoices, payments and credit notes — READ-ONLY.
   User decision, 16 Nov 2026: staff ACCOUNTANTS may see customer documents, read-only.
   Flow: choose a customer (st.customers: search by name or number, recent customers) → doc.view hub →
   b.invoices / b.invoice / b.payments / b.receipt / b.creditnotes / b.statement. No write actions; a 'Read-only' tag.
   Live: GET {paths.staffCustomers}?q=[&cursor=] → {data:[…],next_cursor}  and  GET {paths.invoices|payments|creditNotes}?{customerParam}=<id>
         (paths in data/api.js PATHS; 404/501 = 'Not available in the preview yet'; 403 = 'No access').
   Sample: one sample customer whose documents are the sample account's. Loaded after mf-live.js. */
(function(){
'use strict';
const MF=window.MF, API=window.MFAPI; if(!MF||!MF.L||!API) return;
const L=MF.L, ACT=L.ACT, {t,H,I,M,LTR}=MF, tt=MF.tt;
const LIVE=API.isLive('shop'), P=API.paths||{staffCustomers:'/staff/customers',invoices:'/invoices',payments:'/payments',creditNotes:'/credit-notes',customerParam:'customer_id'};
const STAFF=['acct','admin'];   /* portal ACCOUNTANT and staff ADMIN; the gateway answers 403 to other roles */
const isStaff=()=>STAFF.includes(role());
const DOCS=['doc.view','b.invoices','b.invoice','b.payments','b.receipt','b.creditnotes','b.statement'];
const SAFE=new Set(['invf','pdf','wdprint','wdshare','scpick','scretry','scclear','scmore']);   /* read-only actions kept on document screens */
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const qp=k=>L.qp?L.qp(k):new URLSearchParams(location.hash.split('?')[1]||'').get(k);
const nz=(v,d)=>v==null||v===''?d:v;
const role=()=>{ const S=L.S(), sr=S&&S.session&&S.session.role; return (LIVE&&sr)||(MF.C&&MF.C.role)||sr||''; };   /* live: the signed-in role is authoritative */
const dshort=ts=>ts?L.dt(ts,{day:'numeric',month:'short',year:'numeric'}):'—';
const ini=s=>(String(s||'').replace(/[^\p{L}\p{N}\s]/gu,' ').trim().split(/\s+/).slice(0,2).map(w=>[...w][0]||'').join('')||'?').toUpperCase();
const listOf=j=>Array.isArray(j)?j:(j&&Array.isArray(j.data))?j.data:(j&&j.data&&Array.isArray(j.data.items))?j.data.items:null;
const errSt=e=>!e?'err':e.status===403?'denied':(e.status===404||e.status===501||e.notEnabled)?'na':e.status===401?'auth':'err';
const DENIED=()=>[t('No access to customer documents','لا صلاحية لعرض مستندات العملاء'),t('Customer documents are for accountants and admins.','مستندات العملاء متاحة للمحاسبين والمسؤولين.')];
const NA=()=>[t('Not available in the preview yet','غير متاح في المعاينة بعد'),t('This will show live data once it is switched on.','سيعرض هذا بيانات حية عند تفعيله.')];

/* ---------- customers ---------- */
const cname=c=>MF.C&&MF.C.ar?nz(c.name_ar,c.name):c.name;
const nCust=x=>x&&typeof x==='object'?{id:String(nz(x.id,nz(x.customer_id,nz(x.contact_id,'')))),name:String(nz(x.name,nz(x.customer_name,nz(x.contact_name,'')))),name_ar:nz(x.name_ar,null),no:nz(x.customer_number,nz(x.number,null))}:null;
const SAMPLE=[{id:'sample-c1',name:'Al Wadi Restaurant Co.',name_ar:'شركة مطعم الوادي',no:'C-10021'}];
const RK='mf-staff-recent-v1'+(LIVE?':live':'');
const recent={ get(){ try{ const v=JSON.parse(localStorage.getItem(RK)||'[]'); return Array.isArray(v)?v.filter(x=>x&&x.id&&x.name):[]; }catch(e){ return []; } },
  add(c){ const a=recent.get().filter(x=>x.id!==c.id); a.unshift({id:c.id,name:c.name,name_ar:c.name_ar||null,no:c.no||null}); try{ localStorage.setItem(RK,JSON.stringify(a.slice(0,5))); }catch(e){} } };
L.ui.scl=L.ui.scl||{st:'idle',list:[],q:''}; L.ui.scById=L.ui.scById||{};
const remember=a=>a.forEach(c=>{ L.ui.scById[c.id]=c; });
let seq=0, tmr=null;
const paint=()=>{ const el=document.getElementById('lvsc-res'); if(el) el.innerHTML=resHtml(); };
function fetchCust(q,more){ q=(q||'').trim(); L.ui.scl.q=q;
  if(!LIVE){ const k=q.toLowerCase(); const a=SAMPLE.filter(c=>!k||[c.name,c.name_ar,c.no].some(v=>v&&String(v).toLowerCase().includes(k))); remember(a); L.ui.scl={st:a.length?'ok':'empty',list:a,q,next:null}; paint(); return; }
  const prev=more?L.ui.scl:null, cur=more&&prev&&prev.next; if(more&&!cur) return;
  const my=++seq; if(more){ prev.busy=true; } else L.ui.scl={st:'loading',list:[],q,next:null}; paint();
  API.request('GET',P.staffCustomers+'?q='+encodeURIComponent(q)+(cur?'&cursor='+encodeURIComponent(cur):''),undefined,{quiet:true}).then(j=>{ if(my!==seq) return;
      const a=(listOf(j)||[]).map(nCust).filter(c=>c&&c.id&&c.name); remember(a); const next=j&&!Array.isArray(j)&&j.next_cursor?String(j.next_cursor):null;
      const list=more?prev.list.concat(a.filter(c=>!prev.list.some(x=>x.id===c.id))):a; L.ui.scl={st:list.length?'ok':'empty',list,q,next}; paint(); },
    e=>{ if(my!==seq) return; if(more){ prev.busy=false; prev.moreErr=true; paint(); return; } L.ui.scl={st:errSt(e),list:[],q,next:null}; paint(); }); }
ACT.scmore=()=>fetchCust(L.ui.scl.q||'',true);
const custRow=c=>`<button type="button" class="row" data-act="scpick" data-arg="${esc(c.id)}"><span class="avs" aria-hidden="true">${esc(ini(cname(c)))}</span><span class="b"><span class="t">${esc(cname(c))}</span>${c.no?`<span class="s">${t('Customer no.','رقم العميل')} ${LTR(esc(c.no))}</span>`:''}</span><span class="chev">${I('chev',18)}</span></button>`;
function resHtml(){ const s=L.ui.scl;
  if(s.st==='loading'||s.st==='idle') return `<p class="note" role="status">${t('Searching…','جارٍ البحث…')}</p>`;
  if(s.st==='na') return H.empty('lock',NA()[0],t('The customer list will show here once it is switched on.','ستظهر قائمة العملاء هنا عند تفعيلها.'));
  if(s.st==='denied') return H.empty('lock',DENIED()[0],DENIED()[1]);
  if(s.st==='auth') return H.empty('lock',t('Sign in again to search customers','سجّل الدخول مجددًا للبحث عن العملاء'),'');
  if(s.st==='err') return H.empty('inbox',t('Couldn’t load customers','تعذّر تحميل العملاء'),t('Check your connection and try again.','تحقق من الاتصال وحاول مجددًا.'),`<div class="btns"><button type="button" class="btn sec" data-act="scretry"><span>${t('Try again','حاول مجددًا')}</span></button></div>`);
  if(s.st==='empty') return s.q?H.empty('inbox',t(`No customers match “${esc(s.q)}”`,`لا عملاء يطابقون «${esc(s.q)}»`),t('Try part of the name or the customer number.','جرّب جزءًا من الاسم أو رقم العميل.')):H.empty('inbox',t('No customers yet','لا يوجد عملاء بعد'),'');
  return H.sec(s.q?t('Results','النتائج'):t('Customers','العملاء'),s.list.map(custRow).join(''))
   +(s.next?`<div class="btns"><button type="button" class="btn sec block" data-act="scmore"${s.busy?' disabled':''}><span>${s.busy?t('Loading…','جارٍ التحميل…'):s.moreErr?t('Couldn’t load more · try again','تعذّر تحميل المزيد · حاول مجددًا'):t('Show more customers','عرض المزيد من العملاء')}</span></button></div>`:''); }
L.liveFn=L.liveFn||{};
L.liveFn.stcust=v=>{ clearTimeout(tmr); if(!LIVE){ fetchCust(v); return resHtml(); } L.ui.scl.q=v; tmr=setTimeout(()=>fetchCust(v),300); return `<p class="note" role="status">${t('Searching…','جارٍ البحث…')}</p>`; };
ACT.scretry=()=>fetchCust(L.ui.scl.q||'');

L.scr('st.customers',{a:'backoffice',r:STAFF.join(' '),t:['Customer invoices & payments','فواتير ومدفوعات العملاء'],back:LIVE?'lv.staff':'more',noSeg:true,
  render:()=>{ const rec=recent.get(); remember(rec); if(L.ui.scl.st==='idle') setTimeout(()=>fetchCust(''),0);
    return `<p class="note">${H.pill('neu',t('Read-only','للقراءة فقط'))} ${t('Choose a customer to see their invoices, payments and credit notes.','اختر عميلًا لعرض فواتيره ومدفوعاته وإشعاراته الدائنة.')}</p>`
     +`<div class="search" role="search">${I('search',20)}<label class="vh" for="lvsc-q">${t('Search customers','ابحث عن العملاء')}</label><input id="lvsc-q" type="search" value="${esc(L.ui.scl.q||'')}" data-live="stcust" data-tgt="lvsc-res" autocomplete="off" placeholder="${t('Customer name or number','اسم العميل أو رقمه')}"></div>`
     +(rec.length?H.sec(t('Recent customers','العملاء الأخيرون'),rec.map(custRow).join('')):'')
     +`<div id="lvsc-res">${resHtml()}</div>`; }});

/* ---------- documents for the chosen customer ---------- */
L.ui.scd=L.ui.scd||{};
function loadDocs(c){
  if(!LIVE){ L.ui.scd={invoices:'ok',payments:'ok',cns:'ok'}; return; }
  const S=L.S(); S.invoices=[]; S.payments=[]; S.cns=[]; L.ui.scd={invoices:'loading',payments:'loading',cns:'loading'}; if(L.store&&L.store.replace) L.store.replace(S);
  const N=L.norm||{}, qs='?'+encodeURIComponent(P.customerParam||'customer_id')+'='+encodeURIComponent(c.id), my=c.id;
  const get=(path,key,fn)=>API.request('GET',path+qs,undefined,{quiet:true}).then(j=>{ if(!L.ui.sc||L.ui.sc.id!==my) return; const a=listOf(j); const S2=L.S(); S2[key]=a&&fn?a.map(fn).filter(x=>x&&(x.no||x.id)):[]; L.ui.scd[key]='ok'; if(L.store&&L.store.replace) L.store.replace(S2); },
    e=>{ if(!L.ui.sc||L.ui.sc.id!==my) return; L.ui.scd[key]=errSt(e); });
  Promise.all([get(P.invoices,'invoices',N.nInv),get(P.payments,'payments',N.nPay),get(P.creditNotes,'cns',N.nCn)]).then(()=>{ if(MF.booted) L.rr(); }); }
ACT.scpick=id=>{ const c=L.ui.scById[id]; if(!c) return; L.ui.sc=c; recent.add(c); loadDocs(c); L.go('doc.view',{k:null,id:null,back:null}); };
ACT.scclear=()=>{ L.ui.sc=null; L.go('st.customers'); };

const PM={banktransfer:['Bank transfer','تحويل بنكي'],bank_transfer:['Bank transfer','تحويل بنكي'],transfer:['Bank transfer','تحويل بنكي'],cash:['Cash','نقدًا'],check:['Cheque','شيك'],cheque:['Cheque','شيك'],creditcard:['Credit card','بطاقة ائتمان'],card:['Card','بطاقة'],bankremittance:['Bank remittance','حوالة بنكية'],sadad:['SADAD','سداد'],mada:['mada','مدى'],others:['Other','أخرى']};
const payLabel=m=>L.payLabel?L.payLabel(m):(PM[String(m||'').toLowerCase()]?tt(PM[String(m||'').toLowerCase()]):'—');
const payRow=p=>({ic:'wallet',tone:'ok',t:`${LTR(esc(p.id))} · ${M(p.amt)}`,s:`${dshort(p.ts)} · ${payLabel(p.m)}`,go:'b.receipt',q:{id:p.id}});
const cnRow=cn=>({ic:'receipt',tone:'ok',t:t('Credit note','إشعار دائن')+' '+LTR(esc(cn.no||'—')),s:`${esc(Array.isArray(cn.why)?tt(cn.why):nz(cn.why,''))}${cn.inv?' · '+t('on','على')+' '+LTR(esc(cn.inv)):''}${cn.ts?' · '+dshort(cn.ts):''}`,end:M(cn.amt==null?null:-cn.amt),go:cn.inv&&(L.S().invoices||[]).some(i=>i.no===cn.inv)?'b.invoice':null,q:cn.inv?{no:cn.inv}:null});
const box=(rows,key,art,en,ar)=>{ const st=L.ui.scd[key]; if(rows.length) return H.rows(rows); if(st==='loading') return `<p class="note" role="status">${t('Loading…','جارٍ التحميل…')}</p>`; if(st==='na') return H.empty('lock',NA()[0],''); if(st==='denied') return H.empty('lock',DENIED()[0],''); if(st==='err') return H.empty(art,t('Couldn’t load this list','تعذّر تحميل هذه القائمة'),''); return H.empty(art,t(en,ar),''); };
const byTs=(k)=>(a,b)=>(b[k]||0)-(a[k]||0);
const hub=()=>{ const s=L.S(); const inv=(s.invoices||[]).slice().sort(byTs('d')), pay=(s.payments||[]).slice().sort(byTs('ts')), cns=(s.cns||[]).slice().sort(byTs('ts'));
  return H.sec(t('Invoices','الفواتير'),box(inv.slice(0,5).map(L.invRow),'invoices','doc','No invoices yet','لا توجد فواتير بعد'),{act:inv.length?[t('All invoices','كل الفواتير'),'b.invoices']:null})
   +H.sec(t('Payments','المدفوعات'),box(pay.slice(0,5).map(payRow),'payments','wallet','No payments yet','لا توجد مدفوعات بعد'),{act:pay.length?[t('All payments','كل المدفوعات'),'b.payments']:null})
   +H.sec(t('Credit notes','الإشعارات الدائنة'),box(cns.slice(0,5).map(cnRow),'cns','receipt','No credit notes yet','لا توجد إشعارات دائنة بعد'),{act:cns.length?[t('All credit notes','كل الإشعارات الدائنة'),'b.creditnotes']:null})
   +H.sec('',H.rows([{ic:'doc',tone:'brand',t:t('Statement of account','كشف الحساب'),go:'b.statement'}])); };
const payList=()=>H.sec('',box((L.S().payments||[]).slice().sort(byTs('ts')).map(payRow),'payments','wallet','No payments yet','لا توجد مدفوعات بعد'));
const cnList=()=>H.sec('',box((L.S().cns||[]).slice().sort(byTs('ts')).map(cnRow),'cns','receipt','No credit notes yet','لا توجد إشعارات دائنة بعد'));
/* sample mode has no payment / credit-note list screens: add them for the accountant only */
if(!MF.SCR['b.payments']) L.scr('b.payments',{a:'invoices',r:STAFF.join(' '),t:['Payments','المدفوعات'],back:'doc.view',noSeg:true,render:payList});
if(!MF.SCR['b.creditnotes']) L.scr('b.creditnotes',{a:'invoices',r:STAFF.join(' '),t:['Credit notes','الإشعارات الدائنة'],back:'doc.view',noSeg:true,render:cnList});

const choose=()=>H.empty('doc',t('Choose a customer first','اختر عميلًا أولًا'),t('Customer invoices, payments and credit notes are read-only for staff.','فواتير العملاء ومدفوعاتهم وإشعاراتهم الدائنة للقراءة فقط للموظفين.'),H.btns(H.btn(t('Choose a customer','اختر عميلًا'),{go:'st.customers'})));
DOCS.forEach(id=>{ const d=MF.SCR[id]; if(!d) return; if(Array.isArray(d.r)) STAFF.forEach(r=>{ if(!d.r.includes(r)) d.r.push(r); });
  const r0=d.render, t0=d.t;
  d.render=function(c){ if(!isStaff()) return r0.apply(this,arguments);
    if(!L.ui.sc) return choose();
    if(id==='doc.view'&&!qp('k')&&!qp('id')) return hub();
    if(id==='b.payments') return payList();
    if(id==='b.creditnotes') return cnList();
    if(id==='b.invoices'&&!(L.S().invoices||[]).length) return H.sec('',box([],'invoices','doc','No invoices yet','لا توجد فواتير بعد'));
    return r0.apply(this,arguments); };
  if(id==='doc.view') d.t=function(){ return isStaff()&&!qp('k')&&!qp('id')?t('Invoices & payments','الفواتير والمدفوعات'):(typeof t0==='function'?t0.apply(this,arguments):tt(t0)); };
});

/* read-only: on the customer's documents the accountant gets no write actions, and a Read-only tag */
const canOpen=id=>{ const d=MF.SCR[id], r=role(); return !!(d&&Array.isArray(d.r)&&d.r.includes(r)&&!d.__lvBlocked); };
const roHook=c=>{ if(!c||!isStaff()||!DOCS.includes(c.id)||!L.ui.sc) return;
  document.querySelectorAll('body a[href^="#/"]').forEach(a=>{ if(a.closest('nav.nb,header,.lv-ro,.top,.appbar')) return; const id=(a.getAttribute('href').match(/^#\/([^?]+)/)||[])[1]; if(id&&!canOpen(id)) a.remove(); });
  document.querySelectorAll('body [data-act]').forEach(b=>{ if(b.closest('nav.nb,header,.lv-ro,.top,.appbar')) return; if(!SAFE.has(b.dataset.act)) b.remove(); });
  document.querySelectorAll('#main .btns,#main .grp').forEach(x=>{ if(!x.children.length) x.remove(); });
  const m=document.querySelector('#main'); if(m&&!m.querySelector('.lv-ro')){ const sc=L.ui.sc;
    m.insertAdjacentHTML('afterbegin',`<div class="lv-ro card pad" role="note"><span class="avs" aria-hidden="true">${esc(ini(cname(sc)))}</span><span class="b"><b>${esc(cname(sc))}</b>${sc.no?`<span class="s">${t('Customer no.','رقم العميل')} ${LTR(esc(sc.no))}</span>`:''}</span>${H.pill('neu',t('Read-only','للقراءة فقط'))}<a class="lv-ro-ch" href="${MF.href('st.customers',{k:null,id:null,no:null,back:null})}">${t('Change','تغيير')}</a></div>`); } };
if(Array.isArray(L.post)) L.post.unshift(roHook);
(()=>{ const st=document.createElement('style'); st.textContent='.lv-ro{display:flex;align-items:center;gap:10px;margin:0 16px 12px}.lv-ro .b{flex:1;min-width:0;display:flex;flex-direction:column}.lv-ro .s{font-size:12.5px;color:var(--c-text-2)}.lv-ro-ch{font-weight:600;white-space:nowrap;min-height:44px;display:inline-flex;align-items:center;padding:0 4px}'; document.head.appendChild(st); })();

/* other roles never see a chosen customer */
{ const lg=L.login; if(lg) L.login=r=>{ if(!STAFF.includes(r)) L.ui.sc=null; return lg(r); }; }

if(LIVE){
  /* the accountant's own account has no customer documents: never load them for the staff session */
  { const lf=L.loadFin; if(lf) L.loadFin=()=>{ const S=L.S(); if(S&&S.session&&STAFF.includes(S.session.role)) return; return lf(); }; }
  /* staff home: a live entry for customer documents; the Statements tab opens it; other tabs stay Coming soon */
  const R=MF.ROLES.acct; if(R&&Array.isArray(R.nav)) R.nav=R.nav.map(n=>n[1]==='a.statements'?[n[0],'st.customers',['Customers','العملاء']]:n);
  { const h0=L.home; L.home=r=>STAFF.includes(r)?'lv.staff':h0(r); }
  const sh=MF.SCR['lv.staff']; if(sh){ const r0=sh.render; sh.render=function(c){ const h=r0.apply(this,arguments); if(!isStaff()||typeof h!=='string') return h;
    const entry=H.sec(t('Available now','متاح الآن'),H.rows([{ic:'doc',tone:'brand',t:t('Customer invoices & payments','فواتير ومدفوعات العملاء'),s:t('Read-only · search a customer','للقراءة فقط · ابحث عن عميل'),go:'st.customers'}]));
    const i=h.indexOf('</section>'); return i>-1?h.slice(0,i+10)+entry+h.slice(i+10):entry+h; }; }
}
})();
