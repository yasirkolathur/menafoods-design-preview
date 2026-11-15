/* Direction A v2 — DAILY CASH BOOK for small restaurants (دفتر الصندوق اليومي). Module added 13 Nov 2026.
   A simple Books variant for shawarma shops, cafeterias and small cafés: 1–2 cashiers, often owner-operated, Arabic-first.
   Feels like the paper cash notebook, but faster: open day → quick sale / expense → handover → close with count → WhatsApp report.
   SAMPLE DATA ONLY — fictional shop, staff, suppliers and amounts. No real prices. Books pricing: "Price to set".
   Paid feature: Premium = paid add-on (30-day trial) · Ultra = included · Basic/Normal = 14-day trial then upsell (SUGGESTED). */
(function(){
const MF=window.MF, S=MF.S, L=MF.L, ic=MF.ic, $=MF.money, tb=MF.tb, kpi=MF.kpi;
const V = d => S.variant || d;
const nf2 = n => new Intl.NumberFormat('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const nf1 = n => new Intl.NumberFormat('en-US',{minimumFractionDigits:1,maximumFractionDigits:1}).format(n);
const T = t => `<bdi dir="ltr" class="num">${t}</bdi>`;
const sample = () => MF.badge('sample');
const sgn = n => `<bdi dir="ltr" class="nowrap">${n<0?'−&nbsp;':n>0?'+&nbsp;':''}${$(Math.abs(n))}</bdi>`;
const sugg = () => MF.badge2 ? MF.badge2('suggest') : '';
const price = () => MF.badge2 ? MF.badge2('price') : '';
const TODAY = '2026-11-13';

/* ---------- extra pictograms (simple, language-free; every one is paired with a word) ---------- */
Object.assign(MF.IP, {
 card:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
 stc:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 18.5h4M14.5 8.2c-.4-.8-1.3-1.2-2.5-1.2-1.4 0-2.5.6-2.5 1.6 0 2.2 5 1.2 5 3.4 0 1-1.1 1.7-2.5 1.7-1.2 0-2.1-.4-2.5-1.2"/>',
 bike:'<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M5.5 17 9 10h5l4.5 7M14 10l-1.5-3.5H10M11 14H7"/><rect x="14" y="3.5" width="6" height="4.5" rx="1"/>',
 book:'<path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2z"/><path d="M5 19a2 2 0 0 1 2-2h12M9 7h6M9 11h4"/>',
 veg:'<circle cx="12" cy="14" r="7"/><path d="M12 7c0-2 1-3.5 3-4M8.5 7.6c1.6 1.1 5.4 1.1 7 0"/>',
 gas:'<rect x="6" y="6" width="12" height="15" rx="4"/><path d="M9 6V3.5h6V6M6 11h12"/>',
 bread:'<path d="M4 11a4 4 0 0 1 2-7.5h12A4 4 0 0 1 20 11v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z"/><path d="m9 8 1.5 2M13 8l1.5 2"/>',
 meat:'<path d="M15 3.5a5.5 5.5 0 0 1 0 11c-1.3 0-2.4-.4-3.3-1.1l-4.2 4.2a2 2 0 1 1-2.6 2.6 2 2 0 1 1-1.5-3.2l4.3-4.3A5.5 5.5 0 0 1 15 3.5z"/>',
 water:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
 meal:'<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 2.5-3 6s1 4 3 4v8"/>',
 clean:'<path d="M8 9h6l1 12H7zM9 9V6h4v3M13 4.5h3M18 3l2-1M18 5h2.5M18 7l2 1"/>',
 car:'<path d="M3 16v-4l2.2-5A2 2 0 0 1 7 6h10a2 2 0 0 1 1.8 1L21 12v4zM3 12h18"/><circle cx="7" cy="16.5" r="2"/><circle cx="17" cy="16.5" r="2"/>',
 tool:'<path d="M15 4a5 5 0 0 0-4.6 6.9L3 18.3 5.7 21l7.4-7.4A5 5 0 0 0 20 9l-3 1-3-3 1-3z"/>',
 building:'<path d="M4 21V5l8-2v18M12 8h8v13M2 21h20M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2"/>',
 hand:'<path d="M3 14h3l4 3h5a2 2 0 0 0 0-4h-4M6 14v6H3M14 13l4.5-2.5a2 2 0 0 1 2 3.5L15 18"/><circle cx="15" cy="6" r="3"/>',
 swap:'<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
 bank:'<path d="M3 9 12 4l9 5M4 9h16M6 9v8M10 9v8M14 9v8M18 9v8M3 20h18"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 receipt:'<path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
 bksp:'<path d="M8 5h12v14H8l-6-7z"/><path d="m12 9 5 6M17 9l-5 6"/>',
 out:'<path d="M12 4v16M5 13l7 7 7-7"/>', inn:'<path d="M12 20V4M5 11l7-7 7 7"/>'
});

/* ---------- sample shop, people, channels ---------- */
const SHOP = () => L('Al Nakheel Shawarma (sample)','شاورما النخيل (تجريبي)');
const PEOPLE = { owner:()=>L('Abu Fahad','أبو فهد'), rashid:()=>L('Rashid K.','راشد ك.'), imran:()=>L('Imran S.','عمران س.'), kamal:()=>L('Kamal (cook)','كمال (طبّاخ)'), tariq:()=>L('Tariq (delivery)','طارق (توصيل)') };
const roleTag = r => r==='owner' ? `<span class="roletag owner">${ic('shield')} ${L('Owner','المالك')} · ${PEOPLE.owner()}</span>` : `<span class="roletag cashier">${ic('user')} ${L('Cashier','الكاشير')} · ${PEOPLE.rashid()}</span>`;
const CH = {
 cash:{ic:'cash',cls:'ch-cash',t:()=>L('Cash','نقد'),drawer:true},
 card:{ic:'card',cls:'ch-card',t:()=>L('mada / card','مدى / بطاقة')},
 stc:{ic:'stc',cls:'ch-stc',t:()=>L('STC Pay','STC Pay')},
 app:{ic:'bike',cls:'ch-app',t:()=>L('Delivery app','تطبيق توصيل')},
 tab:{ic:'book',cls:'ch-tab',t:()=>L('On tab (credit)','آجل (دفتر الدين)')}};
const APPS = [['hs','HungerStation','هنقرستيشن'],['jz','Jahez','جاهز'],['kt','Keeta','كيتا'],['tc','The Chefz','ذا شفز'],['ty','ToYou','تويو']];
const appName = k => { const a=APPS.find(x=>x[0]===k); return a?L(a[1],a[2]):k; };
const XCAT = [
 ['veg','veg',()=>L('Vegetables / market','خضار / سوق')],['gas','gas',()=>L('Gas cylinder','أسطوانة غاز')],['bread','bread',()=>L('Bread','خبز')],
 ['meat','meat',()=>L('Meat / chicken','لحم / دجاج')],['water','water',()=>L('Water','ماء')],['meal','meal',()=>L('Staff meals','وجبات العمّال')],
 ['clean','clean',()=>L('Cleaning','تنظيف')],['car','car',()=>L('Transport','مواصلات')],['tool','tool',()=>L('Maintenance','صيانة')],
 ['rent','building',()=>L('Rent / bills','إيجار / فواتير')],['other','more',()=>L('Other','أخرى')]];
const xName = k => (XCAT.find(x=>x[0]===k)||XCAT[10])[2]();
const xIc = k => (XCAT.find(x=>x[0]===k)||XCAT[10])[1];

/* Today's notebook page (Fri 13 Nov 2026, until 15:10). type: in/out affect drawer; nc = not in drawer */
const LEDGER = () => [
 ['07:30','sun',L('Opening float','الرصيد الافتتاحي'),L('Counted by','عدّه')+' '+PEOPLE.rashid(),300,'in'],
 ['08:05','veg',xName('veg'),L('Receipt photo','صورة إيصال')+' ✓',-145,'out'],
 ['08:40','bread',xName('bread'),L('Al Reef Bakery (sample)','مخبز الريف (تجريبي)'),-60,'out'],
 ['09:20','card',L('mada sales','مبيعات مدى'),L('Not in drawer · bank','ليست في الدرج · بنك'),540,'nc'],
 ['11:00','cash',L('Cash sales','مبيعات نقدية'),L('Morning total','إجمالي الصباح'),412,'in'],
 ['12:10','book',L('On tab — Al Noor Workshop','آجل — ورشة النور'),L('Owed to you','دين لك'),120,'nc'],
 ['12:30','bike',`${appName('hs')} ×3`,L('App settles later','يسدّد التطبيق لاحقاً'),320,'nc'],
 ['13:00','cash',L('Cash sales','مبيعات نقدية'),L('Lunch total','إجمالي الغداء'),538,'in','edited'],
 ['13:30','meat',L('Butcher — Al Hamra (sample)','ملحمة الحمراء (تجريبي)'),L('Supplier · paid from drawer','مورّد · من الدرج'),-650,'out'],
 ['14:20','book',L('Tab paid — Al Noor Workshop','سداد آجل — ورشة النور'),L('Cash into drawer','نقد للدرج'),80,'in'],
 ['14:45','card',L('mada sales','مبيعات مدى'),L('Not in drawer · bank','ليست في الدرج · بنك'),600,'nc'],
 ['14:50','stc',L('STC Pay sales','مبيعات STC Pay'),L('Not in drawer','ليست في الدرج'),95,'nc'],
 ['14:55','bike',`${appName('jz')} ×2 · ${appName('kt')} ×1`,L('App settles later','يسدّد التطبيق لاحقاً'),290,'nc'],
 ['15:10','hand',L('Advance — Rashid K.','سلفة — راشد ك.'),L('Salary advance','سلفة على الراتب'),-100,'out']];
const drawerNow = () => LEDGER().filter(r=>r[5]!=='nc').reduce((s,r)=>s+r[4],0); // 375.00

/* End of day (closing at 23:30) */
const EOD = { float:300, cash:1845, card:2310.50, stc:265, apps:{hs:640,jz:415,kt:188,tc:0,ty:96}, tab:120, tabPaid:80,
  exp:{veg:145,bread:60,water:24,gas:85,clean:38.5,car:25}, sup:650, adv:100, draw:200, leave:300 };
const appsTot = () => Object.values(EOD.apps).reduce((a,b)=>a+b,0);             // 1,339.00
const salesTot = () => EOD.cash+EOD.card+EOD.stc+appsTot()+EOD.tab;            // 5,879.50
const expTot = () => Object.values(EOD.exp).reduce((a,b)=>a+b,0);               // 377.50
const expected = () => EOD.float+EOD.cash+EOD.tabPaid-expTot()-EOD.sup-EOD.adv-EOD.draw; // 897.50
const DEN = [[500,'n'],[200,'n'],[100,'n'],[50,'n'],[20,'n'],[10,'n'],[5,'n'],[2,'c'],[1,'c'],[0.5,'c']];
const CNT = { match:{500:1,100:2,50:2,10:7,5:5,1:2,0.5:1}, short:{500:1,100:2,50:2,10:5,5:5,1:2,0.5:1}, over:{500:1,100:2,50:2,10:7,5:5,1:4,0.5:2} };
const counted = v => Object.entries(CNT[v]||CNT.match).reduce((s,[d,c])=>s+d*c,0);
const TOL = 5; // SUGGESTED variance tolerance (SAR) — same as Books
const WEEK = [['2026-11-07',6120],['2026-11-08',4880],['2026-11-09',4615],['2026-11-10',4790.5],['2026-11-11',5210],['2026-11-12',6925],['2026-11-13',5879.5]]; // = 38,420.00
const FOOD = { mf:7860.40, other:3915.00 }; // 7 days: MENAFoods invoices (auto-linked) + meat/bread/veg paid in the book
const foodPct = () => (FOOD.mf+FOOD.other)/WEEK.reduce((s,d)=>s+d[1],0)*100;   // 30.6 %

/* ---------- shared pieces ---------- */
const notERP = () => `<p class="small muted" style="margin-top:12px">${ic('info')} ${L('A simple daily cash notebook — not accounting software. No VAT returns, payroll or stock. Your data stays yours.','دفتر صندوق يومي بسيط — ليس برنامج محاسبة. لا إقرارات ضريبية ولا رواتب ولا مخزون. بياناتك ملكك.')}</p>`;
const syncChip = (off) => off ? `<span class="syncchip">${ic('wifioff')} ${L('Saved on this phone · will sync','محفوظ على الجوال · سيُزامن')}</span>` : `<span class="syncchip">${ic('check')} ${L('Saved · synced 15:10','محفوظ · زُومن 15:10')}</span>`;
const amtFmt = s => { if (!s) return '0.00'; const [a,b] = s.split('.'); return new Intl.NumberFormat('en-US').format(+a||0) + (b!==undefined?'.'+b:''); };
MF.actions.cbk = a => { const k=a.dataset.k; let s = S.cbAmt!==undefined && S.cbAmtFor===S.screen ? S.cbAmt : ''; if (k==='del') s=s.slice(0,-1); else if (k==='.') { if (!s.includes('.')) s=(s||'0')+'.'; } else { if (/\.\d\d$/.test(s) || s.replace('.','').length>=7) return; s = (s==='0'?'':s)+k; } S.cbAmt=s; S.cbAmtFor=S.screen; };
const amtNow = def => (S.cbAmt!==undefined && S.cbAmtFor===S.screen) ? S.cbAmt : def;
const amtBox = (id, def, opt={}) => { const s=amtNow(def); return `<div class="eyebrow" id="${id}-l" style="margin-bottom:4px">${opt.label||L('Amount','المبلغ')}</div><div class="amtbox ${opt.bad?'bad':''}"><output id="${id}" aria-labelledby="${id}-l" aria-live="polite"><span class="cur">${MF.riyal()}</span>${amtFmt(s)}</output>${opt.mic===false?'':`<button class="micbtn" data-act="ov:voice" aria-label="${L('Say the amount (voice)','قل المبلغ (صوت)')}">${ic('mic')}</button>`}</div>${opt.bad?`<div class="small" role="alert" style="color:var(--bad);margin-top:4px">${ic('alert')} ${L('Type the amount first, e.g. 45','اكتب المبلغ أولاً، مثال 45')}</div>`:''}`; };
const keypad = () => `<div class="keypad" role="group" aria-label="${L('Number pad','لوحة الأرقام')}">${['1','2','3','4','5','6','7','8','9','.','0','del'].map(k=>`<button data-act="cbk" data-k="${k}" ${k==='del'?`aria-label="${L('Delete last digit','احذف آخر رقم')}"`:k==='.'?`aria-label=". ${L('decimal point','فاصلة عشرية')}"`:''}>${k==='del'?ic('bksp'):k}</button>`).join('')}</div>`;
const chButtons = sel => `<div class="chpick" role="group" aria-label="${L('Paid by','طريقة الدفع')}">${Object.entries(CH).map(([k,c])=>`<button class="chbtn ${c.cls}" aria-pressed="${k===sel}" data-act="v:${k}">${ic(c.ic)}<span>${c.t()}</span></button>`).join('')}</div>`;
const ledgerRow = (r) => { const [tm,icn,t,s,a,k,ed]=r; const am = k==='nc'?`<span class="am nc">${$(a)}<small class="small" style="display:block;font-weight:500">${L('not in drawer','ليست بالدرج')}</small></span>`:`<span class="am ${a<0?'out':'in'}">${sgn(a)}</span>`;
  return `<li><button class="nbr" data-act="ov:entry"><span class="tm">${T(tm)}</span>${ic(icn)}<span class="ds">${t}${ed?` <span class="tag n">${ic('pen')} ${L('edited','مُعدّل')}</span>`:''}<small>${s}</small></span>${am}</button></li>`; };
const notebook = (rows, head) => `<section class="nb" aria-label="${head||L("Today's page",'صفحة اليوم')}"><div class="nbh"><b>${head||L("Today's page",'صفحة اليوم')}</b><span class="small">${MF.date(TODAY,{wd:1})}</span></div><ol>${rows.map(ledgerRow).join('')}</ol></section>`;
const chTotals = (o) => `<div class="chstrip">${[['cash',o.cash],['card',o.card],['stc',o.stc],['app',o.app],['tab',o.tab]].map(([k,v])=>`<div class="chtot ${CH[k].cls}"><span>${ic(CH[k].ic)} ${CH[k].t()}</span><b>${$(v)}</b></div>`).join('')}</div>`;
const SO_FAR = {cash:950,card:1140,stc:95,app:610,tab:120};
const entrySheet = () => ({type:'sheet',label:L('Entry details','تفاصيل القيد'),body:`<h3 style="margin:0 0 4px">${L('Cash sales · 13:00','مبيعات نقدية · 13:00')}</h3><div class="small muted" style="margin-bottom:10px">${L('Added by','أضافه')} ${PEOPLE.rashid()} · ${L('edited once','عُدّل مرة')}</div>
  <div class="amtbox"><output aria-label="${L('Amount','المبلغ')}"><span class="cur">${MF.riyal()}</span>538.00</output></div>
  <ol class="card" style="list-style:none;margin-top:10px;padding-inline-start:14px"><li class="small"><b>${T('13:00')}</b> ${L('Saved 438.00','حُفظ 438.00')} · ${PEOPLE.rashid()}</li><li class="small" style="margin-top:6px"><b>${T('14:22')}</b> ${L('Changed 438.00 → 538.00 · reason: “typed wrong”','غُيّر 438.00 ← 538.00 · السبب: «خطأ كتابة»')} · ${PEOPLE.rashid()}</li></ol>
  <div class="row wrap" style="margin-top:12px;gap:8px"><button class="btn" data-act="toast:${L('Edit needs a reason · logged','التعديل يحتاج سبباً · مُسجّل')}">${ic('pen')} ${L('Edit (with reason)','عدّل (مع السبب)')}</button><button class="btn" disabled aria-describedby="del-why">${ic('x')} ${L('Delete','احذف')}</button></div>
  <p class="small muted" id="del-why">${ic('lock')} ${L('Cashiers can’t delete. Only the owner can cancel an entry, and the cancelled line stays visible, struck through.','لا يمكن للكاشير الحذف. المالك فقط يلغي القيد، ويبقى السطر الملغى ظاهراً مشطوباً.')}</p>`});
const voiceSheet = () => ({type:'sheet',label:L('Say the amount','قل المبلغ'),body:`<h3 style="margin:0 0 6px">${ic('mic')} ${L('Listening…','أستمع…')}</h3><p class="small muted" style="margin:0 0 10px">${L('Say the amount and how it was paid, e.g. “45 cash” or “خمسة وأربعين مدى”.','قل المبلغ وطريقة الدفع، مثال «خمسة وأربعين كاش» أو “45 cash”.')}</p>
  <div class="card"><div class="small muted">${L('We heard','سمعنا')}</div><div style="font-size:20px;font-weight:700" lang="ar">«خمسة وأربعين كاش»</div><div class="row wrap" style="gap:8px;margin-top:8px"><span class="chtot ch-cash" style="flex-direction:row;gap:6px">${ic('cash')} ${CH.cash.t()}</span><b style="font-size:22px">${$(45)}</b></div></div>
  <div class="row wrap" style="gap:8px;margin-top:12px"><button class="btn pri" data-act="toast:${L('Saved 45.00 cash','حُفظ 45.00 نقداً')}">${ic('check')} ${L('Yes, save 45.00 cash','نعم، احفظ 45.00 نقداً')}</button><button class="btn" data-act="close">${L('No, use the number pad','لا، استخدم لوحة الأرقام')}</button></div>
  <p class="small muted">${L('Voice is optional. It understands Arabic and English numbers and always shows the result before saving. Without network it falls back to the number pad.','الصوت اختياري. يفهم الأرقام بالعربية والإنجليزية ويعرض النتيجة دائماً قبل الحفظ. بدون شبكة نرجع للوحة الأرقام.')}</p>`});
function denomRows(c){ return `<div class="list">${DEN.map(([d,k])=>{ const n=c[d]||0; const lab=`${nf2(d).replace('.00','')} ${k==='n'?L('riyal note','ريال ورقة'):L('riyal coin','ريال معدن')}`; return `<div class="li" style="cursor:default"><span class="grow"><b>${$(d)}</b> <span class="small muted">${k==='n'?L('note','ورقة'):L('coin','معدن')}</span></span><div class="step ${n?'hot':''}"><button data-act="noop" aria-label="${L('Fewer','أقل')} ${lab}">−</button><input class="num" inputmode="numeric" value="${n}" aria-label="${L('Count of','عدد')} ${lab}"><button data-act="noop" aria-label="${L('More','أكثر')} ${lab}">+</button></div><span class="end small" style="min-width:76px">${$(d*n)}</span></div>`; }).join('')}</div>`; }

MF.role('cb',{studio:'11 · Daily cash book — small restaurant (NEW)',label:()=>L('Cash book · ','دفتر الصندوق · ')+SHOP(),nav:[
 {id:'cb.today',go:'cb.today',icon:'book',label:()=>L('Today','اليوم')},
 {id:'cb.sale',go:'cb.sale',icon:'inn',label:()=>L('Sale','بيع')},
 {id:'cb.expense',go:'cb.expense',icon:'out',label:()=>L('Expense','مصروف')},
 {id:'cb.close',go:'cb.close',icon:'moon',label:()=>L('Close day','إغلاق اليوم')},
 {id:'cb.report',go:'cb.report',icon:'chart',label:()=>L('Report','التقرير')}]});

/* ================= TODAY — the notebook page ================= */
MF.screen({id:'cb.today',role:'cb',studio:'Today — the cash notebook page (home)',kind:'dash',nav:'cb.today',
 title:()=>L('Cash book','دفتر الصندوق'), sub:()=>SHOP(),
 acts:()=>`<button class="iconbtn" data-go="cb.counter?view=tabletL" aria-label="${L('Counter mode (tablet)','وضع الكاشير (تابلت)')}">${ic('grid')}</button><button class="iconbtn" data-go="cb.settings" aria-label="${L('Settings and people','الإعدادات والأشخاص')}">${ic('settings')}</button>`,
 variants:()=>[['owner','Owner view (default)'],['cashier','Cashier view (no delete, no owner cash)'],['notopen','Day not opened yet'],['closed','Day closed (read-only)'],['trial','Trial banner (Normal tier)']],
 render:()=>{ const v=V('owner'); const off=S.state==='offline';
  if (v==='notopen') return `<div class="row between wrap" style="gap:8px;margin-bottom:10px">${roleTag('cashier')}${syncChip(off)}</div>
   <div class="state" role="status" style="padding-top:12px"><div class="ic">${ic('sun')}</div><h3>${L('Good morning — open today’s page','صباح الخير — افتح صفحة اليوم')}</h3><p>${L('Count the cash in the drawer to start. Yesterday you left','عُدّ النقد في الدرج للبدء. أمس تركت')} ${$(300)}.</p><button class="btn pri" data-go="cb.open">${ic('sun')} ${L('Open the day','افتح اليوم')}</button></div>
   <div class="card" style="margin-top:12px"><div class="eyebrow">${L('Yesterday · Thu 12 Nov','أمس · الخميس 12 نوفمبر')}</div><div class="row between wrap" style="margin-top:6px;gap:6px"><span>${L('Sales','المبيعات')} <b>${$(6925)}</b></span><span>${L('Deposited','أُودع')} <b>${$(812)}</b></span><span class="tag ok">${ic('check')} ${L('Closed · no difference','مُغلق · بلا فرق')}</span></div></div>${notERP()}`;
  const closed = v==='closed'; const who = v==='cashier'?'cashier':'owner';
  const hero = `<div class="cbhero"><div class="row between wrap" style="gap:6px"><span class="eyebrow">${closed?L('Day closed · counted','اليوم مُغلق · المعدود'):L('In the drawer now (expected)','في الدرج الآن (المتوقع)')}</span>${closed?`<span class="tag n">${ic('lock')} ${L('Read-only','للقراءة فقط')}</span>`:`<span class="tag ok">${ic('sun')} ${L('Open since','مفتوح منذ')} ${T('07:30')}</span>`}</div>
   <div class="big">${$(closed?counted('match'):drawerNow())}</div>
   <div class="parts"><span>${L('Opening','الافتتاحي')} ${$(300)}</span><span>${ic('inn')} ${L('Cash in','قبض نقدي')} ${$(closed?EOD.cash+EOD.tabPaid:1030)}</span><span>${ic('out')} ${L('Cash out','صرف نقدي')} ${$(closed?expTot()+EOD.sup+EOD.adv+EOD.draw:955)}</span></div></div>`;
  const tiles = closed ? `<div class="banner n">${ic('lock')}<div class="grow small"><b>${L('Closed at 23:30 by Imran S. · deposited 597.50','أُغلق 23:30 بواسطة عمران س. · أُودع 597.50')}</b>${who==='owner'?L('As owner you can reopen or correct it — every change needs a reason and is logged.','بصفتك المالك يمكنك إعادة فتحه أو تصحيحه — كل تغيير يحتاج سبباً ويُسجّل.'):L('Only the owner can change a closed day.','المالك فقط يغيّر يوماً مُغلقاً.')}</div></div><div class="row wrap" style="gap:8px"><button class="btn" data-go="cb.report">${ic('chart')} ${L('Day report','تقرير اليوم')}</button>${who==='owner'?`<button class="btn" data-act="ov:reopen">${ic('pen')} ${L('Reopen with reason','أعد الفتح مع السبب')}</button>`:''}</div>`
   : `<div class="qgrid"><button class="qtile in" data-go="cb.sale">${ic('inn')}<span>${L('Sale','بيع')}<br><small>${L('money in','قبض')}</small></span></button><button class="qtile out" data-go="cb.expense">${ic('out')}<span>${L('Expense','مصروف')}<br><small>${L('money out','صرف')}</small></span></button></div>
   <div class="qgrid small"><button class="qtile n" data-go="cb.supplier">${ic('truck')}<span>${L('Supplier','مورّد')}</span></button><button class="qtile n" data-go="cb.staff">${ic('hand')}<span>${who==='owner'?L('Advance / owner','سلفة / المالك'):L('Staff advance','سلفة عامل')}</span></button><button class="qtile n" data-go="cb.handover">${ic('swap')}<span>${L('Hand over','تسليم الوردية')}</span></button><button class="qtile n" data-go="cb.close">${ic('moon')}<span>${L('Close day','إغلاق اليوم')}</span></button></div>`;
  return `${v==='trial'?`<div class="banner info">${ic('clock')}<div class="grow small"><b>${L('Free trial · day 3 of 14','تجربة مجانية · اليوم 3 من 14')}</b>${L('Then part of Books for Premium (add-on) or included in Ultra Premium.','بعدها ضمن الدفاتر للمميّز (إضافة) أو مشمول في فائق التميّز.')} <a href="#" data-go="cb.plans">${L('See options','اعرض الخيارات')}</a></div></div>`:''}
   <div class="row between wrap" style="gap:8px;margin-bottom:10px">${roleTag(who)}${syncChip(off)}</div>${hero}${tiles}
   <h2 class="h">${L('Sales today by how they paid','مبيعات اليوم حسب طريقة الدفع')}</h2>${chTotals(closed?{cash:EOD.cash,card:EOD.card,stc:EOD.stc,app:appsTot(),tab:EOD.tab}:SO_FAR)}
   <div style="height:12px"></div>${notebook(LEDGER().slice().reverse(), L("Today's page · newest first",'صفحة اليوم · الأحدث أولاً'))}
   ${who==='cashier'?`<p class="lockline">${ic('lock')} ${L('Cashier: you can add lines and correct your own with a reason. Deleting and owner cash are for the owner.','الكاشير: يمكنك إضافة السطور وتصحيح سطورك مع السبب. الحذف وسحب المالك للمالك فقط.')}</p>`:`<div class="row wrap" style="gap:8px;margin-top:10px"><button class="btn" data-go="cb.history">${ic('history')} ${L('Changes log','سجل التعديلات')}</button><button class="btn" data-go="cb.owed">${ic('book')} ${L('Owed to you','ديون لك')}</button><button class="btn" data-go="cb.period">${ic('chart')} ${L('Week / month','الأسبوع / الشهر')}</button></div>`}${notERP()}`; },
 pane2:()=>`<div class="eyebrow">${L('Counter mode · quick sale','وضع الكاشير · بيع سريع')}</div>${amtBox('p2amt','45')}${keypad()}${chButtons('cash')}<button class="btn pri block" style="margin-top:10px" data-act="toast:${L('Saved 45.00 cash','حُفظ 45.00 نقداً')}">${L('Save sale','احفظ البيع')}</button>`,
 primary:()=>{ const v=V('owner'); if (v==='closed'||v==='notopen') return null; return {label:L('Add sale','أضف بيعاً'),icon:'plus',go:'cb.sale',sum:`<b>${$(drawerNow())}</b>${L('in drawer','في الدرج')}`}; },
 overlays:{entry:entrySheet, voice:voiceSheet, reopen:()=>({type:'dialog',title:L('Reopen Fri 13 Nov?','إعادة فتح الجمعة 13 نوفمبر؟'),body:L('The report already sent stays in WhatsApp. A corrected report is sent marked “corrected”. A reason is required and logged.','التقرير المُرسل يبقى في واتساب. يُرسل تقرير مُصحّح بعلامة «مُصحّح». السبب مطلوب ويُسجّل.'),ok:L('Reopen','أعد الفتح'),okAct:'toast:'+L('Day reopened · logged','أُعيد فتح اليوم · مُسجّل')})},
 empty:()=>({icon:'book',t:L('Your first page','صفحتك الأولى'),b:L('Open the day with the cash in the drawer. Takes 30 seconds.','افتح اليوم بالنقد الموجود في الدرج. يأخذ 30 ثانية.'),cta:L('Open the day','افتح اليوم'),go:'cb.open'}),
 error:()=>({t:L("Couldn't load today's page","تعذّر تحميل صفحة اليوم"),b:L('Your entries are safe on this phone. Try again; you can still add sales and expenses.','قيودك محفوظة على الجوال. حاول مجدداً؛ يمكنك إضافة المبيعات والمصروفات.'),code:'CB-TODAY'}),
 offline:()=>({msg:L('Offline — everything works. 4 lines saved on this phone will sync by themselves.','غير متصل — كل شيء يعمل. 4 سطور محفوظة على الجوال ستُزامن تلقائياً.'),q:L('Queue: 3 sales, 1 expense with photo','الانتظار: 3 مبيعات، مصروف بصورة')}),
 loadingMsg:()=>L("Opening today's page…",'جارٍ فتح صفحة اليوم…'),
 deniedMsg:()=>L('This cash book is private to the owner and the cashiers they add. Ask the owner to add you with a PIN.','دفتر الصندوق خاص بالمالك والكاشيرين الذين يضيفهم. اطلب من المالك إضافتك برمز PIN.'),
 notes:['Home = the paper notebook page: time margin, icon, line, amount; green = in, red = out, grey = not in drawer (mada, STC Pay, apps, tab).','2 big tiles (Sale / Expense, ≥ 92 px) + 4 tiles for supplier, advance/owner, handover, close. One-hand: actions in the lower half.','Owner vs cashier variants. Tablet = counter-mode pane (number pad + payment buttons).','Offline-first: every line saved on the phone first; sync chip always visible.']});

/* ================= OPEN DAY ================= */
MF.screen({id:'cb.open',role:'cb',studio:'Open the day — opening float',kind:'form',nav:'cb.today',back:'cb.today',
 title:()=>L('Open the day','افتح اليوم'), sub:()=>MF.dateG(TODAY),
 variants:()=>[['same','Same as last close (one tap)'],['count','Count note by note'],['diff','Differs from last close']],
 render:()=>{ const v=V('same');
  const top=`<div class="card"><div class="row between wrap" style="gap:6px"><span class="eyebrow">${L('Left in drawer at last close','المتروك في الدرج عند آخر إغلاق')}</span><span class="small muted">${L('Thu 12 Nov · 23:40 · Imran S.','الخميس 12 نوفمبر · 23:40 · عمران س.')}</span></div><div style="font-size:26px;font-weight:800;margin-top:4px">${$(300)}</div></div>`;
  if (v==='count'||v==='diff') { const c = v==='diff'?{100:2,50:1,20:2}:{100:2,50:1,20:2,10:1}; const t=Object.entries(c).reduce((s,[d,n])=>s+d*n,0);
   return top+`<h2 class="h">${L('Count the drawer','عُدّ الدرج')}</h2>${denomRows(c)}<div class="card" style="margin-top:10px"><div class="row between"><b>${L('Counted','المعدود')}</b><b role="status">${$(t)}</b></div>${v==='diff'?`<div class="banner warn" style="margin-bottom:0">${ic('alert')}<div class="grow small"><b>${L('10.00 less than last close','أقل بـ 10.00 من آخر إغلاق')}</b>${L('Open anyway with a note — the owner sees it in the day report.','افتح مع ملاحظة — يراه المالك في تقرير اليوم.')}</div></div><label class="field" style="margin-top:8px"><span>${L('Note','ملاحظة')}</span><input class="inp" dir="auto" value="${L('Change taken for bread at 06:50','فكة للخبز 06:50')}"></label>`:''}</div>`; }
  return top+`<div class="qgrid" style="grid-template-columns:1fr"><button class="qtile in" data-act="toast:${L('Day opened with 300.00','فُتح اليوم بـ 300.00')}">${ic('check')}<span>${L('Yes, 300.00 is in the drawer','نعم، 300.00 في الدرج')}</span></button><button class="qtile n" data-act="v:count">${ic('cash')}<span>${L('No — count note by note','لا — عُدّ فئة فئة')}</span></button></div>
   <label class="field"><span>${L('Who is at the cash today?','من على الكاشير اليوم؟')}</span><select class="inp"><option>${PEOPLE.rashid()} · ${L('morning','صباحي')}</option><option>${PEOPLE.imran()} · ${L('evening','مسائي')}</option><option>${PEOPLE.owner()}</option></select></label>${notERP()}`; },
 primary:()=>V('same')==='same'?null:{label:L('Open the day','افتح اليوم'),icon:'sun',act:`toast:${L('Day opened','فُتح اليوم')}`,fab:false},
 empty:()=>({icon:'sun',t:L('First day in the app','أول يوم في التطبيق'),b:L('Count the cash you start with. On the next days we remember what you left.','عُدّ النقد الذي تبدأ به. في الأيام التالية نتذكر ما تركته.')}),
 error:()=>({t:L("Couldn't open the day","تعذّر فتح اليوم"),b:L('Your count is kept on the phone. Try again.','عدّك محفوظ على الجوال. حاول مجدداً.'),code:'CB-OPEN'}),
 offline:()=>({msg:L('Offline — you can open the day; it syncs later.','غير متصل — يمكنك فتح اليوم؛ يُزامن لاحقاً.'),q:false}),
 loadingMsg:()=>L('Getting last close…','جارٍ جلب آخر إغلاق…'),
 deniedMsg:()=>L('Only the owner or an added cashier can open the day.','المالك أو كاشير مُضاف فقط يفتح اليوم.'),
 notes:['One-tap open when the float equals last close (most days). Count note-by-note only when needed.','A difference from last close is allowed with a note and flagged in the owner report.']});

/* ================= QUICK SALE ================= */
MF.screen({id:'cb.sale',role:'cb',studio:'Quick sale — number pad + how they paid (voice optional)',kind:'form',nav:'cb.sale',back:'cb.today',
 title:()=>L('Sale · money in','بيع · قبض'), sub:()=>`${MF.dateG(TODAY)} · ${PEOPLE.rashid()}`,
 variants:()=>[['cash','Cash'],['card','mada / card'],['stc','STC Pay'],['app','Delivery app (settles later)'],['tab','On tab (credit customer)'],['invalid','No amount (error)']],
 render:()=>{ const v=V('cash'); const k=v==='invalid'?'cash':v; const amt = v==='invalid'?'':v==='app'?'86':v==='tab'?'38':'45';
  let extra='';
  if (k==='app') extra=`<fieldset style="border:0;padding:0;margin:12px 0 0"><legend class="small strong">${L('Which app?','أي تطبيق؟')}</legend><div class="apppick">${APPS.map(([a,en,ar],i)=>`<button class="chip ${i===0?'on':''}" aria-pressed="${i===0}" data-act="noop">${ic('bike')} ${L(en,ar)}</button>`).join('')}</div></fieldset><div class="banner n">${ic('info')}<div class="grow small"><b>${L('Not in the drawer','ليس في الدرج')}</b>${L('The app pays you later. We keep it in “Owed to you” until you record the settlement.','التطبيق يدفع لك لاحقاً. نحفظه في «ديون لك» حتى تسجّل التسوية.')}</div></div>`;
  if (k==='tab') extra=`<label class="field" style="margin-top:12px"><span>${L('Customer on tab','عميل الآجل')}</span><select class="inp"><option>${L('Al Noor Workshop — owes 340.00','ورشة النور — عليه 340.00')}</option><option>${L("Saeed's Garage — owes 185.00","كراج سعيد — عليه 185.00")}</option><option>${L('Building guard Ali — owes 62.00','حارس العمارة علي — عليه 62.00')}</option><option>${L('+ New customer','+ عميل جديد')}</option></select><em>${L('Tab limit you set: 500.00 · after this sale: 378.00','حدّ الآجل الذي وضعته: 500.00 · بعد هذا البيع: 378.00')}</em></label>`;
  if (k==='card'||k==='stc') extra=`<p class="small muted" style="margin-top:10px">${ic('info')} ${L('Not in the drawer — it goes to your bank. Counted in sales, not in the cash count.','ليس في الدرج — يذهب لحسابك البنكي. يُحسب في المبيعات لا في عدّ النقد.')}</p>`;
  return `${amtBox('saleamt',amt,{bad:v==='invalid'})}${keypad()}<h2 class="h" style="margin-top:14px">${L('How did they pay?','كيف دفع؟')}</h2>${chButtons(k)}${extra}
   <p class="small muted" style="margin-top:10px">${L('One sale or a total for several — both are fine. Undo appears after saving.','بيع واحد أو إجمالي لعدة مبيعات — كلاهما مقبول. يظهر «تراجع» بعد الحفظ.')}</p>`; },
 primary:()=>{ const v=V('cash'); const k=v==='invalid'?'cash':v; return {label:v==='invalid'?L('Type the amount','اكتب المبلغ'):`${L('Save','احفظ')} · ${CH[k].t()}`,icon:'check',act:v==='invalid'?'noop':`toast:${L('Saved','حُفظ')}`,disabled:v==='invalid',fab:false}; },
 pane2:()=>notebook(LEDGER().filter(r=>r[4]>0&&r[1]!=='sun').reverse().slice(0,6), L('Last sales','آخر المبيعات')),
 overlays:{voice:voiceSheet, entry:entrySheet},
 empty:()=>({icon:'inn',t:L('No sales yet today','لا مبيعات اليوم بعد'),b:L('Type the amount and tap how they paid.','اكتب المبلغ واضغط طريقة الدفع.')}),
 error:()=>({t:L("Couldn't save the sale","تعذّر حفظ البيع"),b:L('It’s kept on the phone and will retry. Nothing is lost.','محفوظ على الجوال وستُعاد المحاولة. لم يضِع شيء.'),code:'CB-SALE'}),
 offline:()=>({msg:L('Offline — sales save on the phone. Voice needs network; the number pad always works.','غير متصل — المبيعات تُحفظ على الجوال. الصوت يحتاج شبكة؛ لوحة الأرقام تعمل دائماً.'),q:false}),
 loadingMsg:()=>L('Opening number pad…','جارٍ فتح لوحة الأرقام…'),
 deniedMsg:()=>L('Ask the owner to add you as a cashier.','اطلب من المالك إضافتك ككاشير.'),
 notes:['Number pad (56 px keys, LTR digits, works) + optional voice: “45 cash” / «خمسة وأربعين مدى» → shown before saving.','Channels: cash (drawer), mada/card, STC Pay, delivery apps (HungerStation, Jahez, Keeta, The Chefz, ToYou → receivable), tab (credit customer with a limit).','Toast with Undo after save; later corrections need a reason (audit).']});

/* ================= QUICK EXPENSE ================= */
MF.screen({id:'cb.expense',role:'cb',studio:'Petty-cash expense — picture buttons, photo optional',kind:'form',nav:'cb.expense',back:'cb.today',
 title:()=>L('Expense · money out','مصروف · صرف'), sub:()=>L('From the drawer','من الدرج'),
 variants:()=>[['grid','Pick what for'],['amount','Vegetables · amount'],['photo','With receipt photo'],['invalid','More than drawer (warning)']],
 render:()=>{ const v=V('grid');
  if (v==='grid') return `<h2 class="h" style="margin-top:0">${L('What did you pay for?','دفعت مقابل ماذا؟')}</h2><div class="xgrid" role="group" aria-label="${L('What did you pay for?','دفعت مقابل ماذا؟')}">${XCAT.map(([k,icn,t])=>`<button class="xbtn" data-act="v:amount">${ic(icn)}<span>${t()}</span></button>`).join('')}</div><p class="small muted" style="margin-top:10px">${L('Supplier invoices (incl. MENAFoods) are under Supplier. Staff advances under Advance.','فواتير الموردين (ومنها ميناء فودز) تحت «مورّد». سلف العمال تحت «سلفة».')}</p>`;
  const amt = v==='invalid'?'480':'145';
  return `<div class="row wrap" style="gap:8px;margin-bottom:10px;align-items:center"><span class="chtot" style="flex-direction:row;gap:6px;background:#FBE9E7;color:#7A1C12">${ic('veg')} <b style="font-size:14px">${xName('veg')}</b></span><button class="btn sm" data-act="v:grid">${L('Change','غيّر')}</button></div>
   ${amtBox('expamt',amt)}${keypad()}
   ${v==='invalid'?`<div class="banner warn">${ic('alert')}<div class="grow small"><b>${L('More than the drawer should have (375.00)','أكثر مما يجب أن يكون في الدرج (375.00)')}</b>${L('Check the amount, or choose “Owner paid” below.','تحقق من المبلغ أو اختر «دفعه المالك» أدناه.')}</div></div>`:''}
   <label class="field" style="margin-top:12px"><span>${L('Paid from','الدفع من')}</span><select class="inp"><option>${L('Drawer (cash)','الدرج (نقد)')}</option><option>${L('Owner paid from pocket','دفعه المالك من جيبه')}</option><option>${L('Bank / mada','بنك / مدى')}</option></select></label>
   <div class="card row" style="gap:10px">${v==='photo'?`<div class="photo" style="width:56px;height:56px" aria-hidden="true">${ic('receipt')}</div><div class="grow"><div class="small strong">${L('Receipt photo added','أُضيفت صورة الإيصال')}</div><div class="small muted">IMG_0805.jpg · ${L('on phone, uploads on Wi-Fi','على الجوال، تُرفع عبر Wi-Fi')}</div></div><button class="btn sm" data-act="toast:${L('Camera opens (prototype)','تفتح الكاميرا (نموذج)')}">${L('Retake','أعد التصوير')}</button>`:`<span class="grow small">${ic('camera')} ${L('Receipt photo (optional)','صورة الإيصال (اختياري)')}</span><button class="btn sm" data-act="v:photo">${ic('camera')} ${L('Take photo','صوّر')}</button>`}</div>
   <label class="field" style="margin-top:10px"><span>${L('Note (optional)','ملاحظة (اختياري)')}</span><input class="inp" dir="auto" value="${L('Tomatoes, onions, parsley','طماطم، بصل، بقدونس')}"></label>`; },
 primary:()=>V('grid')==='grid'?null:{label:L('Save expense','احفظ المصروف'),icon:'check',act:`toast:${L('Saved','حُفظ')}`,fab:false},
 overlays:{voice:voiceSheet},
 empty:()=>({icon:'out',t:L('No expenses yet today','لا مصروفات اليوم بعد'),b:L('Tap a picture, then the amount.','اضغط صورة ثم المبلغ.')}),
 error:()=>({t:L("Couldn't save the expense","تعذّر حفظ المصروف"),b:L('Kept on the phone with its photo. It will retry.','محفوظ على الجوال مع الصورة. ستُعاد المحاولة.'),code:'CB-EXP'}),
 offline:()=>({msg:L('Offline — expenses and photos save on the phone.','غير متصل — المصروفات والصور تُحفظ على الجوال.'),q:false}),
 loadingMsg:()=>L('Loading…','جارٍ التحميل…'),
 deniedMsg:()=>L('Ask the owner to add you as a cashier.','اطلب من المالك إضافتك ككاشير.'),
 notes:['11 picture buttons for common small-restaurant costs (owner can hide/reorder in Settings). Icon + word, never icon alone.','Receipt photo optional; paid from drawer / owner pocket / bank — only drawer changes the cash count.','Warns (does not block) when the amount is more than the drawer should hold.']});

/* ================= SUPPLIERS (MENAFoods auto-linked) ================= */
MF.screen({id:'cb.supplier',role:'cb',studio:'Supplier payments — MENAFoods invoices auto-linked',kind:'list',nav:'cb.today',back:'cb.today',
 title:()=>L('Suppliers','الموردون'), sub:()=>L('Pay and keep track','ادفع وتابع'),
 subs:()=>[['mf','MENAFoods (auto)'],['other','Other suppliers'],['pay','Pay a supplier']],
 render:()=>{ const t=S.sub||'mf';
  const tabs = MF.tabs([['mf',L('MENAFoods','ميناء فودز')],['other',L('Others','آخرون')],['pay',L('Pay','ادفع')]],t);
  if (t==='mf') return tabs+`<div class="banner ok">${ic('sync')}<div class="grow small"><b>${L('Linked automatically','مربوطة تلقائياً')}</b>${L('Every MENAFoods invoice appears here and counts as food cost. Payment status comes from your MENAFoods account (Zoho Books) — you don’t type it twice.','كل فاتورة من ميناء فودز تظهر هنا وتُحسب تكلفة طعام. حالة السداد تأتي من حسابك في ميناء فودز (Zoho Books) — لا تكتبها مرتين.')}</div></div>
   <div class="list">${[['INV-26-11931','2026-11-11',4108.30,'open','2026-12-11'],['INV-26-11873','2026-11-08',3586.56,'open','2026-12-08'],['INV-26-11802','2026-11-04',3342.10,'paid','2026-11-12'],['INV-26-11766','2026-11-01',3283.44,'paid','2026-11-10']].map(([n,d,a,s,x])=>`<div class="li" data-act="ov:inv"><span class="av" aria-hidden="true">MF</span><div class="grow"><div class="t">${MF.ltr(n)} · ${L('delivered','سُلّمت')} ${MF.dateG(d)}</div><div class="s">${s==='open'?`${L('On account · due','على الحساب · تستحق')} ${MF.dateG(x)}`:`${L('Paid','مدفوعة')} ${MF.dateG(x)} · ${L('bank transfer','تحويل بنكي')}`}</div></div><div class="end"><b>${$(a)}</b><br>${s==='open'?`<span class="tag warn">${L('Open','مفتوحة')}</span>`:`<span class="tag ok">${ic('check')} ${L('Paid','مدفوعة')}</span>`}</div></div>`).join('')}</div>
   <p class="small muted" style="margin-top:8px">${sample()} ${L('Amounts are sample values. If you paid MENAFoods in cash from the drawer, tap the invoice → “Paid from drawer”.','المبالغ تجريبية. إذا دفعت لميناء فودز نقداً من الدرج، اضغط الفاتورة ← «دُفعت من الدرج».')}</p>`;
  if (t==='other') return tabs+`<div class="list">${[['meat',L('Butcher — Al Hamra (sample)','ملحمة الحمراء (تجريبي)'),650,L('Today 13:30 · drawer','اليوم 13:30 · الدرج'),0],['bread',L('Al Reef Bakery (sample)','مخبز الريف (تجريبي)'),60,L('Today 08:40 · drawer','اليوم 08:40 · الدرج'),0],['veg',L('Vegetable seller — market (sample)','بائع خضار — السوق (تجريبي)'),145,L('Today 08:05 · drawer','اليوم 08:05 · الدرج'),0],['gas',L('Gas delivery (sample)','توصيل غاز (تجريبي)'),170,L('Not paid · pay Sunday','غير مدفوع · يُدفع الأحد'),1]].map(([i,n,a,s,owe])=>`<div class="li" style="cursor:default"><span class="av" aria-hidden="true" style="background:#FBE9E7;color:#7A1C12">${ic(i)}</span><div class="grow"><div class="t">${n}</div><div class="s">${s}</div></div><div class="end"><b>${$(a)}</b>${owe?`<br><span class="tag warn">${L('You owe','عليك')}</span>`:''}</div></div>`).join('')}</div>`;
  return tabs+`<label class="field"><span>${L('Supplier','المورّد')}</span><select class="inp"><option>${L('Butcher — Al Hamra (sample)','ملحمة الحمراء (تجريبي)')}</option><option>${L('Gas delivery (sample)','توصيل غاز (تجريبي)')}</option><option>MENAFoods · INV-26-11931</option><option>${L('+ New supplier','+ مورّد جديد')}</option></select></label>${amtBox('supamt','650',{mic:false})}${keypad()}
   <label class="field" style="margin-top:12px"><span>${L('Paid from','الدفع من')}</span><select class="inp"><option>${L('Drawer (cash)','الدرج (نقد)')}</option><option>${L('Bank transfer','تحويل بنكي')}</option><option>${L('Owner paid from pocket','دفعه المالك من جيبه')}</option><option>${L('Not paid yet (I owe)','لم يُدفع بعد (عليّ)')}</option></select></label>
   <div class="card row" style="gap:10px"><span class="grow small">${ic('camera')} ${L('Supplier invoice photo (optional)','صورة فاتورة المورّد (اختياري)')}</span><button class="btn sm" data-act="toast:${L('Camera opens (prototype)','تفتح الكاميرا (نموذج)')}">${ic('camera')} ${L('Take photo','صوّر')}</button></div>`; },
 primary:()=>S.sub==='pay'?{label:L('Save payment','احفظ الدفعة'),icon:'check',act:`toast:${L('Saved','حُفظ')}`,fab:false}:{label:L('Pay a supplier','ادفع لمورّد'),icon:'plus',act:'sub:pay',fab:true},
 overlays:{inv:()=>({type:'sheet',label:L('MENAFoods invoice','فاتورة ميناء فودز'),body:`<h3 style="margin:0 0 4px">${MF.ltr('INV-26-11931')}</h3><div class="small muted">${L('Delivered Wed 11 Nov · 14 lines · excl. VAT 3,572.43 + VAT 535.87','سُلّمت الأربعاء 11 نوفمبر · 14 سطراً · دون الضريبة 3,572.43 + ضريبة 535.87')} · ${L('sample','تجريبي')}</div><div style="font-size:24px;font-weight:800;margin:8px 0">${$(4108.30)}</div>
   <dl class="dl"><dt>${L('Counts as','تُحسب')}</dt><dd>${L('Food cost (purchases)','تكلفة طعام (مشتريات)')}</dd><dt>${L('Status','الحالة')}</dt><dd>${L('On account · due 11 Dec','على الحساب · تستحق 11 ديسمبر')}</dd><dt>${L('Source','المصدر')}</dt><dd>${L('MENAFoods · Zoho Books 14:48','ميناء فودز · Zoho Books 14:48')}</dd></dl>
   <div class="row wrap" style="gap:8px;margin-top:10px"><button class="btn" data-act="toast:${L('Marked paid from drawer · logged','سُجّلت مدفوعة من الدرج · مُسجّل')}">${ic('cash')} ${L('Paid from drawer','دُفعت من الدرج')}</button><button class="btn" data-go="b.finance">${ic('wallet')} ${L('Pay online','ادفع إلكترونياً')}</button></div>`})},
 empty:()=>({icon:'truck',t:L('No supplier payments yet','لا دفعات للموردين بعد'),b:L('MENAFoods invoices appear here by themselves after delivery.','فواتير ميناء فودز تظهر هنا تلقائياً بعد التسليم.')}),
 error:()=>({t:L("Couldn't load MENAFoods invoices","تعذّر تحميل فواتير ميناء فودز"),b:L('Other suppliers still work. Invoices come back with the connection.','الموردون الآخرون يعملون. تعود الفواتير مع عودة الاتصال.'),code:'CB-SUP'}),
 offline:()=>({msg:L('Offline — showing invoices from 14:48. You can still record cash payments.','غير متصل — الفواتير حتى 14:48. يمكنك تسجيل الدفعات النقدية.'),q:false}),
 loadingMsg:()=>L('Loading supplier invoices…','جارٍ تحميل فواتير الموردين…'),
 deniedMsg:()=>L('Ask the owner — supplier payments can be owner-only in Settings.','اسأل المالك — يمكن جعل دفعات الموردين للمالك فقط من الإعدادات.'),
 notes:['MENAFoods invoices auto-linked (read from Zoho Books, the master) → food cost; never re-typed. “Paid from drawer” only records the cash movement in the customer’s own book.','Other suppliers: butcher, bakery, vegetables, gas; “I owe” for unpaid.']});

/* ================= STAFF ADVANCES · OWNER DRAWINGS ================= */
MF.screen({id:'cb.staff',role:'cb',studio:'Staff advances & owner drawings',kind:'list',nav:'cb.today',back:'cb.today',
 title:()=>L('Advances & owner cash','السلف وسحب المالك'), sub:()=>L('Money that is not an expense','نقد ليس مصروفاً'),
 subs:()=>[['adv','Staff advances'],['owner','Owner drawings']],
 variants:()=>[['owner','Owner'],['cashier','Cashier (owner drawings locked)']],
 render:()=>{ const t=S.sub||'adv', who=V('owner');
  const tabs = MF.tabs([['adv',L('Staff advances','سلف العمال')],['owner',L('Owner','المالك')]],t);
  if (t==='owner') { if (who==='cashier') return tabs+`<div class="state" role="status"><div class="ic">${ic('lock')}</div><h3>${L('Owner only','للمالك فقط')}</h3><p>${L('Only the owner records cash they take. If the owner asks you for cash, use Hand over.','المالك فقط يسجّل النقد الذي يأخذه. إن طلب منك نقداً استخدم «تسليم».')}</p></div>`;
   return tabs+`<div class="grid g2"><div class="card kpi"><div class="eyebrow">${L('Taken today','سُحب اليوم')}</div><div class="v">${$(0)}</div></div><div class="card kpi"><div class="eyebrow">${L('This month','هذا الشهر')}</div><div class="v">${$(2400)}</div><div class="d">${L('6 times','6 مرات')}</div></div></div>
    <p class="small muted">${L('Owner drawings are not expenses — they lower the cash, not the profit.','سحب المالك ليس مصروفاً — يقلّل النقد لا الربح.')}</p>${amtBox('drawamt','200',{mic:false,label:L('Take from drawer','خذ من الدرج')})}${keypad()}`; }
  return tabs+`<div class="list">${[['rashid',300,L('Today 100 · 1 Nov 200','اليوم 100 · 1 نوفمبر 200')],['imran',0,L('No advance','لا سلفة')],['kamal',450,L('3 Nov 450','3 نوفمبر 450')],['tariq',150,L('9 Nov 150','9 نوفمبر 150')]].map(([p,b,s])=>`<div class="li" style="cursor:default"><span class="av" aria-hidden="true">${PEOPLE[p]().slice(0,1)}</span><div class="grow"><div class="t">${PEOPLE[p]()}</div><div class="s">${s}</div></div><div class="end"><b>${$(b)}</b><br><button class="btn sm" data-act="ov:give" aria-label="${L('Give advance','أعطِ سلفة')} — ${PEOPLE[p]()}">${L('Give advance','أعطِ سلفة')}</button></div></div>`).join('')}</div>
   <p class="small muted" style="margin-top:8px">${L('Advances to recover at month end:','سلف تُسترد نهاية الشهر:')} <b>${$(900)}</b>. ${L('The book only tracks them — salaries are paid outside the app.','الدفتر يتابعها فقط — الرواتب تُدفع خارج التطبيق.')}</p>`; },
 primary:()=> (S.sub==='owner' && V('owner')==='owner') ? {label:L('Take 200.00 (owner)','اسحب 200.00 (المالك)'),icon:'check',act:'ov:pin',fab:false} : null,
 overlays:{give:()=>({type:'sheet',label:L('Give advance','أعطِ سلفة'),body:`<h3 style="margin:0 0 8px">${L('Advance to Rashid K.','سلفة لراشد ك.')}</h3>${amtBox('advamt','100',{mic:false})}<label class="field" style="margin-top:10px"><span>${L('Staff PIN (confirms they got it)','رمز العامل (يؤكد الاستلام)')}</span><input class="inp ltr num" inputmode="numeric" autocomplete="off" value="••••" aria-describedby="pinh"><em id="pinh">${L('Or the owner approves on their phone.','أو يوافق المالك من جواله.')}</em></label><button class="btn pri block" data-act="toast:${L('Advance saved','حُفظت السلفة')}">${L('Give 100.00 from drawer','أعطِ 100.00 من الدرج')}</button>`}),
  pin:()=>({type:'dialog',title:L('Owner PIN','رمز المالك'),body:L('Taking 200.00 from the drawer as an owner drawing. It shows in the day report.','سحب 200.00 من الدرج كسحب للمالك. يظهر في تقرير اليوم.'),ok:L('Confirm','أكّد'),okAct:'toast:'+L('Owner drawing saved','حُفظ سحب المالك')})},
 empty:()=>({icon:'hand',t:L('No advances','لا سلف'),b:L('Add staff in Settings to track advances.','أضف العمال في الإعدادات لمتابعة السلف.'),cta:L('Settings','الإعدادات'),go:'cb.settings'}),
 error:()=>({t:L("Couldn't load advances","تعذّر تحميل السلف"),b:L('Try again. New advances still save on the phone.','حاول مجدداً. السلف الجديدة تُحفظ على الجوال.'),code:'CB-ADV'}),
 offline:()=>({msg:L('Offline — advances save on the phone.','غير متصل — السلف تُحفظ على الجوال.'),q:false}),
 loadingMsg:()=>L('Loading…','جارٍ التحميل…'),
 deniedMsg:()=>L('Only the owner can see owner drawings.','المالك فقط يرى سحوباته.'),
 notes:['Staff advances: balance per person; staff PIN or owner approval as receipt. Not an expense; tracked until recovered.','Owner drawings: owner-only, PIN, not an expense (reduces cash, not profit).']});

/* ================= HANDOVER between cashiers ================= */
MF.screen({id:'cb.handover',role:'cb',studio:'Cash handover between shifts / cashiers',kind:'form',nav:'cb.today',back:'cb.today',
 title:()=>L('Hand over the drawer','تسليم الدرج'), sub:()=>`${PEOPLE.rashid()} → ${PEOPLE.imran()} · 16:00`,
 variants:()=>[['match','Count matches'],['diff','10.00 short — both confirm'],['done','Handed over']],
 render:()=>{ const v=V('match'); const exp=351, got=v==='diff'?341:351;
  if (v==='done') return `<div class="state" role="status"><div class="ic" style="background:var(--ok-bg);color:var(--ok)">${ic('check')}</div><h3>${L('Imran S. now has the drawer','الدرج الآن مع عمران س.')}</h3><p>${L('351.00 counted by both at 16:02. Rashid’s part of the day is saved.','عُدّ 351.00 من الطرفين 16:02. حُفظ جزء راشد من اليوم.')}</p><button class="btn" data-go="cb.today">${L('Back to today','العودة لليوم')}</button></div>`;
  return `<div class="grid g2"><div class="card"><div class="eyebrow">${L('From','من')}</div><div class="pp" style="margin-top:6px"><span class="av" aria-hidden="true">${PEOPLE.rashid().slice(0,1)}</span><b>${PEOPLE.rashid()}</b></div></div><div class="card"><div class="eyebrow">${L('To','إلى')}</div><div class="pp" style="margin-top:6px"><span class="av" aria-hidden="true">${PEOPLE.imran().slice(0,1)}</span><b>${PEOPLE.imran()}</b></div></div></div>
   <div class="card" style="margin-top:10px"><div class="recon" role="status"><span>${L('Should be in drawer','يجب أن يكون في الدرج')}</span><b>${$(exp)}</b><span>${L('Counted together','عُدّ معاً')}</span><b>${$(got)}</b><span class="tot">${L('Difference','الفرق')}</span><span class="tot ${got===exp?'var-ok':'var-bad'}">${got===exp?`${ic('check')} ${$(0)}`:sgn(got-exp)}</span></div></div>
   ${v==='diff'?`<div class="banner warn">${ic('alert')}<div class="grow small"><b>${L('10.00 short at handover','نقص 10.00 عند التسليم')}</b>${L('Recount, or both confirm with a reason. The owner sees it in the day report under Rashid’s part.','أعد العدّ أو أكّدا معاً مع السبب. يراه المالك في تقرير اليوم ضمن جزء راشد.')}</div></div><fieldset style="border:0;padding:0;margin:0"><legend class="small strong" style="margin-bottom:6px">${L('Reason','السبب')}</legend><div class="reasons">${[L('Change given wrong','خطأ في الباقي'),L('Expense not written','مصروف لم يُكتب'),L("Don't know",'لا أعرف')].map((r,i)=>`<button class="chip ${i===1?'on':''}" aria-pressed="${i===1}" data-act="noop">${r}</button>`).join('')}</div></fieldset>`:''}
   <label class="field" style="margin-top:12px"><span>${L('Rashid’s PIN','رمز راشد')}</span><input class="inp ltr num" inputmode="numeric" autocomplete="off" value="••••"></label>
   <label class="field"><span>${L('Imran’s PIN','رمز عمران')}</span><input class="inp ltr num" inputmode="numeric" autocomplete="off" value="" aria-describedby="pin2h"><em id="pin2h">${L('Each cashier confirms with their own 4-digit PIN.','كل كاشير يؤكد برمزه المكوّن من 4 أرقام.')}</em></label>
   <button class="btn" data-go="cb.close?sub=count">${ic('cash')} ${L('Count note by note instead','عُدّ فئة فئة بدلاً من ذلك')}</button>`; },
 primary:()=>V('match')==='done'?null:{label:L('Hand over','سلّم'),icon:'swap',act:'v:done',fab:false},
 empty:()=>({icon:'swap',t:L('Only one cashier today','كاشير واحد اليوم'),b:L('Handover is needed only when someone else takes the drawer.','التسليم مطلوب فقط عندما يستلم شخص آخر الدرج.')}),
 error:()=>({t:L("Couldn't save the handover","تعذّر حفظ التسليم"),b:L('Kept on the phone with both confirmations. Try again.','محفوظ على الجوال مع التأكيدين. حاول مجدداً.'),code:'CB-HO'}),
 offline:()=>({msg:L('Offline — handover works; it syncs later.','غير متصل — التسليم يعمل ويُزامن لاحقاً.'),q:false}),
 loadingMsg:()=>L('Working out the drawer…','جارٍ حساب الدرج…'),
 deniedMsg:()=>L('Both people must be cashiers added by the owner.','يجب أن يكون الطرفان كاشيرين أضافهما المالك.'),
 notes:['Splits the day into cashier parts so a shortage belongs to the right person.','Both PINs; a difference needs a reason and shows in the owner report.']});

/* ================= CLOSE THE DAY ================= */
MF.screen({id:'cb.close',role:'cb',studio:'Close the day — count, check, deposit',kind:'form',nav:'cb.close',back:'cb.today',
 title:()=>L('Close the day','إغلاق اليوم'), sub:()=>`${MF.dateG(TODAY)} · 23:30 · ${PEOPLE.imran()}`,
 subs:()=>[['count','1 · Count'],['check','2 · Check'],['deposit','3 · Deposit'],['done','4 · Done']],
 variants:()=>[['match','Counted = expected'],['short','20.00 short'],['over','2.50 over (within tolerance)']],
 render:()=>{ const t=S.sub||'count', v=V('match'); const c=counted(v), e=expected(), d=Math.round((c-e)*100)/100; const need=Math.abs(d)>TOL;
  const order=['count','check','deposit','done']; const cur=order.indexOf(t);
  const steps = `<ol class="cbsteps" style="list-style:none;padding:0" aria-label="${L('Steps','الخطوات')}">${[L('1 Count','1 العدّ'),L('2 Check','2 المطابقة'),L('3 Deposit','3 الإيداع'),L('4 Done','4 تم')].map((l,i)=>`<li><span ${i===cur?'aria-current="step"':''} class="${i<cur?'done':''}">${i<cur?ic('check'):''}${l}</span></li>`).join('')}</ol>`;
  if (t==='count') return steps+`<p class="small muted" style="margin-top:0">${L('Count notes and coins. Only cash — mada, STC Pay and apps are not in the drawer.','عُدّ الأوراق والعملات. النقد فقط — مدى وSTC Pay والتطبيقات ليست في الدرج.')}</p>${denomRows(CNT[v])}<div class="cbhero" style="margin-top:10px"><div class="eyebrow">${L('Counted','المعدود')}</div><div class="big" role="status">${$(c)}</div></div>`;
  if (t==='check') return steps+`<div class="card"><div class="recon" role="status"><span>${L('Opening float','الافتتاحي')}</span><span>${$(EOD.float)}</span><span>+ ${L('Cash sales','مبيعات نقدية')}</span><span>${$(EOD.cash)}</span><span>+ ${L('Tab paid in cash','سداد آجل نقداً')}</span><span>${$(EOD.tabPaid)}</span><span>− ${L('Expenses','مصروفات')}</span><span>${$(expTot())}</span><span>− ${L('Suppliers','موردون')}</span><span>${$(EOD.sup)}</span><span>− ${L('Staff advances','سلف')}</span><span>${$(EOD.adv)}</span><span>− ${L('Owner drawings','سحب المالك')}</span><span>${$(EOD.draw)}</span><span class="tot">${L('Should be in drawer','يجب أن يكون')}</span><span class="tot">${$(e)}</span><span>${L('Counted','المعدود')}</span><b>${$(c)}</b><span class="tot">${L('Difference','الفرق')}</span><span class="tot ${need?'var-bad':'var-ok'}">${d===0?ic('check')+' '+$(0):sgn(d)}</span></div></div>
   ${d===0?`<div class="banner ok">${ic('check')}<div class="grow small"><b>${L('Drawer matches','الدرج مطابق')}</b>${L('Well done.','أحسنت.')}</div></div>`:need?`<div class="banner warn">${ic('alert')}<div class="grow small"><b>${L('20.00 short — more than the 5.00 allowed','نقص 20.00 — أكثر من 5.00 المسموح')}</b>${L('Recount, look for an expense not written, or pick a reason. The owner sees it.','أعد العدّ، ابحث عن مصروف لم يُكتب، أو اختر سبباً. يراه المالك.')}</div></div>
   <fieldset style="border:0;padding:0;margin:0"><legend class="small strong" style="margin-bottom:6px">${L('Reason (required)','السبب (مطلوب)')}</legend><div class="reasons">${[L('Change given wrong','خطأ في الباقي'),L('Expense not written','مصروف لم يُكتب'),L('Sale written twice','بيع مكتوب مرتين'),L("Don't know",'لا أعرف')].map(r=>`<button class="chip" aria-pressed="false" data-act="noop">${r}</button>`).join('')}</div></fieldset><div class="small" role="alert" style="color:var(--bad);margin-top:6px">${ic('alert')} ${L('Pick a reason to continue.','اختر سبباً للمتابعة.')}</div>`:`<div class="banner n">${ic('info')}<div class="grow small"><b>${L('2.50 over — within the 5.00 allowed','زيادة 2.50 — ضمن 5.00 المسموح')}</b>${L('No reason needed. Recorded in the report.','لا حاجة لسبب. يُسجّل في التقرير.')}</div></div>`}`;
  if (t==='deposit') { const dep=c-EOD.leave; return steps+`<div class="grid g2"><div class="card kpi"><div class="eyebrow">${L('Leave for tomorrow','اترك للغد')}</div><div class="v">${$(EOD.leave)}</div><div class="d">${L('Float','رصيد افتتاحي')}</div></div><div class="card kpi"><div class="eyebrow">${L('To deposit','للإيداع')}</div><div class="v">${$(dep)}</div></div></div>
   <label class="field" style="margin-top:12px"><span>${L('How is it deposited?','كيف يُودع؟')}</span><select class="inp"><option>${L('Owner takes it to the bank','المالك يأخذه للبنك')}</option><option>${L('ATM cash deposit','إيداع نقدي بالصراف')}</option><option>${L('Kept in the safe','يبقى في الخزنة')}</option></select></label>
   <div class="card row" style="gap:10px"><span class="grow small">${ic('camera')} ${L('Deposit slip photo (optional, can add tomorrow)','صورة إيصال الإيداع (اختياري، يمكن غداً)')}</span><button class="btn sm" data-act="toast:${L('Camera opens (prototype)','تفتح الكاميرا (نموذج)')}">${ic('camera')} ${L('Take photo','صوّر')}</button></div>
   <div class="card" style="margin-top:10px"><div class="eyebrow">${L('Not in the drawer today','ليست في الدرج اليوم')}</div><div class="recon"><span>${CH.card.t()}</span><span>${$(EOD.card)}</span><span>${CH.stc.t()}</span><span>${$(EOD.stc)}</span><span>${L('Delivery apps (owed)','تطبيقات التوصيل (دين لك)')}</span><span>${$(appsTot())}</span><span>${L('On tab (owed)','آجل (دين لك)')}</span><span>${$(EOD.tab)}</span></div></div>`; }
  return steps+`<div class="state" role="status"><div class="ic" style="background:var(--ok-bg);color:var(--ok)">${ic('lock')}</div><h3>${L('Day closed','أُغلق اليوم')}</h3><p>${L('Fri 13 Nov is saved and locked. Only the owner can change it, with a reason.','حُفظت الجمعة 13 نوفمبر وأُقفلت. المالك فقط يغيّرها مع السبب.')}</p><div class="row wrap" style="gap:8px;justify-content:center"><button class="btn pri" data-go="cb.report?ov=share">${ic('whatsapp')} ${L('Send report to owner','أرسل التقرير للمالك')}</button><button class="btn" data-go="cb.report">${L('See the report','اعرض التقرير')}</button></div></div>`; },
 primary:()=>{ const t=S.sub||'count'; const v=V('match'); const need=Math.abs(counted(v)-expected())>TOL;
  if (t==='count') return {label:L('Next · check','التالي · المطابقة'),icon:'arrow',act:'sub:check',fab:false,sum:`<b>${$(counted(v))}</b>${L('counted','معدود')}`};
  if (t==='check') return {label:need?L('Pick a reason first','اختر سبباً أولاً'):L('Next · deposit','التالي · الإيداع'),icon:'arrow',act:need?'noop':'sub:deposit',disabled:need,fab:false};
  if (t==='deposit') return {label:L('Close the day','أغلق اليوم'),icon:'lock',act:'ov:confirm',fab:false};
  return null; },
 overlays:{confirm:()=>({type:'dialog',title:L('Close Fri 13 Nov?','إغلاق الجمعة 13 نوفمبر؟'),body:L('Counted 897.50 = expected. Deposit 597.50, leave 300.00. After closing, cashiers can’t change this day.','المعدود 897.50 = المتوقع. إيداع 597.50 وترك 300.00. بعد الإغلاق لا يغيّر الكاشير هذا اليوم.'),ok:L('Close the day','أغلق اليوم'),okAct:'sub:done'})},
 empty:()=>({icon:'moon',t:L('The day isn’t open','اليوم غير مفتوح'),b:L('Open the day first.','افتح اليوم أولاً.'),cta:L('Open the day','افتح اليوم'),go:'cb.open'}),
 error:()=>({t:L("Couldn't close the day","تعذّر إغلاق اليوم"),b:L('Your count is safe on the phone. Try again; the report waits.','عدّك محفوظ على الجوال. حاول مجدداً؛ التقرير ينتظر.'),code:'CB-CLOSE'}),
 offline:()=>({msg:L('Offline — you can close the day. The WhatsApp report opens when you’re back online.','غير متصل — يمكنك إغلاق اليوم. يفتح تقرير واتساب عند عودة الاتصال.'),q:false}),
 loadingMsg:()=>L('Adding up the day…','جارٍ جمع اليوم…'),
 deniedMsg:()=>L('Only the owner or the cashier on duty can close the day.','المالك أو الكاشير المناوب فقط يغلق اليوم.'),
 notes:['4 steps: count (notes 500 → coins 0.50) → check (expected vs counted; more than SAR 5 needs a reason, SUGGESTED) → deposit (leave float, deposit, slip photo) → done (locked).','Expected = float + cash sales + tab paid in cash − expenses − supplier cash − advances − owner drawings.','After close: cashier read-only; owner can reopen with a reason (audited).']});

/* ================= DAY REPORT + WhatsApp ================= */
const waText = () => L(
`*Al Nakheel Shawarma — Fri 13 Nov 2026* (sample)
Sales: 5,879.50
• Cash 1,845.00 • mada 2,310.50 • STC Pay 265.00
• Apps 1,339.00 • Tab 120.00
Expenses: 377.50 · Suppliers: 650.00
Advances: 100.00 · Owner: 200.00
Drawer: expected 897.50 · counted 897.50 ✓
Deposit 597.50 · left 300.00
Food cost (7-day est.): 30.6%
Closed 23:30 by Imran S.`,
`*شاورما النخيل — الجمعة 13 نوفمبر 2026* (تجريبي)
المبيعات: 5,879.50
• نقد 1,845.00 • مدى 2,310.50 • STC Pay 265.00
• تطبيقات 1,339.00 • آجل 120.00
المصروفات: 377.50 · الموردون: 650.00
السلف: 100.00 · المالك: 200.00
الدرج: المتوقع 897.50 · المعدود 897.50 ✓
الإيداع 597.50 · المتروك 300.00
تكلفة الطعام (تقدير 7 أيام): 30.6%
أُغلق 23:30 بواسطة عمران س.`);
MF.screen({id:'cb.report',role:'cb',studio:'Day report — channels, expenses, net cash, food cost % · WhatsApp share',kind:'dash',nav:'cb.report',back:'cb.today',
 title:()=>L('Day report','تقرير اليوم'), sub:()=>MF.dateG(TODAY),
 variants:()=>[['closed','Closed day'],['open','Day still open (draft)'],['short','Closed with 20.00 short']],
 render:()=>{ const v=V('closed'); const short=v==='short';
  const pct = a => `${nf1(a/salesTot()*100)}%`;
  const rows = [[CH.cash,EOD.cash],[CH.card,EOD.card],[CH.stc,EOD.stc]].map(([c,a])=>`<tr><td>${ic(c.ic)} ${c.t()}</td><td class="n">${$(a)}</td><td class="n">${pct(a)}</td></tr>`).join('')+APPS.map(([k,en,ar])=>`<tr><td>${ic('bike')} ${L(en,ar)}</td><td class="n">${$(EOD.apps[k])}</td><td class="n">${pct(EOD.apps[k])}</td></tr>`).join('')+`<tr><td>${ic('book')} ${CH.tab.t()}</td><td class="n">${$(EOD.tab)}</td><td class="n">${pct(EOD.tab)}</td></tr><tr><td><b>${L('Total sales','إجمالي المبيعات')}</b></td><td class="n"><b>${$(salesTot())}</b></td><td class="n">100%</td></tr>`;
  const fc=foodPct(); const net=EOD.cash+EOD.tabPaid-expTot()-EOD.sup-EOD.adv-EOD.draw;
  return `${v==='open'?`<div class="banner info">${ic('clock')}<div class="grow small"><b>${L('Draft — the day is still open','مسودة — اليوم ما زال مفتوحاً')}</b>${L('Numbers change until you close the day.','الأرقام تتغيّر حتى تغلق اليوم.')}</div></div>`:''}${short?`<div class="banner warn">${ic('alert')}<div class="grow small"><b>${L('Closed 20.00 short','أُغلق بنقص 20.00')}</b>${L('Reason: “Expense not written” — Imran S., 23:31.','السبب: «مصروف لم يُكتب» — عمران س.، 23:31.')}</div></div>`:''}
   <div class="grid g2"><div class="card kpi"><div class="eyebrow">${L('Sales','المبيعات')}</div><div class="v">${$(salesTot())}</div><div class="d">${L('Thu: 6,925.00','الخميس: 6,925.00')}</div></div><div class="card kpi"><div class="eyebrow">${L('Net cash today','صافي النقد اليوم')}</div><div class="v">${$(short?net-20:net)}</div><div class="d">${L('= deposit','= الإيداع')}</div></div><div class="card kpi"><div class="eyebrow">${L('Money out','الصرف')}</div><div class="v">${$(expTot()+EOD.sup)}</div><div class="d">${L('expenses + suppliers','مصروفات + موردون')}</div></div><div class="card kpi"><div class="eyebrow">${L('Food cost (estimate)','تكلفة الطعام (تقدير)')}</div><div class="v">${nf1(fc)}%</div><div class="d">${L('7 days, incl. MENAFoods','7 أيام، مع ميناء فودز')}</div></div></div>
   <h2 class="h">${L('Sales by how they paid','المبيعات حسب طريقة الدفع')}</h2>${tb([[L('Paid by','الدفع')],[L('Amount','المبلغ'),'n'],['%','n']],[rows])}
   <h2 class="h">${L('Money out','الصرف')}</h2>${tb([[L('What','البند')],[L('Amount','المبلغ'),'n']],[Object.entries(EOD.exp).map(([k,a])=>`<tr><td>${ic(xIc(k))} ${xName(k)}</td><td class="n">${$(a)}</td></tr>`).join('')+`<tr><td>${ic('meat')} ${L('Supplier — butcher (cash)','مورّد — ملحمة (نقد)')}</td><td class="n">${$(EOD.sup)}</td></tr><tr><td>${ic('hand')} ${L('Staff advance (not an expense)','سلفة عامل (ليست مصروفاً)')}</td><td class="n">${$(EOD.adv)}</td></tr><tr><td>${ic('shield')} ${L('Owner drawing (not an expense)','سحب المالك (ليس مصروفاً)')}</td><td class="n">${$(EOD.draw)}</td></tr>`])}
   <h2 class="h">${L('Drawer','الدرج')}</h2><div class="card"><div class="recon"><span>${L('Expected','المتوقع')}</span><span>${$(expected())}</span><span>${L('Counted','المعدود')}</span><span>${$(short?expected()-20:expected())}</span><span class="tot">${L('Difference','الفرق')}</span><span class="tot ${short?'var-bad':'var-ok'}">${short?sgn(-20):ic('check')+' '+$(0)}</span><span>${L('Deposited','أُودع')}</span><span>${$(short?577.5:597.5)}</span><span>${L('Left for tomorrow','للغد')}</span><span>${$(300)}</span></div></div>
   <h2 class="h">${L('Food cost estimate','تقدير تكلفة الطعام')}</h2><div class="card small"><p style="margin:0 0 6px">${L('Last 7 days: MENAFoods invoices','آخر 7 أيام: فواتير ميناء فودز')} <b>${$(FOOD.mf)}</b> + ${L('meat, bread, vegetables from this book','لحم وخبز وخضار من هذا الدفتر')} <b>${$(FOOD.other)}</b> ÷ ${L('sales','المبيعات')} <b>${$(38420)}</b> = <b>${nf1(fc)}%</b></p><p class="muted" style="margin:0">${L('Purchases come in lumps, so we use 7 days, not one day. An estimate — stock on the shelf is not counted.','المشتريات تأتي دفعات، لذا نستخدم 7 أيام لا يوماً واحداً. تقدير — المخزون على الرف غير محسوب.')}</p></div>
   <p class="small muted" style="margin-top:10px">${sample()} ${L('Owed to you: apps 1,339.00 · tab 120.00 —','ديون لك: تطبيقات 1,339.00 · آجل 120.00 —')} <a href="#" data-go="cb.owed">${L('see what’s owed','اعرض الديون')}</a> · <a href="#" data-go="cb.period">${L('week and month','الأسبوع والشهر')}</a></p>${notERP()}`; },
 pane2:()=>`<div class="eyebrow">${L('WhatsApp preview','معاينة واتساب')}</div><div class="wa" style="margin-top:8px">${waText()}</div>`,
 primary:()=>({label:L('Send to owner (WhatsApp)','أرسل للمالك (واتساب)'),icon:'whatsapp',act:'ov:share',fab:false}),
 overlays:{share:()=>({type:'sheet',label:L('Share day report','مشاركة تقرير اليوم'),body:`<h3 style="margin:0 0 6px">${ic('whatsapp')} ${L('Send to Abu Fahad','أرسل إلى أبو فهد')}</h3><p class="small muted" style="margin:0 0 8px">${L('Opens WhatsApp with this message — you press send. Number from Settings:','يفتح واتساب بهذه الرسالة — أنت تضغط إرسال. الرقم من الإعدادات:')} ${MF.ltr('+966 5• ••• ••12')}</p><div class="wa">${waText()}</div>
   <div class="row wrap" style="gap:8px;margin-top:12px"><button class="btn pri" data-act="toast:${L('WhatsApp opens (prototype — nothing sent)','يفتح واتساب (نموذج — لم يُرسل شيء)')}">${ic('whatsapp')} ${L('Open WhatsApp','افتح واتساب')}</button><button class="btn" data-act="toast:${L('PDF ready (sample)','PDF جاهز (تجريبي)')}">${ic('file')} PDF</button></div><p class="small muted">${L('Opening WhatsApp by itself after closing can be turned on in Settings.','يمكن تفعيل فتح واتساب تلقائياً بعد الإغلاق من الإعدادات.')}</p>`})},
 empty:()=>({icon:'chart',t:L('No report yet','لا تقرير بعد'),b:L('Add a sale or expense and the report fills itself.','أضف بيعاً أو مصروفاً ويمتلئ التقرير تلقائياً.')}),
 error:()=>({t:L("Couldn't build the report","تعذّر إعداد التقرير"),b:L('Your entries are safe. Try again.','قيودك محفوظة. حاول مجدداً.'),code:'CB-RPT'}),
 offline:()=>({msg:L('Offline — report from this phone. MENAFoods purchases as of 14:48.','غير متصل — التقرير من الجوال. مشتريات ميناء فودز حتى 14:48.'),q:false}),
 loadingMsg:()=>L('Adding up…','جارٍ الجمع…'),
 deniedMsg:()=>L('Cashiers see their own shift only. The full report is for the owner.','الكاشير يرى ورديته فقط. التقرير الكامل للمالك.'),
 notes:['Sales by channel (each delivery app and tab), money out, advances and owner drawings shown separately (not expenses), drawer reconciliation, deposit.','Food cost % = (MENAFoods invoices auto-linked + meat/bread/veg from the book) ÷ sales, 7-day rolling (estimate).','WhatsApp: opens the user’s own WhatsApp with prefilled text (wa.me link) — the app never sends by itself.']});

/* ================= WEEK / MONTH ================= */
MF.screen({id:'cb.period',role:'cb',studio:'Week / month view',kind:'dash',nav:'cb.report',back:'cb.report',
 title:()=>L('Week & month','الأسبوع والشهر'), sub:()=>SHOP(),
 subs:()=>[['week','This week'],['month','November']],
 render:()=>{ const t=S.sub||'week'; const tabs=MF.tabs([['week',L('This week','هذا الأسبوع')],['month',L('November','نوفمبر')]],t);
  if (t==='week') { const mx=Math.max(...WEEK.map(d=>d[1])); const tot=WEEK.reduce((s,d)=>s+d[1],0); const wd=new Intl.DateTimeFormat(S.lang==='ar'?'ar-SA-u-nu-latn-ca-gregory':'en-GB',{weekday:'short',day:'numeric'});
   return tabs+`<div class="grid g2"><div class="card kpi"><div class="eyebrow">${L('Sales · Sat 7 – Fri 13 Nov','المبيعات · السبت 7 – الجمعة 13 نوفمبر')}</div><div class="v">${$(tot)}</div><div class="d">${L('avg','متوسط')} ${$(tot/7)} / ${L('day','يوم')}</div></div><div class="card kpi"><div class="eyebrow">${L('Food cost (estimate)','تكلفة الطعام (تقدير)')}</div><div class="v">${nf1(foodPct())}%</div><div class="d">${L('MENAFoods','ميناء فودز')} ${$(FOOD.mf)}</div></div></div>
    <h2 class="h">${L('Sales per day','المبيعات يومياً')}</h2><div class="card"><div class="wbars">${WEEK.map(([d,a])=>`<div class="wbar"><span>${wd.format(new Date(d+'T12:00:00+03:00'))}</span><span class="tr" aria-hidden="true"><i style="width:${(a/mx*100).toFixed(1)}%"></i></span><b>${$(a)}</b></div>`).join('')}</div></div>
    <h2 class="h">${L('Drawer each night','الدرج كل ليلة')}</h2>${tb([[L('Day','اليوم')],[L('Difference','الفرق'),'n'],[L('Deposited','أُودع'),'n']],[[['2026-11-07',0,1240],['2026-11-08',-5,780],['2026-11-09',0,690],['2026-11-10',0,705.5],['2026-11-11',2,910],['2026-11-12',0,812],['2026-11-13',0,597.5]].map(([d,x,p])=>`<tr><td>${MF.dateG(d)}</td><td class="n">${x===0?`<span class="tag ok">${ic('check')} 0.00</span>`:`<span class="tag n"><bdi dir="ltr">${x<0?'−':'+'} ${nf2(Math.abs(x))}</bdi></span>`}</td><td class="n">${$(p)}</td></tr>`).join('')])}`; }
  return tabs+`<div class="grid g2"><div class="card kpi"><div class="eyebrow">${L('Sales · 1–13 Nov','المبيعات · 1–13 نوفمبر')}</div><div class="v">${$(71350)}</div></div><div class="card kpi"><div class="eyebrow">${L('Simple profit (estimate)','الربح المبسّط (تقدير)')}</div><div class="v">${$(47139.6)}</div><div class="d">${L('before rent, salaries & app fees','قبل الإيجار والرواتب ورسوم التطبيقات')}</div></div><div class="card kpi"><div class="eyebrow">${L('Food cost','تكلفة الطعام')}</div><div class="v">31.2%</div><div class="d">${L('your target: 32%','هدفك: 32%')}</div></div><div class="card kpi"><div class="eyebrow">${L('Owner drawings','سحب المالك')}</div><div class="v">${$(2400)}</div></div></div>
   <h2 class="h">${L('Where the money went','أين ذهب المال')}</h2>${tb([[L('What','البند')],[L('Amount','المبلغ'),'n'],['%','n']],[[[L('Purchases · MENAFoods','مشتريات · ميناء فودز'),14320.40],[L('Meat, bread, vegetables','لحم وخبز وخضار'),7940],[L('Gas, water, cleaning','غاز وماء وتنظيف'),1310],[L('Transport & maintenance','مواصلات وصيانة'),640],[L('Delivery-app fees','رسوم التطبيقات'),null]].map(([a,b])=>`<tr><td>${a}</td><td class="n">${b===null?`<span class="muted">${L('add from statement','أضف من الكشف')}</span>`:$(b)}</td><td class="n">${b===null?'—':nf1(b/71350*100)+'%'}</td></tr>`).join('')])}
   <p class="small muted">${sample()} ${L('Simple profit = sales − food purchases − daily expenses. Rent, salaries and app fees are subtracted once you enter them.','الربح المبسّط = المبيعات − مشتريات الطعام − المصروفات اليومية. يُخصم الإيجار والرواتب ورسوم التطبيقات عند إدخالها.')}</p>
   <button class="btn" data-act="toast:${L('Excel ready (sample)','Excel جاهز (تجريبي)')}">${ic('file')} ${L('Export month (PDF / Excel)','صدّر الشهر (PDF / Excel)')}</button>`; },
 empty:()=>({icon:'chart',t:L('Not enough days yet','لا أيام كافية بعد'),b:L('After 7 closed days you’ll see the week here.','بعد 7 أيام مغلقة سترى الأسبوع هنا.')}),
 error:()=>({t:L("Couldn't load the week","تعذّر تحميل الأسبوع"),b:L('Today still works. Try again.','اليوم يعمل. حاول مجدداً.'),code:'CB-WK'}),
 offline:()=>({msg:L('Offline — showing days saved on this phone.','غير متصل — الأيام المحفوظة على الجوال.'),q:false}),
 loadingMsg:()=>L('Loading week…','جارٍ تحميل الأسبوع…'),
 deniedMsg:()=>L('Week and month totals are for the owner.','مجاميع الأسبوع والشهر للمالك.'),
 notes:['Week: sales per day (bar + number), food cost estimate, nightly difference and deposit.','Month: sales, simple profit (labelled estimate, before rent/salaries/app fees), food cost vs owner target, owner drawings, export.']});

/* ================= OWED TO YOU — delivery apps + tabs ================= */
MF.screen({id:'cb.owed',role:'cb',studio:'Owed to you — delivery-app settlements + tab customers',kind:'list',nav:'cb.report',back:'cb.today',
 title:()=>L('Owed to you','ديون لك'), sub:()=>L('Apps and tab customers','التطبيقات وعملاء الآجل'),
 subs:()=>[['apps','Delivery apps'],['tabs','Tab customers']],
 render:()=>{ const t=S.sub||'apps'; const tabs=MF.tabs([['apps',L('Delivery apps','تطبيقات التوصيل')],['tabs',L('Tab customers','عملاء الآجل')]],t);
  if (t==='apps') { const A=[['hs',3840,'2026-11-10'],['jz',2215,'2026-11-09'],['kt',940,'2026-11-11'],['tc',310,'2026-11-02'],['ty',505,'2026-11-08']];
   return tabs+`<div class="cbhero"><div class="eyebrow">${L('Sales not settled yet (before app fees)','مبيعات لم تُسوَّ بعد (قبل رسوم التطبيق)')}</div><div class="big">${$(A.reduce((s,a)=>s+a[1],0))}</div></div><div class="list" style="margin-top:10px">${A.map(([k,a,d])=>`<div class="li" data-act="ov:settle"><span class="av" aria-hidden="true" style="background:var(--ch-app-bg);color:var(--ch-app-fg)">${ic('bike')}</span><div class="grow"><div class="t">${appName(k)}</div><div class="s">${L('Since last settlement','منذ آخر تسوية')} ${MF.dateG(d)}</div></div><div class="end"><b>${$(a)}</b></div></div>`).join('')}</div>
    <p class="small muted" style="margin-top:8px">${sample()} ${L('Fees differ by app and contract — we don’t guess them. When the money reaches your bank, record it; the difference is saved as app fees.','الرسوم تختلف حسب التطبيق والعقد — لا نخمّنها. عند وصول المال لحسابك سجّله؛ يُحفظ الفرق كرسوم تطبيق.')}</p>`; }
  return tabs+`<div class="list">${[[L('Al Noor Workshop','ورشة النور'),340,500,L('Last paid 80.00 today','آخر سداد 80.00 اليوم')],[L("Saeed's Garage","كراج سعيد"),185,300,L('12 days','12 يوماً')],[L('Building guard Ali','حارس العمارة علي'),62,100,L('3 days','3 أيام')]].map(([n,b,lim,s])=>`<div class="li" style="cursor:default"><span class="av" aria-hidden="true" style="background:var(--ch-tab-bg);color:var(--ch-tab-fg)">${ic('book')}</span><div class="grow"><div class="t">${n}</div><div class="s">${s} · ${L('limit','الحد')} ${nf2(lim)}</div></div><div class="end"><b>${$(b)}</b><br><button class="btn sm" data-act="ov:paid" aria-label="${L('Got paid','استلمت')} — ${n}">${L('Got paid','استلمت')}</button></div></div>`).join('')}</div>
   <p class="small muted" style="margin-top:8px">${sample()} ${L('Cash received from a tab goes into the drawer and the day’s cash count.','النقد المستلم من الآجل يدخل الدرج وعدّ اليوم.')}</p>`; },
 overlays:{settle:()=>({type:'sheet',label:L('Record settlement','سجّل التسوية'),body:`<h3 style="margin:0 0 6px">${appName('hs')}</h3><p class="small muted" style="margin:0 0 8px">${L('Sales since 10 Nov: 3,840.00','المبيعات منذ 10 نوفمبر: 3,840.00')}</p>${amtBox('setamt','3264',{mic:false,label:L('Received in bank','المستلم في البنك')})}<div class="card" style="margin-top:10px"><div class="recon"><span>${L('Sales','المبيعات')}</span><span>${$(3840)}</span><span>${L('Received','المستلم')}</span><span>${$(3264)}</span><span class="tot">${L('App fees (difference)','رسوم التطبيق (الفرق)')}</span><span class="tot">${$(576)}</span></div></div><p class="small muted">${sample()} ${L('Values are samples; take them from your app statement.','القيم تجريبية؛ خذها من كشف التطبيق.')}</p><button class="btn pri block" data-act="toast:${L('Settlement saved','حُفظت التسوية')}">${L('Save settlement','احفظ التسوية')}</button>`}),
  paid:()=>({type:'sheet',label:L('Tab payment','سداد آجل'),body:`<h3 style="margin:0 0 8px">${L('Al Noor Workshop paid','ورشة النور سدّدت')}</h3>${amtBox('tabamt','100',{mic:false})}<label class="field" style="margin-top:10px"><span>${L('Paid by','طريقة الدفع')}</span><select class="inp"><option>${L('Cash (into drawer)','نقد (للدرج)')}</option><option>mada</option><option>STC Pay</option></select></label><button class="btn pri block" data-act="toast:${L('Saved','حُفظ')}">${L('Save','احفظ')}</button>`})},
 empty:()=>({icon:'book',t:L('Nobody owes you','لا أحد مدين لك'),b:L('App sales and tab sales show here until they’re paid.','مبيعات التطبيقات والآجل تظهر هنا حتى تُدفع.')}),
 error:()=>({t:L("Couldn't load what’s owed","تعذّر تحميل الديون"),b:L('Try again.','حاول مجدداً.'),code:'CB-OWED'}),
 offline:()=>({msg:L('Offline — showing saved balances.','غير متصل — الأرصدة المحفوظة.'),q:false}),
 loadingMsg:()=>L('Loading…','جارٍ التحميل…'),
 deniedMsg:()=>L('Owner only.','للمالك فقط.'),
 notes:['Delivery apps as receivables: gross sales since last settlement; the settlement entry derives fees from the difference — no invented commission rates.','Tab customers with a limit set by the owner; cash repayment goes into the drawer.']});

/* ================= CHANGES LOG (audit) ================= */
MF.screen({id:'cb.history',role:'cb',studio:'Changes log — undo / edit / cancel audit trail + permissions',kind:'list',nav:'cb.today',back:'cb.today',
 title:()=>L('Changes log','سجل التعديلات'), sub:()=>L('Nothing disappears','لا شيء يختفي'),
 subs:()=>[['all','All'],['closed','Closed days']],
 variants:()=>[['owner','Owner'],['cashier','Cashier']],
 render:()=>{ const t=S.sub||'all', who=V('owner'); const tabs=MF.tabs([['all',L('All changes','كل التعديلات')],['closed',L('Closed days','أيام مغلقة')]],t);
  const E=[['14:22',L('Today','اليوم'),'pen',L('Cash sales 13:00: 438.00 → 538.00','مبيعات نقدية 13:00: 438.00 ← 538.00'),L('“typed wrong”','«خطأ كتابة»'),PEOPLE.rashid(),0],['13:31',L('Today','اليوم'),'return',L('Undo: bread 60.00 saved twice','تراجع: خبز 60.00 حُفظ مرتين'),L('within 10 s','خلال 10 ثوانٍ'),PEOPLE.rashid(),0],['09:05',L('Today','اليوم'),'x',L('Cancelled: mada 54.00 (customer refund)','إلغاء: مدى 54.00 (استرجاع للعميل)'),L('“refund”','«استرجاع»'),PEOPLE.owner(),0],['10:12',L('Thu 12 Nov · closed','الخميس 12 نوفمبر · مُغلق'),'lock',L('Cleaning 35.00 → 38.50','تنظيف 35.00 ← 38.50'),L('“receipt found”','«وُجد الإيصال»'),PEOPLE.owner(),1]];
  const list=E.filter(e=>t==='all'||e[6]);
  const yes=`${ic('check')} ${L('Yes','نعم')}`, no=`${ic('x')} ${L('No','لا')}`;
  return tabs+`<div class="list">${list.map(([tm,d,icn,w,why,by])=>`<div class="li" style="cursor:default">${ic(icn)}<div class="grow"><div class="t">${w}</div><div class="s">${d} · ${T(tm)} · ${by} · ${L('reason','السبب')} ${why}</div></div></div>`).join('')}</div>
   <h2 class="h">${L('Who can do what','من يفعل ماذا')}</h2>${tb([[L('Action','الإجراء')],[L('Cashier','الكاشير')],[L('Owner','المالك')]],[[[L('Add lines','إضافة سطور'),1,1],[L('Undo right after saving','تراجع فور الحفظ'),1,1],[L('Correct own line today (reason)','تصحيح سطره اليوم (سبب)'),1,1],[L('Cancel a line (stays struck through)','إلغاء سطر (يبقى مشطوباً)'),0,1],[L('Change a closed day (reason)','تعديل يوم مُغلق (سبب)'),0,1],[L('Owner drawings','سحب المالك'),0,1],[L('Delete for good','حذف نهائي'),0,0]].map(([a,c,o])=>`<tr><td>${a}</td><td>${c?yes:no}</td><td>${o?yes:no}</td></tr>`).join('')])}
   <p class="small muted">${L('Nobody deletes for good — not even the owner. Cancelled lines stay visible, struck through, with who and why.','لا أحد يحذف نهائياً — ولا المالك. السطور الملغاة تبقى ظاهرة مشطوبة مع من ولماذا.')}</p>
   ${who==='cashier'?`<p class="lockline">${ic('lock')} ${L('You see your own changes and the owner’s changes to your lines.','ترى تعديلاتك وتعديلات المالك على سطورك.')}</p>`:''}`; },
 empty:()=>({icon:'history',t:L('No changes','لا تعديلات'),b:L('Edits, undos and cancellations show here with who and why.','التعديلات والتراجع والإلغاء تظهر هنا مع من ولماذا.')}),
 error:()=>({t:L("Couldn't load the log","تعذّر تحميل السجل"),b:L('Try again.','حاول مجدداً.'),code:'CB-LOG'}),
 offline:()=>({msg:L('Offline — log from this phone.','غير متصل — السجل من الجوال.'),q:false}),
 loadingMsg:()=>L('Loading log…','جارٍ تحميل السجل…'),
 deniedMsg:()=>L('Ask the owner.','اسأل المالك.'),
 notes:['Append-only audit: undo right after saving; corrections need a reason; cancellations stay visible struck through; nobody hard-deletes.','Closed days: owner only, reason required, corrected report re-shared.']});

/* ================= SETTINGS (owner) ================= */
const sw = (lab,on,hint) => `<label class="row between" style="gap:10px;padding:10px 0;border-bottom:1px solid var(--line);min-height:48px"><span class="grow"><span class="strong">${lab}</span>${hint?`<br><span class="small muted">${hint}</span>`:''}</span><input type="checkbox" role="switch" ${on?'checked':''} style="width:24px;height:24px"></label>`;
MF.screen({id:'cb.settings',role:'cb',studio:'Settings — people & PINs, buttons, WhatsApp, picture mode',kind:'form',nav:'cb.today',back:'cb.today',
 title:()=>L('Cash book settings','إعدادات الدفتر'), sub:()=>L('Owner only','للمالك فقط'),
 subs:()=>[['people','People'],['buttons','Buttons & channels'],['report','Report & day']],
 render:()=>{ const t=S.sub||'people'; const tabs=MF.tabs([['people',L('People','الأشخاص')],['buttons',L('Buttons','الأزرار')],['report',L('Report & day','التقرير واليوم')]],t);
  if (t==='people') return tabs+`<div class="list">${[['owner',L('Owner','المالك'),L('Full access','صلاحية كاملة')],['rashid',L('Cashier · morning','كاشير · صباحي'),L('PIN set · last used 15:10','الرمز مُعيّن · آخر استخدام 15:10')],['imran',L('Cashier · evening','كاشير · مسائي'),L('PIN set','الرمز مُعيّن')]].map(([p,r,s])=>`<div class="li" style="cursor:default"><span class="av" aria-hidden="true">${PEOPLE[p]().slice(0,1)}</span><div class="grow"><div class="t">${PEOPLE[p]()}</div><div class="s">${r} · ${s}</div></div><button class="btn sm" data-act="toast:${L('PIN reset (prototype)','أُعيد تعيين الرمز (نموذج)')}" aria-label="${L('Reset PIN','أعد تعيين الرمز')} — ${PEOPLE[p]()}">${L('Reset PIN','أعد تعيين الرمز')}</button></div>`).join('')}</div><button class="btn" style="margin-top:10px" data-act="toast:${L('Invite link ready (prototype)','رابط الدعوة جاهز (نموذج)')}">${ic('plus')} ${L('Add cashier','أضف كاشير')}</button>
   <div class="card" style="margin-top:12px">${sw(L('Picture mode','وضع الصور'),true,L('Bigger pictures and fewer words — helps staff who read little Arabic or English. Numbers are always Western digits.','صور أكبر وكلمات أقل — يساعد العمال قليلي القراءة بالعربية أو الإنجليزية. الأرقام دائماً غربية.'))}${sw(L('Sound when saved','صوت عند الحفظ'),true)}${sw(L('Cashiers can pay suppliers','الكاشير يدفع للموردين'),true)}${sw(L('Lock the counter after 2 minutes','اقفل الكاشير بعد دقيقتين'),true,L('PIN to unlock','بالرمز لفتحه'))}</div>`;
  if (t==='buttons') return tabs+`<h2 class="h" style="margin-top:0">${L('Payment buttons','أزرار الدفع')}</h2><div class="card">${Object.values(CH).map(c=>sw(`${ic(c.ic)} ${c.t()}`,true)).join('')}</div><h2 class="h">${L('Delivery apps you use','تطبيقات التوصيل التي تستخدمها')}</h2><div class="card">${APPS.map(([k,en,ar],i)=>sw(L(en,ar),i!==3)).join('')}</div><h2 class="h">${L('Expense buttons','أزرار المصروفات')}</h2><div class="card">${XCAT.map(([k,icn,tt])=>sw(`${ic(icn)} ${tt()}`,k!=='rent')).join('')}</div>`;
  return tabs+`<div class="card">${sw(L('Open WhatsApp report after closing','افتح تقرير واتساب بعد الإغلاق'),false,L('Off: the cashier taps “Send”. On: WhatsApp opens by itself after closing; someone still presses send.','مُعطّل: الكاشير يضغط «أرسل». مُفعّل: يفتح واتساب تلقائياً بعد الإغلاق؛ ويضغط أحدهم إرسال.'))}<label class="field" style="margin-top:10px"><span>${L('Owner WhatsApp number','رقم واتساب المالك')}</span><input class="inp ltr num" inputmode="tel" autocomplete="tel" value="+966 5• ••• ••12"></label><label class="field"><span>${L('Usual opening float','الرصيد الافتتاحي المعتاد')}</span><input class="inp ltr num" inputmode="decimal" value="300.00"></label><label class="field"><span>${L('Allowed difference at close','الفرق المسموح عند الإغلاق')}</span><input class="inp ltr num" inputmode="decimal" value="5.00" aria-describedby="tolh"><em id="tolh">${L('Above this, a reason is required.','فوق ذلك يُطلب سبب.')}</em></label><label class="field"><span>${L('Remind to close the day at','ذكّر بإغلاق اليوم عند')}</span><input class="inp ltr num" value="23:30"></label><label class="field"><span>${L('Food cost target','هدف تكلفة الطعام')}</span><input class="inp ltr num" inputmode="decimal" value="32%"></label></div>
   <div class="card" style="margin-top:10px"><div class="row between wrap" style="gap:6px"><span class="strong">${L('Plan','الخطة')}</span>${MF.tierChip?MF.tierChip('premium'):''}</div><p class="small" style="margin:6px 0">${L('Cash book is part of Books — Premium paid add-on (30-day trial), included in Ultra Premium.','دفتر الصندوق جزء من الدفاتر — إضافة مدفوعة للمميّز (تجربة 30 يوماً)، ومشمول في فائق التميّز.')}</p><div class="row wrap" style="gap:8px">${price()}<button class="btn sm" data-go="cb.plans">${L('See plans','اعرض الخطط')}</button></div></div>`; },
 primary:()=>({label:L('Save settings','احفظ الإعدادات'),icon:'check',act:`toast:${L('Saved','حُفظ')}`,fab:false}),
 empty:()=>({icon:'users',t:L('Just you so far','أنت فقط حتى الآن'),b:L('Add a cashier so they can use the book with their own PIN.','أضف كاشير ليستخدم الدفتر برمزه.'),cta:L('Add cashier','أضف كاشير')}),
 error:()=>({t:L("Couldn't load settings","تعذّر تحميل الإعدادات"),b:L('Try again.','حاول مجدداً.'),code:'CB-SET'}),
 offline:()=>({msg:L('Offline — settings change when you’re back online.','غير متصل — تتغيّر الإعدادات عند عودة الاتصال.'),q:false}),
 loadingMsg:()=>L('Loading settings…','جارٍ تحميل الإعدادات…'),
 deniedMsg:()=>L('Only the owner can change cash book settings.','المالك فقط يغيّر إعدادات الدفتر.'),
 notes:['Owner adds cashiers with 4-digit PINs (one shared phone or tablet is common). Roles: owner / cashier.','Picture mode: bigger icons, fewer words, sound on save — for staff with low Arabic/English literacy (no extra languages added).','Buttons: hide unused channels/apps/expense buttons. Report: auto-open WhatsApp off by default; float, tolerance (5.00 SUGGESTED), close reminder, food cost target.']});

/* ================= PLANS / PAYWALL ================= */
MF.screen({id:'cb.plans',role:'cb',studio:'Cash book access — trial / paid add-on / included',kind:'detail',nav:'cb.today',back:'cb.today',
 title:()=>L('Daily cash book','دفتر الصندوق اليومي'), sub:()=>L('Part of Books','جزء من الدفاتر'),
 variants:()=>[['locked','Normal / Basic — 14-day trial'],['premium','Premium — paid add-on, 30-day trial'],['ultra','Ultra Premium — included'],['ended','Trial ended (read-only)']],
 render:()=>{ const v=V('locked');
  const what = `<ul class="small" style="margin:8px 0;padding-inline-start:18px;line-height:1.7"><li>${L('Open the day, count the drawer, close on one screen','افتح اليوم وعُدّ الدرج وأغلق بشاشة واحدة')}</li><li>${L('Sales by cash, mada, STC Pay, apps and tab','المبيعات نقداً ومدى وSTC Pay والتطبيقات والآجل')}</li><li>${L('Picture buttons for daily expenses, photo optional','أزرار مصوّرة للمصروفات اليومية، الصورة اختيارية')}</li><li>${L('MENAFoods invoices linked by themselves','فواتير ميناء فودز مربوطة تلقائياً')}</li><li>${L('Day report to the owner on WhatsApp','تقرير اليوم للمالك عبر واتساب')}</li><li>${L('Works without internet','يعمل بدون إنترنت')}</li></ul>`;
  const head = `<div class="paywall card"><div class="row between wrap" style="gap:6px"><b>${L('Daily cash book','دفتر الصندوق اليومي')}</b>${MF.badge2?MF.badge2('paid'):''}</div>${what}<div class="row wrap" style="gap:8px">${price()} ${sugg()}</div></div>`;
  if (v==='ultra') return `<div class="banner ok">${ic('check')}<div class="grow small"><b>${L('Included in your Ultra Premium tier','مشمول في فئتك فائق التميّز')}</b>${L('Nothing to pay.','لا شيء للدفع.')}</div></div>${head}`;
  if (v==='premium') return `<div class="banner info">${ic('star')}<div class="grow small"><b>${L('Premium · paid add-on','مميّز · إضافة مدفوعة')}</b>${L('Try 30 days free. No automatic charge — you choose to continue; billed on your MENAFoods statement.','جرّب 30 يوماً مجاناً. بلا خصم تلقائي — أنت تختار الاستمرار؛ يُفوتر على كشف ميناء فودز.')}</div></div>${head}`;
  if (v==='ended') return `<div class="banner warn">${ic('lock')}<div class="grow small"><b>${L('Trial ended — read-only for 90 days','انتهت التجربة — للقراءة 90 يوماً')}</b>${L('Your pages and reports stay yours; export them any time.','صفحاتك وتقاريرك تبقى لك؛ صدّرها متى شئت.')}</div></div>${head}<button class="btn" style="margin-top:10px" data-act="toast:${L('Export ready (sample)','التصدير جاهز (تجريبي)')}">${ic('file')} ${L('Export all (PDF / Excel)','صدّر الكل (PDF / Excel)')}</button>`;
  return `<div class="banner n"><div class="grow small">${MF.tierChip?MF.tierChip('normal'):''} <b>${L('For Premium and Ultra Premium customers','لعملاء المميّز وفائق التميّز')}</b>${L('You can try it free for 14 days.','يمكنك تجربته مجاناً 14 يوماً.')}</div></div>${head}<p class="small muted">${L('Free for everyone: one daily sales total (helps your forecast).','مجاني للجميع: إجمالي مبيعات يومي واحد (يحسّن توقعك).')}</p>`; },
 primary:()=>{ const v=V('locked'); if (v==='ultra') return {label:L('Open cash book','افتح الدفتر'),icon:'book',go:'cb.today',fab:false}; if (v==='ended') return {label:L('Continue (price to set)','استمر (السعر يُحدَّد لاحقاً)'),icon:'star',act:`toast:${L('Request sent to your salesperson (prototype)','أُرسل الطلب لمندوبك (نموذج)')}`,fab:false}; return {label:v==='premium'?L('Start 30-day trial','ابدأ تجربة 30 يوماً'):L('Start 14-day trial','ابدأ تجربة 14 يوماً'),icon:'clock',go:'cb.open',fab:false}; },
 empty:()=>({icon:'book',t:L('Cash book','دفتر الصندوق'),b:L('Not available for this account.','غير متاح لهذا الحساب.')}),
 error:()=>({t:L("Couldn't check your plan","تعذّر التحقق من خطتك"),b:L('Try again.','حاول مجدداً.'),code:'CB-PLAN'}),
 offline:()=>({msg:L('Offline — start the trial when you’re back online.','غير متصل — ابدأ التجربة عند عودة الاتصال.'),q:false}),
 loadingMsg:()=>L('Checking your plan…','جارٍ التحقق من خطتك…'),
 deniedMsg:()=>L('Only the account owner can start a trial or a plan.','مالك الحساب فقط يبدأ التجربة أو الخطة.'),
 notes:['Same SUGGESTED access as Books: Ultra included; Premium paid add-on + 30-day trial; Basic/Normal 14-day trial then upsell; read-only 90 days after the end.','Price: "Price to set" — no invented prices.']});

/* ================= COUNTER MODE (tablet at the counter) ================= */
MF.screen({id:'cb.counter',role:'cb',studio:'Counter mode — tablet on the counter (keypad + today)',kind:'form',nav:'cb.sale',back:'cb.today',
 title:()=>L('Counter mode','وضع الكاشير'), sub:()=>`${SHOP()} · ${PEOPLE.rashid()}`,
 variants:()=>[['cash','Cash selected'],['app','Delivery app selected'],['locked','Locked (PIN to unlock)']],
 render:()=>{ const v=V('cash');
  if (v==='locked') return `<div class="state" role="status"><div class="ic">${ic('lock')}</div><h3>${L('Counter locked','الكاشير مقفل')}</h3><p>${L('Enter your 4-digit PIN to continue.','أدخل رمزك من 4 أرقام للمتابعة.')}</p></div><label class="field" style="max-width:280px;margin:0 auto 8px"><span>${L('PIN','الرمز')}</span><input class="inp ltr num" inputmode="numeric" autocomplete="off" value=""></label><div style="max-width:360px;margin:0 auto">${keypad()}</div>`;
  return `<div class="counter"><div>${amtBox('ctramt',v==='app'?'86':'45')}${keypad()}${chButtons(v)}${v==='app'?`<div class="apppick">${APPS.map(([a,en,ar],i)=>`<button class="chip ${i===1?'on':''}" aria-pressed="${i===1}" data-act="noop">${L(en,ar)}</button>`).join('')}</div>`:''}<button class="btn pri block" style="margin-top:10px;min-height:56px;font-size:17px" data-act="toast:${L('Saved','حُفظ')}">${ic('check')} ${L('Save sale','احفظ البيع')}</button></div>
   <div><div class="cbhero"><div class="eyebrow">${L('In the drawer now (expected)','في الدرج الآن (المتوقع)')}</div><div class="big">${$(drawerNow())}</div></div><div class="qgrid"><button class="qtile out" data-go="cb.expense">${ic('out')}<span>${L('Expense','مصروف')}</span></button><button class="qtile n" data-go="cb.handover">${ic('swap')}<span>${L('Hand over','تسليم')}</span></button></div>${notebook(LEDGER().slice().reverse().slice(0,7), L('Latest lines','آخر السطور'))}</div></div>`; },
 overlays:{voice:voiceSheet, entry:entrySheet},
 empty:()=>({icon:'grid',t:L('Counter mode','وضع الكاشير'),b:L('Open the day first.','افتح اليوم أولاً.'),cta:L('Open the day','افتح اليوم'),go:'cb.open'}),
 error:()=>({t:L("Couldn't start counter mode","تعذّر بدء وضع الكاشير"),b:L('Use the phone screens meanwhile — same data.','استخدم شاشات الجوال مؤقتاً — نفس البيانات.'),code:'CB-CTR'}),
 offline:()=>({msg:L('Offline — the counter keeps working and syncs later.','غير متصل — الكاشير يعمل ويُزامن لاحقاً.'),q:false}),
 loadingMsg:()=>L('Starting counter mode…','جارٍ بدء وضع الكاشير…'),
 deniedMsg:()=>L('Only cashiers added by the owner can use the counter.','فقط الكاشيرون المضافون من المالك يستخدمون الكاشير.'),
 notes:['Tablet (834 / 1194): keypad with 72 px keys + payment buttons on one side, drawer + latest lines on the other. Locks after 2 min idle; PIN to unlock (SUGGESTED).','On a phone the two columns stack.']});

/* ================= Entry points ================= */
const booksR = MF.screens['h.books'] && MF.screens['h.books'].render;
if (booksR) MF.patch('h.books',{render:()=>{ const strip=`<div class="banner info" style="margin-top:0">${ic('book')}<div class="grow small"><b>${L('Small restaurant? Try the daily cash book','مطعم صغير؟ جرّب دفتر الصندوق اليومي')}</b>${L('A faster version of the paper notebook — big buttons, works offline.','نسخة أسرع من الدفتر الورقي — أزرار كبيرة ويعمل بدون إنترنت.')}</div><button class="btn sm" data-go="cb.today">${L('Open','افتح')}</button></div>`; return strip+booksR(); }});
if (MF.screens['h.books']) MF.screens['h.books'].notes = (MF.screens['h.books'].notes||[]).concat(['NEW: link to the Daily cash book (small-restaurant variant of Books).']);
})();
