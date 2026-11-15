/* Souq Modern · tiny runtime hooks (sample data only). */
(function(){const MF=window.MF;
MF.after=(C)=>{ /* welcome strip on customer home: Ramadan/market-day style banner */
 if(C.id==='b.home' && C.state==='default'){ const m=document.getElementById('main'); if(m && !m.querySelector('.souq-wm')){ const d=document.createElement('div'); d.className='souq-wm'; d.innerHTML=`<span style="flex:1"><b>${MF.t('Market day · Tuesday basket','يوم السوق · سلة الثلاثاء')}</b>${MF.t('Your usual list is ready, delivered tomorrow 7–9 AM.','قائمتك المعتادة جاهزة، والتوصيل غدًا 7–9 صباحًا.')}</span>`; const seg=m.querySelector('.proto,.seg'); (seg?seg.nextSibling:m.firstChild) ? m.insertBefore(d, seg?seg.nextSibling:m.firstChild) : m.appendChild(d);} } };
})();
