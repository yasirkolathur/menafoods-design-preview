/* Pro Ops · runtime hooks: dark-first default + live status strip (sample data only). */
(function(){const MF=window.MF; MF.DEFAULT_THEME='dark';
MF.after=(C)=>{ document.documentElement.dataset.area=C.def.a||''; if(['loading','error','denied'].includes(C.state)) return; const m=document.getElementById('main'); if(!m||m.querySelector('.ops')) return;
 const t=MF.t; const off=C.state==='offline';
 const d=document.createElement('div'); d.className='ops'; d.setAttribute('role','status');
 d.innerHTML=`<span class="${off?'w':''}"><i aria-hidden="true"></i>${off?t('Offline · queue 3','غير متصل · 3 بالانتظار'):t('Synced 10:42','مُزامن 10:42')}</span><span>${t('Zoho Books','زوهو بوكس')} · ${t('OK','سليم')}</span><span>${t('Sun 15 Nov','الأحد 15 نوفمبر')}</span><span>${t('SAMPLE','عينة')}</span>`;
 const seg=m.querySelector(':scope > .proto, :scope > .seg'); m.insertBefore(d, seg||m.firstChild); };
})();
