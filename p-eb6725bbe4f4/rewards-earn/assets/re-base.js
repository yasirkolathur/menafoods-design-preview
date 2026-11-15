/* MENAFoods Rewards & Earn — shared helpers, sample data, roles. SAMPLE DATA ONLY:
   fictional businesses, people, brands (all brand names are invented), amounts, points and payouts. Policy values are "Suggested" unless marked as an owner decision.
   Money values for rewards/referrals are SAMPLE values; real rates are variables "to set" (see the Page: unit-economics framework). */
(function(){
const MF=window.MF, S=MF.S, L=MF.L, ic=MF.ic, $=MF.money;
const nf0=new Intl.NumberFormat('en-US'); MF.N = n => `<span class="num">${nf0.format(Math.round(n))}</span>`;
MF.V = d => S.variant || d;
MF.nm = o => S.lang==='ar' ? (o.ar||o.en) : (o.en||o.ar);
MF.kpi = (a,b,c) => `<div class="card kpi"><div class="eyebrow">${a}</div><div class="v">${b}</div>${c?`<div class="d small muted">${c}</div>`:''}</div>`;
MF.tb = (heads, rows, cap) => `<div class="tbwrap" role="region" tabindex="0" aria-label="${cap||L('Table','جدول')}"><table class="tb">${cap?`<caption class="sr">${cap}</caption>`:''}<thead><tr>${heads.map(h=>`<th scope="col" class="${h[1]||''}">${h[0]}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
MF.tabs = (arr, cur, label) => `<div class="chips wrapchips" role="tablist" aria-label="${label||L('Sections','الأقسام')}">${arr.map(([k,v])=>`<button class="chip ${k===cur?'on':''}" role="tab" aria-selected="${k===cur}" data-act="sub:${k}">${v}</button>`).join('')}</div>`;
MF.filt = (arr, cur) => `<div class="wrapchips" role="group" aria-label="${L('Filter','تصفية')}">${arr.map((v,i)=>`<button class="chip ${i===(cur||0)?'on':''}" aria-pressed="${i===(cur||0)}" data-act="noop">${v}</button>`).join('')}</div>`;
MF.b = k => ({
  sample:`<span class="mfbadge sample">${L('Sample values','قيم تجريبية')}</span>`,
  suggest:`<span class="mfbadge suggest">${ic('info')} ${L('Suggested','مقترح')}</span>`,
  price:`<span class="mfbadge price">${ic('info')} ${L('Price to set','السعر يُحدَّد لاحقاً')}</span>`,
  rate:`<span class="mfbadge price">${ic('info')} ${L('Rate to set','المعدل يُحدَّد لاحقاً')}</span>`,
  staff:`<span class="mfbadge staff">${ic('lock')} ${L('Staff only','للموظفين فقط')}</span>`,
  decided:`<span class="mfbadge decided">${ic('check')} ${L('Owner decision','قرار المالك')}</span>`,
  legal:`<span class="mfbadge notimpl">${ic('shield')} ${L('Legal check needed','يلزم تحقق قانوني')}</span>`,
  sim:`<span class="mfbadge notimpl">${ic('alert')} ${L('Integration simulated','الربط محاكاة')}</span>`}[k]);
/* Sponsored label: always visible text "Sponsored · إعلان" + "Why?" button that opens the why-sheet (ov=why) */
MF.spons = (brand) => `<span class="spons" lang="${S.lang}">${L('Sponsored','إعلان')}<span aria-hidden="true">·</span><span>${L('إعلان','Sponsored')}</span></span> <button class="whybtn small" data-act="ov:why" aria-label="${L('Why am I seeing this ad','لماذا أرى هذا الإعلان')}${brand?' — '+brand:''}">${L('Why?','لماذا؟')}</button>`;
MF.fund = k => k==='brand'?`<span class="fund brand">${L('Brand-funded','بتمويل العلامة')}</span>`:`<span class="fund mf">${L('MENAFoods','ميناء فودز')}</span>`;
MF.tierName = k => ({basic:L('Basic','أساسي'),normal:L('Normal','عادي'),premium:L('Premium','مميّز'),ultra:L('Ultra Premium','فائق التميّز')}[k]);
MF.tierChip = k => `<span class="tierchip ${k}">${ic('star')} ${MF.tierName(k)}</span>`;
MF.TIERS=['basic','normal','premium','ultra'];
MF.POL = {earnPer:10, mult:{basic:1,normal:1.25,premium:1.5,ultra:2}, onTime:100, expiryMonths:12, warnDays:30, minPayout:'P_min', refQualOrders:3, refWindowDays:90, clawDays:60, holdDays:7};
MF.PTS = {bal:4820, pending:427, exp:600, expOn:'2026-12-31', ytd:6120};
MF.pts = n => `<span class="num">${nf0.format(n)}</span> ${L('pts','نقطة')}`;
MF.biz = () => L('Fig Leaf Kitchen (sample)','مطعم ورقة التين (تجريبي)');
MF.code = 'FIGLEAF-7Q4K';
MF.link = 'menafoods.sa/r/FIGLEAF-7Q4K';
/* fictional brands */
MF.BR = { najd:{en:'Najd Valley Dairy (fictional)',ar:'ألبان وادي نجد (وهمية)'}, sahra:{en:'Sahra Gold Oils (fictional)',ar:'زيوت صحراء الذهبية (وهمية)'}, sunbula:{en:'Sunbula Rice (fictional)',ar:'أرز سنبلة (وهمي)'}, bayt:{en:'Bayt Al Bahar Spices (fictional)',ar:'بهارات بيت البحار (وهمية)'} };
MF.br = k => MF.nm(MF.BR[k]);
/* deterministic sample QR (NOT a real QR code — visual placeholder) */
MF.qr = (seed='MF') => { const n=25, c=6; let h=0; for (const ch of seed) h=(h*31+ch.charCodeAt(0))>>>0; const rnd=()=>{h^=h<<13;h>>>=0;h^=h>>17;h^=h<<5;h>>>=0;return h/4294967296};
  let r=''; const fin=(x,y)=>{r+=`<rect x="${x*c}" y="${y*c}" width="${7*c}" height="${7*c}" fill="#161614"/><rect x="${(x+1)*c}" y="${(y+1)*c}" width="${5*c}" height="${5*c}" fill="#fff"/><rect x="${(x+2)*c}" y="${(y+2)*c}" width="${3*c}" height="${3*c}" fill="#161614"/>`;};
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){ const inF=(x<8&&y<8)||(x>n-9&&y<8)||(x<8&&y>n-9); if(!inF&&rnd()>.52) r+=`<rect x="${x*c}" y="${y*c}" width="${c}" height="${c}" fill="#161614"/>`; }
  fin(0,0);fin(n-7,0);fin(0,n-7);
  return `<div class="qr" role="img" aria-label="${L('Referral QR code (sample image) for code','رمز QR للإحالة (صورة تجريبية) للرمز')} ${seed}"><svg viewBox="0 0 ${n*c} ${n*c}" aria-hidden="true" focusable="false"><rect width="${n*c}" height="${n*c}" fill="#fff"/>${r}</svg></div>`; };
MF.legal = (t,b) => `<div class="legal" role="note"><b>${ic('shield')} ${t}</b>${b}</div>`;
MF.sampleNote = () => `<p class="small muted" style="margin-top:12px">${L('Sample data — fictional businesses, brands, amounts and points. Brand deals shown are not real offers.','بيانات تجريبية — منشآت وعلامات ومبالغ ونقاط وهمية. عروض العلامات المعروضة ليست عروضاً حقيقية.')}</p>`;
MF.funnelStages = () => [['invited',L('Invited','مدعو')],['signed',L('Signed up','سجّل')],['approved',L('Approved (CR + credit checks)','معتمد (السجل + الائتمان)')],['first',L('First paid order','أول طلب مدفوع')],['qual',L('Qualified','مؤهَّل')]];
MF.stageChips = (k, bad) => { const st=MF.funnelStages(); const i=st.findIndex(s=>s[0]===k); return `<div class="stagechips"><span class="sr">${L('Stage','المرحلة')}: ${bad?bad:st[i][1]}</span>${st.map((s,j)=>`<span class="stg ${bad&&j===i?'bad':j<i?'done':j===i?'cur':''}" aria-hidden="true">${s[1].replace(/ \(.*\)/,'')}</span>`).join('')}</div>`; };

/* screen factory: fills bespoke default states so every screen has empty/loading/error/offline/denied copy */
MF.scr = (d) => { const t=d.title; d.empty = d.empty || (()=>({icon:d.icon||'list',t:L('Nothing here yet','لا شيء هنا بعد'),b:L('When there is activity it will show here.','ستظهر الأنشطة هنا عند حدوثها.')}));
  d.error = d.error || (()=>({t:L("Couldn't load this","تعذّر التحميل"),b:L('Your points, rewards and earnings are safe. Try again.','نقاطك ومكافآتك وأرباحك محفوظة. حاول مرة أخرى.'),code:(d.id||'RE').toUpperCase().replace(/\./g,'-')}));
  d.offline = d.offline || (()=>({msg:L('Offline — showing data from 06:00. Redeeming, payouts and sharing links need a connection.','غير متصل — البيانات من 06:00. الاستبدال والسحب ومشاركة الروابط تحتاج اتصالاً.'),q:false}));
  d.deniedMsg = d.deniedMsg || (()=>L('Your role cannot open this screen. Ask the account owner or a MENAFoods admin.','دورك لا يسمح بفتح هذه الشاشة. اطلب ذلك من مالك الحساب أو مسؤول ميناء فودز.'));
  MF.screen(d); };

/* roles */
MF.role('re',{studio:'1 · Customer — Rewards & Earn',label:()=>L('Owner · ','المالك · ')+MF.biz(),nav:[
 {id:'re.home',go:'re.home',icon:'home',label:()=>L('Home','الرئيسية')},
 {id:'re.points',go:'re.points',icon:'star',label:()=>L('Points','النقاط')},
 {id:'re.refer',go:'re.refer',icon:'users',label:()=>L('Earn','اربح')},
 {id:'re.offers',go:'re.offers',icon:'sparkle',label:()=>L('Offers','العروض')},
 {id:'re.plans',go:'re.plans',icon:'chart',label:()=>L('Plans','الباقات')}]});
MF.role('rs',{studio:'2 · Salesperson',label:()=>L('Salesperson · Yousef M. (sample)','مندوب · يوسف م. (تجريبي)'),nav:[
 {id:'rs.earn',go:'rs.earn',icon:'wallet',label:()=>L('Earnings','الأرباح')},
 {id:'rs.refer',go:'rs.refer',icon:'users',label:()=>L('Refer','الإحالة')},
 {id:'rs.customer',go:'rs.customer',icon:'user',label:()=>L('Customer','العميل')}]});
MF.role('rd',{studio:'3 · Delivery staff',label:()=>L('Driver · Saeed (sample)','سائق · سعيد (تجريبي)'),nav:[
 {id:'rd.earn',go:'rd.earn',icon:'qr',label:()=>L('Refer & earn','أحِل واربح')}]});
MF.role('rx',{studio:'4 · Outside affiliate',label:()=>L('Affiliate · Noura A. (sample)','مسوّقة بالعمولة · نورة ع. (تجريبي)'),nav:[
 {id:'rx.dash',go:'rx.dash',icon:'chart',label:()=>L('Dashboard','لوحتي')},
 {id:'rx.links',go:'rx.links',icon:'share',label:()=>L('Links','الروابط')},
 {id:'rx.wallet',go:'rx.wallet',icon:'wallet',label:()=>L('Wallet','المحفظة')}]});
MF.role('rm',{studio:'5 · Admin console (rewards, referrals, sponsored)',label:()=>L('Admin · Growth & loyalty','مسؤول · النمو والولاء'),nav:[
 {id:'rm.overview',go:'rm.overview',icon:'chart',label:()=>L('Overview','نظرة عامة')},
 {id:'rm.rules',go:'rm.rules',icon:'settings',label:()=>L('Rules','القواعد')},
 {id:'rm.campaigns',go:'rm.campaigns',icon:'sparkle',label:()=>L('Campaigns','الحملات')},
 {id:'rm.fraud',go:'rm.fraud',icon:'shield',label:()=>L('Fraud','الاحتيال')},
 {id:'rm.payouts',go:'rm.payouts',icon:'wallet',label:()=>L('Payouts','المدفوعات')},
 {id:'rm.reports',go:'rm.reports',icon:'file',label:()=>L('Reports','التقارير')}]});
MF.role('rc',{studio:'6 · Accountant (finance checker)',label:()=>L('Accountant · finance','محاسب · المالية'),nav:[
 {id:'rc.payouts',go:'rc.payouts',icon:'wallet',label:()=>L('Release','الصرف')},
 {id:'rm.liability',go:'rm.liability',icon:'chart',label:()=>L('Liability','الالتزامات')}]});
})();
