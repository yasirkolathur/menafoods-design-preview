/* Working-preview guard for older prototype studios. SAMPLE DATA ONLY.
   Every tap gives feedback: real handlers run as before; taps that change nothing
   show a short "simulated" toast; empty links never jump to the top; Back labels go back. */
(function(){
'use strict';
if(window.__mfGuard) return; window.__mfGuard=true;
const ar=()=>((document.documentElement.lang||'')+(document.documentElement.dir||'')).includes('ar')||document.documentElement.dir==='rtl';
const T=(en,a)=>ar()?a:en;
let box=null, tmr=0;
function toast(msg){ if(!box){ box=document.createElement('div'); box.className='mfg-toast'; box.setAttribute('role','status'); box.setAttribute('aria-live','polite'); document.body.appendChild(box); }
  box.textContent=msg; box.classList.add('on'); clearTimeout(tmr); tmr=setTimeout(()=>box.classList.remove('on'),2200); }
const st=document.createElement('style'); st.textContent='.mfg-toast{position:fixed;z-index:2147483000;left:50%;bottom:28px;transform:translate(-50%,12px);max-width:min(92vw,420px);background:#1d2420;color:#fff;border-radius:12px;padding:12px 16px;font:500 14px/1.45 system-ui,"IBM Plex Sans Arabic",sans-serif;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.25)}.mfg-toast.on{opacity:1;transform:translate(-50%,0)}@media (prefers-reduced-motion:reduce){.mfg-toast{transition:none}}';
document.head.appendChild(st);
let muts=0; const mo=new MutationObserver(l=>{ for(const m of l){ if(box&&(m.target===box||box.contains(m.target))) continue; muts++; } });
const startMo=()=>mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,characterData:true});
if(document.body) startMo(); else document.addEventListener('DOMContentLoaded',startMo);
window.__mfDead=0; window.__mfLive=0;
const NATIVE='input,select,textarea,label,summary,option,[contenteditable],video,audio,iframe';
const BACK=/^(back|رجوع|عودة|السابق|‹|←|→)$/i;
window.addEventListener('click',e=>{
  const el=e.target.closest('a,button,[role=button],[role=tab],[role=link],[data-act],[data-go],[onclick],.btn,.chip');
  if(!el||e.target.closest(NATIVE)) return;
  if(el.closest('.mfg-toast')) return;
  const a=el.closest('a'); const hr=a&&a.getAttribute('href');
  if(a&&hr&&!hr.startsWith('#')&&!hr.startsWith('javascript')) return; /* real page link */
  if(a&&(hr==='#'||hr===''||hr==null||hr==='javascript:void(0)')) e.preventDefault();
  if(el.disabled||el.getAttribute('aria-disabled')==='true'){ toast(T('Not available yet in this step','غير متاح بعد في هذه الخطوة')); return; }
  const h0=location.href, m0=muts, y0=scrollY;
  setTimeout(()=>{
    if(location.href!==h0||muts!==m0||scrollY!==y0){ window.__mfLive++; return; }
    window.__mfDead++;
    const lbl=((el.getAttribute('aria-label')||el.textContent||'').trim());
    if(BACK.test(lbl)&&history.length>1){ history.back(); return; }
    toast(T('Simulated in this preview — the full working app is in the 4 Working preview themes','محاكاة في هذه النسخة — التطبيق العامل بالكامل في الثيمات الأربعة العاملة'));
  },260);
},true);
})();
