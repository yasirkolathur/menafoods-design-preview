/* SAMPLE DATA ONLY — fictional businesses, people, prices, stock. Not real prices, stock or brand deals. */
(function(){
const MF=window.MF;
MF.DATA = {
 P:{
  p1:{en:'Basmati rice 40 kg sack',ar:'أرز بسمتي كيس 40 كجم',g:'sack',pk:['Sack · 40 kg','كيس · 40 كجم'],pr:185,u:['4.63 / kg','4.63 / كجم'],cat:'rice',moq:1,stock:'in'},
  p2:{en:'Sunflower oil 18 L tin',ar:'زيت دوار الشمس تنكة 18 لتر',g:'tin',pk:['Tin · 18 L','تنكة · 18 لتر'],pr:96.5,u:['5.36 / L','5.36 / لتر'],cat:'oil',moq:1,stock:'in'},
  p3:{en:'Tomato paste 400 g × 24',ar:'معجون طماطم 400 جم × 24',g:'can',pk:['Case · 24 cans','كرتون · 24 علبة'],pr:58,u:['2.42 / can','2.42 / علبة'],cat:'canned',moq:1,stock:'in'},
  p4:{en:'Full-fat milk 1 L × 12',ar:'حليب كامل الدسم 1 لتر × 12',g:'milk',pk:['Case · 12 × 1 L','كرتون · 12 × 1 لتر'],pr:62.4,u:['5.20 / L','5.20 / لتر'],cat:'dairy',moq:2,stock:'in'},
  p5:{en:'Frozen chicken 1 kg × 10',ar:'دجاج مجمد 1 كجم × 10',g:'frozen',pk:['Case · 10 kg','كرتون · 10 كجم'],pr:139,u:['13.90 / kg','13.90 / كجم'],cat:'frozen',moq:1,stock:'low'},
  p6:{en:'White sugar 50 kg sack',ar:'سكر أبيض كيس 50 كجم',g:'sack',pk:['Sack · 50 kg','كيس · 50 كجم'],pr:142,u:['2.84 / kg','2.84 / كجم'],cat:'rice',moq:1,stock:'in'},
  p7:{en:'Takeaway boxes × 500',ar:'علب سفري × 500',g:'box',pk:['Carton · 500 pcs','كرتون · 500 قطعة'],pr:88,u:['0.18 / pc','0.18 / قطعة'],cat:'pack',moq:1,stock:'in'},
  p8:{en:'Chickpeas 400 g × 24',ar:'حمص معلب 400 جم × 24',g:'can',pk:['Case · 24 cans','كرتون · 24 علبة'],pr:52.8,u:['2.20 / can','2.20 / علبة'],cat:'canned',moq:1,stock:'in'},
  p9:{en:'Labneh 1 kg × 6 (sample brand)',ar:'لبنة 1 كجم × 6 (علامة تجريبية)',g:'milk',pk:['Case · 6 tubs','كرتون · 6 علب'],pr:44,u:['7.33 / kg','7.33 / كجم'],cat:'dairy',moq:1,stock:'in',sp:true},
  p10:{en:'Ground cumin 1 kg',ar:'كمون مطحون 1 كجم',g:'jar',pk:['Jar · 1 kg','برطمان · 1 كجم'],pr:36.75,u:['36.75 / kg','36.75 / كجم'],cat:'spice',moq:1,stock:'in'},
  p11:{en:'Mozzarella 2 kg × 6',ar:'جبنة موزاريلا 2 كجم × 6',g:'cheese',pk:['Case · 12 kg','كرتون · 12 كجم'],pr:168,u:['14.00 / kg','14.00 / كجم'],cat:'dairy',moq:1,stock:'low'},
  p12:{en:'Eggs 30 × 12 trays',ar:'بيض 30 × 12 طبق',g:'egg',pk:['Case · 360 eggs','كرتون · 360 بيضة'],pr:210,u:['0.58 / egg','0.58 / بيضة'],cat:'dairy',moq:1,stock:'out'}
 },
 CATS:[['rice','sack',['Rice, grains & sugar','الأرز والحبوب والسكر']],['oil','tin',['Oils & fats','الزيوت والدهون']],['dairy','milk',['Dairy & eggs','الألبان والبيض']],['frozen','frozen',['Frozen','المجمدات']],['canned','can',['Canned','المعلبات']],['spice','jar',['Spices','البهارات']],['pack','box',['Packaging','التغليف']]],
 credit:{limit:15000,used:6480,avail:8520,overdue:2140,inv:'INV-2026-0412'},
};
})();
