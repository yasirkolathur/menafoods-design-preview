/* SAMPLE DATA ONLY — fictional businesses, people, SKUs and prices. Not MENAFoods data. */
const D = {
 me:{en:'Ahmed',ar:'أحمد'},
 biz:{en:'Al-Nada Grocery (Sample)',ar:'تموينات الندى (تجريبي)'},
 branch:{en:'Al-Malqa branch',ar:'فرع الملقا'},
 customers:[
  {id:'c1',en:'Sufrat Al-Bait Restaurant',ar:'مطعم سفرة البيت',seg:['Restaurant','مطعم'],city:['Riyadh','الرياض'],st:'ok',risk:'ok',limit:80000,used:61200,overdue:0,last:-2,ini:'س'},
  {id:'c2',en:'Al-Nada Grocery',ar:'تموينات الندى',seg:['Grocery','بقالة'],city:['Riyadh','الرياض'],st:'wait',risk:'wait',limit:40000,used:37400,overdue:6200,last:-9,ini:'ن'},
  {id:'c3',en:'Sand Star Hotel',ar:'فندق نجمة الرمال',seg:['Hotel','فندق'],city:['Makkah','مكة المكرمة'],st:'ok',risk:'ok',limit:250000,used:118000,overdue:0,last:-1,ini:'ف'},
  {id:'c4',en:'Golden Hospitality Catering',ar:'الضيافة الذهبية للإعاشة',seg:['Catering','إعاشة'],city:['Jeddah','جدة'],st:'bad',risk:'bad',limit:300000,used:296500,overdue:48900,last:-15,ini:'ض'},
  {id:'c5',en:'Sunbula Bakery',ar:'مخبز سنبلة',seg:['Bakery','مخبز'],city:['Dammam','الدمام'],st:'new',risk:'new',limit:0,used:0,overdue:0,last:null,ini:'م'},
  {id:'c6',en:'Habba Coffee',ar:'مقهى حبة بن',seg:['Cafe','مقهى'],city:['Riyadh','الرياض'],st:'ok',risk:'ok',limit:25000,used:8300,overdue:0,last:-3,ini:'ح'},
 ],
 products:[
  {sku:'MF-RIC-1010',en:'Basmati Rice Sella 10 kg',ar:'أرز بسمتي سيلا 10 كجم',brand:'Sample Brand A',unit:['Bag','كيس'],case:4,price:96.5,moq:2,stock:'ok',icon:'box'},
  {sku:'MF-OIL-0518',en:'Sunflower Oil 18 L tin',ar:'زيت دوار الشمس 18 لتر تنك',brand:'Sample Brand B',unit:['Tin','تنك'],case:1,price:142.0,moq:1,stock:'ok',icon:'box'},
  {sku:'MF-CHK-1200',en:'Frozen Whole Chicken 1.2 kg ×10',ar:'دجاج كامل مجمد 1.2 كجم ×10',brand:'Sample Brand C',unit:['Carton','كرتون'],case:10,price:118.75,moq:1,stock:'low',icon:'temp'},
  {sku:'MF-MOZ-2205',en:'Mozzarella Block 2.3 kg',ar:'جبنة موزاريلا قالب 2.3 كجم',brand:'Sample Brand D',unit:['Block','قالب'],case:6,price:54.2,moq:2,stock:'ok',icon:'temp'},
  {sku:'MF-TOM-0800',en:'Tomato Paste 800 g ×12',ar:'معجون طماطم 800 جم ×12',brand:'Sample Brand E',unit:['Carton','كرتون'],case:12,price:63.0,moq:1,stock:'out',icon:'box'},
  {sku:'MF-SUG-5000',en:'White Sugar 5 kg',ar:'سكر أبيض 5 كجم',brand:'Sample Brand F',unit:['Bag','كيس'],case:6,price:21.9,moq:3,stock:'ok',icon:'box'},
 ],
};
const nm = o => S.lang==='ar'?o.ar:o.en;
const pr = (p,i) => (Array.isArray(p)?p[S.lang==='ar'?1:0]:p);
