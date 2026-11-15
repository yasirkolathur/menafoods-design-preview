/* Screens: Auth & Customer/buyer. Sample data only. */
const SCREENS = [];
const R = (o) => SCREENS.push(o);
const stockChip = s => s==='ok'?chip('ok',L('In stock','متوفر')):s==='low'?chip('wait',L('Low stock','كمية محدودة')):chip('bad',L('Out of stock','غير متوفر'));
const prodRow = (p, q) => `<div class="li" data-go="b-product">${thumb(p.icon)}<div class="grow"><div class="ttl" dir="auto">${nm(p)}</div><div class="sub">${ltr(p.sku)} · ${pr(p.unit)} · ${L('MOQ','الحد الأدنى')} ${num(p.moq)}</div><div class="row small" style="gap:8px;margin-top:2px">${money(p.price,{ex:true})} ${stockChip(p.stock)}</div></div>${q!==undefined?qtyCtl(q):btn(ic('plus','sm'),'sm sec','data-act="add" aria-label="add"')}</div>`;

/* ===== 1. Auth & access ===== */
R({id:'auth-phone',role:'auth',title:['Sign in','تسجيل الدخول'],kind:'form',noNav:true,
 error:['Couldn’t send the code','تعذّر إرسال الرمز','WhatsApp didn’t accept the request. Try again or get the code by SMS.','لم يقبل واتساب الطلب. حاول مرة أخرى أو استلم الرمز عبر رسالة نصية.'],
 render:()=>`<div style="height:24px"></div><div class="row"><div class="logo" style="width:52px;height:52px;border-radius:14px;background:var(--brand);color:#fff;display:grid;place-items:center;font-weight:800">MF</div></div>
 <h1 style="margin:0;font-size:26px">${L('Welcome to MENAFoods','مرحباً بك في مينا فودز')}</h1>
 <p class="muted" style="margin:0">${L('Wholesale ordering for food businesses. We’ll send a 6-digit code on WhatsApp.','طلبات الجملة لمنشآت الأغذية. سنرسل رمزاً من 6 أرقام عبر واتساب.')}</p>
 ${field(L('Mobile number','رقم الجوال'),'50 000 0101',{ltr:true,im:'tel',lead:`<b class="ltr">+966</b>`,hint:L('Saudi mobile, starts with 5','رقم جوال سعودي يبدأ بـ 5')})}
 ${btn(ic('chat')+L('Send code on WhatsApp','أرسل الرمز عبر واتساب'),'block lg','data-go="auth-otp"')}
 ${btn(L('Send by SMS instead','أرسل برسالة نصية بدلاً من ذلك'),'ghost block')}
 <p class="tiny muted" style="text-align:center">${L('Staff? Sign in with your MENAFoods account','موظف؟ سجّل الدخول بحساب مينا فودز')} · <a href="#" data-go="auth-lang">${L('Language','اللغة')}</a></p>`});
R({id:'auth-otp',role:'auth',title:['Enter code','أدخل الرمز'],kind:'form',noNav:true,back:'auth-phone',
 variants:[['expired','Code expired','انتهت صلاحية الرمز'],['wrong','Wrong code','رمز خاطئ']],
 error:['Verification failed','فشل التحقق','We couldn’t verify the code right now.','تعذّر التحقق من الرمز حالياً.'],
 render:(v)=>`<h1 style="margin:8px 0 0;font-size:24px">${L('Check WhatsApp','تحقق من واتساب')}</h1>
 <p class="muted" style="margin:0">${L('Code sent to','أُرسل الرمز إلى')} ${ltr('+966 50 000 0101')} · <a href="#" data-go="auth-phone">${L('Change','تغيير')}</a></p>
 <div class="otpboxes">${(v==='expired'?'      ':'482 91').split('').map((c,i)=>`<span class="${c.trim()?'f':''}">${c.trim()}</span>`).join('')}</div>
 ${v==='expired'?banner('wait','clock',`<b>${L('This code expired','انتهت صلاحية هذا الرمز')}</b><br>${L('Codes last 5 minutes. Request a new one.','الرمز صالح لمدة 5 دقائق. اطلب رمزاً جديداً.')}`):
   v==='wrong'?banner('bad','alert',`<b>${L('That code doesn’t match','الرمز غير مطابق')}</b><br>${L('2 attempts left before a 10-minute pause.','تبقّت محاولتان قبل إيقاف مؤقت لمدة 10 دقائق.')}`):
   `<p class="small muted" style="text-align:center">${L('Resend in','إعادة الإرسال خلال')} ${ltr('0:42')}</p>`}
 ${btn(v==='expired'?L('Send a new code','أرسل رمزاً جديداً'):L('Verify','تحقق'),'block lg',`data-go="${v==='expired'?'auth-otp':'auth-access'}"`)}
 ${btn(L('Resend by SMS','إعادة الإرسال برسالة نصية'),'ghost block',v==='expired'?'':'disabled')}`});
R({id:'auth-access',role:'auth',title:['Choose business','اختر المنشأة'],kind:'list',noNav:true,
 empty:['No business access yet','لا توجد منشأة مرتبطة بحسابك بعد','Your business owner or MENAFoods sales can add you. Share your number with them.','يمكن لمالك المنشأة أو مندوب مينا فودز إضافتك. شارك رقمك معهم.','Apply as a new business','سجّل منشأة جديدة'],
 render:()=>`<h1 style="margin:8px 0 0;font-size:24px">${L('Where are you ordering for?','لأي منشأة تطلب اليوم؟')}</h1>
 <p class="muted small" style="margin:0">${L('You have access to 2 businesses. You can switch any time from your profile.','لديك صلاحية على منشأتين. يمكنك التبديل في أي وقت من ملفك.')}</p>
 ${list([
  {lead:av('ن'),t:L('Al-Nada Grocery (Sample)','تموينات الندى (تجريبي)'),s:L('Owner · 3 branches · Credit active','مالك · 3 فروع · ائتمان نشط'),go:'b-hub',end:chip('ok',L('Credit','ائتمان'))},
  {lead:av('ن'),t:L('↳ Al-Malqa branch','↳ فرع الملقا'),s:L('Branch buyer · spending limit applies','مشتري الفرع · حد إنفاق مطبق'),go:'b-hub'},
  {lead:av('ح'),t:L('Habba Coffee (Sample)','مقهى حبة بن (تجريبي)'),s:L('Approver · 1 branch · Cash','معتمد · فرع واحد · نقدي'),go:'b-hub',end:chip('hold',L('Cash','نقدي'))},
 ])}
 ${banner('new','users',L('Need access to another business? Ask its owner to invite your number.','تحتاج صلاحية على منشأة أخرى؟ اطلب من مالكها دعوة رقمك.'))}`});
R({id:'auth-lang',role:'auth',title:['Language','اللغة'],kind:'form',noNav:true,back:'auth-phone',
 render:()=>`<h1 style="margin:8px 0 0;font-size:24px">${L('Language · اللغة','اللغة · Language')}</h1>
 <p class="muted small" style="margin:0">${L('We matched your device language. Your choice is saved to your profile and follows you on every device.','اخترنا لغة جهازك تلقائياً. يُحفظ اختيارك في ملفك ويتبعك على كل الأجهزة.')}</p>
 ${list([{lead:av('ع'),t:'العربية',s:L('Right-to-left · Western digits 0–9','من اليمين لليسار · أرقام 0–9'),act:'lang-ar',end:S.lang==='ar'?chip('ok',L('Selected','مختار')):''},{lead:av('A'),t:'English',s:L('Left-to-right','من اليسار لليمين'),act:'lang-en',end:S.lang==='en'?chip('ok',L('Selected','مختار')):''},{lead:av(ic('globe','sm')),t:L('Follow device language','اتبع لغة الجهاز'),s:ltr(navigator.language),act:'lang-auto'}])}
 ${btn(L('Continue','متابعة'),'block lg','data-go="auth-phone"')}`});

/* ===== 2. Customer / buyer ===== */
R({id:'b-hub',role:'customer',nav:'hub',title:['Today','اليوم'],kind:'dash',fab:['repeat','Reorder usual','أعد طلب المعتاد','b-cart'],
 empty:['All caught up','لا مهام الآن','Nothing needs you right now. Your usual Tuesday order is ready when you are.','لا شيء يحتاجك الآن. طلبك المعتاد ليوم الثلاثاء جاهز متى أردت.','Reorder usual list','أعد طلب قائمتك المعتادة'],
 render:()=>`${hello(L('Good afternoon, Ahmed','مساء الخير يا أحمد'),`${dt(0)} · ${L('Al-Nada Grocery · Al-Malqa','تموينات الندى · الملقا')}`)}
 <div class="hero"><div class="row"><div class="grow"><div style="font-weight:700;font-size:17px">${L('Your usual list · 14 items','قائمتك المعتادة · 14 صنفاً')}</div><div class="muted small">${L('Usually ordered Tuesday · order by 6:00 PM for delivery tomorrow 7–10 AM','تطلبها عادةً يوم الثلاثاء · اطلب قبل 6:00 م للتوصيل غداً 7–10 ص')}</div></div>${ic('repeat','lg')}</div>
   <div class="row wrap" style="gap:8px">${btn(ic('repeat','sm')+L('Reorder in 1 tap','أعد الطلب بضغطة'),'','data-go="b-cart"')}<span class="muted small">${L('Est.','تقديري')} ${money(3184.6,{ex:true})}</span></div></div>
 <div class="kpis">
  ${kpi(L('Credit available','الائتمان المتاح'),money(2600),L('of 40,000 · Zoho sync 14:58','من 40,000 · مزامنة Zoho 14:58'),'wait','b-finance')}
  ${kpi(L('Due this week','مستحق هذا الأسبوع'),money(6200),L('2 invoices · 1 overdue','فاتورتان · واحدة متأخرة'),'bad','b-finance')}
  ${kpi(L('On the way','في الطريق'),num(1),L('ETA 4:30–5:00 PM','الوصول 4:30–5:00 م'),'new','b-order')}
  ${kpi(L('Waiting approval','بانتظار الموافقة'),num(2),L('From branch buyers','من مشتري الفروع'),'prog','b-approvals')}
 </div>
 ${sec(L('Needs you now','يحتاج إجراءك الآن'),filters([[L('All','الكل'),4],[L('Approve','اعتماد'),2],[L('Pay','سداد'),1],[L('Receive','استلام'),1]])+`<div class="queue">
  ${qi({tone:'prog',icon:'inbox',t:L('Approve order from Al-Malqa branch','اعتماد طلب فرع الملقا'),s:L('Khalid · 9 items · over his 2,500 spending limit','خالد · 9 أصناف · يتجاوز حد إنفاقه 2,500'),chips:money(3410.25,{ex:true}),sla:95,act:btn(L('Review','مراجعة'),'sm','data-go="b-approvals"'),go:'b-approvals',swipe:'demo'})}
  ${qi({tone:'bad',icon:'file',t:L('Invoice INV-S-20418 is 6 days overdue','الفاتورة INV-S-20418 متأخرة 6 أيام'),s:L('Pay or upload transfer proof to keep credit open','ادفع أو ارفع إثبات التحويل لإبقاء الائتمان مفتوحاً'),chips:money(6200)+chip('bad',L('Overdue','متأخرة')),act:btn(L('Pay','ادفع'),'sm danger','data-go="b-finance"'),go:'b-finance'})}
  ${qi({tone:'new',icon:'truck',t:L('Delivery arriving today','توصيل يصل اليوم'),s:L('SO-S-88213 · driver Faisal · stop 3 of 7','SO-S-88213 · السائق فيصل · المحطة 3 من 7'),chips:chip('new',L('Out for delivery','خرج للتوصيل')),act:btn(L('Track','تتبع'),'sm sec','data-go="b-order"'),go:'b-order'})}
  ${qi({tone:'wait',icon:'shield',t:L('Credit increase: approve the Nafith note','زيادة الائتمان: وافق على سند نافذ'),s:L('Step 4 of 4 · sign in the Nafith app','الخطوة 4 من 4 · وقّع في تطبيق نافذ'),sla:1380,total:2880,act:btn(L('Open','فتح'),'sm sec','data-go="b-nafith"'),go:'b-nafith'})}
 </div>`)}
 ${sec(L('Running low (par levels)','أصناف قاربت النفاد'),`<div class="list">${prodRow(D.products[0],6)}${prodRow(D.products[5],9)}</div>`,L('Edit par levels','تعديل الحدود'),'b-catalog')}
 <div class="pwa-only">${banner('hold','grid',L('Install MENAFoods on your home screen for faster reordering.','ثبّت مينا فودز على الشاشة الرئيسية لطلب أسرع.'),btn(L('Install','تثبيت'),'sm sec'))}</div>`});
R({id:'b-catalog',role:'customer',nav:'catalog',title:['Catalog','الكتالوج'],kind:'list',
 variants:[['search','Search results (mixed AR/EN)','نتائج بحث (عربي/إنجليزي)'],['noresult','No results','لا نتائج']],
 empty:['Catalog is empty for this branch','لا أصناف لهذا الفرع','Your price list has no active items yet. Your salesperson has been notified.','قائمة أسعارك لا تحتوي أصنافاً نشطة بعد. تم إشعار مندوبك.','Contact salesperson','تواصل مع المندوب'],
 render:(v)=>`${field('',v==='search'?'موزاريلا mozz':v==='noresult'?'زعتر بلدي 25kg':'',{lead:ic('search'),ph:L('Search name, brand, SKU or barcode','ابحث بالاسم أو العلامة أو الرمز أو الباركود'),trail:btn(ic('scan'),'ghost sm','aria-label="scan"')})}
 ${filters([[L('Usual list','قائمتي'),14],[L('Dry goods','مواد جافة')],[L('Frozen','مجمدات')],[L('Dairy & cheese','ألبان وأجبان')],[L('Oils','زيوت')],[L('Packaging','تغليف')]],v?1:0)}
 ${v==='noresult'?`<div class="state tone-hold"><div class="art">${ic('search')}</div><h2>${L('No match for','لا نتائج لـ')} “<bdi>زعتر بلدي 25kg</bdi>”</h2><p>${L('We searched Arabic, English, spelling variants and SKUs. Ask your salesperson to source it.','بحثنا بالعربية والإنجليزية وتهجئات بديلة والرموز. اطلب من مندوبك توفيره.')}</p>${btn(L('Request this item','اطلب هذا الصنف'),'sec')}</div>`:
 `${v==='search'?`<div class="small muted">${L('3 results · matched “موزاريلا / mozzarella / موتزاريلا”','3 نتائج · تطابق "موزاريلا / mozzarella / موتزاريلا"')}</div>`:''}
 <div class="list">${(v==='search'?[D.products[3],D.products[3],D.products[1]]:D.products).map(p=>prodRow(p)).join('')}</div>`}`});
R({id:'b-product',role:'customer',nav:'catalog',title:['Product','الصنف'],kind:'detail',back:'b-catalog',
 variants:[['out','Out of stock + alternatives','غير متوفر + بدائل']],
 error:['Product unavailable','الصنف غير متاح','We couldn’t load the latest price and stock. Prices are never shown from old data.','تعذّر تحميل السعر والمخزون الحاليين. لا نعرض أسعاراً قديمة.'],
 render:(v)=>{const p=v==='out'?D.products[4]:D.products[3]; return `<div class="photo" style="height:200px">${ic('image','lg')}<span class="tiny" style="position:absolute;margin-top:80px">${L('Product photo (sample)','صورة الصنف (تجريبية)')}</span></div>
 <div><h2 style="margin:0;font-size:20px" dir="auto">${nm(p)}</h2><div class="muted small">${p.brand} · ${ltr(p.sku)} · ${ltr('6281000000000')}</div></div>
 <div class="row wrap">${stockChip(p.stock)}${chip('hold',L('Halal','حلال'),false)}${chip('hold',L('Chilled 0–4°C','مبرد 0–4°م'),false)}</div>
 ${card(`<div class="row"><div class="grow"><div class="small muted">${L('Price per','السعر لكل')} ${pr(p.unit)}</div><div style="font-size:24px">${money(p.price,{ex:true})}</div><div class="tiny muted">${L('Case of','كرتون من')} ${num(p.case)} = ${money(p.price*p.case)} · ${L('VAT 15% added at checkout','تضاف ضريبة 15% عند الدفع')}</div></div></div>
 <div class="seg" style="margin-top:10px">${[L('Unit','حبة'),L('Case ×'+p.case,'كرتون ×'+p.case)].map((t,i)=>`<button class="${i?'on':''}" data-seg>${t}</button>`).join('')}</div>
 <div class="row" style="margin-top:10px">${qtyCtl(p.moq)}<span class="small muted grow">${L('Minimum order','الحد الأدنى للطلب')} ${num(p.moq)}</span></div>`)}
 ${v==='out'?banner('bad','alert',`<b>${L('Out of stock · back in 3–5 days','غير متوفر · يعود خلال 3–5 أيام')}</b><br>${L('Approved alternatives from your rules:','بدائل معتمدة حسب إعداداتك:')}`)+`<div class="list">${prodRow(D.products[1])}</div>`+btn(ic('bell','sm')+L('Notify me when back','أبلغني عند التوفر'),'sec block'):
  btn(ic('cart','sm')+L('Add to cart','أضف للسلة'),'block lg','data-act="add"')}
 ${card(kv([[L('Substitution','الاستبدال'),L('Ask me first','اسألني أولاً')],[L('Your par level','حدك المعتاد'),num(8)+' '+pr(p.unit)],[L('Last ordered','آخر طلب'),dt(-7,{noHijri:true})],[L('Origin','المنشأ'),L('Sample country','بلد تجريبي')]]))}`;}});
R({id:'b-cart',role:'customer',nav:'catalog',title:['Cart','السلة'],kind:'list',back:'b-hub',
 empty:['Your cart is empty','سلتك فارغة','Start from your usual list — it’s usually faster.','ابدأ من قائمتك المعتادة — أسرع عادةً.','Load usual list','حمّل القائمة المعتادة'],
 render:()=>`${banner('new','clock',L('Order by <b>6:00 PM</b> for delivery tomorrow 7–10 AM (Riyadh time).','اطلب قبل <b>6:00 م</b> للتوصيل غداً 7–10 ص (بتوقيت الرياض).'))}
 <div class="list">${D.products.slice(0,4).map((p,i)=>prodRow(p,[6,2,3,4][i])).join('')}</div>
 ${card(kv([[L('Subtotal (excl. VAT)','المجموع (غير شامل الضريبة)'),money(1269.3)],[L('Delivery','التوصيل'),L('Free over 500','مجاني فوق 500')],[L('Substitutions','الاستبدال'),L('Ask before substituting','اسأل قبل الاستبدال')]]))}
 ${btn(L('Checkout','إتمام الطلب'),'block lg','data-go="b-checkout"')}`});
R({id:'b-checkout',role:'customer',nav:'catalog',title:['Checkout','إتمام الطلب'],kind:'form',back:'b-cart',
 variants:[['over','Over credit limit','تجاوز حد الائتمان'],['approval','Needs branch approval','يحتاج اعتماد الفرع']],
 error:['Checkout couldn’t be validated','تعذّر التحقق من الطلب','Prices or stock changed. Review the highlighted lines.','تغيّرت الأسعار أو المخزون. راجع الأسطر المظللة.'],
 render:(v)=>`${steps(3,2)}
 ${sec(L('Deliver to','التوصيل إلى'),list([{lead:thumb('store'),t:L('Al-Malqa branch','فرع الملقا'),s:L('RRMA1234 · Receiving 7 AM–12 PM','RRMA1234 · الاستلام 7 ص–12 م'),go:'b-branches'}]))}
 ${sec(L('Delivery window','نافذة التوصيل'),`<div class="filters"><button class="on">${L('Tomorrow 7–10 AM','غداً 7–10 ص')}</button><button>${L('Tomorrow 10–1','غداً 10–1')}</button><button>${L('Sat 7–10 AM','السبت 7–10 ص')}</button></div><div class="small muted">${dt(1)}</div>`)}
 ${sec(L('Payment','الدفع'),seg([L('On credit','آجل'),L('Cash on delivery','عند الاستلام'),L('Bank transfer','تحويل')],0)+
   (v==='over'?banner('bad','alert',`<b>${L('This order is 1,059.94 over your available credit','هذا الطلب يتجاوز ائتمانك المتاح بـ 1,059.94')}</b><br>${L('Pay an overdue invoice, split the order, or request a one-time approval from MENAFoods.','سدّد فاتورة متأخرة، أو قسّم الطلب، أو اطلب موافقة لمرة واحدة من مينا فودز.')}`, ''):
    banner('ok','shield',`${L('Credit available','الائتمان المتاح')} ${money(2600)} · ${L('Net 30 · synced from Zoho Books 14:58','30 يوماً · مزامنة من Zoho Books 14:58')}`)))}
 ${card(kv([[L('Subtotal','المجموع'),money(1269.3)],[L('VAT 15%','ضريبة القيمة المضافة 15%'),money(190.4)],[`<b>${L('Total incl. VAT','الإجمالي شامل الضريبة')}</b>`,`<b>${money(1459.7)}</b>`]].concat(v==='over'?[]:[])))}
 ${field(L('PO number (optional)','رقم أمر الشراء (اختياري)'),'',{ltr:true,ph:'PO-'})}
 ${v==='over'?`<div class="grid2">${btn(L('Pay overdue','سدّد المتأخر'),'sec','data-go="b-finance"')}${btn(L('Request approval','اطلب موافقة'),'warn','data-act="submit"')}</div>`:
   v==='approval'?banner('new','inbox',L('Above your 2,500 spending limit → sent to <b>Sara (Approver)</b> before MENAFoods receives it.','يتجاوز حد إنفاقك 2,500 ← يُرسل إلى <b>سارة (المعتمدة)</b> قبل وصوله إلى مينا فودز.'))+btn(L('Send for approval','أرسل للاعتماد'),'block lg','data-go="b-submitted"'):
   btn(L('Place order','أكّد الطلب')+' · '+money(1459.7),'block lg','data-go="b-submitted"')}`});
R({id:'b-submitted',role:'customer',nav:'orders',title:['Order placed','تم الطلب'],kind:'detail',
 variants:[['approval','Sent for branch approval','أُرسل لاعتماد الفرع']],
 render:(v)=>`<div class="state ${v?'tone-prog':'tone-ok'}"><div class="art">${ic(v?'inbox':'check')}</div>
 <h2>${v?L('Sent to Sara for approval','أُرسل إلى سارة للاعتماد'):L('Order SO-S-88240 placed','تم تأكيد الطلب SO-S-88240')}</h2>
 <p>${v?L('We’ll notify you on WhatsApp when it’s approved. Approvals usually take under 2 hours.','سنبلغك عبر واتساب عند الاعتماد. يتم الاعتماد عادةً خلال ساعتين.'):L('Delivery tomorrow 7–10 AM to Al-Malqa branch. You’ll get a WhatsApp update when it’s on the way.','التوصيل غداً 7–10 ص إلى فرع الملقا. ستصلك رسالة واتساب عند خروجه للتوصيل.')}</p></div>
 ${card(tl(v?[{t:L('Submitted by Khalid','أرسله خالد'),s:dt(0,{time:true,noHijri:true})},{t:L('Branch approval (Sara)','اعتماد الفرع (سارة)'),s:L('Waiting · SLA 2h','بالانتظار · خلال ساعتين'),tone:'prog',icon:'clock'},{t:L('MENAFoods confirms','تأكيد مينا فودز'),s:'',tone:'hold',icon:'more'}]:
 [{t:L('Placed','تم الطلب'),s:dt(0,{time:true,noHijri:true})},{t:L('Confirmed & picking','مؤكد وجاري التجهيز'),s:L('Tonight','الليلة'),tone:'hold',icon:'box'},{t:L('Out for delivery','خرج للتوصيل'),s:L('Tomorrow 7–10 AM','غداً 7–10 ص'),tone:'hold',icon:'truck'}]))}
 <div class="grid2">${btn(L('View order','عرض الطلب'),'sec','data-go="b-order"')}${btn(L('Back to Today','العودة لليوم'),'','data-go="b-hub"')}</div>`});
R({id:'b-approvals',role:'customer',nav:'hub',title:['Approvals','الاعتمادات'],kind:'list',denied:true,
 empty:['No orders waiting','لا طلبات بانتظار الاعتماد','Orders from branch buyers above their limit will appear here.','ستظهر هنا طلبات مشتري الفروع التي تتجاوز حدودهم.'],
 variants:[['detail','Reviewing one order (edit qty)','مراجعة طلب (تعديل الكمية)']],
 render:(v)=> v==='detail'?`${card(`<div class="row"><div class="grow"><b>${L('Al-Malqa branch · Khalid','فرع الملقا · خالد')}</b><div class="small muted">SO-S-88239 · ${dt(0,{time:true,noHijri:true})}</div></div>${sla(95)}</div>${banner('wait','alert',L('Over Khalid’s spending limit by 910.25','يتجاوز حد إنفاق خالد بـ 910.25'))}`)}
 <div class="list">${D.products.slice(0,3).map((p,i)=>prodRow(p,[12,4,6][i])).join('')}</div>
 ${field(L('Comment to buyer','ملاحظة للمشتري'),L('Reduced rice to 8 — we have stock','خفضت الأرز إلى 8 — لدينا مخزون'))}
 ${card(kv([[L('Total excl. VAT','الإجمالي غير شامل الضريبة'),money(3410.25)],[L('Branch budget left (Nov)','المتبقي من ميزانية الفرع (نوفمبر)'),money(5800)]]))}
 <div class="grid2">${btn(ic('x','sm')+L('Reject','رفض'),'sec','data-act="reject"')}${btn(ic('check','sm')+L('Approve','اعتماد'),'','data-act="approve"')}</div>`:
 `${filters([[L('Waiting','بالانتظار'),2],[L('Approved','معتمد'),11],[L('Rejected','مرفوض'),1]])}
 <div class="queue">${qi({tone:'prog',icon:'inbox',t:L('Al-Malqa · Khalid · 9 items','الملقا · خالد · 9 أصناف'),s:L('Over limit by 910.25 · includes 1 off-list item','يتجاوز الحد بـ 910.25 · يشمل صنفاً خارج القائمة'),chips:money(3410.25,{ex:true}),sla:95,go:'b-approvals?detail',swipe:'demo',act:btn(L('Review','مراجعة'),'sm','data-go="b-approvals?detail"')})}
 ${qi({tone:'wait',icon:'inbox',t:L('Al-Nakheel · Mona · 4 items','النخيل · منى · 4 أصناف'),s:L('Off-list item: Mozzarella 2.3 kg','صنف خارج القائمة: موزاريلا 2.3 كجم'),chips:money(612.8,{ex:true}),sla:22,swipe:true,act:btn(L('Review','مراجعة'),'sm','data-go="b-approvals?detail"')})}</div>
 <p class="tiny muted ios-only">${L('Tip: swipe a request to approve or reject.','تلميح: اسحب الطلب للاعتماد أو الرفض.')}</p>`});
R({id:'b-orders',role:'customer',nav:'orders',title:['Orders','الطلبات'],kind:'list',
 empty:['No orders yet','لا توجد طلبات بعد','Your first order takes about 2 minutes.','طلبك الأول يستغرق دقيقتين تقريباً.','Browse catalog','تصفح الكتالوج'],
 render:()=>`${filters([[L('Open','مفتوحة'),3],[L('Delivered','مُسلّمة')],[L('Issues','مشاكل'),1],[L('All branches','كل الفروع')]])}
 <div class="queue">${[
  ['new','truck','SO-S-88213',L('Out for delivery · ETA 4:30 PM','خرج للتوصيل · الوصول 4:30 م'),2840.5,chip('new',L('On the way','في الطريق'))],
  ['prog','box','SO-S-88240',L('Picking · tomorrow 7–10 AM','قيد التجهيز · غداً 7–10 ص'),1269.3,chip('prog',L('Picking','تجهيز'))],
  ['wait','inbox','SO-S-88239',L('Waiting branch approval','بانتظار اعتماد الفرع'),3410.25,chip('wait',L('Approval','اعتماد'))],
  ['bad','alert','SO-S-88102',L('Delivered · 1 item short','مُسلّم · نقص صنف واحد'),1932.0,chip('bad',L('Issue','مشكلة'))],
  ['ok','check','SO-S-88077',L('Delivered '+'8 Nov','سُلّم 8 نوفمبر'),2210.75,chip('ok',L('Delivered','مُسلّم'))]
 ].map(o=>qi({tone:o[0],icon:o[1],t:ltr(o[2])+' · '+money(o[4],{ex:true}),s:o[3],chips:o[5],go:'b-order'})).join('')}</div>`});
R({id:'b-order',role:'customer',nav:'orders',title:['Order SO-S-88213','الطلب SO-S-88213'],kind:'detail',back:'b-orders',
 variants:[['delivered','Delivered + POD','مُسلّم + إثبات التسليم']],
 render:(v)=>`${card(`<div class="row"><div class="grow"><b>${v?L('Delivered 4:41 PM','سُلّم 4:41 م'):L('Arriving 4:30–5:00 PM','يصل 4:30–5:00 م')}</b><div class="small muted">${L('Driver Faisal · stop 3 of 7','السائق فيصل · المحطة 3 من 7')}</div></div>${v?chip('ok',L('Delivered','مُسلّم')):chip('new',L('On the way','في الطريق'))}</div>`)}
 ${v?'':`<div class="map"><div class="pin" style="top:40%;left:30%;background:var(--s-new)"><span>${ic('truck','sm')}</span></div><div class="pin" style="top:22%;left:66%;background:var(--brand)"><span>${ic('store','sm')}</span></div><span class="lbl">${L('Map placeholder','خريطة توضيحية')}</span></div>
 <div class="grid2">${btn(ic('phone','sm')+L('Call driver','اتصل بالسائق'),'sec')}${btn(ic('chat','sm')+'WhatsApp','sec')}</div>`}
 ${sec(L('Timeline','المراحل'),card(tl([{t:L('Placed by Khalid','طلبه خالد'),s:dt(-1,{time:true,noHijri:true})},{t:L('Approved by Sara','اعتمدته سارة'),s:L('38 min after','بعد 38 دقيقة')},{t:L('Picked · 1 substitution accepted','تم التجهيز · قُبل استبدال واحد'),s:L('Oil 18 L → Brand B (you allowed)','زيت 18 لتر ← العلامة B (سمحت بذلك)'),tone:'wait',icon:'repeat'},{t:L('Out for delivery','خرج للتوصيل'),s:time(14,5),tone:v?'ok':'new',icon:'truck'},{t:L('Delivered & signed','سُلّم ووُقّع'),s:v?time(16,41):'',tone:v?'ok':'hold',icon:v?'check':'more'}])))}
 ${v?sec(L('Proof of delivery','إثبات التسليم'),`<div class="grid2"><div class="photo">${ic('camera')}</div><div class="sig">${L('Signature · Ali (receiver)','توقيع · علي (المستلم)')}</div></div>`)+`<div class="grid2">${btn(ic('alert','sm')+L('Report issue','أبلغ عن مشكلة'),'sec')}${btn(ic('repeat','sm')+L('Buy again','اطلب مجدداً'),'','data-go="b-cart"')}</div>`:''}
 ${card(kv([[L('Items','الأصناف'),num(9)],[L('Subtotal','المجموع'),money(2470)],[L('VAT 15%','الضريبة 15%'),money(370.5)],[L('Total','الإجمالي'),money(2840.5)],[L('Invoice','الفاتورة'),ltr('INV-S-20466')]]))}`});
R({id:'b-finance',role:'customer',nav:'finance',title:['Invoices & statement','الفواتير وكشف الحساب'],kind:'dash',
 empty:['No invoices yet','لا فواتير بعد','Invoices appear here after your first delivery, cleared by ZATCA.','تظهر الفواتير هنا بعد أول توصيل، معتمدة من هيئة الزكاة.'],
 render:()=>`<div class="kpis">${kpi(L('Credit limit','حد الائتمان'),money(40000),L('Zoho Books · synced 14:58','Zoho Books · مزامنة 14:58'))}${kpi(L('Used','المستخدم'),money(37400),'94%','wait')}${kpi(L('Available','المتاح'),money(2600),'','wait')}${kpi(L('Overdue','متأخر'),money(6200),L('oldest 6 days','الأقدم 6 أيام'),'bad')}</div>
 ${card(`<div class="sec-h"><h3>${L('Aging','أعمار الديون')}</h3><span class="small muted">${L('Net 30','30 يوماً')}</span></div><div style="margin-top:8px" class="stack">${agingBar([31200,6200,0,0,0])}</div>`)}
 ${banner('bad','alert',`<b>${L('Credit 94% used','استُخدم 94% من الائتمان')}</b> — ${L('pay INV-S-20418 to free 6,200.','سدّد INV-S-20418 لتحرير 6,200.')}`,btn(L('Pay now','ادفع الآن'),'sm danger'))}
 ${tabs([L('Invoices','الفواتير'),L('Payments','المدفوعات'),L('Statement','كشف الحساب')])}
 <div class="queue">${[['bad','INV-S-20418',6200,L('Due 6 Nov · 6 days late','استحقت 6 نوفمبر · متأخرة 6 أيام'),chip('bad',L('Overdue','متأخرة'))],['wait','INV-S-20466',2840.5,L('Due 12 Dec','تستحق 12 ديسمبر'),chip('wait',L('Open','مفتوحة'))],['ok','INV-S-20391',1932,L('Paid 2 Nov · transfer','دُفعت 2 نوفمبر · تحويل'),chip('ok',L('Paid','مدفوعة'))]].map(o=>qi({tone:o[0],icon:'file',t:ltr(o[1])+' · '+money(o[2]),s:o[3],chips:o[4]+chip('hold','ZATCA ✓',false),act:btn(ic('upload','sm'),'sm sec','aria-label="pdf"')})).join('')}</div>
 <div class="grid2">${btn(ic('file','sm')+L('Statement PDF (AR/EN)','كشف حساب PDF (ع/En)'),'sec')}${btn(ic('upload','sm')+L('Upload transfer proof','ارفع إثبات التحويل'),'sec')}</div>`});
