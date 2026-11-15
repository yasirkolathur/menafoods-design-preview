/* MENAFoods Business Hub (Mini ERP 2.0) — shared helpers, sample data and components.
   SAMPLE DATA ONLY — fictional business, people, suppliers, invoices and amounts. Never real prices, stock or customers.
   Light by design: no inventory valuation, no payroll, no general ledger. Values marked "Suggested" are open for the owner. */
(function(){
const MF=window.MF, S=MF.S, L=MF.L, ic=MF.ic;
const nf2=new Intl.NumberFormat('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}), nf0=new Intl.NumberFormat('en-US'), nf1=new Intl.NumberFormat('en-US',{minimumFractionDigits:1,maximumFractionDigits:1});
MF.nm = o => S.lang==='ar' ? (o.ar||o.en) : (o.en||o.ar);
MF.kpi = (a,b,c) => `<div class="card kpi"><div class="eyebrow">${a}</div><div class="v">${b}</div>${c?`<div class="d">${c}</div>`:''}</div>`;
MF.tb = (heads, rows, cap) => `<div class="tbwrap" role="region" tabindex="0" aria-label="${cap||L('Table','جدول')}"><table class="tb">${cap?`<caption class="sr">${cap}</caption>`:''}<thead><tr>${heads.map(h=>`<th scope="col" class="${h[1]||''}">${h[0]}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
MF.tabs = (arr, cur, label) => `<div class="chips bhtabs" role="tablist" aria-label="${label||L('Sections','الأقسام')}">${arr.map(([k,v])=>`<button class="chip ${k===cur?'on':''}" role="tab" aria-selected="${k===cur}" data-act="sub:${k}">${v}</button>`).join('')}</div>`;
MF.badge = k => k==='notimpl' ? `<span class="mfbadge notimpl">${ic('alert')} ${L('Integration simulated — prototype','الربط محاكاة — نموذج أولي')}</span>` : k==='decided' ? `<span class="mfbadge decided">${ic('check')} ${L('Owner decision','قرار المالك')}</span>` : `<span class="mfbadge sample">${L('Sample values','قيم تجريبية')}</span>`;
MF.badge2 = k => ({suggest:`<span class="mfbadge suggest">${ic('info')} ${L('Suggested','مقترح')}</span>`, price:`<span class="mfbadge price">${ic('info')} ${L('Price to set','السعر يُحدَّد لاحقاً')}</span>`, staff:`<span class="mfbadge staff">${ic('lock')} ${L('Staff only — never shown to the customer','للموظفين فقط — لا يظهر للعميل')}</span>`, paid:`<span class="mfbadge paid">${ic('star')} ${L('Small ERP · paid plan','نظام ERP الصغير · خطة مدفوعة')}</span>`, phase1:`<span class="mfbadge phase">${ic('layers')} ${L('Rewards & Earn · Phase 1 · separate module','المكافآت والربح · المرحلة 1 · وحدة مستقلة')}</span>`, sponsored:`<span class="mfbadge sponsored">${L('Sponsored / إعلان','Sponsored / إعلان')}</span>`, free:`<span class="mfbadge free">${ic('check')} ${L('Free mini ERP','نظام ERP المصغّر المجاني')}</span>`}[k]);
MF.tierName = k => ({basic:L('Basic','أساسي'),normal:L('Normal','عادي'),premium:L('Premium','مميّز'),ultra:L('Ultra Premium','فائق التميّز')}[k]);
MF.tierChip = k => `<span class="tierchip ${k}">${ic('star')} ${MF.tierName(k)}</span>`;
MF.V = d => S.variant || d;
MF.SUB = d => S.sub || d;
MF.n0 = n => `<span class="num">${nf0.format(Math.round(n))}</span>`;
MF.n1 = n => nf1.format(n);
MF.f2 = n => nf2.format(n);
MF.T = t => `<bdi dir="ltr" class="num">${t}</bdi>`;
MF.sgn = n => `<bdi dir="ltr" class="nowrap">${n<0?'−&nbsp;':n>0?'+&nbsp;':''}${MF.money(Math.abs(n))}</bdi>`;
MF.h2 = (t, extra='') => `<div class="bh-h2"><h2 class="h">${t}</h2>${extra}</div>`;

/* ---------- extra icons (language-free; always paired with a word) ---------- */
Object.assign(MF.IP, {
 card:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
 stc:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 18.5h4M14.5 8.2c-.4-.8-1.3-1.2-2.5-1.2-1.4 0-2.5.6-2.5 1.6 0 2.2 5 1.2 5 3.4 0 1-1.1 1.7-2.5 1.7-1.2 0-2.1-.4-2.5-1.2"/>',
 bike:'<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M5.5 17 9 10h5l4.5 7M14 10l-1.5-3.5H10M11 14H7"/><rect x="14" y="3.5" width="6" height="4.5" rx="1"/>',
 book:'<path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2z"/><path d="M5 19a2 2 0 0 1 2-2h12M9 7h6M9 11h4"/>',
 receipt:'<path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
 swap:'<path d="M4 8h14l-3-3M20 16H6l3 3"/>', bank:'<path d="M3 9 12 4l9 5M4 9h16M6 9v8M10 9v8M14 9v8M18 9v8M3 20h18"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>', hand:'<path d="M3 14h3l4 3h5a2 2 0 0 0 0-4h-4M6 14v6H3M14 13l4.5-2.5a2 2 0 0 1 2 3.5L15 18"/><circle cx="15" cy="6" r="3"/>',
 out:'<path d="M12 4v16M5 13l7 7 7-7"/>', inn:'<path d="M12 20V4M5 11l7-7 7 7"/>', building:'<path d="M4 21V5l8-2v18M12 8h8v13M2 21h20M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', eyeoff:'<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.7M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1.1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
 plug:'<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5"/>', repeat:'<path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/>',
 calc:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 14.5h.01M12 14.5h.01M16 14.5h.01M8 18h.01M12 18h4"/>',
 download:'<path d="M12 4v12M6 10l6 6 6-6M4 20h16"/>', layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>', key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M14 9l2 2"/>'
});

/* ---------- sample business (fictional) ---------- */
MF.TODAY = '2026-11-14';
MF.B = {
 biz:()=>L('Fig Leaf Kitchen (sample)','مطعم ورقة التين (تجريبي)'), code:'C-0412',
 br:{olaya:()=>L('Olaya branch','فرع العليا'), malqa:()=>L('Al Malqa branch','فرع الملقا')},
 tier:'premium',
 ppl:{owner:()=>L('Nasser H. (owner)','ناصر ح. (المالك)'), mgr:()=>L('Reem S. (branch manager)','ريم س. (مديرة فرع)'), buyer:()=>L('Hala A. (buyer)','هالة ع. (مشترية)'), cashier:()=>L('Rashid K. (cashier)','راشد ك. (كاشير)'), cashier2:()=>L('Imran S. (cashier)','عمران س. (كاشير)'), sales:()=>L('Yousef M. (salesperson)','يوسف م. (مندوب)'), acct:()=>L('Lina F. (accountant)','لينا ف. (محاسبة)'), admin:()=>L('Omar T. (manager)','عمر ت. (مدير)')}
};
MF.SUP = [ // spend this month (1–14 Nov), excl. VAT where the invoice shows VAT
 {k:'mf', n:()=>L('MENAFoods','ميناء فودز'), amt:27340, auto:true},
 {k:'hamra', n:()=>L('Al Hamra Butcher (sample)','ملحمة الحمراء (تجريبي)'), amt:6480},
 {k:'green', n:()=>L('Green Valley Veg (sample)','خضار الوادي الأخضر (تجريبي)'), amt:3240},
 {k:'reef', n:()=>L('Al Reef Bakery (sample)','مخبز الريف (تجريبي)'), amt:1260},
 {k:'water', n:()=>L('Crystal Water (sample)','مياه كريستال (تجريبي)'), amt:640}];
MF.CAT = [
 {k:'food',n:()=>L('Food & ingredients','مواد غذائية'),amt:34180,src:'p'},{k:'pack',n:()=>L('Packaging','تغليف'),amt:2900,src:'p'},{k:'bev',n:()=>L('Beverages','مشروبات'),amt:1880,src:'p'},
 {k:'rent',n:()=>L('Rent','إيجار'),amt:9000,src:'e'},{k:'wage',n:()=>L('Wages paid (entered by you)','أجور مدفوعة (تُدخلها أنت)'),amt:7800,src:'e'},{k:'util',n:()=>L('Electricity & water','كهرباء وماء'),amt:2350,src:'e'},
 {k:'maint',n:()=>L('Maintenance','صيانة'),amt:1230,src:'e'},{k:'clean',n:()=>L('Cleaning','تنظيف'),amt:640,src:'e'},{k:'trans',n:()=>L('Transport','مواصلات'),amt:410,src:'e'},{k:'other',n:()=>L('Other','أخرى'),amt:450,src:'e'}];
MF.M = { sales:96420, purch:38960, exp:21880, lastSales:89310, lastProfit:31140,
 drawer:2145.50, bank:18400, appsOwed:6312, owe:14870.25,
 credit:{limit:40000, used:9870.25, sync:'15:02'} };
MF.M.profit = MF.M.sales - MF.M.purch - MF.M.exp; // 35,580.00
MF.M.cashPos = MF.M.drawer + MF.M.bank + MF.M.appsOwed - MF.M.owe; // 11,987.25
MF.PAY = [ // what you owe
 {id:'INV-S-24117', sup:'mf', due:'2026-11-16', amt:3420.50, st:'d-3'},
 {id:'INV-S-24152', sup:'mf', due:'2026-11-21', amt:4118.75, st:'open'},
 {id:'INV-S-24188', sup:'mf', due:'2026-11-28', amt:2331.00, st:'open'},
 {id:'HB-1093', sup:'hamra', due:'2026-11-15', amt:3200.00, st:'open'},
 {id:'GV-7702', sup:'green', due:'2026-11-11', amt:1240.00, st:'over'},
 {id:'RB-W46', sup:'reef', due:'2026-11-18', amt:560.00, st:'open'}];
MF.supName = k => (MF.SUP.find(s=>s.k===k)||{n:()=>k}).n();
MF.APPS = [['hs','HungerStation','هنقرستيشن',3180],['jz','Jahez','جاهز',1946],['kt','Keeta','كيتا',812],['tc','The Chefz','ذا شفز',374]];
MF.TODAYSALES = {cash:1240, mada:2115.50, stc:310, card:455, apps:{hs:640,jz:360,kt:180}, tab:0};
MF.DRAWER = {open:500, cashSales:1240, exp:185, sup:140, adv:100}; // expected 1,315.00
MF.DRAWER.expected = MF.DRAWER.open + MF.DRAWER.cashSales - MF.DRAWER.exp - MF.DRAWER.sup - MF.DRAWER.adv;
MF.DEN = [[500,'n'],[200,'n'],[100,'n'],[50,'n'],[20,'n'],[10,'n'],[5,'n'],[1,'c'],[0.5,'c']];
MF.CNT = { match:{500:1,200:2,100:3,50:1,20:2,10:1,5:3}, short:{500:1,200:2,100:3,50:1,20:2,5:2,1:2}, over:{500:1,200:2,100:3,50:1,20:2,10:1,5:3,1:4} };
MF.counted = v => Object.entries(MF.CNT[v]||MF.CNT.match).reduce((s,[d,c])=>s+d*c,0);
MF.TOL = 5; // Suggested variance tolerance, SAR
MF.ITEMS = [ // MENAFoods SKUs (sample) — par levels editable by customer & salesperson
 {sku:'MF-RIC-1010',en:'Sella basmati rice 10 kg',ar:'أرز بسمتي سيلا 10 كجم',u:['bag','كيس'],par:12,on:5,use:9.6,last:'2026-11-08',stock:'in'},
 {sku:'MF-CHK-1010',en:'Frozen whole chicken 1000 g × 10',ar:'دجاج كامل مجمد 1000 جم × 10',u:['ctn','كرتون'],par:10,on:2,use:8,last:'2026-11-08',stock:'in'},
 {sku:'MF-FRY-2504',en:'Frozen fries 9 mm 2.5 kg × 4',ar:'بطاطس مقلية مجمدة 9 مم 2.5 كجم × 4',u:['ctn','كرتون'],par:6,on:1,use:4.8,last:'2026-11-05',stock:'out',eta:'2026-11-15'},
 {sku:'MF-OIL-1806',en:'Sunflower oil 1.8 L × 6',ar:'زيت دوار الشمس 1.8 لتر × 6',u:['ctn','كرتون'],par:8,on:3,use:6.4,last:'2026-11-08',stock:'in'},
 {sku:'MF-CHS-2006',en:'Shredded mozzarella 2 kg × 6',ar:'جبن موزاريلا مبشور 2 كجم × 6',u:['ctn','كرتون'],par:6,on:4,use:4.8,last:'2026-11-05',stock:'low'},
 {sku:'MF-PKG-0750',en:'Takeaway container 750 ml × 300',ar:'علب سفري 750 مل × 300',u:['ctn','كرتون'],par:3,on:1,use:2.4,last:'2026-10-29',stock:'in'}];

/* ---------- shared components ---------- */
MF.hbars = (rows, label, opt={}) => { const max=Math.max(...rows.map(r=>r.v)); const tot=rows.reduce((s,r)=>s+r.v,0);
 return `<figure class="hbars" aria-label="${label}"><figcaption class="sr">${label}</figcaption><ul>${rows.map((r,i)=>`<li><span class="hb-l">${r.l}${r.tag||''}</span><span class="hb-track" aria-hidden="true"><i style="width:${(r.v/max*100).toFixed(1)}%" class="${r.cls||(i===0&&opt.lead?'lead':'')}"></i></span><span class="hb-v">${MF.money(r.v)}${opt.pct?` <small class="muted num">${Math.round(r.v/tot*100)}%</small>`:''}</span></li>`).join('')}</ul></figure>`; };
MF.consentLvl = k => ({none:`<span class="cl none">${ic('eyeoff')} ${L('Not shared','غير مُشارَك')}</span>`, totals:`<span class="cl totals">${ic('eye')} ${L('Totals only','الإجماليات فقط')}</span>`, detailed:`<span class="cl detailed">${ic('eye')} ${L('Detailed','تفصيلي')}</span>`}[k]);
MF.syncChip = (st) => ({ok:`<span class="syncchip">${ic('check')} ${L('Synced 15:10','زُومن 15:10')}</span>`, off:`<span class="syncchip off">${ic('wifioff')} ${L('Saved on this device · will sync','محفوظ على الجهاز · سيُزامن')}</span>`, conflict:`<span class="syncchip warn">${ic('conflict')} ${L('2 to review','2 للمراجعة')}</span>`}[st||'ok']);
MF.sync = () => MF.syncChip(S.state==='offline'?'off':'ok');
MF.notERP = () => `<p class="small muted bh-note">${ic('info')} ${L('Light by design: a simple business notebook, not an ERP. No inventory valuation, payroll or general ledger. Your data stays yours.','خفيف عن قصد: دفتر أعمال بسيط وليس نظام ERP. لا تقييم مخزون ولا رواتب ولا دفتر أستاذ عام. بياناتك ملكك.')}</p>`;
MF.persona = (k) => { const m={owner:['shield',MF.B.ppl.owner()],mgr:['building',MF.B.ppl.mgr()+' · '+MF.B.br.olaya()],buyer:['cart',MF.B.ppl.buyer()],cashier:['cash',MF.B.ppl.cashier()+' · '+MF.B.br.olaya()]}[k]; return `<span class="roletag ${k==='owner'?'owner':'cashier'}">${ic(m[0])} ${m[1]}</span>`; };
MF.lock = (t) => `<div class="lockrow2">${ic('lock')}<span>${t}</span></div>`;
MF.agebar = (parts) => `<div class="agebar" role="img" aria-label="${parts.map(p=>p.l+' '+MF.f2(p.v)).join(', ')}">${parts.filter(p=>p.v>0).map(p=>`<i style="flex:${p.v};background:${p.c}"></i>`).join('')}</div><div class="row wrap small" style="gap:10px;margin-top:6px">${parts.map(p=>`<span><i class="sw" style="background:${p.c}" aria-hidden="true"></i> ${p.l} ${MF.money(p.v)}</span>`).join('')}</div>`;
/* bespoke states helper: st({e:[icon,t,b,cta,go], r:[t,b,code], o:[msg,queue], d:msg, l:msg}) */
MF.st = o => ({
 empty: o.e ? ()=>({icon:o.e[0],t:o.e[1](),b:o.e[2](),cta:o.e[3]?o.e[3]():null,go:o.e[4]}) : undefined,
 error: o.r ? ()=>({t:o.r[0](),b:o.r[1](),code:o.r[2]}) : undefined,
 offline: o.o ? ()=>({msg:o.o[0](),q:o.o[1]?o.o[1]():false}) : undefined,
 deniedMsg: o.d,
 loadingMsg: o.l });
/* 25-day forecast (simple, explainable): weekday × payday × trend */
MF.addD = (iso,n) => { const d=new Date(iso+'T12:00:00+03:00'); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
const dow = iso => new Date(iso+'T12:00:00+03:00').getDay();
MF.fc = (() => { const base=6500; const out=[]; for (let i=1;i<=25;i++){ const iso=MF.addD(MF.TODAY,i); const w=dow(iso); let f=w===4?1.30:w===5?1.35:w===6?1.10:0.90; const d=+iso.slice(8,10), m=iso.slice(5,7); if ((m==='11'&&d>=27)||(m==='12'&&d<=1)) f*=1.18; const v=base*f*(1+0.002*i); const wd=0.08+0.004*i; out.push({iso,v,lo:v*(1-wd),hi:v*(1+wd),pd:(m==='11'&&d===27)}); } return out; })();
MF.fcTot = () => MF.fc.reduce((s,d)=>s+d.v,0);
MF.fcChart = (h=200) => { const W=640,H=h,l=44,r=10,t=14,b=28, n=MF.fc.length, max=Math.max(...MF.fc.map(d=>d.hi))*1.08; const X=i=>l+i*(W-l-r)/(n-1), Y=v=>t+(H-t-b)*(1-v/max);
 const band=MF.fc.map((d,i)=>`${X(i).toFixed(1)},${Y(d.hi).toFixed(1)}`).join(' ')+' '+MF.fc.map((d,i)=>`${X(i).toFixed(1)},${Y(d.lo).toFixed(1)}`).reverse().join(' ');
 const line=MF.fc.map((d,i)=>`${X(i).toFixed(1)},${Y(d.v).toFixed(1)}`).join(' ');
 const ticks=[0,max/2,max].map(v=>`<line x1="${l}" x2="${W-r}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="var(--line)"/><text x="${l-6}" y="${(Y(v)+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--ink-2)">${nf0.format(Math.round(v/100)*100)}</text>`).join('');
 const xl=[0,6,12,18,24].map(i=>`<text x="${X(i).toFixed(1)}" y="${H-8}" text-anchor="${i===0?'start':i===24?'end':'middle'}" font-size="11" fill="var(--ink-2)">${MF.dateG(MF.fc[i].iso).replace(/\s?2026/,'')}</text>`).join('');
 const pi=MF.fc.findIndex(d=>d.pd);
 const svg=`<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false" style="direction:ltr;unicode-bidi:isolate;width:100%;height:auto">${ticks}<polygon points="${band}" fill="var(--fc-band,#DCEFE6)"/><polyline points="${line}" fill="none" stroke="var(--acc)" stroke-width="2.5"/><line x1="${X(pi)}" x2="${X(pi)}" y1="${t}" y2="${H-b}" stroke="#8A4B00" stroke-dasharray="4 3"/><text x="${X(pi)+4}" y="${t+10}" font-size="11" fill="#8A4B00">${L('Payday','يوم الراتب')}</text>${xl}</svg>`;
 return `<figure class="fcfig" role="img" aria-label="${L('Forecast of daily sales for the next 25 days, from','توقع المبيعات اليومية لـ 25 يوماً القادمة، من')} ${MF.f2(MF.fc[0].v)} ${L('to','إلى')} ${MF.f2(MF.fc[24].v)}; ${L('peak around payday 27 Nov','ذروة قرب يوم الراتب 27 نوفمبر')}.">${svg}</figure>`; };
MF.spark = (vals) => { const W=120,H=32,max=Math.max(...vals),min=Math.min(...vals); const p=vals.map((v,i)=>`${(i*(W-4)/(vals.length-1)+2).toFixed(1)},${(H-3-(v-min)/(max-min||1)*(H-6)).toFixed(1)}`).join(' '); return `<svg class="spark" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false" style="direction:ltr"><polyline points="${p}" fill="none" stroke="var(--acc)" stroke-width="2"/></svg>`; };

MF.PLAN = k => k==='paid' ? MF.badge2('paid') : MF.badge2('free');
MF.REWARDS_URL = '../rewards-earn/index.html';
/* shared nav for all customer-side Hub screens */
const NAV = [
 {id:'bh.home',go:'bh.home',icon:'home',label:()=>L('Home','الرئيسية')},
 {id:'bh.daybook',go:'bh.daybook',icon:'book',label:()=>L('Day','اليوم')},
 {id:'bh.purchases',go:'bh.purchases',icon:'cart',label:()=>L('Purchases','المشتريات')},
 {id:'bh.payments',go:'bh.payments',icon:'wallet',label:()=>L('Payments','المدفوعات')},
 {id:'bh.more',go:'bh.more',icon:'grid',label:()=>L('More','المزيد')}];
const lab = () => L('Business Hub · ','مركز الأعمال · ')+MF.B.biz();
MF.role('bhA',{studio:'1 · Customer — dashboard, forecast, reorder, plan',label:lab,nav:NAV});
MF.role('bhB',{studio:'2 · Customer — purchases, sales, expenses, payments',label:lab,nav:NAV});
MF.role('bhC',{studio:'3 · Customer — day book (cash)',label:lab,nav:NAV});
MF.role('bhD',{studio:'4 · Customer — team, approvals, consent, integrations, sync, settings',label:lab,nav:NAV});
const SNAV=[{id:'st.portfolio',go:'st.portfolio',icon:'users',label:()=>L('Customers','العملاء')},{id:'st.health',go:'st.health',icon:'target',label:()=>L('Health','الصحة')}];
MF.role('stS',{studio:'5 · Staff — salesperson',label:()=>L('Salesperson · ','مندوب · ')+MF.B.ppl.sales(),nav:SNAV});
MF.role('stA',{studio:'6 · Staff — accountant',label:()=>L('Accountant · ','محاسب · ')+MF.B.ppl.acct(),nav:[{id:'st.acct',go:'st.acct',icon:'file',label:()=>L('Customer finance','مالية العميل')},{id:'st.creditReq',go:'st.creditReq',icon:'shield',label:()=>L('Credit requests','طلبات الائتمان')}]});
MF.role('stM',{studio:'7 · Staff — admin / manager',label:()=>L('Admin · ','مسؤول · ')+MF.B.ppl.admin(),nav:[{id:'st.admin',go:'st.admin',icon:'settings',label:()=>L('Hub admin','إدارة المركز')},{id:'st.creditReq',go:'st.creditReq',icon:'shield',label:()=>L('Approvals','الاعتمادات')}]});
MF.defaultDeltas = ['<b>PWA</b>: compact header, sticky bottom action bar, sidebar on tablet/desktop, installable, offline via service worker + IndexedDB queue.','<b>Android M3</b>: top app bar, navigation bar with pill indicator, extended FAB for the primary action, snackbars, 28dp dialogs, camera via CameraX.','<b>iOS HIG</b>: large title, text back button, tab bar, bottom toolbar for the primary action, sheets & alerts, swipe actions, camera via VisionKit document scanner.'];
})();
