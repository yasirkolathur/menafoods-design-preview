/* SAMPLE DATA ONLY — بيانات تجريبية. Fake businesses, fake brands, fake prices. Not MENAFoods data. */
const FOOD={
 rice:['#F7EBD3','<path d="M22 20h36l6 44a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6z" fill="#E9CFA0"/><path d="M22 20c2-6 34-6 36 0" fill="#D9B77C"/><rect x="26" y="36" width="28" height="16" rx="4" fill="#B5502A"/><circle cx="40" cy="44" r="4" fill="#F3C574"/>'],
 oil:['#FFF3D6','<rect x="24" y="22" width="32" height="46" rx="6" fill="#F3C574"/><rect x="30" y="12" width="20" height="12" rx="3" fill="#9B6411"/><rect x="28" y="38" width="24" height="16" rx="3" fill="#fff" opacity=".8"/><path d="M40 41c3 4 3 7 0 9-3-2-3-5 0-9z" fill="#E8A33D"/>'],
 cheese:['#FFF6DB','<path d="M12 50 58 24l10 26z" fill="#F5D46B"/><path d="M12 50h56v14H12z" fill="#EDC04A"/><circle cx="30" cy="57" r="3" fill="#D9A92E"/><circle cx="50" cy="44" r="3" fill="#E5B83E"/><circle cx="58" cy="58" r="2.5" fill="#D9A92E"/>'],
 chicken:['#FBE7DC','<path d="M46 20c12 0 18 10 14 20-3 8-12 10-18 8l-14 14c-2 2-6 4-8 1-3-2-1-6 1-8l14-14c-3-6-1-21 11-21z" fill="#E0997A"/><circle cx="20" cy="64" r="5" fill="#F7EFE3"/>'],
 flour:['#F4EFE6','<path d="M18 22h44v40a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8z" fill="#fff" stroke="#E2CFB3" stroke-width="2"/><path d="M18 22l6-8h32l6 8" fill="#EFE2CF"/><path d="M40 34c-6 4-6 12 0 18 6-6 6-14 0-18z" fill="#E8A33D"/>'],
 can:['#FCE3DA','<rect x="22" y="18" width="36" height="46" rx="6" fill="#C2452D"/><rect x="22" y="30" width="36" height="20" fill="#fff" opacity=".9"/><circle cx="40" cy="40" r="6" fill="#C2452D"/>'],
 fries:['#FFF0D4','<path d="M22 36h36l-4 30H26z" fill="#B5502A"/><g fill="#F3C574"><rect x="26" y="14" width="5" height="26" rx="2"/><rect x="33" y="10" width="5" height="28" rx="2"/><rect x="40" y="14" width="5" height="26" rx="2"/><rect x="47" y="12" width="5" height="28" rx="2"/></g>'],
 spice:['#FDE9D6','<rect x="26" y="26" width="28" height="40" rx="6" fill="#C8693A"/><rect x="24" y="16" width="32" height="12" rx="3" fill="#7A3017"/><rect x="30" y="38" width="20" height="14" rx="3" fill="#FBF1EA"/>'],
 milk:['#E9F1F7','<path d="M28 24h24v42H28z" fill="#fff" stroke="#BCD0E2" stroke-width="2"/><path d="M28 24l4-10h16l4 10" fill="#DCE8F2"/><rect x="28" y="40" width="24" height="12" fill="#2C5D8A"/>'],
 cups:['#EEF4EF','<path d="M24 24h32l-4 42H28z" fill="#fff" stroke="#9FC7B7" stroke-width="2"/><rect x="22" y="18" width="36" height="7" rx="3" fill="#1F6F5C"/><path d="M28 40h24" stroke="#1F6F5C" stroke-width="3"/>'],
 ghee:['#FFF5DA','<rect x="20" y="26" width="40" height="38" rx="8" fill="#F3C574"/><rect x="18" y="20" width="44" height="10" rx="4" fill="#9B6411"/><path d="M30 44h20" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'],
 dates:['#F6E6DA','<g fill="#7A3017"><ellipse cx="30" cy="44" rx="8" ry="13"/><ellipse cx="46" cy="40" rx="8" ry="13"/><ellipse cx="38" cy="54" rx="8" ry="12"/></g><path d="M44 22c4-6 10-8 14-6" stroke="#1F6F5C" stroke-width="3" fill="none"/>']
};
function food(k,size=''){const f=FOOD[k]||FOOD.rice;return {bg:f[0],svg:`<svg viewBox="0 0 80 80" aria-hidden="true">${f[1]}</svg>`}}
const P=[
 {id:'p1',k:'rice',en:'Sella basmati rice 40 kg',ar:'أرز بسمتي سيلا 40 كجم',brand:{en:'Nakhla Gold',ar:'نخلة الذهبي'},sku:'MF-RIC-0040',unit:{en:'Bag',ar:'كيس'},pack:'1 × 40 kg',price:189.00,moq:1,stock:'in',cat:'rice'},
 {id:'p2',k:'oil',en:'Sunflower frying oil 18 L tin',ar:'زيت دوار الشمس للقلي 18 لتر',brand:{en:'Wadi Sun',ar:'شمس الوادي'},sku:'MF-OIL-0018',unit:{en:'Tin',ar:'تنكة'},pack:'1 × 18 L',price:142.50,moq:1,stock:'in',cat:'oil'},
 {id:'p3',k:'cheese',en:'Shredded mozzarella 2 kg',ar:'جبن موزاريلا مبشور 2 كجم',brand:{en:'Dairy Hills',ar:'تلال الألبان'},sku:'MF-CHS-0206',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 6 × 2 kg',price:214.00,moq:1,stock:'low',cat:'dairy'},
 {id:'p4',k:'chicken',en:'Frozen whole chicken 1100 g',ar:'دجاج كامل مجمد 1100 جم',brand:{en:'Najd Farms',ar:'مزارع نجد'},sku:'MF-FRZ-1110',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 10 × 1100 g',price:118.00,moq:2,stock:'in',cat:'frozen'},
 {id:'p5',k:'can',en:'Tomato paste 400 g',ar:'معجون طماطم 400 جم',brand:{en:'Red Valley',ar:'الوادي الأحمر'},sku:'MF-CAN-0424',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 24 × 400 g',price:76.80,moq:1,stock:'in',cat:'canned'},
 {id:'p6',k:'flour',en:'All-purpose flour 45 kg',ar:'دقيق لجميع الاستخدامات 45 كجم',brand:{en:'Sanabel Mills',ar:'مطاحن السنابل'},sku:'MF-FLR-0045',unit:{en:'Bag',ar:'كيس'},pack:'1 × 45 kg',price:96.00,moq:1,stock:'in',cat:'bakery'},
 {id:'p7',k:'fries',en:'Frozen fries 9 mm 2.5 kg',ar:'بطاطس مقلية مجمدة 9 مم 2.5 كجم',brand:{en:'Crisp Co.',ar:'كرسب'},sku:'MF-FRZ-0925',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 4 × 2.5 kg',price:88.00,moq:1,stock:'out',cat:'frozen'},
 {id:'p8',k:'spice',en:'Kabsa spice mix 1 kg',ar:'بهارات كبسة 1 كجم',brand:{en:'Bayt Al-Bahar',ar:'بيت البهار'},sku:'MF-SPC-0106',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 6 × 1 kg',price:64.20,moq:1,stock:'in',cat:'spices'},
 {id:'p9',k:'milk',en:'UHT full-fat milk 1 L',ar:'حليب كامل الدسم طويل الأجل 1 لتر',brand:{en:'Dairy Hills',ar:'تلال الألبان'},sku:'MF-DRY-1012',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 12 × 1 L',price:52.80,moq:2,stock:'in',cat:'dairy'},
 {id:'p10',k:'cups',en:'Paper cups 8 oz',ar:'أكواب ورقية 8 أونصة',brand:{en:'PackRight',ar:'باك رايت'},sku:'MF-PKG-0810',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 1000 pcs',price:71.00,moq:1,stock:'in',cat:'packaging'},
 {id:'p11',k:'ghee',en:'Vegetable ghee 1.6 kg',ar:'سمن نباتي 1.6 كجم',brand:{en:'Golden Dallah',ar:'الدلة الذهبية'},sku:'MF-GHE-0616',unit:{en:'Carton',ar:'كرتون'},pack:'CTN 6 × 1.6 kg',price:165.00,moq:1,stock:'in',cat:'oil'},
 {id:'p12',k:'dates',en:'Khalas dates 3 kg',ar:'تمر خلاص 3 كجم',brand:{en:'Al-Ahsa Grove',ar:'بستان الأحساء'},sku:'MF-DTS-0300',unit:{en:'Box',ar:'صندوق'},pack:'1 × 3 kg',price:45.00,moq:2,stock:'in',cat:'dates'}
];
const PX=Object.fromEntries(P.map(p=>[p.id,p]));
const CATS=[['all','All','الكل'],['rice','Rice','الأرز'],['oil','Oils & ghee','الزيوت والسمن'],['dairy','Dairy & cheese','الألبان والأجبان'],['frozen','Frozen','المجمدات'],['canned','Canned','المعلبات'],['spices','Spices','البهارات'],['bakery','Bakery','المخبوزات'],['packaging','Packaging','التغليف'],['dates','Dates','التمور']];
const BIZ={en:'Sanabel Al-Khair Restaurant',ar:'مطعم سنابل الخير'};
const BRANCHES=[
 {id:'b1',en:'Olaya branch',ar:'فرع العليا',city:{en:'Riyadh',ar:'الرياض'},short:'RAOA 2391',buyer:{en:'Khalid',ar:'خالد'},cap:15000},
 {id:'b2',en:'Al-Malqa branch',ar:'فرع الملقا',city:{en:'Riyadh',ar:'الرياض'},short:'RHMA 7714',buyer:{en:'Huda',ar:'هدى'},cap:10000},
 {id:'b3',en:'Central kitchen',ar:'المطبخ المركزي',city:{en:'Riyadh',ar:'الرياض'},short:'RSSA 4410',buyer:{en:'Nasser',ar:'ناصر'},cap:25000}
];
const CUSTOMERS=[
 {id:'k1',en:'Sanabel Al-Khair Restaurant',ar:'مطعم سنابل الخير',seg:{en:'Restaurant · Kabsa & grills',ar:'مطعم · كبسة ومشويات'},st:'active',risk:'low',limit:60000,used:38400,days:'Sun, Wed',ini:'س',c:'#B5502A'},
 {id:'k2',en:'Bait Al-Qahwa Cafe',ar:'مقهى بيت القهوة',seg:{en:'Cafe · Specialty coffee',ar:'مقهى · قهوة مختصة'},st:'active',risk:'med',limit:20000,used:18700,days:'Thu',ini:'ب',c:'#1F6F5C'},
 {id:'k3',en:'Al-Rawabi Mini Market',ar:'تموينات الروابي',seg:{en:'Grocery · Van sales',ar:'بقالة · مبيعات متنقلة'},st:'hold',risk:'high',limit:15000,used:16200,days:'Mon, Thu',ini:'ر',c:'#9B6411'},
 {id:'k4',en:'Nakheel Hills Hotel',ar:'فندق تلال النخيل',seg:{en:'Hotel · 3 outlets',ar:'فندق · 3 منافذ'},st:'active',risk:'low',limit:150000,used:62000,days:'Sun',ini:'ت',c:'#2C5D8A'},
 {id:'k5',en:'Al-Waha Catering Co.',ar:'شركة الواحة للإعاشة',seg:{en:'Catering · 4 sites',ar:'إعاشة · 4 مواقع'},st:'applying',risk:'med',limit:0,used:0,days:'Daily',ini:'و',c:'#7A3017'},
 {id:'k6',en:'Furn Al-Hara Bakery',ar:'مخبز فرن الحارة',seg:{en:'Bakery',ar:'مخبز'},st:'prospect',risk:'-',limit:0,used:0,days:'-',ini:'ف',c:'#C8693A'}
];
const P_={buyer:{en:'Khalid A. (sample)',ar:'خالد ع. (تجريبي)'},owner:{en:'Noura S. (sample)',ar:'نورة س. (تجريبي)'},sales:{en:'Faisal M.',ar:'فيصل م.'},driver:{en:'Majed',ar:'ماجد'},van:{en:'Saad',ar:'سعد'},store:{en:'Yousef',ar:'يوسف'},acc:{en:'Reem',ar:'ريم'},mgr:{en:'Abdullah',ar:'عبدالله'}};
