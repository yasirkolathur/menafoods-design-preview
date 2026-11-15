/* Fresh Market · runtime hooks: product photography + hero banner (sample data, generated photos, no brands). */
(function(){const MF=window.MF;
const PH=['sack','tin','can','milk','box','frozen','jar','cheese','egg'];
MF.GX=(g,s)=> PH.includes(g) ? `<img class="ph" src="assets/img/${g}.webp" alt="" width="${s}" height="${s}" loading="lazy" decoding="async">` : null || `<img class="ph" src="assets/img/box.webp" alt="" width="${s}" height="${s}">`;
MF.after=(C)=>{ if(!['b.home','b.catalog','rw.home'].includes(C.id) || !['default','offline'].includes(C.state)) return; const m=document.getElementById('main'); if(!m||m.querySelector('.fm-hero')) return; const t=MF.t;
 const d=document.createElement('section'); d.className='fm-hero'; d.setAttribute('aria-label',t('This week','هذا الأسبوع'));
 d.innerHTML=`<span class="sc" aria-hidden="true"></span><span class="tag">${t('Sample','عينة')}</span><div class="in"><b>${t('Fresh for your kitchen','طازج لمطبخك')}</b><span>${t('Case deals on staples this week. Order by 6 PM for tomorrow.','عروض الكراتين على الأساسيات هذا الأسبوع. اطلب قبل 6 مساءً للتوصيل غدًا.')}</span><a href="${MF.href('b.catalog',{v:'all'})}">${t('Shop deals','تسوّق العروض')}</a></div>`;
 const seg=m.querySelector(':scope > .proto, :scope > .seg'); const after=C.id==='b.home'?m.querySelector(':scope > .search'):null;
 if(after) after.after(d); else m.insertBefore(d, seg?seg.nextSibling:m.firstChild); };
})();
