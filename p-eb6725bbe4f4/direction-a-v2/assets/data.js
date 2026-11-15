/* SAMPLE DATA ONLY — fictional businesses, people, prices and stock. Not MENAFoods data. */
(function(){
const MF = window.MF;
MF.nm = o => MF.S.lang==='ar' ? (o.ar||o.en) : (o.en||o.ar);
MF.D = {
 me:{en:'Hala A. (sample)',ar:'هالة ع. (تجريبي)'},
 biz:{en:'Fig Leaf Kitchen',ar:'مطعم ورقة التين',cr:'7001234567',vat:'310123456700003'},
 branch:{en:'Olaya branch',ar:'فرع العليا'},
 products:[
  {sku:'MF-RIC-1010',en:'Sella basmati rice 10 kg',ar:'أرز بسمتي سيلا 10 كجم',unit:{en:'Bag',ar:'كيس'},pack:'BAG 10KG',price:78.50,par:12,on:5,moq:2,cat:'rice',last:'2026-11-08',stock:'in'},
  {sku:'MF-OIL-1806',en:'Sunflower oil 1.8 L × 6',ar:'زيت دوار الشمس 1.8 لتر × 6',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 6×1.8L',price:96.00,par:8,on:3,moq:1,cat:'oil',last:'2026-11-08',stock:'in'},
  {sku:'MF-CHS-2006',en:'Shredded mozzarella 2 kg × 6',ar:'جبن موزاريلا مبشور 2 كجم × 6',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 6×2KG',price:212.00,par:6,on:4,moq:1,cat:'dairy',last:'2026-11-05',stock:'low',lock:true},
  {sku:'MF-CHK-1010',en:'Frozen whole chicken 1000 g × 10',ar:'دجاج كامل مجمد 1000 جم × 10',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 10×1000G',price:118.00,par:10,on:2,moq:2,cat:'frozen',last:'2026-11-08',stock:'in'},
  {sku:'MF-TOM-0424',en:'Tomato paste 400 g × 24',ar:'معجون طماطم 400 جم × 24',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 24×400G',price:64.75,par:4,on:4,moq:1,cat:'canned',last:'2026-10-29',stock:'in'},
  {sku:'MF-FRY-2504',en:'Frozen fries 9 mm 2.5 kg × 4',ar:'بطاطس مقلية مجمدة 9 مم 2.5 كجم × 4',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 4×2.5KG',price:89.00,par:6,on:1,moq:1,cat:'frozen',last:'2026-11-05',stock:'out',eta:'2026-11-15'},
  {sku:'MF-SPC-0101',en:'Kabsa spice mix 1 kg',ar:'بهارات كبسة 1 كجم',unit:{en:'Pack',ar:'عبوة'},pack:'PCK 1KG',price:32.00,par:5,on:3,moq:1,cat:'spices',last:'2026-10-22',stock:'in'},
  {sku:'MF-PKG-0750',en:'Takeaway container 750 ml × 300',ar:'علب سفري 750 مل × 300',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 300×750ML',price:145.00,par:3,on:1,moq:1,cat:'packaging',last:'2026-10-29',stock:'in'},
  {sku:'MF-MLK-1012',en:'UHT full-cream milk 1 L × 12',ar:'حليب كامل الدسم طويل الأجل 1 لتر × 12',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 12×1L',price:52.80,par:10,on:6,moq:2,cat:'dairy',last:'2026-11-08',stock:'in'},
  {sku:'MF-THN-1800',en:'Tahini 18 kg tin',ar:'طحينة 18 كجم تنكة',unit:{en:'Tin',ar:'تنكة'},pack:'TIN 18KG',price:265.00,par:1,on:0,moq:1,cat:'canned',last:'2026-10-15',stock:'in'}
 ],
 cats:[['all',{en:'All',ar:'الكل'}],['rice',{en:'Rice & grains',ar:'أرز وحبوب'}],['oil',{en:'Oils & ghee',ar:'زيوت وسمن'}],['dairy',{en:'Dairy & cheese',ar:'ألبان وأجبان'}],['frozen',{en:'Frozen',ar:'مجمدات'}],['canned',{en:'Canned & pastes',ar:'معلبات'}],['spices',{en:'Spices',ar:'بهارات'}],['packaging',{en:'Packaging',ar:'تغليف'}]],
 branches:[
  {id:'olaya',en:'Olaya branch',ar:'فرع العليا',addr:'RRRD2929',buyer:{en:'Hala A.',ar:'هالة ع.'},cap:8000,spent:5120},
  {id:'malqa',en:'Al Malqa branch',ar:'فرع الملقا',addr:'RMQA4412',buyer:{en:'Omar S.',ar:'عمر س.'},cap:6000,spent:5890},
  {id:'narjis',en:'Al Narjis branch',ar:'فرع النرجس',addr:'RNRA7310',buyer:{en:'Faisal K.',ar:'فيصل ك.'},cap:5000,spent:1240}
 ],
 customers:[
  {id:'c1',en:'Fig Leaf Kitchen',ar:'مطعم ورقة التين',seg:{en:'Restaurant',ar:'مطعم'},city:{en:'Riyadh',ar:'الرياض'},limit:60000,used:41250,status:'active',risk:'ok',last:'2026-11-08',usual:{en:'Sun & Wed',ar:'الأحد والأربعاء'}},
  {id:'c2',en:'Golden Palm Grocery',ar:'تموينات النخلة الذهبية',seg:{en:'Grocery',ar:'تموينات'},city:{en:'Riyadh',ar:'الرياض'},limit:25000,used:23900,status:'hold',risk:'bad',last:'2026-11-02',usual:{en:'Mon',ar:'الاثنين'}},
  {id:'c3',en:'Blue Oasis Hotel',ar:'فندق الواحة الزرقاء',seg:{en:'Hotel',ar:'فندق'},city:{en:'Jeddah',ar:'جدة'},limit:150000,used:62400,status:'active',risk:'ok',last:'2026-11-10',usual:{en:'Weekly Thu',ar:'الخميس أسبوعياً'}},
  {id:'c4',en:'Masar Catering Co.',ar:'شركة إعاشة المسار',seg:{en:'Catering',ar:'إعاشة'},city:{en:'Makkah',ar:'مكة المكرمة'},limit:300000,used:288000,status:'hold',risk:'bad',last:'2026-10-21',usual:{en:'Daily',ar:'يومياً'}},
  {id:'c5',en:'Sunbula Bakery',ar:'مخبز السنبلة',seg:{en:'Bakery',ar:'مخبز'},city:{en:'Dammam',ar:'الدمام'},limit:0,used:0,status:'prospect',risk:'n',last:null,usual:{en:'—',ar:'—'}},
  {id:'c6',en:'Raml Coffee',ar:'مقهى رمل',seg:{en:'Cafe',ar:'مقهى'},city:{en:'Riyadh',ar:'الرياض'},limit:6000,used:3100,status:'active',risk:'ok',last:'2026-10-30',usual:{en:'Tue',ar:'الثلاثاء'}}
 ],
 orders:[
  {no:'SO-26-04812',date:'2026-11-12',st:'pending',total:2846.20,lines:9,branch:'olaya'},
  {no:'SO-26-04790',date:'2026-11-11',st:'approval',total:6420.00,lines:14,branch:'malqa'},
  {no:'SO-26-04733',date:'2026-11-08',st:'delivered',total:3118.75,lines:11,branch:'olaya'},
  {no:'SO-26-04701',date:'2026-11-05',st:'partial',total:1984.00,lines:7,branch:'narjis'},
  {no:'SO-26-04655',date:'2026-11-01',st:'delivered',total:2760.40,lines:10,branch:'olaya'}
 ],
 invoices:[
  {no:'INV-26-11873',date:'2026-11-08',due:'2026-12-08',amt:3586.56,st:'open'},
  {no:'INV-26-11702',date:'2026-10-29',due:'2026-11-28',amt:2281.60,st:'open'},
  {no:'INV-26-11455',date:'2026-10-12',due:'2026-11-11',amt:4410.90,st:'overdue'},
  {no:'INV-26-11021',date:'2026-09-20',due:'2026-10-20',amt:1975.00,st:'paid'}
 ],
 // Owner decisions (v2): accountant approves up to 10,000; above 10,000 also needs the manager. Hold after 7 days overdue.
 policy:{acctMax:10000, holdDay:7, sched:[-3,0,2,4,6,7]},
 // Per-SKU par-level change history (SAMPLE). who/role bilingual; when = Riyadh time.
 parHist:{
  'MF-RIC-1010':[{who:{en:'Yousef M.',ar:'يوسف م.'},role:'sales',o:10,n:12,when:'2026-11-10',t:'11:05',why:{en:'Weekend brunch menu added',ar:'أُضيفت قائمة فطور نهاية الأسبوع'}},{who:{en:'Hala A.',ar:'هالة ع.'},role:'cust',o:8,n:10,when:'2026-10-02',t:'09:40',why:null}],
  'MF-CHK-1010':[{who:{en:'Hala A.',ar:'هالة ع.'},role:'cust',o:12,n:10,when:'2026-11-09',t:'21:14',why:{en:'Freezer space is tight on Wednesdays',ar:'مساحة الفريزر محدودة يوم الأربعاء'}},{who:{en:'Yousef M.',ar:'يوسف م.'},role:'sales',o:8,n:12,when:'2026-09-14',t:'12:30',why:{en:'Matched 8-week average use',ar:'مطابقة متوسط الاستهلاك لـ 8 أسابيع'}}],
  'MF-FRY-2504':[{who:{en:'Nora R.',ar:'نورة ر.'},role:'cust',o:4,n:6,when:'2026-11-04',t:'16:02',why:null}],
  'MF-MLK-1012':[{who:{en:'Yousef M.',ar:'يوسف م.'},role:'sales',o:8,n:10,when:'2026-10-21',t:'10:12',why:{en:'New coffee station',ar:'ركن قهوة جديد'}}]
 }
};
// preload the cart with par suggestions (usual list -> suggested qty = par - on hand, rounded to MOQ)
MF.sugg = p => { if (p.stock==='out') return 0; const d = Math.max(0, p.par - p.on); return d===0?0:Math.max(p.moq, d); };
MF.D.products.forEach(p => { MF.S.cart[p.sku] = MF.sugg(p); });
MF.cartLines = () => MF.D.products.filter(p => (MF.S.cart[p.sku]||0) > 0);
MF.subtotal = () => MF.cartLines().reduce((s,p)=>s+p.price*MF.S.cart[p.sku],0);
MF.prod = sku => MF.D.products.find(p=>p.sku===sku);
})();
