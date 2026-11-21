/* MENAFoods · Pay by hand to staff + Theme in Settings (design preview, SAMPLE DATA ONLY).
   Customer pay screen: one more method, "Pay by hand to MENAFoods staff".
   The option is offered only when the account has an assigned salesperson
   (live: /v1/me → account.salesperson | sales_person | assigned_salesperson, or me.salesperson;
    sample: Khalid Al-Shammari). Preview: add ?nosp=1 to hide the salesperson and show the empty state.
   Live writes go through MFAPI.paths['payments.cash.request'] and
   MFAPI.paths['payments.cash.verify']. A 501 not_enabled_in_preview
   response is final: the adapter shows the bilingual notice and nothing is saved.
   Also registers set.theme / c.theme / b-theme inside Settings in every supported theme. */
(function(){
'use strict';
const SK='mf-cash-preview';
const SAMPLE_OTP='248163';
const SAMPLE_SP={id:'sp-khalid',role:'SALESPERSON',name:'Khalid Al-Shammari',name_ar:'خالد الشمري'};
const SAMPLE_STAFF=[
  SAMPLE_SP,
  {id:'st-majed',role:'DELIVERY',name:'Majed Al-Qahtani',name_ar:'ماجد القحطاني'},
  {id:'st-noura',role:'STOREKEEPER',name:'Noura Al-Otaibi',name_ar:'نورة العتيبي'},
  {id:'st-sara',role:'ADMIN',name:'Sara Al-Dosari',name_ar:'سارة الدوسري'}
];
const COLLECT_ROLES=['sales','van','acct','admin'];
const CUST_ROLES='owner bm buyer cashier cfin viewer recv';
const ALL_ROLES=CUST_ROLES+' sales van driver store acct mgr admin aff';
const ROLE_L={
  SALESPERSON:['Your salesperson','مندوبك'],
  DELIVERY:['Delivery person','موظف التوصيل'],
  SALES_DELIVERY:['Sales & delivery','المبيعات والتوصيل'],
  STOREKEEPER:['Storekeeper','أمين المستودع'],
  ADMIN:['Admin','المسؤول']
};

function T(en,ar){ const MF=window.MF; if(MF&&typeof MF.t==='function') return MF.t(en,ar);
  const arNow=(document.documentElement.lang||'').startsWith('ar')||document.documentElement.dir==='rtl';
  return arNow?ar:en; }
function arLang(){ const MF=window.MF; if(MF&&MF.C) return !!MF.C.ar;
  return (document.documentElement.lang||'').startsWith('ar')||document.documentElement.dir==='rtl'; }
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function isLive(){ const A=window.MFAPI; if(!A) return false;
  try{ if(typeof A.isLive==='function') return !!(A.isLive('shop')||A.isLive()); }catch(e){}
  return A.live===true; }
function nospAsked(){ try{ const raw=(location.hash||'').replace(/^#/, ''); const qstr=raw.indexOf('?')>=0?raw.slice(raw.indexOf('?')+1):raw; const q=new URLSearchParams(qstr+'&'+(location.search||'').replace(/^\?/,'')); return q.get('nosp')==='1'; }catch(e){ return false; } }
function me(){ try{ const L=window.MF&&MF.L; const S=L&&L.S&&L.S(); return (S&&S.me)||{}; }catch(e){ return {}; } }
function asPerson(x,role){ if(!x) return null;
  if(typeof x==='string'){ const n=x.trim(); return n?{id:n,role:role||'SALESPERSON',name:n,name_ar:n}:null; }
  const name=x.name||x.name_en||x.full_name||x.display_name||'';
  const name_ar=(x.name_ar!=null&&x.name_ar!=='')?x.name_ar:((x.ar_name!=null&&x.ar_name!=='')?x.ar_name:name);
  const id=x.id||x.user_id||x.email||name;
  if(!id&&!name) return null;
  return {id:String(id||name),role:String(x.role||x.portal_role||role||'SALESPERSON').toUpperCase().replace(/^SALES$/,'SALESPERSON'),name:name||String(id),name_ar:name_ar||name||String(id)}; }
function assignedSalesperson(){ if(nospAsked()) return null;
  const m=me(), acc=m.account||{};
  const raw=acc.salesperson||acc.sales_person||acc.assigned_salesperson||m.salesperson;
  if(raw===null||raw===false||raw==='') return isLive()?null:SAMPLE_SP;
  const p=asPerson(raw,'SALESPERSON');
  if(p) return p;
  return isLive()?null:SAMPLE_SP; }
function personName(p){ if(!p) return ''; return arLang()?(p.name_ar||p.name):(p.name||p.name_ar); }
function roleLabel(role){ const x=ROLE_L[role]||ROLE_L.SALESPERSON; return T(x[0],x[1]); }
function staffChoices(){ const sp=assignedSalesperson(); if(!sp) return [];
  const extra=[];
  const m=me(), acc=m.account||{};
  const list=acc.staff_contacts||m.staff_contacts;
  if(Array.isArray(list)) list.forEach(x=>{ const p=asPerson(x); if(p&&p.id!==sp.id) extra.push(p); });
  /* sample staff (Majed / Noura / Sara) are preview-only — never in live mode, even if staff_contacts is empty */
  if(!isLive()){
    SAMPLE_STAFF.forEach(s=>{ if(s.id!==sp.id&&!extra.some(e=>e.id===s.id)&&s.role!=='SALESPERSON') extra.push(s); });
  }
  return [sp].concat(extra); }
function load(){ try{ return JSON.parse(localStorage.getItem(SK)||'{"pending":[],"paid":[]}'); }catch(e){ return {pending:[],paid:[]}; } }
function save(s){ try{ localStorage.setItem(SK,JSON.stringify(s)); }catch(e){} }
function uid(){ return 'CR-'+Date.now().toString(36).toUpperCase(); }
function money(n){ const MF=window.MF; if(MF&&MF.M) return MF.M(Number(n)||0); return (Number(n)||0).toFixed(2); }
function dueInvoices(){ const L=window.MF&&MF.L, S=L&&L.S&&L.S();
  if(S&&Array.isArray(S.invoices)){
    const bal=typeof L.bal==='function'?L.bal:i=>Math.max(0,Number((i.total!=null?i.total:i.amt)||0)-Number(i.paid||0));
    return S.invoices.filter(i=>bal(i)>0).map(i=>({no:i.no||i.id,bal:bal(i),due:i.due}));
  }
  return [{no:'INV-2026-0412',bal:2140},{no:'INV-2026-0428',bal:3180},{no:'INV-2026-0433',bal:1160}]; }
function ui(){ const L=window.MF&&MF.L; if(!L) return {}; L.ui=L.ui||{}; L.ui.cash=L.ui.cash||{}; return L.ui.cash; }
function toast(m){ const L=window.MF&&MF.L; if(L&&L.toast) L.toast(m); else if(window.MF&&MF.toast) MF.toast(m); }
function go(id,q){ const L=window.MF&&MF.L; if(L&&L.go) return L.go(id,q||{});
  const href=window.MF&&MF.href; if(href) location.hash=href(id,q||{}); else location.hash='#/'+id; }
function pathOf(key,fallback){ const A=window.MFAPI, p=A&&A.paths&&A.paths[key]; return p||fallback; }
function livePost(key,fallback,body){ const A=window.MFAPI;
  if(!A||typeof A.request!=='function'||!isLive()) return Promise.resolve({sample:true});
  return A.request('POST',pathOf(key,fallback),body); }

/* ---------- OTP boxes (Mobbin: Zip / Chime / Blackbird — 6 slots, resend) ---------- */
function otpBoxes(val,name){ const v=String(val||'').replace(/\D/g,'').slice(0,6);
  let h='<div class="mfc-otp" role="group" aria-label="'+esc(T('6-digit code','رمز من 6 أرقام'))+'">';
  for(let i=0;i<6;i++) h+='<input class="mfc-d" type="text" inputmode="numeric" maxlength="1" autocomplete="'+(i===0?'one-time-code':'off')+'" aria-label="'+esc(T('Digit','خانة'))+' '+(i+1)+'" data-mfc="d" data-i="'+i+'" value="'+esc(v[i]||'')+'">';
  return h+'</div><input type="hidden" name="'+esc(name||'otp')+'" id="mfcOtp" value="'+esc(v)+'">'; }
function css(){ if(document.getElementById('mfc-css')) return;
  const s=document.createElement('style'); s.id='mfc-css';
  s.textContent='.mfc-otp{display:flex;gap:8px;justify-content:center;direction:ltr;margin:12px 0 8px}'+
    '.mfc-d{width:44px;height:52px;text-align:center;font:600 22px/1 var(--font,inherit);border:1.5px solid var(--c-line,rgba(0,0,0,.15));border-radius:12px;background:var(--c-card,#fff);color:inherit}'+
    '.mfc-d:focus{outline:2px solid var(--c-brand,var(--brand,#0A6B4F));border-color:transparent}'+
    '.mfc-code{font:700 32px/1.2 var(--font,inherit);letter-spacing:.18em;direction:ltr;text-align:center;margin:8px 0}'+
    '.mfc-note{margin:12px 0}'+
    '.mfc-wait{text-align:center;padding:8px 0}'+
    '#main .mfc-method .s{display:block}';
  document.head.appendChild(s); }

/* ---------- customer method injection ---------- */
function cashRadio(name){ const id='mfc-pm-cash';
  return '<div class="row rad mfc-method"><input type="radio" name="'+name+'" id="'+id+'" value="cash">'+
    '<span class="b"><label class="t" for="'+id+'">'+esc(T('Pay by hand to MENAFoods staff','الدفع يدوياً لموظف MENAFoods'))+'</label>'+
    '<span class="s">'+esc(T('Hand cash or a transfer to your salesperson, a delivery person, storekeeper or admin. Confirmed with a one-time code.','سلّم المبلغ نقداً أو بتحويل لمندوبك أو لموظف التوصيل أو أمين المستودع أو المسؤول. يُؤكَّد برمز لمرة واحدة.'))+'</span></span></div>'; }
function noSpNote(){ const MF=window.MF, H=MF&&MF.H, href=MF&&MF.href;
  const contact=H&&H.btn?H.btn(T('Contact MENAFoods','تواصل مع MENAFoods'),{go:'cc.home',k:'sec',ic:'msg'}):
    '<a class="btn sec" href="'+(href?href('cc.home'):'#/cc.home')+'">'+esc(T('Contact MENAFoods','تواصل مع MENAFoods'))+'</a>';
  const body='<p class="why">'+esc(T("You don't have an assigned salesperson yet. Contact MENAFoods to get one.","ليس لديك مندوب مبيعات معيّن بعد. تواصل مع MENAFoods لتعيين مندوب."))+'</p>'+contact;
  if(H&&H.alert) return '<div class="mfc-note">'+H.alert('info',T('Pay by hand to MENAFoods staff','الدفع يدوياً لموظف MENAFoods'),body)+'</div>';
  return '<div class="card pad mfc-note" role="status"><b>'+esc(T('Pay by hand to MENAFoods staff','الدفع يدوياً لموظف MENAFoods'))+'</b>'+body+'</div>'; }
function injectMethod(html){ if(!html||html.indexOf('mfc-method')>-1||html.indexOf('mfc-note')>-1) return html;
  const sp=assignedSalesperson();
  const re=/<fieldset class="radios">[\s\S]*?<\/fieldset>/g;
  let found=null, m;
  while((m=re.exec(html))){ if(/name="(pm|paym)"/.test(m[0])) found=m; }
  if(!found) return html;
  let block=found[0];
  if(sp) block=block.replace('</fieldset>',cashRadio(/name="paym"/.test(block)?'paym':'pm')+'</fieldset>');
  else block=block+' '+noSpNote();
  return html.slice(0,found.index)+block+html.slice(found.index+found[0].length); }
function patchPayRender(){ const MF=window.MF; const d=MF&&MF.SCR&&MF.SCR['b.pay']; if(!d||d.__mfcash||typeof d.render!=='function') return;
  d.__mfcash=true; const r0=d.render;
  d.render=function(c){ const out=r0.apply(this,arguments);
    const isMethod=!c||!c.v||c.v==='method';
    if(!isMethod) return out;
    if(typeof out==='string') return injectMethod(out);
    if(out&&typeof out==='object'){ if(typeof out.b==='string') out.b=injectMethod(out.b); return out; }
    return out; }; }
function cashSelected(){ return !!(document.querySelector('input[name="pm"][value="cash"]:checked,input[name="paym"][value="cash"]:checked')); }
function interceptPay(){ document.addEventListener('click',function(e){
  const scr=window.MF&&MF.C&&MF.C.id; if(scr!=='b.pay') return;
  if(!cashSelected()) return;
  const t=e.target.closest('a,button'); if(!t) return;
  const href=t.getAttribute('href')||'';
  const act=t.getAttribute('data-act')||'';
  if(act==='paynow'||/\/b\.pay/.test(href)||/Pay now|ادفع الآن|Continue|متابعة|Pay\b|ادفع/.test((t.textContent||''))){
    e.preventDefault(); e.stopPropagation();
    const L=window.MF&&MF.L; if(L){ L.ui=L.ui||{}; L.ui.payM='cash'; }
    snapshotInvoices(); go('b.pay.cash'); }
},true);
  const L=window.MF&&MF.L; if(L&&L.ACT&&!L.ACT.__mfcashPay){ const p0=L.ACT.paynow;
    if(typeof p0==='function'){ L.ACT.__mfcashPay=true; L.ACT.paynow=function(){ if((L.ui&&L.ui.payM==='cash')||cashSelected()){ snapshotInvoices(); go('b.pay.cash'); return; } return p0.apply(this,arguments); }; } }
  document.addEventListener('change',function(e){ const el=e.target; if(!el||!el.matches||!el.matches('input[name="pm"],input[name="paym"]')) return;
    const L=window.MF&&MF.L; if(L){ L.ui=L.ui||{}; L.ui.payM=el.value==='cash'?'cash':el.value; } }); }
function snapshotInvoices(){ const u=ui(); const due=dueInvoices();
  const boxes=[...document.querySelectorAll('input[data-act="paysel"]')];
  if(boxes.length){ u.inv=boxes.filter(b=>b.checked).map(b=>b.getAttribute('data-arg')).filter(Boolean); }
  if(!u.inv||!u.inv.length){ const L=window.MF&&MF.L; u.inv=(L&&L.ui&&L.ui.paySel)?Object.keys(L.ui.paySel).filter(k=>k!=='__pre'&&L.ui.paySel[k]):due.map(i=>i.no); }
  if(!u.inv.length&&due[0]) u.inv=[due[0].no];
  u.amt=due.filter(i=>u.inv.indexOf(i.no)>-1).reduce((a,i)=>a+Number(i.bal||0),0); }

/* ---------- customer confirm / OTP / receipt ---------- */
function selectedStaff(){ const u=ui(); const list=staffChoices(); return list.find(s=>s.id===u.staff)||list[0]||null; }
function renderCashConfirm(){ const MF=window.MF, H=MF.H, t=MF.t.bind(MF), LTR=MF.LTR;
  const sp=assignedSalesperson();
  if(!sp){ return noSpNote()+H.btns(H.btn(T('Back','رجوع'),{k:'sec',go:'b.pay'})); }
  const u=ui(); const due=dueInvoices(); const list=staffChoices();
  if(!u.staff) u.staff=sp.id;
  if(!u.inv||!u.inv.length) snapshotInvoices();
  if(u.amt==null) u.amt=due.filter(i=>u.inv.indexOf(i.no)>-1).reduce((a,i)=>a+Number(i.bal||0),0);
  const radios=H.radios?null:null;
  const staffRows=list.map(s=>{
    const id='mfc-st-'+s.id; const on=u.staff===s.id;
    const sub=roleLabel(s.role)+(s.id===sp.id?' · '+T('Assigned to you','معيّن لحسابك'):'');
    return '<div class="row rad"><input type="radio" name="mfcstaff" id="'+id+'" value="'+esc(s.id)+'"'+(on?' checked':'')+'>'+
      '<span class="b"><label class="t" for="'+id+'">'+esc(personName(s))+'</label><span class="s">'+esc(sub)+'</span></span></div>';
  }).join('');
  const invRows=due.map(i=>{
    const on=u.inv.indexOf(i.no)>-1; const id='mfc-inv-'+i.no;
    return '<div class="row tog"><input class="cb" type="checkbox" id="'+id+'" data-mfc="inv" data-arg="'+esc(i.no)+'"'+(on?' checked':'')+'>'+
      '<label class="b" for="'+id+'"><span class="t">'+LTR(i.no)+'</span></label><span class="e">'+money(i.bal)+'</span></div>';
  }).join('');
  const amt=Number(u.amt)||0;
  const body=H.sec(T('Who will receive it','من يستلم المبلغ'),'<fieldset class="radios">'+staffRows+'</fieldset>',{raw:true})+
    H.sec(T('Amount','المبلغ'),H.field(T('You pay','ستدفع'),String(amt.toFixed(2)),{pre:'SAR',im:'decimal',ltr:true,id:'mfcAmt',name:'mfcAmt'}))+
    H.sec(T('Invoices this payment covers','الفواتير التي تغطيها هذه الدفعة'),invRows,{raw:true})+
    H.note(T('A 6-digit code confirms the hand-over. You will show it to the staff member, or enter the code they received.','رمز من 6 أرقام يؤكد التسليم. تظهره للموظف، أو تدخل الرمز الذي يصله.'),'info');
  return {b:body,dock:'<div class="dt"><small>'+esc(T('You pay','ستدفع'))+'</small>'+money(amt)+'</div>'+H.btn(T('Confirm and send code','أكّد وأرسل الرمز'),{ic:'key'})}; }
function startRequest(target){ const u=ui(); const st=selectedStaff(); if(!st) return;
  const due=dueInvoices();
  const amtEl=document.getElementById('mfcAmt')||document.querySelector('input[name="mfcAmt"]')||document.querySelector('#main .field input.inp');
  if(amtEl) u.amt=Number(String(amtEl.value).replace(/[, ]/g,''))||u.amt;
  const boxes=[...document.querySelectorAll('input[data-mfc="inv"]')];
  if(boxes.length) u.inv=boxes.filter(b=>b.checked).map(b=>b.getAttribute('data-arg'));
  const amt=Number(u.amt)||0;
  if(!amt||amt<=0){ toast(T('Enter an amount','أدخل المبلغ')); return; }
  if(!u.inv||!u.inv.length){ toast(T('Choose at least one invoice','اختر فاتورة واحدة على الأقل')); return; }
  const body={amount:amt,currency:'SAR',invoice_ids:u.inv.slice(),staff_id:st.id,staff_role:st.role,staff_name:st.name,otp_target:target||'customer'};
  const finish=req=>{
    const rec={id:req.request_id||uid(),otp:req.otp||SAMPLE_OTP,amount:amt,invoices:u.inv.slice(),staff:st,otp_target:body.otp_target,status:'pending_otp',ts:Date.now(),customer:sampleCustomer()};
    const s=load(); s.pending=s.pending.filter(p=>p.id!==rec.id); s.pending.unshift(rec); save(s);
    u.active=rec.id; go('b.pay.otp');
  };
  if(!isLive()){ finish({request_id:uid(),otp:SAMPLE_OTP}); return; }
  const prev=load();
  livePost('payments.cash.request','/payments/cash/request',body).then(j=>{
    const d=(j&&j.data&&typeof j.data==='object'&&!Array.isArray(j.data))?j.data:(j||{});
    finish(d);
  }).catch(()=>{ /* 501 notice is already shown; nothing saved */ }); }
function sampleCustomer(){ const m=me(), acc=m.account||{};
  const name=acc.name||m.name||T('Al Wadi Restaurant Co.','شركة مطعم الوادي');
  const name_ar=acc.name_ar||m.name_ar||'شركة مطعم الوادي';
  return {id:acc.id||m.account_id||'sample-alwadi',name,name_ar}; }
function activeReq(){ const u=ui(); const s=load(); return s.pending.find(p=>p.id===u.active)||s.pending[0]||null; }
function renderOtp(){ const MF=window.MF, H=MF.H; const rec=activeReq();
  if(!rec) return H.empty?H.empty('key',T('No payment waiting','لا دفعة بانتظار التأكيد'),T('Start again from Pay invoices.','ابدأ من جديد من دفع الفواتير.'),H.btns(H.btn(T('Pay invoices','دفع الفواتير'),{go:'b.pay'}))):noSpNote();
  const staff=personName(rec.staff);
  const toCust=rec.otp_target!=='staff';
  let h='';
  if(toCust){
    h+=H.sec('', '<div class="card pad mfc-wait">'+
      '<p class="s">'+esc(T('Show this code to','أظهر هذا الرمز إلى'))+' <b>'+esc(staff)+'</b></p>'+
      '<div class="mfc-code" dir="ltr">'+esc(isLive()?maskOtp(rec.otp):rec.otp)+'</div>'+
      (isLive()?'':'<p class="why">'+esc(T('Sample code (preview only). Your staff member enters it under Collect cash payment.','رمز تجريبي (للمعاينة فقط). يدخله الموظف من «تحصيل دفعة نقدية».'))+'</p>')+
      '<p class="why">'+esc(T('Waiting for them to confirm on their device.','بانتظار تأكيدهم على جهازهم.'))+'</p></div>',{raw:true});
    h+=H.btns(H.btn(T('Enter a code instead','أدخل رمزاً بدلاً من ذلك'),{k:'sec'}),H.btn(T('Cancel','إلغاء'),{k:'sec',go:'b.pay'}));
  }else{
    h+=H.sec(T('Enter the 6-digit code','أدخل الرمز المكوّن من 6 أرقام'),
      '<p class="why">'+esc(T('A 6-digit code was sent to','أُرسل رمز من 6 أرقام إلى')+' '+staff)+'</p>'+otpBoxes('','otp')+
      (isLive()?'':'<p class="why">'+esc(T('Sample code (preview only): ','رمز تجريبي (للمعاينة فقط): ')+SAMPLE_OTP)+'</p>')+
      '<button type="button" class="btn sec" data-mfc="resend">'+esc(T('Resend code','إعادة إرسال الرمز'))+'</button>',{raw:true});
    h={b:h,dock:H.btn(T('Confirm payment','أكّد الدفعة'),{st:'success'})};
  }
  const sum=H.sec(T('Paying','الدفع'),H.kv([[T('Amount','المبلغ'),money(rec.amount),'tot'],[T('Staff','الموظف'),staff],[T('Invoices','الفواتير'),(rec.invoices||[]).join(' · ')]]));
  if(typeof h==='string') return sum+h;
  h.b=sum+h.b; return h; }
function maskOtp(o){ return o?String(o).replace(/.(?=.{2})/g,'•'):'••••••'; }
function verifyStaff(code){ const rec=activeReq()||(load().pending||[])[0]; if(!rec) return;
  const otp=String(code||'').replace(/\D/g,'');
  if(otp.length!==6){ toast(T('Enter the 6-digit code','أدخل الرمز المكوّن من 6 أرقام')); return; }
  const finish=pay=>{ const s=load(); s.pending=s.pending.filter(p=>p.id!==rec.id);
    const rec2=Object.assign({},rec,{status:'received',payment_id:(pay&&pay.payment_id)||('RC-CASH-'+rec.id.slice(-6)),ts:Date.now()});
    s.paid.unshift(rec2); save(s); recordLocalPayment(rec2); toast(T('Payment received','تم استلام الدفعة')); go('lv.staff'); };
  if(!isLive()){ if(otp!==String(rec.otp||SAMPLE_OTP)){ toast(T("That code doesn't match",'الرمز غير مطابق')); return; } finish({}); return; }
  livePost('payments.cash.verify','/payments/cash/verify',{request_id:rec.id,otp:otp}).then(j=>{
    const d=(j&&j.data&&typeof j.data==='object'&&!Array.isArray(j.data))?j.data:(j||{}); finish(d);
  }).catch(()=>{}); }
function verifyOtp(code){ const rec=activeReq(); if(!rec) return;
  const otp=String(code||'').replace(/\D/g,'');
  if(otp.length!==6){ toast(T('Enter the 6-digit code','أدخل الرمز المكوّن من 6 أرقام')); return; }
  const done=pay=>{
    const s=load(); s.pending=s.pending.filter(p=>p.id!==rec.id);
    const rec2=Object.assign({},rec,{status:'received',payment_id:(pay&&pay.payment_id)||('RC-CASH-'+rec.id.slice(-6)),receipt_id:(pay&&pay.receipt_id),ts:Date.now()});
    s.paid.unshift(rec2); save(s);
    recordLocalPayment(rec2);
    const u=ui(); u.active=rec2.id; u.receipt=rec2.payment_id;
    go('b.pay.cash.done');
  };
  if(!isLive()){ if(otp!==String(rec.otp||SAMPLE_OTP)){ toast(T("That code doesn't match",'الرمز غير مطابق')); return; } done({}); return; }
  livePost('payments.cash.verify','/payments/cash/verify',{request_id:rec.id,otp:otp}).then(j=>{
    const d=(j&&j.data&&typeof j.data==='object'&&!Array.isArray(j.data))?j.data:(j||{});
    done(d);
  }).catch(()=>{}); }
function recordLocalPayment(rec){ if(isLive()) return; /* live write is the request/verify pair only */
  const L=window.MF&&MF.L; if(!L||!L.S) return;
  const S=L.S(); if(!S) return;
  const id=rec.payment_id;
  S.payments=S.payments||[];
  if(S.payments.some(p=>p.id===id)) return;
  (rec.invoices||[]).forEach(no=>{ const i=(S.invoices||[]).find(x=>(x.no||x.id)===no); if(!i) return;
    const bal=typeof L.bal==='function'?L.bal(i):Math.max(0,Number(i.total||i.amt||0)-Number(i.paid||0));
    const share=Math.min(bal,Number(rec.amount)||0);
    i.paid=Number(((i.paid||0)+share).toFixed(2)); });
  S.payments.unshift({id,ts:rec.ts||Date.now(),amt:rec.amount,m:'cash',inv:rec.invoices.slice(),staff:rec.staff&&rec.staff.name});
  if(L.save) L.save(); }
function renderDone(){ const MF=window.MF, H=MF.H; const s=load(); const rec=s.paid[0]||activeReq();
  if(!rec) return H.empty?H.empty('ok',T('Payment received','تم استلام الدفعة'),'',H.btns(H.btn(T('Finance','المالية'),{go:'b.finance'}))):'';
  const staff=personName(rec.staff);
  return '<div class="card pad center">'+(MF.art?MF.art('ok'):'')+'<p class="hero"><span class="l">'+esc(T('Received','تم الاستلام'))+'</span><span class="v disp">'+money(rec.amount)+'</span></p></div>'+
    H.sec(T('Receipt','الإيصال'),H.kv([
      [T('Receipt no.','رقم الإيصال'),(window.MF.LTR||((x)=>x))(rec.payment_id||rec.id)],
      [T('Method','الطريقة'),T('Pay by hand to MENAFoods staff','الدفع يدوياً لموظف MENAFoods')],
      [T('Received by','استلمها'),staff+' · '+roleLabel(rec.staff&&rec.staff.role)],
      [T('Invoices','الفواتير'),(rec.invoices||[]).join(' · ')]
    ]))+
    H.btns(H.btn(T('View in finance','عرض في المالية'),{go:'b.finance'}),H.btn(T('Done','تم'),{k:'sec',go:'b.home'})); }

/* ---------- staff collect ---------- */
function canCollect(role){ return COLLECT_ROLES.indexOf(role)>-1; }
function renderCollect(){ const MF=window.MF, H=MF.H; const s=load(); const pending=s.pending||[];
  const u=ui(); const open=pending.find(p=>p.id===u.staffOpen)||pending[0];
  let h='';
  if(!pending.length){
    h+=H.empty?H.empty('wallet',T('No cash payments waiting','لا دفعات نقدية بانتظارك'),T('When a customer chooses Pay by hand and picks you, it appears here so you can enter the code.','عندما يختار العميل الدفع يدوياً ويحدّدك، تظهر هنا لتدخل الرمز.')):'<p class="why">'+esc(T('No cash payments waiting','لا دفعات نقدية بانتظارك'))+'</p>';
  }else if(open){
    const cust=open.customer||sampleCustomer();
    const cname=arLang()?(cust.name_ar||cust.name):cust.name;
    h+=H.sec(T('Enter the 6-digit code','أدخل الرمز المكوّن من 6 أرقام'),
      '<p class="why">'+esc(T('From','من')+' '+cname+' · ')+money(open.amount)+'</p>'+otpBoxes('','otp')+
      (isLive()?'':'<p class="why">'+esc(T('Sample code (preview only): ','رمز تجريبي (للمعاينة فقط): ')+ (open.otp||SAMPLE_OTP))+'</p>')+
      '<button type="button" class="btn sec" data-mfc="resend">'+esc(T('Resend code','إعادة إرسال الرمز'))+'</button>',{raw:true});
    h+=H.sec(T('Details','التفاصيل'),H.kv([[T('Customer','العميل'),cname],[T('Amount','المبلغ'),money(open.amount),'tot'],[T('Invoices','الفواتير'),(open.invoices||[]).join(' · ')]]));
    if(pending.length>1) h+=H.sec(T('Other waiting payments','دفعات أخرى بانتظارك'),H.rows(pending.filter(p=>p.id!==open.id).map(p=>{
      const n=p.customer||sampleCustomer(); return {ic:'wallet',tone:'brand',t:arLang()?(n.name_ar||n.name):n.name,s:money(p.amount),go:'lv.cash',q:{id:p.id}}; })));
    return {b:h,dock:H.btn(T('Confirm received','أكّد الاستلام'),{st:'success'})};
  }
  return h; }
function patchStaffHome(){ const MF=window.MF; const d=MF&&MF.SCR&&MF.SCR['lv.staff']; if(!d||d.__mfcash||typeof d.render!=='function') return;
  d.__mfcash=true; const r0=d.render;
  d.render=function(c){ const out=r0.apply(this,arguments);
    if(!c||!canCollect(c.role)) return out;
    const H=MF.H; const n=(load().pending||[]).length;
    const row=H.sec(T('Collections','التحصيل'),H.rows([{ic:'wallet',tone:'brand',t:T('Collect cash payment','تحصيل دفعة نقدية'),s:n?T(n+' waiting',n+' بانتظارك'):T('Enter the customer’s one-time code','أدخل رمز العميل لمرة واحدة'),go:'lv.cash'}]));
    const add=html=>{ if(!html||html.indexOf('lv.cash')>-1) return html; const i=html.indexOf('</section>'); return i>-1?html.slice(0,i+10)+row+html.slice(i+10):row+html; };
    if(typeof out==='string') return add(out);
    if(out&&typeof out.b==='string'){ out.b=add(out.b); return out; }
    return out; }; }

function payRoles(){ const d=window.MF&&MF.SCR&&MF.SCR['b.pay'];
  if(d&&d.r){ const r=Array.isArray(d.r)?d.r.slice():String(d.r).split(/\s+/).filter(Boolean); if(r.length) return r; }
  return ['owner','bm','cfin']; }
function registerMF(){ const MF=window.MF; if(!MF||!MF.S||MF.SCR['b.pay.cash']) return;
  const S=MF.S; const PAY=payRoles();
  S('b.pay.cash',{a:'invoices',r:PAY.join(' '),t:[T('Pay by hand','الدفع يدوياً'),T('Pay by hand','الدفع يدوياً')],back:'b.pay',flow:true,noSeg:true,render:renderCashConfirm});
  S('b.pay.otp',{a:'invoices',r:PAY.join(' '),t:[T('Confirm with a code','التأكيد برمز'),T('Confirm with a code','التأكيد برمز')],back:'b.pay.cash',flow:true,noSeg:true,render:renderOtp});
  S('b.pay.cash.done',{a:'invoices',r:PAY.join(' '),t:[T('Payment received','تم استلام الدفعة'),T('Payment received','تم استلام الدفعة')],back:'b.finance',nav:'b.finance',noSeg:true,render:renderDone});
  S('lv.cash',{a:'home',r:COLLECT_ROLES.join(' '),t:[T('Collect cash payment','تحصيل دفعة نقدية'),T('Collect cash payment','تحصيل دفعة نقدية')],back:'lv.staff',noSeg:true,render:renderCollect});
  /* titles are bilingual arrays — MF.S expects [en,ar] */
  MF.SCR['b.pay.cash'].t=['Pay by hand','الدفع يدوياً'];
  MF.SCR['b.pay.otp'].t=['Confirm with a code','التأكيد برمز'];
  MF.SCR['b.pay.cash.done'].t=['Payment received','تم استلام الدفعة'];
  MF.SCR['lv.cash'].t=['Collect cash payment','تحصيل دفعة نقدية'];
  patchPayRender(); patchStaffHome(); interceptPay();
  if(!MF.SCR['lv.staff']){
    S('lv.staff',{a:'home',r:'sales van driver store acct mgr admin',t:['Home','الرئيسية'],noSeg:true,
      render:function(c){ const H=MF.H; const home={sales:'s.today',van:'v.route',driver:'d.route',store:'k.lists',admin:'ad.overview',acct:'more',mgr:'m.inbox'}[(c&&c.role)||'']||'more';
        const n=(load().pending||[]).length;
        let h='';
        if(canCollect(c&&c.role)) h+=H.sec(T('Collections','التحصيل'),H.rows([{ic:'wallet',tone:'brand',t:T('Collect cash payment','تحصيل دفعة نقدية'),s:n?T(n+' waiting',n+' بانتظارك'):T('Enter the customer’s one-time code','أدخل رمز العميل لمرة واحدة'),go:'lv.cash'}]));
        h+=H.sec('',H.rows([{ic:'home',tone:'brand',t:T('Open your tools','افتح أدواتك'),go:home}]));
        return h; }});
    patchStaffHome();
  }
  function addCollectRow(id){ const d=MF.SCR[id]; if(!d||d.__mfcashCol||typeof d.render!=='function') return;
    d.__mfcashCol=true; const r0=d.render;
    d.render=function(){ const out=r0.apply(this,arguments); const H=MF.H;
      const row=H.sec(T('Collections','التحصيل'),H.rows([{ic:'wallet',tone:'brand',t:T('Collect cash payment','تحصيل دفعة نقدية'),s:T('Enter the customer’s one-time code','أدخل رمز العميل لمرة واحدة'),go:'lv.cash'}]));
      const add=h=>{ if(typeof h!=='string'||h.indexOf('lv.cash')>-1) return h; return row+h; };
      if(typeof out==='string') return add(out);
      if(out&&typeof out.b==='string'){ out.b=add(out.b); return out; }
      return out; }; }
  ['s.today','v.route','d.route','k.lists','ad.overview'].forEach(addCollectRow);
  registerThemeMF();
}

function themeHref(id){
  if(window.MFSwitch&&typeof MFSwitch.dest==='function'){ try{ const d=MFSwitch.dest(id); if(d&&d.href) return d.href; }catch(e){} }
  const qs=(()=>{ try{ return new URLSearchParams((location.hash.split('?')[1]||'')+'&'+(location.search||'').replace(/^\?/,'')); }catch(e){ return new URLSearchParams(); } })();
  const L=qs.get('lang')||qs.get('l')||(arLang()?'ar':'en');
  const role=qs.get('role')||'owner';
  const base='../'+id+'/';
  if(id==='direction-b') return base+'index.html#/c.theme?lang='+L;
  if(id==='direction-c') return base+'app.html#r=customer&s=b-theme&l='+L;
  if(id==='direction-a'||id==='direction-a-v2') return base+'index.html#/b.home?lang='+L;
  const screen='set.theme';
  return base+'app.html#/'+screen+'?lang='+L+'&role='+role;
}
const THEME_LIST=[
  ['redesign-v3','Calm Commerce · v3','التجارة الهادئة · الإصدار 3'],
  ['theme-souq-modern','Souq Modern','السوق العصري'],
  ['theme-pro-ops','Pro Ops','العمليات الاحترافية'],
  ['theme-fresh-market','Fresh Market','السوق الطازج'],
  ['direction-b','Direction B · Smart Basket','الاتجاه B · السلة الذكية'],
  ['direction-c','Direction C · Role Command Hubs','الاتجاه C · لوحات قيادة حسب الدور']
];
function currentThemeId(){
  const ids=['theme-souq-modern','theme-fresh-market','theme-pro-ops','redesign-v3','direction-a-v2','direction-a','direction-b','direction-c'];
  const path=String(location.pathname||'');
  for(let i=0;i<ids.length;i++){ const id=ids[i]; if(path.indexOf('/'+id+'/')>-1||path.endsWith('/'+id)||new RegExp('/'+id+'([/?#]|$)').test(path)) return id; }
  if(window.MFSwitch&&typeof MFSwitch.THEME==='string'&&ids.indexOf(MFSwitch.THEME)>-1) return MFSwitch.THEME;
  const m=path.match(/p-eb6725bbe4f4\/([^/]+)/); return (m&&ids.indexOf(m[1])>-1)?m[1]:''; }
function registerThemeMF(){ const MF=window.MF; if(!MF||!MF.S||MF.SCR['set.theme']) return;
  const H=MF.H;
  MF.S('set.theme',{a:'settings',r:ALL_ROLES,t:['Theme','الثيم'],back:'more',noSeg:true,
    render:function(){ const L=arLang()?'ar':'en'; const cur=currentThemeId();
      const rows=THEME_LIST.map(([id,en,ar])=>{
        const on=id===cur; const href=themeHref(id);
        const inner=H.row({ic:on?'check':'grid',tone:on?'brand':'',t:L==='ar'?ar:en,s:on?T('Current','الحالي'):''});
        return String(inner).replace(/^<div /,'<a href="'+String(href).replace(/"/g,'&quot;')+'" ').replace(/<\/div>\s*$/,'</a>');
      }).join('');
      return H.sec(T('App theme','ثيم التطبيق'),H.note(T('Keeps this screen, your language and your role.','يحافظ على هذه الشاشة ولغتك ودورك.'))+rows,{raw:true}); }});
  const acc=MF.SCR['set.account'];
  if(acc&&typeof acc.render==='function'&&!acc.__mfth){ acc.__mfth=true; const r0=acc.render;
    acc.render=function(){ const out=r0.apply(this,arguments);
      const row=H.row({ic:'grid',tone:'brand',t:T('Theme','الثيم'),s:(THEME_LIST.find(x=>x[0]===currentThemeId())||['','Theme','الثيم'])[arLang()?2:1],go:'set.theme'});
      const add=h=>{ if(typeof h!=='string'||h.indexOf('set.theme')>-1) return h;
        const mark=MF.href('set.prefs'); const i=h.indexOf('href="'+mark+'"');
        if(i>-1){ const start=h.lastIndexOf('<a',i); if(start>-1) return h.slice(0,start)+row+h.slice(start); }
        return h+row; };
      if(typeof out==='string') return add(out);
      if(out&&typeof out.b==='string'){ out.b=add(out.b); return out; }
      return out; }; }
  const prefs=MF.SCR['set.prefs'];
  if(prefs&&typeof prefs.render==='function'&&!prefs.__mfth){ prefs.__mfth=true; const r0=prefs.render;
    prefs.render=function(){ const top=H.sec(T('App theme','ثيم التطبيق'),H.rows([{ic:'grid',tone:'brand',t:T('Theme','الثيم'),s:T('Switch theme','تغيير النمط'),go:'set.theme'}]));
      const out=r0.apply(this,arguments);
      if(typeof out==='string') return out.indexOf('set.theme')>-1?out:top+out;
      if(out&&typeof out.b==='string'&&out.b.indexOf('set.theme')<0) out.b=top+out.b;
      return out; }; }
}


/* ---------- events ---------- */
function bind(){ if(bind.ok) return; bind.ok=true;
  document.addEventListener('change',function(e){ const el=e.target; if(!el||!el.matches) return;
    if(el.name==='mfcstaff'){ ui().staff=el.value; }
  });
  document.addEventListener('input',function(e){ const el=e.target; if(!el||!el.matches||!el.matches('input.mfc-d')) return;
    const i=Number(el.getAttribute('data-i')||0); const v=String(el.value).replace(/\D/g,'').slice(-1);
    el.value=v; const box=el.parentNode; const all=[...box.querySelectorAll('input.mfc-d')];
    if(v&&all[i+1]) all[i+1].focus();
    const hid=document.getElementById('mfcOtp'); if(hid) hid.value=all.map(x=>x.value).join('');
  });
  document.addEventListener('keydown',function(e){ const el=e.target; if(!el||!el.matches||!el.matches('input.mfc-d')) return;
    if(e.key==='Backspace'&&!el.value){ const i=Number(el.getAttribute('data-i')||0); const all=[...el.parentNode.querySelectorAll('input.mfc-d')]; if(all[i-1]){ all[i-1].focus(); all[i-1].value=''; } }
  });
  document.addEventListener('click',function(e){ const t=e.target.closest('button,a,[data-mfc]'); if(!t) return;
    const scr=window.MF&&MF.C&&MF.C.id;
    const label=(t.textContent||'').trim();
    const mfc=t.getAttribute('data-mfc');
    if(mfc==='resend'){ e.preventDefault(); toast(T('A new code was sent','أُرسل رمز جديد')); return; }
    if(scr==='b.pay.cash'&&(t.getAttribute('data-st')||/Confirm and send code|أكّد وأرسل الرمز/.test(label))){ e.preventDefault(); startRequest('customer'); return; }
    if(scr==='b.pay.otp'&&/Enter a code instead|أدخل رمزاً بدلاً من ذلك/.test(label)){ e.preventDefault(); const rec=activeReq(); if(rec){ rec.otp_target='staff'; const s=load(); const i=s.pending.findIndex(p=>p.id===rec.id); if(i>-1) s.pending[i]=rec; save(s); const L=window.MF&&MF.L; if(L&&L.rr) L.rr(); } return; }
    if(scr==='b.pay.otp'&&(/Confirm payment|أكّد الدفعة/.test(label)||t.getAttribute('data-st'))){ e.preventDefault(); const hid=document.getElementById('mfcOtp'); verifyOtp(hid&&hid.value); return; }
    if(scr==='lv.cash'&&(/Confirm received|أكّد الاستلام/.test(label)||t.getAttribute('data-st'))){ e.preventDefault(); const hid=document.getElementById('mfcOtp'); const rec=activeReq()||(load().pending||[])[0]; if(rec) ui().active=rec.id; verifyStaff(hid&&hid.value); return; }
  },true);
  /* after staff verify in sample, show a staff-side confirmation if we landed on customer done while in a staff role */
}

/* ---------- Direction B ---------- */
function registerB(){ if(typeof screen!=='function') return;
  const Lb=typeof L==='function'?L:function(en,ar){ return arLang()?ar:en; };
  const moneyB=window.money||money;
  const Ico=window.I||function(){ return ''; };
  const field=window.field;
  const btn=window.btn;
  const needPay=!(typeof SC!=='undefined'&&SC['c.pay']);
  if(needPay){
  screen('c.pay',{role:'customer',code:'2.11b',en:'Make a payment',ar:'إجراء دفعة',nav:'c.profile',back:'c.invoices',layout:'form',
    render:function(){ const sp=assignedSalesperson();
      let h='<h1 style="margin:8px 0 0;font-size:22px">'+esc(Lb('How would you like to pay?','كيف تريد الدفع؟'))+'</h1>';
      h+='<div class="list"><label class="li"><input type="radio" name="bpaym" value="card" checked><div class="sp"><div class="b">'+esc(Lb('Card, mada or Apple Pay','بطاقة أو مدى أو Apple Pay'))+'</div><div class="small muted">'+esc(Lb('Instant · simulated','فوري · محاكى'))+'</div></div></label>';
      h+='<label class="li"><input type="radio" name="bpaym" value="sadad"><div class="sp"><div class="b">'+esc(Lb('Bank transfer (SADAD / IBAN)','تحويل بنكي (سداد / آيبان)'))+'</div></div></label>';
      if(sp) h+='<label class="li mfc-method"><input type="radio" name="bpaym" value="cash"><div class="sp"><div class="b">'+esc(Lb('Pay by hand to MENAFoods staff','الدفع يدوياً لموظف MENAFoods'))+'</div><div class="small muted">'+esc(Lb('Confirmed with a one-time code','يُؤكَّد برمز لمرة واحدة'))+'</div></div></label></div>';
      else h+='</div>'+noSpNoteB();
      h+='<div class="card"><div class="between"><div class="small muted">'+esc(Lb('Paying','الدفع'))+'</div><div class="b ltr">INV-26-09-1187</div></div><div class="big">'+moneyB(1500)+'</div></div>';
      h+='<button class="btn block" data-mfc="b-cont">'+esc(Lb('Continue','متابعة'))+'</button>';
      return h; }});
  screen('c.pay.cash',{role:'customer',en:'Pay by hand',ar:'الدفع يدوياً',nav:'c.profile',back:'c.pay',layout:'form',
    render:function(){ const list=staffChoices(); const sp=assignedSalesperson(); if(!sp) return noSpNoteB();
      let h='<h1 style="margin:8px 0 0;font-size:22px">'+esc(Lb('Who will receive it','من يستلم المبلغ'))+'</h1><div class="list">';
      list.forEach((s,i)=>{ h+='<label class="li"><input type="radio" name="mfcstaff" value="'+esc(s.id)+'"'+(i===0?' checked':'')+'><div class="sp"><div class="b">'+esc(personName(s))+'</div><div class="small muted">'+esc(roleLabel(s.role))+'</div></div></label>'; });
      h+='</div>';
      if(field) h+=field(Lb('Amount','المبلغ'),'1,500.00',{ltr:true});
      else h+='<label class="field"><span>'+esc(Lb('Amount','المبلغ'))+'</span><input class="ltr" value="1500.00" id="mfcAmt"></label>';
      h+='<div class="card"><label class="li"><input type="checkbox" checked data-mfc="inv" data-arg="INV-26-09-1187"><div class="sp"><span class="ltr">INV-26-09-1187</span></div><b>'+moneyB(1500)+'</b></label></div>';
      h+='<button class="btn block" data-mfc="b-send">'+esc(Lb('Confirm and send code','أكّد وأرسل الرمز'))+'</button>';
      return h; }});
  screen('c.pay.otp',{role:'customer',en:'Confirm with a code',ar:'التأكيد برمز',nav:'c.profile',back:'c.pay.cash',layout:'form',
    render:function(){ const rec=activeReq(); if(!rec) return '<p>'+esc(Lb('No payment waiting','لا دفعة بانتظار التأكيد'))+'</p>';
      return '<div class="card" style="text-align:center"><p class="small muted">'+esc(Lb('Show this code to','أظهر هذا الرمز إلى'))+' <b>'+esc(personName(rec.staff))+'</b></p><div class="mfc-code" dir="ltr">'+esc(rec.otp||SAMPLE_OTP)+'</div><p class="small muted">'+esc(Lb('Sample code (preview only).','رمز تجريبي (للمعاينة فقط).'))+'</p></div><button class="btn out block" data-act="go:c.invoices">'+esc(Lb('Done','تم'))+'</button>'; }});
  screen('s.collect',{role:'sales',en:'Collect cash payment',ar:'تحصيل دفعة نقدية',nav:'s.customers',back:'s.customers',layout:'form',
    render:function(){ const p=(load().pending||[])[0];
      if(!p) return '<div class="card"><p>'+esc(Lb('No cash payments waiting','لا دفعات نقدية بانتظارك'))+'</p><p class="small muted">'+esc(Lb('When a customer chooses Pay by hand and picks you, it appears here.','عندما يختار العميل الدفع يدوياً ويحدّدك، تظهر هنا.'))+'</p></div>';
      return '<h1 style="margin:8px 0 0;font-size:22px">'+esc(Lb('Enter the 6-digit code','أدخل الرمز المكوّن من 6 أرقام'))+'</h1><p class="small muted">'+esc((p.customer&&p.customer.name)||Lb('Customer','العميل'))+' · '+moneyB(p.amount)+'</p>'+otpBoxes('','otp')+'<p class="small muted">'+esc(Lb('Sample code (preview only): ','رمز تجريبي (للمعاينة فقط): ')+(p.otp||SAMPLE_OTP))+'</p><button class="btn block" data-mfc="b-staff-ok">'+esc(Lb('Confirm received','أكّد الاستلام'))+'</button>'; }});

  [['v.collect','van','v.route'],['a.collect','acct','a.approvals'],['m.collect','admin','m.approvals']].forEach(function(x){
    const id=x[0], role=x[1], back=x[2]; if(SC[id]) return;
    screen(id,{role:role,en:'Collect cash payment',ar:'تحصيل دفعة نقدية',nav:back,back:back,layout:'form',render:SC['s.collect']&&SC['s.collect'].render});
    wrapBScreen(back,function(html){ if(!html||html.indexOf(id)>-1) return html;
      const row='<div class="list"><div class="li" data-act="go:'+id+'">'+(Ico('wallet')||'')+'<div class="sp"><div class="b">'+esc(Lb('Collect cash payment','تحصيل دفعة نقدية'))+'</div><div class="small muted">'+esc(Lb('Enter the customer’s one-time code','أدخل رمز العميل لمرة واحدة'))+'</div></div></div></div>';
      return row+html; });
  });
  }
  if(!(typeof SC!=='undefined'&&SC['c.theme'])){
    screen('c.theme',{role:'customer',en:'Theme',ar:'الثيم',nav:'c.profile',back:'c.profile',layout:'list',
      render:function(){ const cur=currentThemeId(); let h='<h1 style="margin:8px 0 12px;font-size:22px">'+esc(T('Theme','الثيم'))+'</h1><div class="list">';
        THEME_LIST.forEach(([id,en,ar])=>{ const on=id===cur; h+='<a class="li" href="'+esc(themeHref(id))+'"><div class="sp"><div class="b">'+esc(arLang()?ar:en)+'</div>'+(on?'<div class="small muted">'+esc(T('Current','الحالي'))+'</div>':'')+'</div></a>'; });
        return h+'</div>'; }});
  }
  wrapBScreen('c.profile',html=>{
    if(!html||html.indexOf('c.theme')>-1) return html;
    const row='<div class="li" data-act="go:c.theme"><div class="sp"><div class="b">'+esc(T('Theme','الثيم'))+'</div><div class="small muted">'+esc((THEME_LIST.find(x=>x[0]===currentThemeId())||['','Theme','الثيم'])[arLang()?2:1])+'</div></div></div>';
    const j=html.indexOf('data-act="go:a.lang"');
    if(j>-1){ let start=html.lastIndexOf('<div class="li"',j); if(start<0) start=j; /* insert after this li */ const end=html.indexOf('</div>', html.indexOf('</div>', html.indexOf('</div>', start)+1)+1); if(end>-1) return html.slice(0,end+6)+row+html.slice(end+6); }
    return html.replace('<div class="list">','<div class="list">'+row);
  });
  wrapBScreen('c.invoices',html=>{
    if(!html) return html;
    return html.replace(/data-act="[^"]*Payment link opened[^"]*"/g,'data-act="go:c.pay"').replace(/data-act="[^"]*فُتح رابط الدفع[^"]*"/g,'data-act="go:c.pay"');
  });
  wrapBScreen('s.customers',html=>{
    if(!html||html.indexOf('s.collect')>-1) return html;
    const row='<div class="list"><div class="li" data-act="go:s.collect">'+ (Ico('wallet')||'') +'<div class="sp"><div class="b">'+esc(Lb('Collect cash payment','تحصيل دفعة نقدية'))+'</div><div class="small muted">'+esc(Lb('Enter the customer’s one-time code','أدخل رمز العميل لمرة واحدة'))+'</div></div></div></div>';
    return row+html;
  });
  document.addEventListener('click',function(e){ const t=e.target.closest('[data-mfc],button,a'); if(!t) return;
    const a=t.getAttribute('data-mfc');
    if(a==='b-cont'){ e.preventDefault(); const cash=document.querySelector('input[name="bpaym"][value="cash"]:checked');
      if(cash){ if(typeof window.go==='function') window.go('c.pay.cash'); else location.hash='#/c.pay.cash'; }
      else { toast(T('Simulated in this preview','محاكاة في هذه النسخة')); } return; }
    if(a==='b-send'){ e.preventDefault(); const st=staffChoices()[0]; const rec={id:uid(),otp:SAMPLE_OTP,amount:1500,invoices:['INV-26-09-1187'],staff:selectedOr(st),otp_target:'customer',status:'pending_otp',ts:Date.now(),customer:sampleCustomer()};
      const s=load(); s.pending.unshift(rec); save(s); ui().active=rec.id; if(typeof window.go==='function') window.go('c.pay.otp'); else location.hash='#/c.pay.otp'; return; }
    if(a==='b-staff-ok'){ e.preventDefault(); const hid=document.getElementById('mfcOtp'); const rec=(load().pending||[])[0]; if(!rec) return;
      if(String(hid&&hid.value)!==String(rec.otp||SAMPLE_OTP)){ toast(T("That code doesn't match",'الرمز غير مطابق')); return; }
      const s=load(); s.pending=s.pending.filter(p=>p.id!==rec.id); s.paid.unshift(Object.assign({},rec,{status:'received'})); save(s); toast(T('Payment received','تم استلام الدفعة')); if(typeof window.go==='function'){ const cur=(window.S&&S.screen)||'s.customers'; const back=(SC[cur]&&SC[cur].back)||'s.customers'; window.go(back);} }
  },true);
}
function selectedOr(st){ const id=(document.querySelector('input[name="mfcstaff"]:checked')||{}).value; return staffChoices().find(s=>s.id===id)||st; }
function noSpNoteB(){ const Lb=typeof L==='function'?L:T;
  return '<div class="card" role="status"><b>'+esc(Lb('Pay by hand to MENAFoods staff','الدفع يدوياً لموظف MENAFoods'))+'</b><p class="small">'+esc(Lb("You don't have an assigned salesperson yet. Contact MENAFoods to get one.","ليس لديك مندوب مبيعات معيّن بعد. تواصل مع MENAFoods لتعيين مندوب."))+'</p><button class="btn out" data-act="'+esc(Lb('Contact MENAFoods (sample)','تواصل مع MENAFoods (تجريبي)'))+'">'+esc(Lb('Contact MENAFoods','تواصل مع MENAFoods'))+'</button></div>'; }
function wrapBScreen(id,fn){ const SC=window.SC; const d=SC&&SC[id]; if(!d||typeof d.render!=='function'||d.__mfcash) return;
  d.__mfcash=true; const r0=d.render; d.render=function(){ return fn(r0.apply(this,arguments)); }; }

/* ---------- Direction C ---------- */
function registerC(){ if(typeof SCREENS==='undefined'||typeof R!=='function') return;
  const needPay=!SCREENS.some(s=>s.id==='b-pay');
  if(needPay){
  const Lb=typeof L==='function'?L:T; const moneyC=window.money||money;
  R({id:'b-pay',role:'customer',nav:'finance',title:['Make a payment','إجراء دفعة'],kind:'form',back:'b-finance',
    render:function(){ const sp=assignedSalesperson();
      let h='<h1 style="margin:8px 0 0;font-size:22px">'+esc(Lb('How would you like to pay?','كيف تريد الدفع؟'))+'</h1>';
      h+='<div class="list"><label class="li"><input type="radio" name="cpaym" value="card" checked><div class="grow"><b>'+esc(Lb('Card, mada or Apple Pay','بطاقة أو مدى أو Apple Pay'))+'</b><div class="small muted">'+esc(Lb('Instant · simulated','فوري · محاكى'))+'</div></div></label>';
      h+='<label class="li"><input type="radio" name="cpaym" value="sadad"><div class="grow"><b>'+esc(Lb('Bank transfer (SADAD / IBAN)','تحويل بنكي (سداد / آيبان)'))+'</b></div></label>';
      if(sp) h+='<label class="li mfc-method"><input type="radio" name="cpaym" value="cash"><div class="grow"><b>'+esc(Lb('Pay by hand to MENAFoods staff','الدفع يدوياً لموظف MENAFoods'))+'</b><div class="small muted">'+esc(Lb('Confirmed with a one-time code','يُؤكَّد برمز لمرة واحدة'))+'</div></div></label></div>';
      else h+='</div>'+noSpNoteC();
      h+='<div class="card pad"><div class="small muted">INV-S-20418</div><div class="big">'+ (typeof moneyC==='function'?moneyC(6200):'6,200')+'</div></div>';
      h+='<button class="btn block" data-mfc="c-cont">'+esc(Lb('Continue','متابعة'))+'</button>';
      return h; }});
  R({id:'b-pay-cash',role:'customer',nav:'finance',title:['Pay by hand','الدفع يدوياً'],kind:'form',back:'b-pay',
    render:function(){ const list=staffChoices(); const sp=assignedSalesperson(); if(!sp) return noSpNoteC();
      let h='<h1 style="margin:8px 0 0;font-size:22px">'+esc(Lb('Who will receive it','من يستلم المبلغ'))+'</h1><div class="list">';
      list.forEach((s,i)=>{ h+='<label class="li"><input type="radio" name="mfcstaff" value="'+esc(s.id)+'"'+(i===0?' checked':'')+'><div class="grow"><b>'+esc(personName(s))+'</b><div class="small muted">'+esc(roleLabel(s.role))+'</div></div></label>'; });
      h+='</div><label class="field"><span>'+esc(Lb('Amount','المبلغ'))+'</span><input class="ltr" id="mfcAmt" value="6200.00" inputmode="decimal"></label>';
      h+='<div class="list"><label class="li"><input type="checkbox" checked data-mfc="inv" data-arg="INV-S-20418"><div class="grow"><span class="ltr">INV-S-20418</span></div><b>'+(typeof moneyC==='function'?moneyC(6200):'6,200')+'</b></label></div>';
      h+='<button class="btn block" data-mfc="c-send">'+esc(Lb('Confirm and send code','أكّد وأرسل الرمز'))+'</button>';
      return h; }});
  R({id:'b-pay-otp',role:'customer',nav:'finance',title:['Confirm with a code','التأكيد برمز'],kind:'form',back:'b-pay-cash',
    render:function(){ const rec=activeReq(); if(!rec) return '<p>'+esc(Lb('No payment waiting','لا دفعة بانتظار التأكيد'))+'</p>';
      return '<div class="card pad" style="text-align:center"><p class="small muted">'+esc(Lb('Show this code to','أظهر هذا الرمز إلى'))+' <b>'+esc(personName(rec.staff))+'</b></p><div class="mfc-code" dir="ltr">'+esc(rec.otp||SAMPLE_OTP)+'</div><p class="small muted">'+esc(Lb('Sample code (preview only).','رمز تجريبي (للمعاينة فقط).'))+'</p></div>'; }});
  R({id:'s-collect',role:'sales',nav:'more',title:['Collect cash payment','تحصيل دفعة نقدية'],kind:'form',
    render:function(){ const p=(load().pending||[])[0];
      if(!p) return '<div class="card pad"><p>'+esc(Lb('No cash payments waiting','لا دفعات نقدية بانتظارك'))+'</p></div>';
      return '<h1 style="margin:8px 0 0;font-size:22px">'+esc(Lb('Enter the 6-digit code','أدخل الرمز المكوّن من 6 أرقام'))+'</h1>'+otpBoxes('','otp')+'<p class="small muted">'+esc(Lb('Sample code (preview only): ','رمز تجريبي (للمعاينة فقط): ')+(p.otp||SAMPLE_OTP))+'</p><button class="btn block" data-mfc="c-staff-ok">'+esc(Lb('Confirm received','أكّد الاستلام'))+'</button>'; }});

  [['v-collect','van','v-hub'],['a-collect','acct','a-hub'],['m-collect','admin','m-hub']].forEach(function(x){
    const id=x[0], role=x[1], back=x[2]; if(SCREENS.some(s=>s.id===id)) return;
    const src=SCREENS.find(s=>s.id==='s-collect');
    R({id:id,role:role,nav:'more',title:['Collect cash payment','تحصيل دفعة نقدية'],kind:'form',back:back,render:src&&src.render});
  });
  ['s-hub','v-hub','a-hub','m-hub'].forEach(function(hid){
    const sc=SCREENS.find(s=>s.id===hid); if(!sc||typeof sc.render!=='function'||sc.__mfcashCol) return;
    sc.__mfcashCol=true; const r0=sc.render; const dest=hid==='s-hub'?'s-collect':hid.replace('-hub','-collect');
    sc.render=function(){ const html=String(r0.apply(this,arguments)||''); if(html.indexOf(dest)>-1) return html;
      const row='<div class="card pad" style="margin:0 0 12px"><a class="li" data-go="'+dest+'"><div class="grow"><b>'+esc(Lb('Collect cash payment','تحصيل دفعة نقدية'))+'</b><div class="small muted">'+esc(Lb('Enter the customer’s one-time code','أدخل رمز العميل لمرة واحدة'))+'</div></div></a></div>';
      return row+html; };
  });
  }
  if(!SCREENS.some(s=>s.id==='b-theme')){
    R({id:'b-theme',role:'customer',nav:'more',title:['Theme','الثيم'],kind:'list',back:'b-profile',
      render:function(){ const cur=currentThemeId(); let h='<h1 style="margin:8px 0 12px;font-size:22px">'+esc(T('Theme','الثيم'))+'</h1><div class="list">';
        THEME_LIST.forEach(([id,en,ar])=>{ const on=id===cur; h+='<a class="li" href="'+esc(themeHref(id))+'"><div class="grow"><b>'+esc(arLang()?ar:en)+'</b>'+(on?'<div class="small muted">'+esc(T('Current','الحالي'))+'</div>':'')+'</div></a>'; });
        return h+'</div>'; }});
  }
  const prof=SCREENS.find(s=>s.id==='b-profile');
  if(prof&&typeof prof.render==='function'&&!prof.__mfth){ prof.__mfth=true; const r0=prof.render;
    prof.render=function(){ const html=String(r0.apply(this,arguments)||'');
      if(html.indexOf('b-theme')>-1) return html;
      const row='<a class="li" data-go="b-theme"><div class="grow"><b>'+esc(T('Theme','الثيم'))+'</b><div class="small muted">'+esc((THEME_LIST.find(x=>x[0]===currentThemeId())||['','Theme','الثيم'])[arLang()?2:1])+'</div></div></a>';
      const i=html.indexOf('data-go="auth-lang"');
      if(i>-1){ const end=html.indexOf('</a>',i); if(end>-1) return html.slice(0,end+4)+row+html.slice(end+4); }
      return html.replace('<div class="list">','<div class="list">'+row); }; }
  const fin=SCREENS.find(s=>s.id==='b-finance');
  if(fin&&typeof fin.render==='function'&&!fin.__mfcash){ fin.__mfcash=true; const r0=fin.render;
    fin.render=function(){ return String(r0.apply(this,arguments)||'').replace(/>([^<]*Pay now|ادفع الآن)<\/button>/,' data-go="b-pay">$1</button>'); }; }
  document.addEventListener('click',function(e){ const t=e.target.closest('[data-mfc],button'); if(!t) return;
    const a=t.getAttribute('data-mfc'); const goC=id=>{ const p=new URLSearchParams(location.hash.slice(1)); p.set('s',id); location.hash=p.toString(); };
    if(a==='c-cont'){ e.preventDefault(); if(document.querySelector('input[name="cpaym"][value="cash"]:checked')) goC('b-pay-cash'); else toast(T('Simulated in this preview','محاكاة في هذه النسخة')); }
    if(a==='c-send'){ e.preventDefault(); const st=selectedOr(staffChoices()[0]); const rec={id:uid(),otp:SAMPLE_OTP,amount:6200,invoices:['INV-S-20418'],staff:st,otp_target:'customer',status:'pending_otp',ts:Date.now(),customer:sampleCustomer()};
      const s=load(); s.pending.unshift(rec); save(s); ui().active=rec.id; goC('b-pay-otp'); }
    if(a==='c-staff-ok'){ e.preventDefault(); const hid=document.getElementById('mfcOtp'); const rec=(load().pending||[])[0]; if(!rec) return;
      if(String(hid&&hid.value)!==String(rec.otp||SAMPLE_OTP)){ toast(T("That code doesn't match",'الرمز غير مطابق')); return; }
      const s=load(); s.pending=s.pending.filter(p=>p.id!==rec.id); s.paid.unshift(Object.assign({},rec,{status:'received'})); save(s); toast(T('Payment received','تم استلام الدفعة')); }
  },true);
}
function noSpNoteC(){ const Lb=typeof L==='function'?L:T;
  return '<div class="card pad" role="status"><b>'+esc(Lb('Pay by hand to MENAFoods staff','الدفع يدوياً لموظف MENAFoods'))+'</b><p class="small muted">'+esc(Lb("You don't have an assigned salesperson yet. Contact MENAFoods to get one.","ليس لديك مندوب مبيعات معيّن بعد. تواصل مع MENAFoods لتعيين مندوب."))+'</p><button class="btn sec" data-act="'+esc(Lb('Contact MENAFoods (sample)','تواصل مع MENAFoods (تجريبي)'))+'">'+esc(Lb('Contact MENAFoods','تواصل مع MENAFoods'))+'</button></div>'; }

function boot(){ css();
  try{ registerMF(); }catch(e){ console.warn('[cash-pay] mf',e); }
  try{ registerB(); }catch(e){ console.warn('[cash-pay] b',e); }
  try{ registerC(); }catch(e){ console.warn('[cash-pay] c',e); }
  bind();
}
boot();
window.MFCash={assignedSalesperson,staffChoices,isLive,SAMPLE_OTP,payRoles,currentThemeId,COLLECT_ROLES};
})();
