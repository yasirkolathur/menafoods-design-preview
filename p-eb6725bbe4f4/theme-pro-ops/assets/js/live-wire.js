/* MENAFoods · WIRING layer (front-end only, SAMPLE DATA). Loaded after live-ops.js.
   Every button, chip, switch and keypad that used to show a "Done (prototype)" toast or did nothing is wired here to
   a real screen, a sheet, or a real action on the local data (saved through MF.API in sample mode).
   New screens/sheets follow Mobbin references (cited in REF below; collection "MENAFoods – Customer Care" + searches 15 Nov 2026):
   - doc.view (document viewer, Save as PDF / Print / Share): Airbnb receipt 6ad950a7, talabat bilingual receipt 27e8d95e,
     Neo Financial statement 085a83c6, Lemonade receipt 4fb854cb.
   - b.branchNew (add a branch / delivery location): talabat new address a445dacb, Swiggy address form e0f2485a, Fresha custom address c044c3a7.
   - Invite sheet: Slack invite sheet e7166ddd, WHOOP invite code 9165178c.
   - Add photo / file action sheet: ChatGPT add sources f9d0d350, Airbnb select-from-library ae8818cc, Cursor context bc79928a.
   - Confirm (destructive) sheet: talabat cancel free trial 5fbd7ce4, Shopify cancel plan 9c34f0f0, Partiful cancel event 714182f5.
   - Reason / note sheet: Wolt add message 288b4f35, Airbnb are-you-sure c8fa3a80.
   - Date sheet (promise to pay, call back): Wealthfront choose date fb11c205, Venmo schedule 8067ab9d. */
(function(){
'use strict';
const MF=window.MF, L=MF&&MF.L; if(!MF||!L||!MF.LIVE) return;
const {t,tt,H,M,N,I,LTR,href}=MF; const S=()=>L.S(); const ACT=L.ACT; const {esc,go,toast}=L;
const now=()=>Date.now(); const DAY=86400000;
const REF=L.WIRE_REF={
 'doc.view':['Airbnb 6ad950a7-f46b-41ab-9f31-b09e7f7439c7','talabat 27e8d95e-1473-4a8f-8693-c669d95bd96e','Neo Financial 085a83c6-918e-4276-9ef5-507c1ee360be','Lemonade 4fb854cb-31da-4289-8725-808f5a7ddf7f'],
 'b.branchNew':['talabat a445dacb-2180-48aa-ba13-a05ff87f197b','Swiggy e0f2485a-bebc-4668-b3bc-d7ef2ae89ffd','Fresha c044c3a7-5eba-432c-99a3-400019ebd1c1'],
 invite:['Slack e7166ddd-377a-4395-8646-40fa80ce5f96','WHOOP 9165178c-50c9-4277-b86e-1ee134799d4f'],
 photo:['ChatGPT f9d0d350-5094-4901-8a4f-4a941b88ca98','Airbnb ae8818cc-38dd-4cf8-a6df-306c1d6ad578','Cursor bc79928a-d1fe-4210-b884-e5a52d2e9bb4'],
 confirm:['talabat 5fbd7ce4-aa12-42b5-b45e-deccbba690b5','Shopify 9c34f0f0-2be9-495a-b606-b0234fddc1b2','Partiful 714182f5-4f0e-48e3-99e7-4d1d9246e1e1'],
 reason:['Wolt 288b4f35-6bc3-4630-a932-706e8f3ca645','Airbnb c8fa3a80-384a-4092-961b-6fd367fe969e'],
 date:['Wealthfront fb11c205-4ea4-4308-9c80-b6527cc749fd','Venmo 8067ab9d-34da-49e2-9706-2975958ffc14']};

/* ---------- wiring state (lives inside the main sample state, so it is saved/reset with it) ---------- */
const W=L.W=()=>{ const s=S(); if(!s.wire) s.wire={log:[],np:{},chips:{},sw:{},branches:[],team:[],access:[],devicesOut:[],files:[],callback:null,trialCancelled:false,drafts:{}}; return s.wire; };
const scr=()=>(MF.C&&MF.C.id)||'';
const wlog=L.wlog=(ic,txt,o={})=>{ const w=W(); w.log.unshift({id:'w'+now()+Math.random().toString(36).slice(2,5),ts:now(),scr:o.scr||scr(),ic,txt}); w.log=w.log.slice(0,80); if(o.notify!==false) L.notify(ic,txt,o.go||scr()); L.save(); };
const pair=(en,ar)=>[en,ar];

/* ---------- sheets ---------- */
const sheet=(title,body,ref)=>{ L.sheet(title,body+(ref?`<p class="note" style="margin-top:10px">${I('info',14)}<span>${t('Pattern','النمط')}: ${esc(ref)}</span></p>`:'')); };
const field=(name,label,o={})=>L.fld(name,label,o);
L.wconfirm=(title,body,okLabel,onOk,o={})=>{ L.ui.wok=onOk; sheet(title,`${o.ic?`<div class="center" style="padding:6px 0 10px">${I(o.ic,34)}</div>`:''}<p class="why">${body}</p>${o.bul?`<ul class="lv-bul">${o.bul.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}${H.btns(L.ab(o.keep||t('Keep','إبقاء'),'wcancel',null,{block:true}),L.ab(okLabel,'wok',null,{k:o.danger===false?'sec':'out',block:true}))}`,o.ref); };
L.wreason=(title,help,okLabel,onOk,o={})=>{ L.ui.wok=onOk; sheet(title,`<p class="why">${help}</p>${field('wreason',o.label||t('Reason','السبب'),{ta:true,req:o.req!==false,ph:o.ph||'',max:400})}${o.extra||''}${H.btns(L.ab(okLabel,'wok',null,{block:true}),L.ab(t('Cancel','إلغاء'),'wcancel',null,{k:'sec',block:true}))}`,o.ref||REF.reason[0]); };
ACT.wcancel=()=>{ L.ui.wok=null; L.closeSheet(); };
ACT.wok=()=>{ const f=L.ui.wok; if(!f) return L.closeSheet(); L.clearBad(); const r=f(); if(r===false) return; L.ui.wok=null; L.closeSheet(); L.rr(); };
const needReason=(min=3)=>{ const v=L.val('wreason'); if(v.length<min){ L.bad('wreason',t('Write a short reason','اكتب سببًا قصيرًا')); L.focusBad(); return null; } return v; };

/* photo / file picker sheet (real file input; nothing is uploaded) */
L.wphoto=(ctx,o={})=>{ L.ui.wfile={ctx,label:o.label}; sheet(o.title||t('Add photo','أضف صورة'),`<div class="card grp">
 <label class="row" for="wf-cam"><span class="thumb brand">${I('camera',20)}</span><span class="b"><span class="t">${t('Take photo','التقط صورة')}</span><span class="s">${t('Opens the camera on your phone','يفتح الكاميرا في جوالك')}</span></span></label><input id="wf-cam" class="vh" type="file" accept="image/*" capture="environment" data-act="wfile">
 <label class="row" for="wf-lib"><span class="thumb brand">${I('upload',20)}</span><span class="b"><span class="t">${o.pdf?t('Choose photo or PDF','اختر صورة أو PDF'):t('Choose from library','اختر من المعرض')}</span><span class="s">${t('Stays on this device in the preview','يبقى على هذا الجهاز في النسخة التجريبية')}</span></span></label><input id="wf-lib" class="vh" type="file" accept="${o.pdf?'image/*,application/pdf':'image/*'}" data-act="wfile">
 <button type="button" class="row" data-act="wfsample"><span class="thumb">${I('doc',20)}</span><span class="b"><span class="t">${t('Use a sample photo','استخدم صورة تجريبية')}</span><span class="s">${t('For trying the flow','لتجربة المسار')}</span></span></button></div>${H.btns(L.ab(t('Cancel','إلغاء'),'wcancel',null,{k:'sec',block:true}))}`,REF.photo[0]); };
const addFile=(name,size)=>{ const c=L.ui.wfile||{ctx:scr()}; W().files.unshift({id:'F'+now(),ctx:c.ctx,scr:scr(),name,size:size||0,ts:now()}); wlog('camera',pair(`Added ${name}`,`أُضيف ${name}`),{notify:false}); L.ui.wfile=null; L.closeSheet(); L.rr(); toast(t(`Added ${name}`,`أُضيف ${name}`)); };
ACT.wfsample=()=>addFile(t('sample-photo.jpg','صورة-تجريبية.jpg'),182000);
document.addEventListener('change',e=>{ const el=e.target; if(el&&el.dataset&&el.dataset.act==='wfile'&&el.files&&el.files[0]){ const f=el.files[0]; addFile(f.name,f.size); } },true);
ACT.wfile=()=>{}; /* the change event above does the work; clicking the input just opens the picker */
ACT.wfrm=id=>{ const w=W(); w.files=w.files.filter(f=>f.id!==id); L.save(); L.rr(); toast(t('Removed','أُزيل')); };

/* downloads (real files generated in the browser from the sample data) */
const dl=L.wdl=(name,text,type)=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type:type||'text/csv'})); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500); };
const csv=rows=>'\ufeff'+rows.map(r=>r.map(x=>'"'+String(x==null?'':x).replace(/"/g,'""')+'"').join(',')).join('\n');
const share=(text)=>{ const u='https://wa.me/?text='+encodeURIComponent(text); window.open(u,'_blank','noopener'); };

/* ---------- the wiring table: screen → button label (EN or AR) → action ---------- */
const WIRE={
 'a.collect':[[['Log promise to pay','سجّل وعدًا بالدفع'],'wpromise']],
 'a.holds':[[['Release with reason','ارفع مع سبب'],'wrelease']],
 'a.statements':[[['Send by WhatsApp','أرسل عبر واتساب'],'wshare','statement'],[['PDF','PDF'],'wdoc','statement']],
 'a.zoho':[[['Retry','إعادة المحاولة'],'wretry']],
 'b.branches':[[['Add branch','أضف فرعًا'],'wgo','b.branchNew']],
 'b.issue':[[['Take photo','التقط صورة'],'wphoto','issue']],
 'bh.approvals':[[['Reject','رفض'],'wreject','expense']],
 'bh.billing':[[['Cancel trial','ألغِ التجربة'],'wtrial']],
 'bh.import':[[['Download template','نزّل القالب'],'wtpl']],
 'bh.reports':[[['PDF','PDF'],'wdoc','report'],[['Excel','Excel'],'wxls','report']],
 'bh.snap':[[['Enter manually','أدخل يدويًا'],'wgo','bh.expense']],
 'bh.team':[[['Invite','دعوة'],'winvite']],
 'bh.open':[[['Open day','افتح اليوم'],'wnpopen']],
 'v.collect':[[['Confirm collection','أكّد التحصيل'],'wnpcollect']],
 'cb.report':[[['PDF','PDF'],'wdoc','cashreport'],[['Share on WhatsApp','شارك عبر واتساب'],'wshare','cashreport']],
 'cc.callback':[[['Add to calendar','أضف للتقويم'],'wics'],[['Cancel call back','ألغِ الاتصال'],'wcbcancel']],
 'd.returns':[[['Scan return label','امسح ملصق الإرجاع'],'wretlabel']],
 'd.sync':[[['Upload now','ارفع الآن'],'wupload']],
 'ob.otp':[[['Resend code','أعد إرسال الرمز'],'wresend']],
 're.wallet':[[['Use as MENAFoods credit','استخدمه كرصيد'],'wwallet']],
 're.refer':[[['Share on WhatsApp','شارك عبر واتساب'],'wshare','refer'],[['Copy link','انسخ الرابط'],'wcopy','https://menafoods.sa/r/ALWADI']],
 'rm.case':[[['Clear','براءة'],'wclearcase'],[['Clear','تبرئة'],'wclearcase'],[['Clear','مسح'],'wclearcase']],
 'rm.kyc':[[['Request new IBAN','اطلب آيبان جديدًا'],'wiban']],
 'rm.rules':[[['Save draft','احفظ مسودة'],'wdraft']],
 'b.creditApp':[[['Save draft','احفظ المسودة'],'wdraft']],
 's.creditReview':[[['Return for info','إرجاع لاستكمال'],'wreturninfo']],
 's.visit':[[['Dictate','إملاء صوتي'],'wdictate'],[['Photo','صورة'],'wphoto','visit']],
 'set.docs':[[['Upload document','ارفع مستندًا'],'wphoto','doc']],
 'set.security':[[['Sign out','خروج'],'wdevout']],
 'v.pod':[[['Add photo','أضف صورة'],'wphoto','pod'],[['Use OTP instead','استخدم رمز التحقق'],'wotp']],
 'v.sale':[[['Send by WhatsApp','أرسل عبر واتساب'],'wshare','vansale']],
 'v.issued':[[['Send by WhatsApp','أرسل عبر واتساب'],'wshare','vansale']],
 '*':[[['Request access','اطلب الصلاحية'],'waccess']]
};
const lookup=label=>{ const id=scr(); const L1=(WIRE[id]||[]).concat(WIRE['*']); return L1.find(e=>e[0][0]===label||e[0][1]===label); };
L.WIRE=WIRE;
const btnPrev=H.btn;
H.btn=(label,o={})=>{ if(!o.go&&!o.st){ const w=lookup(label); if(w) return L.ab(label,w[1],w[2]==null?null:w[2],{k:o.k,sm:o.sm,block:o.block,ic:o.ic,dis:o.dis,lbl:o.lbl}); } return btnPrev(label,o); };

/* ---------- prototype chips: selection is kept per screen and used by the screen's main action ---------- */
const chipsPrev=H.chips;
let chC=null, chN=0;
H.chips=(arr,cur=0,label)=>{ if(MF.C!==chC){ chC=MF.C; chN=0; } const key=scr()+':'+(chN++); const sel=W().chips[key]; const curEff=sel?sel:(Array.isArray(cur)?cur:[cur]);
 return `<div class="chips" role="group" aria-label="${label||t('Filters','عوامل التصفية')}">${arr.map((c,i)=>`<button type="button" class="chip" aria-pressed="${curEff.includes(i)}" data-act="wchip" data-arg="${key}|${i}">${c}</button>`).join('')}</div>`; };
ACT.wchip=a=>{ const [key,i]=a.split('|'); const w=W(); const cur=w.chips[key]||[]; const n=Number(i); w.chips[key]=cur.includes(n)?cur.filter(x=>x!==n):cur.concat(n); L.save(); L.rr(); };
L.chipSel=(id,k=0)=>W().chips[id+':'+k]||null;

/* ---------- prototype switches: saved per screen ---------- */
let tgC=null, tgN=0;
H.toggle=(label,on,sub)=>{ if(MF.C!==tgC){ tgC=MF.C; tgN=0; } const key=scr()+':'+(tgN++); const v=W().sw[key]; const eff=v===undefined?on:v; return L.sw('wsw:'+key,label,eff,sub).replace(`data-act="wsw:${key}"`,`data-act="wsw" data-arg="${key}"`); };
ACT.wsw=(key,el)=>{ W().sw[key]=!!(el&&el.checked); L.save(); toast(el&&el.checked?t('Turned on · saved','تم التشغيل · محفوظ'):t('Turned off · saved','تم الإيقاف · محفوظ')); };

/* ---------- keypads: real amount entry ---------- */
H.numpad=(val)=>{ const id=scr(); const np=W().np; const cur=np[id]!=null?np[id]:String(val); const v=Number(cur)||0;
 return `<div class="pad-d" aria-live="polite"><span class="vh">${t('Amount','المبلغ')}</span>${M(v,'big')}</div><div class="numpad" role="group" aria-label="${t('Number pad','لوحة الأرقام')}">${['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k=>`<button type="button" data-act="wnp" data-arg="${k}"${k==='⌫'?` aria-label="${t('Delete','حذف')}"`:''}>${k}</button>`).join('')}</div>`; };
const npVal=(id,dflt)=>{ const v=W().np[id]; return v==null?dflt:(Number(v)||0); };
ACT.wnp=k=>{ const id=scr(); const np=W().np; let s=np[id]!=null?String(np[id]):''; if(np[id]==null) s=''; if(k==='⌫') s=s.slice(0,-1); else if(k==='.'){ if(!s.includes('.')) s=(s||'0')+'.'; } else { if(/\.\d\d$/.test(s)) return toast(t('Two decimals max','خانتان عشريتان كحد أقصى')); s=(s==='0'?'':s)+k; if(Number(s)>999999) return toast(t('Amount too large','المبلغ كبير جدًا')); } np[id]=s; L.save(); L.rr(); };
ACT.wnpopen=()=>{ const amt=npVal('bh.open',500); const s=S(); s.hub.cash.push({id:'K'+now(),ts:now(),k:'open',amt,note:['Opening float','رصيد افتتاحي']}); wlog('cash',pair(`Day opened with ${amt.toFixed(2)} float`,`فُتح اليوم برصيد ${amt.toFixed(2)}`)); delete W().np['bh.open']; L.save(); go('bh.daybook'); toast(t('Day opened','تم فتح اليوم')); };
ACT.wnpcollect=()=>{ const amt=npVal('v.collect',640); if(!(amt>0)) return toast(t('Enter the amount collected','أدخل المبلغ المحصّل')); const m=document.querySelector('[name="cm"]:checked'); wlog('cash',pair(`Collected ${amt.toFixed(2)} from Mini Market 24 · receipt sent`,`حُصّل ${amt.toFixed(2)} من ميني ماركت 24 · أُرسل الإيصال`)); delete W().np['v.collect']; L.save(); MF.setParam('state','success'); };

/* ---------- actions ---------- */
ACT.wgo=id=>go(id);
ACT.wdoc=k=>go('doc.view',{k,back:scr()});
ACT.pdf=no=>{ const id=scr(); const k=id==='b.receipt'?'receipt':id==='b.statement'?'statement':'invoice'; go('doc.view',{k,id:no||'',back:id}); };
ACT.wshare=k=>{ const txt={statement:t('Your MENAFoods statement for November 2026 (sample).','كشف حسابك من MENAFoods لشهر نوفمبر 2026 (عينة).'),cashreport:t('Cash book report for today (sample).','تقرير دفتر النقدية لليوم (عينة).'),refer:t('Order wholesale food on MENAFoods: https://menafoods.sa/r/ALWADI','اطلب المواد الغذائية بالجملة من MENAFoods: https://menafoods.sa/r/ALWADI'),vansale:t('Your van invoice from MENAFoods (sample).','فاتورة الفان من MENAFoods (عينة).')}[k]||'MENAFoods';
 share(txt); wlog('share',pair('Shared on WhatsApp','تمت المشاركة عبر واتساب'),{notify:false}); toast(t('Opening WhatsApp…','جارٍ فتح واتساب…')); };
ACT.wcopy=u=>{ const done=()=>toast(t('Link copied','تم نسخ الرابط')); try{ navigator.clipboard.writeText(u).then(done,done); }catch(e){ done(); } };
ACT.wxls=k=>{ const rows=[[t('Line','البند'),t('Amount (SAR, sample)','المبلغ (ريال، عينة)')]]; const s=S(); (s.hub.exp||[]).forEach(x=>rows.push([tt(x.note),x.amt])); (s.hub.cash||[]).filter(x=>x.k==='sale').forEach(x=>rows.push([tt(x.note),x.amt])); dl(`menafoods-${k}-sample.csv`,csv(rows)); wlog('download',pair('Report exported (CSV for Excel)','صُدّر التقرير (CSV لإكسل)'),{notify:false}); toast(t('Downloaded · opens in Excel','تم التنزيل · يفتح في إكسل')); };
ACT.wtpl=()=>{ dl('menafoods-import-template.csv',csv([['date','type','amount_sar','category','note'],['2026-11-15','sale','0.00','','sample row — replace'],['2026-11-15','expense','0.00','supplies','sample row — replace']])); toast(t('Template downloaded','تم تنزيل القالب')); };
ACT.wics=()=>{ const cb=W().callback||{slot:t('Today 12:00','اليوم 12:00')}; const d=new Date(now()+2*3600000); const z=n=>String(n).padStart(2,'0'); const st=`${d.getUTCFullYear()}${z(d.getUTCMonth()+1)}${z(d.getUTCDate())}T${z(d.getUTCHours())}${z(d.getUTCMinutes())}00Z`;
 dl('menafoods-call-back.ics',['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MENAFoods//Preview//EN','BEGIN:VEVENT','UID:cb-'+now()+'@menafoods.preview','DTSTAMP:'+st,'DTSTART:'+st,'DURATION:PT15M','SUMMARY:MENAFoods call back (sample)','DESCRIPTION:'+cb.slot,'END:VEVENT','END:VCALENDAR'].join('\r\n'),'text/calendar'); toast(t('Added · open the file to save it in your calendar','تمت الإضافة · افتح الملف لحفظه في التقويم')); };
ACT.wcbcancel=()=>L.wconfirm(t('Cancel the call back?','إلغاء الاتصال؟'),t('We won’t call you. You can book a new time any time.','لن نتصل بك. يمكنك حجز وقت جديد في أي وقت.'),t('Cancel call back','ألغِ الاتصال'),()=>{ W().callback=null; wlog('phone',pair('Call back cancelled','أُلغي طلب الاتصال')); setTimeout(()=>go('cc.callback',{v:'form'}),0); },{ic:'phone',keep:t('Keep call back','أبقِ الاتصال'),ref:REF.confirm[2]});
ACT.wpromise=()=>{ L.ui.wok=()=>{ const amt=Number(L.val('wpamt')); const d=L.val('wpdate'); let ok=true; if(!(amt>0)){ L.bad('wpamt',t('Enter an amount','أدخل مبلغًا')); ok=false; } if(!d){ L.bad('wpdate',t('Choose a date','اختر تاريخًا')); ok=false; } if(!ok){ L.focusBad(); return false; } wlog('calendar',pair(`Promise to pay ${amt.toFixed(2)} on ${d} · Kebab Corner`,`وعد بالدفع ${amt.toFixed(2)} في ${d} · ركن الكباب`)); toast(t('Promise logged · reminder set','سُجّل الوعد · ضُبط تذكير')); };
 const d=new Date(now()+3*DAY).toISOString().slice(0,10); sheet(t('Log promise to pay','سجّل وعدًا بالدفع'),`<p class="why">${t('Kebab Corner · overdue 3,410.00. The collections reminder pauses until this date.','ركن الكباب · متأخر 3,410.00. يتوقف تذكير التحصيل حتى هذا التاريخ.')}</p>${field('wpamt',t('Amount','المبلغ'),{req:true,pre:'SAR',im:'decimal',ltr:true,val:'3410.00'})}${field('wpdate',t('Promised date','التاريخ الموعود'),{req:true,type:'date',ltr:true,val:d})}${H.btns(L.ab(t('Save promise','احفظ الوعد'),'wok',null,{block:true}),L.ab(t('Cancel','إلغاء'),'wcancel',null,{k:'sec',block:true}))}`,REF.date[0]); };
ACT.wrelease=()=>L.wreason(t('Release hold','رفع الإيقاف'),t('The account can order again right away. Your reason is saved in the audit log.','يمكن للحساب الطلب فورًا. يُحفظ السبب في سجل التدقيق.'),t('Release hold','ارفع الإيقاف'),()=>{ const r=needReason(); if(!r) return false; wlog('lock',pair(`Hold released · ${r}`,`رُفع الإيقاف · ${r}`)); toast(t('Hold released','رُفع الإيقاف')); });
ACT.wretry=()=>{ wlog('sync',pair('Zoho Books sync retried · 1 record fixed','أُعيدت مزامنة Zoho Books · أُصلح سجل واحد'),{notify:false}); toast(t('Retried · synced','أُعيدت المحاولة · تمت المزامنة')); go('a.zoho',{v:'ok'}); };
ACT.wreject=k=>L.wreason(t('Reject expense','رفض المصروف'),t('Tell the cashier why. They will see this note.','أخبر الكاشير بالسبب. سيرى هذه الملاحظة.'),t('Reject','رفض'),()=>{ const r=needReason(); if(!r) return false; wlog('x',pair(`Expense rejected · ${r}`,`رُفض المصروف · ${r}`)); toast(t('Rejected · cashier notified','رُفض · أُبلغ الكاشير')); });
ACT.wtrial=()=>L.wconfirm(t('Cancel your free trial?','إلغاء الفترة التجريبية؟'),t('Business Hub stops at the end of today. Your data stays for 30 days.','يتوقف مركز الأعمال بنهاية اليوم. تبقى بياناتك 30 يومًا.'),t('Cancel free trial','ألغِ التجربة'),()=>{ W().trialCancelled=true; wlog('x',pair('Business Hub trial cancelled','أُلغيت تجربة مركز الأعمال')); toast(t('Trial cancelled','أُلغيت التجربة')); },{ic:'alert',keep:t('Keep benefits','أبقِ المزايا'),bul:[t('You keep access until the end of today','يبقى الوصول حتى نهاية اليوم'),t('You can’t start another free trial','لا يمكنك بدء تجربة أخرى')],ref:REF.confirm[0]});
ACT.winvite=()=>{ L.ui.wok=()=>{ const n=L.val('winame'), m=L.val('wimob').replace(/\D/g,''), r=L.val('wirole'); let ok=true; if(n.length<2){ L.bad('winame',t('Enter a name','أدخل الاسم')); ok=false; } if(!/^5\d{8}$/.test(m)){ L.bad('wimob',t('Enter 9 digits starting with 5','أدخل 9 أرقام تبدأ بـ 5')); ok=false; } if(!ok){ L.focusBad(); return false; } W().team.push({id:'T'+now(),n,m,r,st:'invited',ts:now()}); wlog('users',pair(`Invited ${n} as ${r}`,`دُعي ${n} بدور ${r}`)); toast(t('Invitation sent by SMS (sample)','أُرسلت الدعوة برسالة (عينة)')); };
 sheet(t('Invite to your team','ادعُ إلى فريقك'),`${field('winame',t('Name','الاسم'),{req:true,ac:'name'})}${field('wimob',t('Mobile','الجوال'),{req:true,pre:'+966',ltr:true,im:'tel',max:9})}${field('wirole',t('Role','الدور'),{sel:[['Buyer',t('Buyer','مشترٍ')],['Cashier',t('Cashier','كاشير')],['Branch manager',t('Branch manager','مدير فرع')]],val:'Buyer'})}${H.btns(L.ab(t('Send invite','أرسل الدعوة'),'wok',null,{block:true}),L.ab(t('Copy invite link','انسخ رابط الدعوة'),'wcopy','https://menafoods.sa/join/ALWADI',{k:'sec',block:true}))}`,REF.invite[0]); };
ACT.wretlabel=()=>{ L.ui.wok=()=>{ const c=L.val('wrl').toUpperCase(); if(!/^RT-?\d{4,}$/.test(c)){ L.bad('wrl',t('Label codes look like RT-1042','رموز الملصق مثل RT-1042')); L.focusBad(); return false; } wlog('refresh',pair(`Return ${c} scanned onto the truck`,`المرتجع ${c} مُسح على الشاحنة`)); toast(t('Return added to truck','أُضيف المرتجع إلى الشاحنة')); };
 sheet(t('Scan return label','امسح ملصق الإرجاع'),`${field('wrl',t('Label code','رمز الملصق'),{req:true,ltr:true,ph:'RT-1042',hint:t('Type the code under the barcode, or use the camera','اكتب الرمز تحت الباركود أو استخدم الكاميرا')})}<label class="btn sec block" for="wf-rl">${I('camera',20)}<span>${t('Use camera','استخدم الكاميرا')}</span></label><input id="wf-rl" class="vh" type="file" accept="image/*" capture="environment" data-act="wfile">${H.btns(L.ab(t('Add return','أضف المرتجع'),'wok',null,{block:true}))}`); };
ACT.wupload=()=>{ if(L.flushQueue) L.flushQueue(); wlog('upload',pair('Uploaded 3 waiting items','رُفعت 3 عناصر منتظرة'),{notify:false}); toast(t('Uploaded · nothing waiting','تم الرفع · لا شيء منتظر')); L.rr(); };
ACT.wresend=()=>{ wlog('msg',pair('New sample code sent: 4821','أُرسل رمز تجريبي جديد: 4821'),{notify:false}); toast(t('New sample code sent: 4821','أُرسل رمز تجريبي جديد: 4821')); go('ob.otp',{v:'enter'}); };
ACT.wwallet=()=>L.wconfirm(t('Use 75.00 as MENAFoods credit?','استخدام 75.00 كرصيد لدى MENAFoods؟'),t('It is taken off your next invoice. This can’t be withdrawn as cash afterwards.','يُخصم من فاتورتك القادمة. لا يمكن سحبه نقدًا بعد ذلك.'),t('Use as credit','استخدمه كرصيد'),()=>{ wlog('wallet',pair('75.00 moved to MENAFoods credit','نُقل 75.00 إلى رصيد MENAFoods')); toast(t('Added to your credit','أُضيف إلى رصيدك')); },{ic:'wallet',danger:false,keep:t('Not now','ليس الآن'),ref:REF.confirm[0]});
ACT.wclearcase=()=>L.wreason(t('Clear this case','تبرئة هذه الحالة'),t('Points are released to the member. Write why the signal was a false alarm.','تُفرج النقاط للعضو. اكتب سبب كون الإشارة إنذارًا كاذبًا.'),t('Clear case','برّئ الحالة'),()=>{ const r=needReason(); if(!r) return false; wlog('shield',pair(`Fraud case cleared · ${r}`,`بُرّئت حالة الاحتيال · ${r}`)); toast(t('Case cleared','بُرّئت الحالة')); });
ACT.wiban=()=>L.wreason(t('Request a new IBAN','طلب آيبان جديد'),t('The affiliate gets a message asking for an IBAN in their own name.','تصل للشريك رسالة تطلب آيبان باسمه.'),t('Send request','أرسل الطلب'),()=>{ const r=L.val('wreason')||t('Name on IBAN does not match','الاسم على الآيبان غير مطابق'); wlog('key',pair(`New IBAN requested · ${r}`,`طُلب آيبان جديد · ${r}`)); toast(t('Request sent to the affiliate','أُرسل الطلب للشريك')); },{req:false,label:t('Note (optional)','ملاحظة (اختياري)')});
ACT.wdraft=()=>{ const vals={}; document.querySelectorAll('#main input, #main select, #main textarea').forEach((el,i)=>{ vals[el.id||('f'+i)]=el.type==='checkbox'?el.checked:el.value; }); W().drafts[scr()]={ts:now(),vals}; wlog('doc',pair('Draft saved','حُفظت المسودة'),{notify:false}); toast(t('Draft saved','حُفظت المسودة')); };
ACT.wreturninfo=()=>L.wreason(t('Return for more information','إرجاع لاستكمال المعلومات'),t('The customer is asked for what is missing. The application keeps its place in the queue.','يُطلب من العميل ما ينقص. يحتفظ الطلب بمكانه في الدور.'),t('Return to customer','أرجع للعميل'),()=>{ const r=needReason(); if(!r) return false; wlog('msg',pair(`Returned for info · ${r}`,`أُرجع للاستكمال · ${r}`)); toast(t('Returned · customer notified','أُرجع · أُبلغ العميل')); });
ACT.wdictate=()=>{ const SR=window.SpeechRecognition||window.webkitSpeechRecognition; sheet(t('Dictate note','إملاء الملاحظة'),`<p class="why">${SR?t('Tap Start and speak. The text goes into the visit note.','اضغط ابدأ وتحدث. يُضاف النص إلى ملاحظة الزيارة.'):t('Voice typing isn’t available in this browser. Use the microphone on your keyboard instead.','الإملاء الصوتي غير متاح في هذا المتصفح. استخدم ميكروفون لوحة المفاتيح.')}</p>${field('wdict',t('Note','الملاحظة'),{ta:true})}${H.btns(SR?L.ab(t('Start','ابدأ'),'wdstart',null,{ic:'mic',block:true}):'',L.ab(t('Add to visit note','أضف إلى ملاحظة الزيارة'),'wdadd',null,{k:SR?'sec':'pri',block:true}))}`); };
ACT.wdstart=(a,b)=>{ const SR=window.SpeechRecognition||window.webkitSpeechRecognition; const lbl=b&&b.querySelector('span:last-child')||b; const set=on=>{ if(!b) return; b.setAttribute('aria-pressed',String(on)); b.classList.toggle('lv-rec',on); if(lbl) lbl.textContent=on?t('Stop','إيقاف'):t('Start','ابدأ'); };
 if(L._rec){ try{ L._rec.stop(); }catch(e){} L._rec=null; set(false); return; }
 const ta=document.querySelector('[name="wdict"]');
 if(!SR){ if(ta){ ta.focus(); ta.placeholder=t('Voice input is not supported here — type your notes','الإدخال الصوتي غير مدعوم هنا — اكتب ملاحظاتك'); } return; }
 try{ const r=L._rec=new SR(); r.lang=MF.C&&MF.C.ar?'ar-SA':'en-GB'; r.onresult=e=>{ if(ta) ta.value=(ta.value+' '+e.results[0][0].transcript).trim(); }; r.onend=r.onerror=()=>{ L._rec=null; set(false); }; r.start(); set(true); }catch(e){ L._rec=null; if(ta) ta.focus(); } };
ACT.wdadd=()=>{ const v=L.val('wdict'); if(!v){ L.bad('wdict',t('Say or type something first','قل أو اكتب شيئًا أولًا')); L.focusBad(); return; } L.closeSheet(); const ta=document.querySelector('#main textarea'); if(ta){ ta.value=(ta.value+' '+v).trim(); } wlog('mic',pair('Dictated note added','أُضيفت ملاحظة صوتية'),{notify:false}); toast(t('Added to the note','أُضيف إلى الملاحظة')); };
ACT.wdevout=()=>L.wconfirm(t('Sign out this device?','تسجيل الخروج من هذا الجهاز؟'),t('Galaxy Tab S9 at the Olaya counter will need to sign in again.','سيحتاج Galaxy Tab S9 في كاشير العليا إلى تسجيل الدخول مجددًا.'),t('Sign out device','أخرج الجهاز'),()=>{ W().devicesOut.push('tab-s9'); wlog('lock',pair('Signed out Galaxy Tab S9','سُجّل خروج Galaxy Tab S9')); toast(t('Device signed out','سُجّل خروج الجهاز')); },{ic:'lock',keep:t('Cancel','إلغاء'),ref:REF.confirm[1]});
ACT.wotp=()=>{ L.ui.wok=()=>{ if(L.val('wotpc')!=='4821'){ L.bad('wotpc',t('That code isn’t right. The sample code is 4821.','الرمز غير صحيح. الرمز التجريبي 4821.')); L.focusBad(); return false; } wlog('key',pair('Delivery confirmed with customer code','تأكيد التسليم برمز العميل')); setTimeout(()=>MF.setParam('state','success'),0); };
 sheet(t('Confirm with customer code','التأكيد برمز العميل'),`<p class="why">${t('Ask the customer for the 4-digit code in their app or SMS.','اطلب من العميل الرمز المكون من 4 أرقام في تطبيقه أو الرسالة.')}</p>${field('wotpc',t('Customer code','رمز العميل'),{req:true,ltr:true,im:'numeric',max:4,ac:'one-time-code',hint:t('Sample code 4821','الرمز التجريبي 4821')})}${H.btns(L.ab(t('Confirm delivery','أكّد التسليم'),'wok',null,{block:true}))}`); };
ACT.waccess=()=>{ const id=scr(); const w=W(); if(!w.access.some(a=>a.scr===id&&a.role===MF.C.role)){ w.access.push({scr:id,role:MF.C.role,ts:now()}); wlog('key',pair(`Access requested: ${tt(MF.SCR[id].t)}`,`طُلبت صلاحية: ${tt(MF.SCR[id].t)}`)); } L.rr(); toast(t('Request sent to the owner','أُرسل الطلب إلى المالك')); };
ACT.call=()=>{ window.open('tel:+966920000000','_self'); toast(t('Calling the customer…','جارٍ الاتصال بالعميل…')); };
ACT.nav0=()=>{ window.open('https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent('Olaya Street, Riyadh'),'_blank','noopener'); };
ACT.wphoto=ctx=>L.wphoto(ctx,{pdf:ctx==='doc',title:ctx==='doc'?t('Upload document','ارفع مستندًا'):undefined});
/* reset now asks in a sheet instead of "tap again" */
ACT.reset=()=>L.wconfirm(t('Reset the demo?','إعادة ضبط العرض؟'),t('This clears everything you did in this preview on this browser and starts again with the sample data.','يمسح كل ما فعلته في هذا العرض على هذا المتصفح ويبدأ من جديد بالبيانات التجريبية.'),t('Reset demo','إعادة الضبط'),()=>{ L.reset(); toast(t('Demo data reset','تمت إعادة ضبط بيانات العرض')); },{ic:'refresh',keep:t('Cancel','إلغاء'),ref:REF.confirm[1]});
/* signature clear: only active when something is drawn */
L.post.push(c=>{ if(c.id!=='d.pod') return; const b=document.querySelector('[data-act="sigclr"]'); const cv=document.querySelector('.lv-sig'); if(!b||!cv) return; const upd=()=>{ const on=!!L.ui.sig; b.disabled=!on; b.setAttribute('aria-disabled',String(!on)); }; upd(); cv.addEventListener('pointerup',()=>setTimeout(upd,0)); });
const sigclr0=ACT.sigclr; ACT.sigclr=(a,el)=>{ sigclr0(a,el); if(el){ el.disabled=true; el.setAttribute('aria-disabled','true'); } toast(t('Signature cleared','مُسح التوقيع')); };
/* approval steppers edit the approval, not the cart */
const APPR={p1:10,p5:8,p11:6,p2:4};
L.post.push(c=>{ if(c.id!=='b.approval') return; const w=W(); const q=w.appr||APPR; document.querySelectorAll('#main [data-q]').forEach(b=>{ const [sku,d]=b.dataset.q.split(':'); b.removeAttribute('data-q'); b.dataset.act='wappr'; b.dataset.arg=sku+':'+d; }); Object.keys(q).forEach(k=>{ const el=document.querySelector(`#main [data-sku="${k}"] .q`); if(el) el.textContent=q[k]; }); });
ACT.wappr=a=>{ const [sku,d]=a.split(':'); const w=W(); w.appr=Object.assign({},APPR,w.appr||{}); w.appr[sku]=Math.max(0,(w.appr[sku]||0)+Number(d)); L.save(); L.rr(); toast(w.appr[sku]?t(`Quantity ${w.appr[sku]}`,`الكمية ${w.appr[sku]}`):t('Removed from this order','أُزيل من هذا الطلب')); };
/* callback chip choice is kept for the booked view */
L.post.push(c=>{ if(c.id!=='cc.callback') return; const sel=L.chipSel('cc.callback',0); if(sel&&sel.length){ const lab=document.querySelectorAll('#main .chips .chip')[sel[sel.length-1]]; if(lab) W().callback={slot:lab.textContent.trim()}; } });

/* ---------- screen activity strip: shows what the wired actions saved on this screen ---------- */
L.post.push(c=>{ const id=c.id; if(id==='doc.view'||id==='n.center') return; const w=W(); const items=w.log.filter(x=>x.scr===id).slice(0,3); const files=w.files.filter(f=>f.scr===id).slice(0,4); const acc=w.access.find(a=>a.scr===id&&a.role===c.role);
 const main=document.getElementById('main'); if(!main||main.querySelector('.lv-wact')) return; let h='';
 if(acc&&c.state==='denied') h+=H.alert('info',t('Access requested','طُلبت الصلاحية'),t('We told the owner. You’ll get a notification when they decide.','أبلغنا المالك. سيصلك إشعار عند القرار.'));
 if(files.length) h+=H.sec(t('Added files','الملفات المضافة'),files.map(f=>`<div class="row"><span class="thumb">${I('doc',20)}</span><span class="b"><span class="t">${esc(f.name)}</span><span class="s">${f.size?Math.round(f.size/1024)+' KB · ':''}${L.ago(f.ts)}</span></span><span class="e">${L.ab(t('Remove','إزالة'),'wfrm',f.id,{k:'sec',sm:true})}</span></div>`).join(''));
 if(items.length) h+=H.sec(t('Saved on this screen','محفوظ في هذه الشاشة'),items.map(x=>`<div class="row"><span class="thumb ok">${I(x.ic in {}?'check':x.ic,20)}</span><span class="b"><span class="t">${esc(tt(x.txt))}</span><span class="s">${L.ago(x.ts)}</span></span></div>`).join(''));
 if(!h) return; const foot=main.querySelector('.foot'); const d=document.createElement('div'); d.className='lv-wact'; d.innerHTML=h; foot?main.insertBefore(d,foot):main.appendChild(d); });

/* ---------- NEW SCREEN · doc.view — document viewer (Mobbin: Airbnb receipt, talabat bilingual receipt, Neo statement) ---------- */
const DOCK={invoice:['Tax invoice','فاتورة ضريبية'],receipt:['Payment receipt','إيصال دفع'],statement:['Statement of account','كشف حساب'],report:['Profit & loss (estimate)','الأرباح والخسائر (تقديري)'],cashreport:['Cash book · day report','دفتر النقدية · تقرير اليوم']};
const ALLR='owner bm buyer cashier sales van driver store acct mgr admin aff';
L.scr('doc.view',{a:'invoices',r:ALLR,t:()=>tt(DOCK[L.qp('k')]||DOCK.invoice),back:'b.finance',noSeg:true,flow:false,
 acts:()=>`<button type="button" class="ib" data-act="wdprint" aria-label="${t('Save as PDF or print','احفظ PDF أو اطبع')}">${I('download')}</button><button type="button" class="ib" data-act="wdshare" aria-label="${t('Share','مشاركة')}">${I('share')}</button>`,
 render:(c)=>{ const k=L.qp('k')||'invoice', id=L.qp('id')||''; const s=S(); const P=MF.DATA.P; let meta=[], lines=[], tot=null;
  if(k==='invoice'){ const i=s.invoices.find(x=>x.no===id)||s.invoices.find(x=>x.no==='INV-2026-0433')||s.invoices[0]; const o=i&&L.ord(i.order); meta=[[t('Invoice no.','رقم الفاتورة'),LTR(i.no)],[t('Order','الطلب'),LTR('#'+i.order)],[t('Issued','تاريخ الإصدار'),L.dt(i.d,{day:'numeric',month:'short',year:'numeric'})],[t('Due','الاستحقاق'),L.dt(i.due,{day:'numeric',month:'short',year:'numeric'})]];
   if(o){ lines=Object.entries(o.items).map(([sku,q])=>[MF.pn(P[sku]),q,P[sku].pr]); tot=L.tot(o); } else { tot={sub:L.r2((i.amt||0)/1.15),vat:L.r2((i.amt||0)-(i.amt||0)/1.15),tot:i.amt||0}; } }
  else if(k==='receipt'){ const p=s.payments.find(x=>x.id===id)||s.payments[0]; meta=[[t('Receipt no.','رقم الإيصال'),LTR(p.id)],[t('Paid','تاريخ الدفع'),L.dt(p.ts,{day:'numeric',month:'short',year:'numeric'})],[t('Method','الطريقة'),p.m],[t('Invoices','الفواتير'),LTR((p.inv||[]).join(', '))]]; lines=[[t('Payment received','دفعة مستلمة'),1,p.amt]]; tot={sub:p.amt,vat:0,tot:p.amt,novat:true}; }
  else if(k==='statement'){ meta=[[t('Period','الفترة'),t('1–30 Nov 2026','1–30 نوفمبر 2026')],[t('Account','الحساب'),t('Al Wadi Restaurant (sample)','مطعم الوادي (عينة)')]]; lines=s.invoices.map(i=>[i.no,1,L.bal(i)]); const b=L.r2(lines.reduce((a,l)=>a+l[2],0)); tot={sub:b,vat:0,tot:b,novat:true,lbl:t('Balance due','الرصيد المستحق')}; }
  else { const ex=(s.hub.exp||[]).reduce((a,x)=>a+x.amt,0), sa=(s.hub.cash||[]).filter(x=>x.k==='sale').reduce((a,x)=>a+x.amt,0); meta=[[t('Date','التاريخ'),L.dt(now(),{day:'numeric',month:'short',year:'numeric'})],[t('Business','المنشأة'),t('Al Wadi Restaurant (sample)','مطعم الوادي (عينة)')]]; lines=[[t('Sales','المبيعات'),1,sa],[t('Expenses','المصروفات'),1,-ex]]; tot={sub:L.r2(sa-ex),vat:0,tot:L.r2(sa-ex),novat:true,lbl:t('Net','الصافي')}; }
  const head=tt(DOCK[k]||DOCK.invoice);
  const paper=`<article class="lv-paper" aria-label="${head}"><header class="lv-ph"><div><b class="lv-brand">MENAFoods</b><span class="s">${t('MENAFoods Trading Co. (sample) · VAT 300000000000003','شركة منافودز للتجارة (عينة) · ضريبي 300000000000003')}</span></div><div class="lv-pt"><b>${head}</b><span lang="${c.ar?'en':'ar'}">${c.ar?(DOCK[k]||DOCK.invoice)[0]:(DOCK[k]||DOCK.invoice)[1]}</span></div></header>
   ${H.kv(meta)}<table class="lv-pl"><thead><tr><th scope="col">${t('Item','الصنف')}</th><th scope="col">${t('Qty','الكمية')}</th><th scope="col">${t('Amount','المبلغ')}</th></tr></thead><tbody>${lines.map(([n,q,p])=>`<tr><td>${esc(n)}</td><td>${N(q)}</td><td>${M(L.r2(p*q))}</td></tr>`).join('')}</tbody></table>
   ${H.kv([tot.novat?null:[t('Subtotal excl. VAT','المجموع قبل الضريبة'),M(tot.sub)],tot.novat?null:[t('VAT 15%','ضريبة 15%'),M(tot.vat)],[tot.lbl||t('Total incl. VAT','الإجمالي شامل الضريبة'),M(tot.tot),'tot']])}
   ${k==='invoice'?`<div class="lv-pq">${H.qr(t('ZATCA QR code (sample)','رمز QR لهيئة الزكاة (عينة)'),9)}<span class="s">${t('Sample document from the design preview — not a real tax invoice.','مستند تجريبي من نسخة التصميم — ليس فاتورة ضريبية حقيقية.')}</span></div>`:`<p class="s">${t('Sample document from the design preview.','مستند تجريبي من نسخة التصميم.')}</p>`}</article>`;
  return {b:`<div class="lv-canvas">${paper}</div>`,dock:`${L.ab(t('Save as PDF','احفظ PDF'),'wdprint',null,{ic:'download'})}${L.ab(t('Share','مشاركة'),'wdshare',null,{k:'sec',ic:'share'})}`}; }});
ACT.wdprint=()=>{ wlog('download',pair('Document saved as PDF','حُفظ المستند PDF'),{notify:false,scr:L.qp('back')||'doc.view'}); window.print(); };
ACT.wdshare=()=>{ const u=location.href; if(navigator.share){ navigator.share({title:'MENAFoods',url:u}).catch(()=>{}); } else ACT.wcopy(u); };
/* doc.view: back goes to the screen it was opened from */
const dv=MF.SCR['doc.view']; Object.defineProperty(dv,'back',{get:()=>{ const b=L.qp('back'); return b&&MF.SCR[b]?b:'b.finance'; },configurable:true});

/* ---------- NEW SCREEN · b.branchNew — add a branch (Mobbin: talabat new address, Swiggy address form, Fresha custom address) ---------- */
L.scr('b.branchNew',{a:'team',r:'owner bm',t:['Add branch','أضف فرعًا'],back:'b.branches',noSeg:true,
 render:(c)=>({b:H.sec('',`<div class="lv-mapw">${H.map(t('Map preview (sample)','معاينة الخريطة (عينة)'),1)}<button type="button" class="btn sec sm lv-mapb" data-act="wbloc">${I('pin',18)}<span>${t('Use my location','استخدم موقعي')}</span></button></div>`,{raw:true})
  +H.sec(t('Branch','الفرع'),`<div class="card pad">${field('bname',t('Branch name','اسم الفرع'),{req:true,ph:t('e.g. Al Malqa','مثل: الملقا')})}${field('bcity',t('City','المدينة'),{sel:[['Riyadh',t('Riyadh','الرياض')],['Jeddah',t('Jeddah','جدة')],['Dammam',t('Dammam','الدمام')]],val:'Riyadh'})}${field('bdist',t('District','الحي'),{req:true})}${field('bstreet',t('Street and building','الشارع والمبنى'),{req:true})}${field('bnat',t('National address short code','الرمز المختصر للعنوان الوطني'),{ltr:true,ph:'RRRD2929',hint:t('8 characters, from the SPL national address','8 خانات من العنوان الوطني')})}</div>`,{raw:true})
  +H.sec(t('Receiving','الاستلام'),`<div class="card pad">${field('bcontact',t('Receiving contact','مسؤول الاستلام'),{req:true})}${field('bmob',t('Mobile','الجوال'),{req:true,pre:'+966',ltr:true,im:'tel',max:9})}${field('bwin',t('Delivery window','نافذة التوصيل'),{sel:[['7-9',t('7–9 AM','7–9 ص')],['9-12',t('9 AM–12 PM','9 ص–12 م')],['14-17',t('2–5 PM','2–5 م')]],val:'7-9'})}${field('bnote',t('Directions for the driver','إرشادات للسائق'),{ta:true})}</div>`,{raw:true})
  +H.note(t('New branches start with the account’s payment terms. Credit for the branch is set by the owner.','تبدأ الفروع الجديدة بشروط دفع الحساب. يحدد المالك ائتمان الفرع.')),
  dock:L.ab(t('Save branch','احفظ الفرع'),'wbsave',null,{block:true})})});
ACT.wbloc=(a,b)=>{ const show=(lat,lng,smp)=>{ const el=document.querySelector('[name="bdist"]'); if(el&&!el.value) el.value=t('Al Olaya','العليا'); let p=document.querySelector('.lv-pinok'); if(!p){ p=document.createElement('p'); p.className='lv-pinok'; p.setAttribute('role','status'); (b&&b.parentNode?b.parentNode:document.querySelector('#main')).insertBefore(p,b&&b.nextSibling); } p.textContent='📍 '+lat.toFixed(5)+', '+lng.toFixed(5)+(smp?' · '+t('sample pin — move it on the map','دبوس تجريبي — حرّكه على الخريطة'):''); W().pin={lat,lng}; };
 show(24.69380,46.68540,true);
 if(navigator.geolocation) try{ navigator.geolocation.getCurrentPosition(p=>show(p.coords.latitude,p.coords.longitude,false),()=>{}, {timeout:5000}); }catch(e){} };
ACT.wbsave=()=>{ L.clearBad(); const v=k=>L.val(k); const bad=[]; if(v('bname').length<2) bad.push(['bname',t('Enter a branch name','أدخل اسم الفرع')]); if(!v('bdist')) bad.push(['bdist',t('Enter the district','أدخل الحي')]); if(!v('bstreet')) bad.push(['bstreet',t('Enter the street','أدخل الشارع')]); if(v('bnat')&&!/^[A-Za-z]{4}\d{4}$/.test(v('bnat'))) bad.push(['bnat',t('4 letters then 4 numbers','4 أحرف ثم 4 أرقام')]); if(v('bcontact').length<2) bad.push(['bcontact',t('Enter a contact name','أدخل اسم المسؤول')]); if(!/^5\d{8}$/.test(v('bmob').replace(/\D/g,''))) bad.push(['bmob',t('Enter 9 digits starting with 5','أدخل 9 أرقام تبدأ بـ 5')]);
 if(bad.length){ bad.forEach(([k,m])=>L.bad(k,m)); L.focusBad(); return; } W().branches.push({id:'BR'+now(),n:v('bname'),city:v('bcity'),dist:v('bdist'),street:v('bstreet'),contact:v('bcontact'),win:v('bwin'),ts:now()}); wlog('store',pair(`Branch added: ${v('bname')}`,`أُضيف فرع: ${v('bname')}`),{scr:'b.branches'}); go('b.branches'); toast(t('Branch saved · setting up','حُفظ الفرع · قيد الإعداد')); };
/* b.branches lists branches added here */
L.post.push(c=>{ if(c.id!=='b.branches') return; const B=W().branches; if(!B.length) return; const grp=document.querySelector('#main .card.grp'); if(!grp||grp.querySelector('[data-wbr]')) return; grp.insertAdjacentHTML('beforeend',B.map(b=>`<div class="row" data-wbr="1"><span class="thumb brand">${I('store',20)}</span><span class="b"><span class="t">${esc(b.n)}</span><span class="s">${esc(b.dist)} · ${esc(b.contact)}</span></span><span class="e">${H.pill('warn',t('Setup','إعداد'))}</span></div>`).join('')); });
/* bh.team lists invited people */
L.post.push(c=>{ if(c.id!=='bh.team') return; const T=W().team; if(!T.length) return; const grp=document.querySelector('#main .card.grp'); if(!grp||grp.querySelector('[data-wtm]')) return; grp.insertAdjacentHTML('beforeend',T.map(m=>`<div class="row" data-wtm="1"><span class="avs" aria-hidden="true">${esc(m.n.slice(0,1))}</span><span class="b"><span class="t">${esc(m.n)}</span><span class="s">${esc(m.r)} · ${LTR('+966 '+m.m)}</span></span><span class="e">${H.pill('warn',t('Invited','مدعو'))}</span></div>`).join('')); });
/* set.security hides signed-out devices; bh.billing shows cancelled trial */
L.post.push(c=>{ if(c.id==='set.security'&&W().devicesOut.length){ document.querySelectorAll('#main [data-act="wdevout"]').forEach(b=>{ const r=b.closest('.row'); if(r) r.remove(); }); }
 if(c.id==='bh.billing'&&W().trialCancelled){ const b=document.querySelector('#main [data-act="wtrial"]'); if(b){ b.outerHTML=H.pill('neu',t('Trial cancelled · ends today','أُلغيت التجربة · تنتهي اليوم')); } } });

/* styles for the new screens (use each theme's tokens) */
const css=`.lv-canvas{background:var(--c-surface-2);padding:16px;margin:0 0 12px}.lv-paper{background:#fff;color:#111;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.12);padding:20px 18px;max-width:720px;margin:0 auto;font-size:13px}.lv-paper .kv dt,.lv-paper .s{color:#555}.lv-paper .kv dd{color:#111}.lv-ph{display:flex;justify-content:space-between;gap:12px;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:10px}.lv-ph .s{display:block;font-size:11px}.lv-brand{font-size:18px}.lv-pt{text-align:end;display:flex;flex-direction:column}.lv-pl{width:100%;border-collapse:collapse;margin:10px 0}.lv-pl th,.lv-pl td{border-bottom:1px solid #ddd;padding:6px 4px;text-align:start}.lv-pl th:last-child,.lv-pl td:last-child{text-align:end}.lv-pq{display:flex;gap:12px;align-items:center;margin-top:10px}.lv-pq .qr{width:84px;height:84px}.lv-mapw{position:relative;margin:0 16px 12px}.lv-mapb{position:absolute;inset-inline-end:10px;bottom:10px}.lv-bul{margin:6px 0 12px;padding-inline-start:20px;line-height:1.7}@media print{body *{visibility:hidden}.lv-paper,.lv-paper *{visibility:visible}.lv-paper{position:absolute;inset:0;box-shadow:none}}`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

/* prototype data-toast buttons that stand for a real action */
document.addEventListener('click',e=>{ if(!MF.booted) return; const b=e.target.closest&&e.target.closest('[data-toast]'); if(!b) return; const lab=(b.getAttribute('aria-label')||b.textContent||'').trim(); const tx=b.dataset.toast||'';
 if(/copy link|انسخ الرابط/i.test(lab)){ e.stopPropagation(); e.preventDefault(); ACT.wcopy('https://menafoods.sa/r/'+(scr()==='rx.links'?'NOURA':'ALWADI')); return; }
 if(/prototype|نموذج/i.test(tx)&&/photo|pdf|file|camera|صورة|ملف|الكاميرا|أرفق/i.test(lab+' '+tx)){ e.stopPropagation(); e.preventDefault(); L.wphoto(scr(),{pdf:/pdf/i.test(lab+tx)}); return; }
},true);
})();
