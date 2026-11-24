/* MENAFoods · Drive Mode in Settings (design preview, SAMPLE DATA ONLY).
   Drive Mode is no longer a floating button on every page. It lives in Settings / More as
   "Drive Mode: Off / On / Automatic". When it is active, a small "Drive Mode" pill sits in the top bar;
   tapping it opens the voice panel.
   - The preference is stored on this device only (localStorage "mf.drive.v1"). No network calls, no writes,
     in sample and live mode alike. Trip state (car connected, driving detected) is sessionStorage, sample only.
   - Native apps (iOS / Android): Automatic turns on with CarPlay / Android Auto / a car Bluetooth device.
   - Web app (PWA): browsers cannot see car or Bluetooth audio connections, so Automatic can only SUGGEST
     Drive Mode when location shows driving speed (needs location permission), or the user turns it on.
   - Voice never orders, pays, confirms deliveries, changes stock or approves. Answers here are samples.
   Works in: 4 working themes (MF runtime), Direction B (Smart Basket) and Direction C (Role Hubs).
   Mobbin references: see /research/drive-mode-spec.md (engineer spec). */
(function(){
'use strict';
if(window.MFDrive) return;
const KEY='mf.drive.v1', SKEY='mf.drive.trip.v1';
const DEF={mode:'off',carplay:true,bt:true,devCar:true,devSpk:false,suggest:true,read:true,listen:true,locOk:false};
const load=()=>{ try{ return Object.assign({},DEF,JSON.parse(localStorage.getItem(KEY)||'{}')); }catch(e){ return Object.assign({},DEF); } };
const sload=()=>{ try{ return Object.assign({conn:false,driving:false,trip:'',dismissed:false},JSON.parse(sessionStorage.getItem(SKEY)||'{}')); }catch(e){ return {conn:false,driving:false,trip:'',dismissed:false}; } };
let P=load(), SS=sload();
const save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(P)); }catch(e){} };
const ssave=()=>{ try{ sessionStorage.setItem(SKEY,JSON.stringify(SS)); }catch(e){} };
const UI={open:false,listening:false,heard:'',answer:'',confirm:null,view:'set',perm:false};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- framework adapter ---------- */
const FW=(()=>{ if(window.MF&&typeof window.MF.S==='function') return 'mf';
  try{ if(typeof SC!=='undefined'&&typeof ORDER!=='undefined') return 'b'; }catch(e){}
  try{ if(typeof SCREENS!=='undefined') return 'c'; }catch(e){}
  return ''; })();
if(!FW) return;
/* which design direction is hosting us: each gets its own Mobbin-referenced treatment (see THEME CSS below) */
const THEME=(()=>{ const p=location.pathname; return /theme-souq-modern/.test(p)?'souq':/theme-pro-ops/.test(p)?'pro':/theme-fresh-market/.test(p)?'fresh':/direction-b/.test(p)?'b':/direction-c/.test(p)?'c':'v3'; })();
const markTheme=()=>{ if(document.documentElement.getAttribute('data-dm')!==THEME) document.documentElement.setAttribute('data-dm',THEME); };
markTheme();
const gS=()=>{ try{ return S; }catch(e){ return null; } };   /* Direction B / C global state */
function ctx(){
  if(FW==='mf'){ const c=window.MF.C||{}; const R=(window.MF.ROLES||{})[c.role]||{}; return {lang:c.lang||(document.documentElement.lang==='ar'?'ar':'en'),plat:c.plat||'pwa',role:c.role||'',grp:R.grp||'customer',id:c.id||'',guest:!c.role||c.role==='guest'||/^ob\.|^app\.login/.test(c.id||'')}; }
  const s=gS()||{}; const role=s.role||'';
  const grp=/customer/.test(role)?'customer':(role==='auth'||role===''?'guest':'staff');
  return {lang:s.lang==='ar'?'ar':'en',plat:s.plat||'pwa',role,grp,id:s.screen||'',guest:grp==='guest'};
}
const T=(en,ar)=>ctx().lang==='ar'?ar:en;
const native=()=>{ const p=ctx().plat; return p==='ios'||p==='android'; };
const carLink=()=>ctx().plat==='ios'?'CarPlay':'Android Auto';
function rerender(){
  const y=window.scrollY;
  if(FW==='mf'){ window.MF.render(false); }
  else { try{ render(); }catch(e){} }
  window.scrollTo(0,y); ensure();
}
function goSettings(){
  UI.open=false;
  if(FW==='mf'){ location.hash=window.MF.href('set.drive'); }
  else if(FW==='b'){ try{ act('go:c.drive'); }catch(e){} }
  else { try{ go('b-drive'); }catch(e){} }
  ensure();
}
function setPlat(p){
  if(FW==='mf'){ window.MF.setParam('plat',p==='pwa'?null:p); return; }
  const s=gS(); if(!s) return; s.plat=p;
  if(FW==='b'){ try{ render(); }catch(e){} } else { try{ syncHash(); render(); }catch(e){} }
  ensure();
}
function goScreen(mfId){ if(FW==='mf'&&window.MF.SCR[mfId]){ UI.open=false; location.hash=window.MF.href(mfId); ensure(); return true; } return false; }

/* ---------- state ---------- */
function active(){
  if(P.mode==='on') return true;
  if(P.mode!=='auto') return false;
  if(SS.trip==='off') return false;
  if(SS.trip==='on') return true;
  if(native()&&SS.conn&&((ctx().plat!=='pwa'&&P.carplay)||(P.bt&&P.devCar))) return true;
  return false;
}
function suggesting(){ return P.mode==='auto'&&P.suggest&&SS.driving&&!active()&&SS.trip!=='off'&&!SS.dismissed; }
function source(){
  if(P.mode==='on') return T('Turned on in Settings','مفعّل من الإعدادات');
  if(SS.trip==='on') return T('Turned on while driving','فُعّل أثناء القيادة');
  return T('Connected to Hilux 2023 (sample) · automatic','متصل بـ Hilux 2023 (عينة) · تلقائي');
}
function modeLabel(m){ return {off:T('Off','إيقاف'),on:T('On','تشغيل'),auto:T('Automatic','تلقائي')}[m||P.mode]; }
function setMode(m){ P.mode=m; if(m!=='auto'){ SS={conn:false,driving:false,trip:'',dismissed:false}; ssave(); } if(m==='off') UI.open=false; save(); window.dispatchEvent(new CustomEvent('mf:drive-pref',{detail:{mode:m}})); }

/* ---------- icons ---------- */
const PATH={mic:'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21',car:'M4 16.5h16M6.5 16.5V19M17.5 16.5V19M4 16.5v-4L6.2 7.5h11.6L20 12.5v4M7.5 13.2h.01M16.5 13.2h.01M4.5 12.5h15',bt:'M7 7.5l10 9-5 4.5V3l5 4.5-10 9',shield:'M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z',x:'M6 6l12 12M18 6L6 18',pin:'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',lock:'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',speed:'M5 17a8 8 0 1 1 14 0M12 13l4-4',off:'M12 3v8M7.1 6.3a7 7 0 1 0 9.8 0',check:'M5 12.5l4.5 4.5L19 7.5'};
const svg=(n,s=20,cls='')=>`<svg class="mfdm-ic ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${PATH[n]}"/></svg>`;

/* ---------- styles (theme tokens with fallbacks for B / C) ---------- */
const css=`:root{--dm-brand:var(--c-brand,var(--primary,var(--brand,#0A6B4F)));--dm-on-brand:var(--c-text-on-brand,var(--on-primary,#fff));--dm-weak:var(--c-brand-weak,var(--palm-50,var(--brand-50,#E1F0E8)));--dm-brand-text:var(--c-brand-text,var(--palm-700,var(--brand-600,#08583F)));--dm-surface:var(--c-surface,var(--surface,var(--card,#fff)));--dm-s2:var(--c-surface-2,var(--sand-100,var(--bg,#EFEDE6)));--dm-text:var(--c-text,var(--ink-900,var(--ink,#141613)));--dm-text2:var(--c-text-2,var(--ink-500,var(--ink-3,#545850)));--dm-line:var(--c-border,var(--line,#DEDAD0));--dm-warn:var(--c-warning,var(--warn,#8F4C08));--dm-warn-weak:var(--c-warning-weak,var(--warn-bg,#FDF0DC));--dm-ok:var(--c-success,var(--ok,#1B7343))}
.mfdm-pill{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 12px 0 10px;border-radius:999px;border:0;background:var(--dm-brand);color:var(--dm-on-brand);font:600 13px/1 inherit;font-family:inherit;cursor:pointer;flex:none;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,.12)}
.mfdm-pill:focus-visible,.mfdm-btn:focus-visible,.mfdm-mic:focus-visible,.mfdm-x:focus-visible,.mfdm-chip:focus-visible{outline:3px solid var(--c-focus,#1D5AA6);outline-offset:2px}
.mfdm-pill .mfdm-sh{display:none}@media (max-width:430px){.mfdm-pill{padding:0 10px 0 8px;gap:5px}.mfdm-pill .mfdm-l{display:none}.mfdm-pill .mfdm-sh{display:inline}}
.device:not(.desktop) .mfdm-pill .mfdm-l{display:none}.device:not(.desktop) .mfdm-pill .mfdm-sh{display:inline}
.mfdm-pill .mfdm-dot{width:8px;height:8px;border-radius:8px;background:#7CF0B5;box-shadow:0 0 0 0 rgba(124,240,181,.7);animation:mfdmPulse 2s infinite}
@keyframes mfdmPulse{0%{box-shadow:0 0 0 0 rgba(124,240,181,.6)}70%{box-shadow:0 0 0 7px rgba(124,240,181,0)}100%{box-shadow:0 0 0 0 rgba(124,240,181,0)}}
@media (prefers-reduced-motion:reduce){.mfdm-pill .mfdm-dot,.mfdm-mic.on::after,.mfdm-sheet,.mfdm-banner{animation:none!important}}
.mfdm-scrim{position:fixed;inset:0;background:rgba(20,22,19,.42);z-index:2147482000}
.mfdm-sheet{position:fixed;z-index:2147482001;left:50%;transform:translateX(-50%);bottom:0;width:min(100%,560px);max-height:88vh;overflow:auto;background:var(--dm-surface);color:var(--dm-text);border-radius:24px 24px 0 0;padding:8px 20px calc(20px + env(safe-area-inset-bottom));box-shadow:0 18px 48px rgba(20,22,19,.22);animation:mfdmUp .32s cubic-bezier(.05,.7,.1,1)}
@keyframes mfdmUp{from{transform:translate(-50%,24px);opacity:.4}to{transform:translate(-50%,0);opacity:1}}
.mfdm-in .mfdm-scrim,.mfdm-in .mfdm-sheet,.mfdm-in .mfdm-banner{position:absolute}
.mfdm-grab{display:block;width:36px;height:5px;border-radius:5px;background:var(--dm-line);margin:2px auto 10px}
.mfdm-sh-h{display:flex;align-items:center;gap:10px}.mfdm-sh-h h2{margin:0;font-size:19px;line-height:1.35;flex:1}
.mfdm-src{display:block;font-size:13px;color:var(--dm-text2);margin-top:2px;font-weight:400}
.mfdm-x{width:44px;height:44px;border-radius:999px;border:0;background:var(--dm-s2);color:var(--dm-text);display:grid;place-items:center;cursor:pointer;flex:none}
.mfdm-micw{display:grid;place-items:center;margin:18px 0 6px}
.mfdm-mic{position:relative;width:88px;height:88px;border-radius:999px;border:0;background:var(--dm-brand);color:var(--dm-on-brand);display:grid;place-items:center;cursor:pointer;box-shadow:0 8px 24px rgba(10,107,79,.28)}
.mfdm-mic.on::after{content:"";position:absolute;inset:-8px;border-radius:999px;border:3px solid var(--dm-brand);opacity:.5;animation:mfdmRing 1.2s infinite}
@keyframes mfdmRing{from{transform:scale(.92);opacity:.7}to{transform:scale(1.18);opacity:0}}
.mfdm-state{text-align:center;margin:8px 0 2px;font-weight:600;font-size:15px;min-height:22px}
.mfdm-qa{background:var(--dm-s2);border-radius:16px;padding:12px 14px;margin:12px 0;font-size:15px;line-height:1.55}
.mfdm-qa small{display:block;color:var(--dm-text2);font-size:12px;margin-bottom:2px}
.mfdm-qa p{margin:0 0 6px}.mfdm-qa p:last-child{margin:0}
.mfdm-try{margin:12px 0 4px}.mfdm-try>span{display:block;font-size:13px;color:var(--dm-text2);margin-bottom:6px}
.mfdm-chips{display:flex;flex-wrap:wrap;gap:8px}
.mfdm-chip{min-height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--dm-line);background:var(--dm-surface);color:var(--dm-text);font:500 14px inherit;font-family:inherit;cursor:pointer}
.mfdm-safe{display:flex;gap:8px;align-items:flex-start;font-size:13px;line-height:1.5;color:var(--dm-text2);margin:14px 0 4px}
.mfdm-safe .mfdm-ic{flex:none;margin-top:1px;color:var(--dm-brand)}
.mfdm-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.mfdm-btn{flex:1 1 140px;min-height:48px;padding:0 16px;border-radius:999px;border:1px solid transparent;background:var(--dm-brand);color:var(--dm-on-brand);font:600 15px inherit;font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;text-decoration:none}
.mfdm-btn.sec{background:var(--dm-surface);color:var(--dm-text);border-color:var(--dm-line)}
.mfdm-btn.ghost{background:transparent;color:var(--dm-brand-text);border-color:transparent;flex:0 0 auto}
.mfdm-btn.sm{min-height:40px;font-size:14px;flex:0 0 auto}
.mfdm-confirm{border:1px solid var(--dm-warn);background:var(--dm-warn-weak);border-radius:16px;padding:12px 14px;margin:12px 0}
.mfdm-confirm b{display:block;margin-bottom:2px}
.mfdm-banner{position:fixed;z-index:2147481000;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom));max-width:540px;margin-inline:auto;background:var(--dm-surface);color:var(--dm-text);border:1px solid var(--dm-line);border-radius:20px;padding:14px;box-shadow:0 12px 32px rgba(20,22,19,.18);animation:mfdmUp2 .3s ease-out}
.mfdm-banner.inline{position:static;animation:none;margin:0;box-shadow:0 4px 14px rgba(20,22,19,.08)}
@keyframes mfdmUp2{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}
.mfdm-bh{display:flex;gap:12px;align-items:flex-start}.mfdm-bh b{display:block;font-size:16px;margin-bottom:2px}.mfdm-bh p{margin:0;font-size:14px;line-height:1.5;color:var(--dm-text2)}
.mfdm-lead{width:44px;height:44px;border-radius:14px;background:var(--dm-weak);color:var(--dm-brand-text);display:grid;place-items:center;flex:none}
.mfdm-link{background:none;border:0;padding:8px 0 0;color:var(--dm-text2);font:500 13px inherit;font-family:inherit;text-decoration:underline;cursor:pointer;min-height:32px}
.mfdm-tag{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:600;background:var(--dm-s2);color:var(--dm-text2);white-space:nowrap}
.mfdm-tag.ok{background:var(--dm-weak);color:var(--dm-brand-text)}.mfdm-tag.warn{background:var(--dm-warn-weak);color:var(--dm-warn)}
.mfdm-hero{display:flex;gap:12px;align-items:center}.mfdm-hero h2{margin:0 0 2px;font-size:17px;line-height:1.4}.mfdm-hero p{margin:0;font-size:14px;line-height:1.5;color:var(--dm-text2)}
.mfdm-plat{display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:13px;color:var(--dm-text2)}
.mfdm-plat button{min-height:36px;padding:0 12px;border-radius:999px;border:1px solid var(--dm-line);background:var(--dm-surface);color:var(--dm-text);font:500 13px inherit;font-family:inherit;cursor:pointer}
.mfdm-plat button[aria-pressed="true"]{background:var(--dm-brand);color:var(--dm-on-brand);border-color:var(--dm-brand)}
.mfdm-dis{opacity:.62}
.mfdm-sub{padding-inline-start:16px;border-inline-start:3px solid var(--dm-weak);margin:4px 0 6px}
/* generic settings markup for Direction B / C */
.mfdm-g{display:flex;flex-direction:column;gap:16px;padding-bottom:24px;color:var(--dm-text)}
.mfdm-g h3{font-size:13px;font-weight:700;letter-spacing:.02em;color:var(--dm-text2);margin:0 4px 6px;text-transform:none}
.mfdm-card{background:var(--dm-surface);border:1px solid var(--dm-line);border-radius:18px;padding:4px 14px}
.mfdm-card.pad{padding:14px}
.mfdm-row{display:flex;align-items:center;gap:12px;min-height:56px;padding:10px 0;border-bottom:1px solid var(--dm-line);cursor:pointer}
.mfdm-row:last-child{border-bottom:0}
.mfdm-row .b{flex:1;min-width:0}.mfdm-row .t{display:block;font-weight:600;font-size:15px}.mfdm-row .s{display:block;font-size:13px;line-height:1.45;color:var(--dm-text2);margin-top:2px}
.mfdm-row input[type=radio],.mfdm-row input[type=checkbox]{width:22px;height:22px;accent-color:var(--dm-brand);flex:none;margin:0}
.mfdm-row input.mfdm-sw{appearance:none;-webkit-appearance:none;width:48px;height:28px;border-radius:28px;background:var(--dm-line);position:relative;cursor:pointer;transition:background .16s}
.mfdm-row input.mfdm-sw::after{content:"";position:absolute;top:3px;inset-inline-start:3px;width:22px;height:22px;border-radius:22px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:inset-inline-start .16s}
.mfdm-row input.mfdm-sw:checked{background:var(--dm-brand)}.mfdm-row input.mfdm-sw:checked::after{inset-inline-start:23px}
.mfdm-row input:disabled{cursor:not-allowed}
.mfdm-note{display:flex;gap:8px;font-size:13px;line-height:1.5;color:var(--dm-text2);margin:0 4px}
.mfdm-seg{display:flex;gap:6px;flex-wrap:wrap}.mfdm-seg button{min-height:36px;padding:0 12px;border-radius:999px;border:1px solid var(--dm-line);background:var(--dm-surface);color:var(--dm-text);font:500 13px inherit;font-family:inherit;cursor:pointer}.mfdm-seg button[aria-pressed="true"]{background:var(--dm-text);color:var(--dm-surface)}
.mfdm-vh{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* ===== per-theme treatments (Mobbin references in research/drive-mode-spec.md §9) ===== */
/* shared: mode picker variants */
.mfdm-pick{display:flex;gap:8px}
.mfdm-opt{position:relative;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--dm-text);-webkit-tap-highlight-color:transparent}
.mfdm-opt input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
.mfdm-opt:has(input:focus-visible){outline:3px solid var(--c-focus,#1D5AA6);outline-offset:2px}
.mfdm-ot{font-weight:600}
.mfdm-pd{margin-top:12px;font-size:14px;line-height:1.55;color:var(--dm-text2)}.mfdm-pd b{color:var(--dm-text);font-size:15px}.mfdm-pd p{margin:4px 0 0}
.mfdm-oi{width:44px;height:44px;border-radius:999px;display:grid;place-items:center;flex:none;background:var(--dm-s2);color:var(--dm-text2)}
.mfdm-ocheck{display:none}
/* — Calm Commerce v3 (Instacart · sweetgreen · HelloFresh · Uber Eats): calm list radios, soft green info bar, side drawer on wide screens — */
[data-dm=v3] .mfdm-banner{background:var(--dm-weak);border:0;border-radius:14px;box-shadow:0 6px 20px rgba(20,22,19,.12)}
[data-dm=v3] .mfdm-banner .mfdm-lead{background:var(--dm-surface)}
[data-dm=v3] .mfdm-banner.inline{box-shadow:none}
@media (min-width:900px){[data-dm=v3] .mfdm-sheet{left:auto;right:0;top:0;bottom:0;transform:none;width:420px;max-height:none;height:100%;border-radius:0;padding-top:16px;animation:mfdmSide .28s cubic-bezier(.05,.7,.1,1)}[data-dm=v3] .mfdm-sheet[dir=rtl]{right:auto;left:0;animation-name:mfdmSideR}[data-dm=v3] .mfdm-sheet .mfdm-grab{display:none}}
@keyframes mfdmSide{from{transform:translateX(40px);opacity:.3}to{transform:none;opacity:1}}@keyframes mfdmSideR{from{transform:translateX(-40px);opacity:.3}to{transform:none;opacity:1}}
/* — Souq Modern (Vestiaire Collective · Blue Apron · ZARA · Co–Star): editorial caps labels, outlined square chips, stamped cards — */
[data-dm=souq] .mfdm-pill{border-radius:4px;background:var(--dm-surface);color:var(--dm-brand-text);border:1.5px solid var(--dm-brand);box-shadow:none;text-transform:uppercase;letter-spacing:.08em;font-size:12px;min-height:34px}
[data-dm=souq][lang=ar] .mfdm-pill,[data-dm=souq] .mfdm-pill[dir=rtl]{text-transform:none;letter-spacing:0;font-size:13px}
[data-dm=souq] .mfdm-pill .mfdm-dot{border-radius:1px;transform:rotate(45deg);width:7px;height:7px;background:var(--c-accent,#C9962B);animation:none}
[data-dm=souq] .mfdm-s .sec-h h2{text-transform:uppercase;letter-spacing:.12em;font-size:12.5px;color:var(--dm-text2);font-family:"Inter",sans-serif;font-weight:700}
[data-dm=souq][lang=ar] .mfdm-s .sec-h h2{text-transform:none;letter-spacing:0;font-size:14px;font-family:"IBM Plex Sans Arabic",sans-serif}
[data-dm=souq] .mfdm-pick{gap:0;border:1px solid var(--dm-text);border-radius:4px;overflow:hidden}
[data-dm=souq] .mfdm-opt{flex:1;min-height:48px;border-inline-end:1px solid var(--dm-text);font-size:14px;text-transform:uppercase;letter-spacing:.06em;background:var(--dm-surface)}
[data-dm=souq][lang=ar] .mfdm-opt{text-transform:none;letter-spacing:0;font-size:15px}
[data-dm=souq] .mfdm-opt:last-child{border-inline-end:0}
[data-dm=souq] .mfdm-opt.on{background:var(--dm-text);color:var(--dm-surface)}
[data-dm=souq] .mfdm-pd{border-top:1px solid var(--dm-line);padding-top:12px}
[data-dm=souq] .mfdm-herocard{border-top:3px solid var(--c-accent,#C9962B)}
[data-dm=souq] .mfdm-hero h2,[data-dm=souq] .mfdm-sh-h h2{font-family:"Reem Kufi","IBM Plex Sans Arabic",sans-serif;font-weight:600}
[data-dm=souq] .mfdm-lead{border-radius:22px 22px 6px 6px}
[data-dm=souq] .mfdm-sheet{border-radius:10px 10px 0 0;border-top:3px solid var(--dm-brand)}
[data-dm=souq] .mfdm-btn,[data-dm=souq] .mfdm-chip,[data-dm=souq] .mfdm-plat button,[data-dm=souq] .mfdm-x{border-radius:6px}
[data-dm=souq] .mfdm-qa,[data-dm=souq] .mfdm-confirm{border-radius:6px}
[data-dm=souq] .mfdm-banner{border-radius:8px;border:1px solid var(--dm-line);border-top:3px solid var(--dm-brand);box-shadow:0 10px 28px rgba(60,30,10,.16)}
[data-dm=souq] .mfdm-tag{border-radius:3px}
/* — Pro Ops (Copilot · WHOOP · Google Health/Fitbit · Phantom · Lloyds): segmented control, mono status chip, dense dark cards — */
[data-dm=pro] .mfdm-pill{border-radius:3px;background:transparent;color:var(--dm-brand);border:1px solid var(--dm-brand);box-shadow:none;min-height:30px;padding:0 8px;font-family:"IBM Plex Mono","IBM Plex Sans Arabic",monospace;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase}
[data-dm=pro] .mfdm-pill[dir=rtl]{text-transform:none;letter-spacing:0;font-family:"IBM Plex Sans Arabic",sans-serif;font-size:12.5px}
[data-dm=pro] .mfdm-pill .mfdm-ic{width:14px;height:14px}
[data-dm=pro] .mfdm-pill .mfdm-dot{width:7px;height:7px;background:var(--dm-brand);animation:mfdmBlink 1.6s steps(2) infinite;box-shadow:none}
@keyframes mfdmBlink{50%{opacity:.25}}
[data-dm=pro] .mfdm-pick{background:var(--dm-s2);border:1px solid var(--dm-line);border-radius:6px;padding:3px;gap:3px}
[data-dm=pro] .mfdm-opt{flex:1;min-height:40px;border-radius:4px;font-size:13.5px;color:var(--dm-text2)}
[data-dm=pro] .mfdm-opt.on{background:var(--dm-brand);color:var(--dm-on-brand)}
[data-dm=pro] .mfdm-pd{font-size:13.5px;border-inline-start:2px solid var(--dm-brand);padding-inline-start:10px}
[data-dm=pro] .mfdm-sheet{border-radius:8px 8px 0 0;border:1px solid var(--dm-line);border-bottom:0;padding-inline:16px}
[data-dm=pro] .mfdm-sh-h h2{font-family:"Plex Condensed","IBM Plex Sans Arabic",sans-serif;font-size:18px}
[data-dm=pro] .mfdm-mic{width:76px;height:76px;border-radius:10px;box-shadow:none}
[data-dm=pro] .mfdm-mic.on::after{border-radius:14px}
[data-dm=pro] .mfdm-qa{border-radius:4px;border-inline-start:3px solid var(--dm-brand);background:var(--dm-s2)}
[data-dm=pro] .mfdm-btn,[data-dm=pro] .mfdm-chip,[data-dm=pro] .mfdm-plat button,[data-dm=pro] .mfdm-x{border-radius:4px}
[data-dm=pro] .mfdm-chip{min-height:36px;font-size:13px}
[data-dm=pro] .mfdm-lead{border-radius:6px}
[data-dm=pro] .mfdm-tag{border-radius:3px;background:transparent;border:1px solid currentColor;font-family:"IBM Plex Mono","IBM Plex Sans Arabic",monospace;font-size:11px}
[data-dm=pro] .mfdm-banner{border-radius:10px;padding:16px;box-shadow:0 16px 40px rgba(0,0,0,.45)}
[data-dm=pro] .mfdm-banner:not(.inline) .mfdm-acts{flex-direction:column}
[data-dm=pro] .mfdm-banner .mfdm-btn{flex:1 1 auto;width:100%}
[data-dm=pro] .mfdm-confirm{border-radius:4px}
/* — Fresh Market (Fiverr · Mindtrip · Wolt · Blinkit · Swiggy · talabat): selectable photo-style cards, soft tinted chips, pillowy sheets — */
[data-dm=fresh] .mfdm-pill{background:var(--dm-weak);color:var(--dm-brand-text);box-shadow:0 2px 8px rgba(30,60,20,.12);min-height:38px;padding:0 14px 0 4px;font-family:"Baloo Bhaijaan 2","IBM Plex Sans Arabic",sans-serif;font-size:14px;font-weight:700}
[data-dm=fresh] .mfdm-pill[dir=rtl]{padding:0 4px 0 14px}
[data-dm=fresh] .mfdm-pill .mfdm-ic{width:30px;height:30px;padding:6px;border-radius:999px;background:var(--dm-brand);color:var(--dm-on-brand);box-sizing:border-box}
[data-dm=fresh] .mfdm-pill .mfdm-dot{display:none}
[data-dm=fresh] .mfdm-pick{flex-direction:column;gap:10px}
[data-dm=fresh] .mfdm-opt{justify-content:flex-start;text-align:start;gap:12px;min-height:76px;padding:12px 14px;border-radius:20px;background:var(--dm-surface);border:2px solid var(--dm-line);box-shadow:0 2px 10px rgba(30,60,20,.06)}
[data-dm=fresh] .mfdm-opt.on{border-color:var(--dm-brand);background:var(--dm-weak)}
[data-dm=fresh] .mfdm-opt .mfdm-ob{display:block;flex:1;min-width:0}
[data-dm=fresh] .mfdm-opt .mfdm-ot{display:block;font-family:"Baloo Bhaijaan 2","IBM Plex Sans Arabic",sans-serif;font-size:17px;font-weight:700}
[data-dm=fresh] .mfdm-opt .mfdm-os{display:block;font-size:13px;line-height:1.45;color:var(--dm-text2);font-weight:400;margin-top:2px}
[data-dm=fresh] .mfdm-opt .mfdm-oe{display:block;margin-top:6px}
[data-dm=fresh] .mfdm-opt[data-v=on] .mfdm-oi{background:var(--dm-brand);color:var(--dm-on-brand)}
[data-dm=fresh] .mfdm-opt[data-v=auto] .mfdm-oi{background:var(--c-accent-weak,#FFF1C2);color:var(--c-accent-text,#7A5200)}
[data-dm=fresh] .mfdm-ocheck{display:grid;place-items:center;width:26px;height:26px;border-radius:999px;border:2px solid var(--dm-line);flex:none;color:transparent}
[data-dm=fresh] .mfdm-opt.on .mfdm-ocheck{background:var(--dm-brand);border-color:var(--dm-brand);color:var(--dm-on-brand)}
[data-dm=fresh] .mfdm-sheet{border-radius:28px 28px 0 0}
[data-dm=fresh] .mfdm-sh-h h2,[data-dm=fresh] .mfdm-hero h2,[data-dm=fresh] .mfdm-bh b{font-family:"Baloo Bhaijaan 2","IBM Plex Sans Arabic",sans-serif;font-weight:700}
[data-dm=fresh] .mfdm-mic{width:96px;height:96px;box-shadow:0 0 0 10px var(--dm-weak),0 10px 26px rgba(30,90,40,.25)}
[data-dm=fresh] .mfdm-qa{border-radius:20px}
[data-dm=fresh] .mfdm-chip{min-height:44px;background:var(--dm-weak);border-color:transparent;color:var(--dm-brand-text);font-weight:600}
[data-dm=fresh] .mfdm-lead{border-radius:999px;background:var(--c-accent-weak,#FFF1C2);color:var(--c-accent-text,#7A5200)}
[data-dm=fresh] .mfdm-banner{border-radius:24px;border:0;padding:16px;box-shadow:0 14px 36px rgba(30,60,20,.2)}
[data-dm=fresh] .mfdm-btn{min-height:52px;font-weight:700}
[data-dm=fresh] .mfdm-btn.sec{background:var(--dm-weak);border-color:transparent;color:var(--dm-brand-text)}
[data-dm=fresh] .mfdm-tag{padding:3px 10px}
/* — Direction B (Najd warmth): henna hero card, soft shadow cards, henna radios — */
[data-dm=b] .mfdm-card{border:0;border-radius:var(--r-lg,20px);box-shadow:var(--shadow,0 2px 10px rgba(60,30,10,.08))}
[data-dm=b] .mfdm-herocard{background:linear-gradient(160deg,var(--henna-500,#B5502A),#C8693A 60%,var(--saffron-500,#E8A33D));color:#fff}
[data-dm=b] .mfdm-herocard .mfdm-hero p{color:rgba(255,255,255,.88)}[data-dm=b] .mfdm-herocard .mfdm-lead{background:rgba(255,255,255,.2);color:#fff}
[data-dm=b] .mfdm-pill{background:linear-gradient(135deg,var(--henna-500,#B5502A),var(--saffron-500,#E8A33D))}
[data-dm=b] .mfdm-pill .mfdm-dot{background:#fff;animation:none}
[data-dm=b] .mfdm-sheet{border-radius:var(--r-xl,28px) var(--r-xl,28px) 0 0}
[data-dm=b] .mfdm-lead{background:var(--henna-50,#FBF1EA);color:var(--henna-600,#9A4020)}
[data-dm=b] .mfdm-banner{border:0;border-radius:var(--r-lg,20px);border-inline-start:4px solid var(--saffron-500,#E8A33D)}
/* — Direction C (role hubs + status system): action tiles picker, status-chip pill, status-striped banner — */
[data-dm=c] .mfdm-pick.k-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
[data-dm=c] .mfdm-opt{flex-direction:column;min-height:88px;padding:12px 6px;border-radius:var(--r,12px);background:var(--card,#fff);border:1px solid var(--line,#DEDAD0);font-size:13.5px}
[data-dm=c] .mfdm-opt .mfdm-oi{width:36px;height:36px;background:transparent;color:var(--brand,#0B6E69)}
[data-dm=c] .mfdm-opt.on{border:2px solid var(--brand,#0B6E69);background:var(--brand-50,#E6F3F2)}
[data-dm=c] .mfdm-pill{background:var(--s-ok-bg,#DDF5E5);color:var(--s-ok,#157F3B);box-shadow:none;min-height:30px;font-size:12.5px;padding:0 10px 0 8px}
[data-dm=c] .mfdm-pill .mfdm-dot{background:var(--s-ok,#157F3B);animation:none}
[data-dm=c] .mfdm-card{border-radius:var(--r,12px)}
[data-dm=c] .mfdm-banner{border-radius:var(--r,12px);border-inline-start:4px solid var(--s-prog,#1D5AA6)}
[data-dm=c] .mfdm-btn{border-radius:var(--r-sm,8px)}
`;
function addCss(){ if(document.getElementById('mfdmCss')) return; const st=document.createElement('style'); st.id='mfdmCss'; st.textContent=css; (document.head||document.documentElement).appendChild(st); }

/* ---------- sample voice answers (role-aware) ---------- */
/* Checklist prompts (points today, overdue invoices, supplier bills due, payments today):
   answers never invent amounts. Missing or unapproved data replies “not available” / «غير متوفر».
   “payments today” stays unavailable for every role until the owner approves access.
   Today’s points need a live today-total; until then the reply is “not available” even for customers.
   Admin/accountant may open the overdue and supplier-bills screens; voice still says “not available”
   until a verified live figure exists. Guest and unapproved roles get “not available” only. */
const NA_TXT=()=>T('not available','غير متوفر');
const BRIEF_Q=()=>[
  T('points today','نقاط اليوم'),
  T('overdue invoices','الفواتير المتأخرة'),
  T('supplier bills due','فواتير الموردين المستحقة'),
  T('payments today','مدفوعات اليوم')
];
function canFin(){ const r=ctx().role; return r==='admin'||r==='acct'; }
function canRewards(){ const c=ctx(); return !c.guest && c.grp==='customer' && ['owner','bm','buyer'].includes(c.role); }
function briefCmds(){
  const na=NA_TXT();
  const [q1,q2,q3,q4]=BRIEF_Q();
  return [
    {q:q1,a:na,k:'points_today'},
    {q:q2,a:na,k:'overdue_invoices'},
    {q:q3,a:na,k:'supplier_bills'},
    {q:q4,a:na,k:'payments_today'}
  ];
}
function clearVoice(){ UI.heard=''; UI.answer=''; UI.confirm=null; UI.listening=false; clearTimeout(tmr); }
function cmds(){
  const c=ctx(); const r=c.role;
  const brief=briefCmds();
  if(c.guest) return brief;
  if(c.grp==='customer') return brief.concat([
    {q:T('My open orders','طلباتي المفتوحة'),a:T('You have 2 open orders. The latest, #58240, arrives tomorrow 7–9 AM.','لديك طلبان مفتوحان. آخرها ‎#58240 يصل غدًا 7–9 صباحًا.'),go:'b.orders'},
    {q:T('What do I owe?','كم عليّ؟'),a:T('Your balance due is 2,140.00 riyals. Invoice INV-2026-0412 is 4 days overdue.','المستحق عليك 2,140.00 ريال. الفاتورة INV-2026-0412 متأخرة 4 أيام.'),go:'b.finance'},
    {q:T('Open my cart','افتح السلة'),a:T('Opening your cart.','جارٍ فتح سلتك.'),go:'b.cart',nav:true},
    {q:T('Place my usual order','اطلب طلبي المعتاد'),ctrl:true,go:'b.reorder'}]);
  if(['driver','van','d','v'].includes(r)||/driver|van/.test(r)) return brief.concat([
    {q:T('Next stop','المحطة التالية'),a:T('Next stop: Al Wadi Restaurant, Olaya. 4.2 km, about 9 minutes.','المحطة التالية: مطعم الوادي، العليا. 4.2 كم، نحو 9 دقائق.')},
    {q:T('Deliveries left','التوصيلات المتبقية'),a:T('4 deliveries left today and 3,420.00 riyals cash to collect.','تبقى 4 توصيلات اليوم و3,420.00 ريال نقدًا للتحصيل.')},
    {q:T('Confirm delivery','أكّد التسليم'),ctrl:true}]);
  if(/sales/.test(r)) return brief.concat([
    {q:T('My visits today','زياراتي اليوم'),a:T('5 visits today. Next: Bayt Al Kunafa at 11:30.','5 زيارات اليوم. التالية: بيت الكنافة 11:30.')},
    {q:T('Who is overdue?','من المتأخر؟'),a:T('3 of your customers are more than 7 days overdue.','3 من عملائك متأخرون أكثر من 7 أيام.')},
    {q:T('Take an order','سجّل طلبًا'),ctrl:true}]);
  return brief.concat([
    {q:T('Approvals waiting','الموافقات المنتظرة'),a:T('4 credit approvals are waiting for you. The oldest is 2 hours old.','4 طلبات ائتمان بانتظارك. أقدمها منذ ساعتين.')},
    {q:T('Overdue accounts','الحسابات المتأخرة'),a:T('3 accounts are on hold after 7 days overdue.','3 حسابات موقوفة بعد تأخر 7 أيام.')},
    {q:T('Approve the first one','اعتمد الأول'),ctrl:true}]);
}

/* ---------- pill, banner, sheet ---------- */
function pillHTML(inline){ return `<button type="button" class="mfdm-pill" ${inline?'data-drv="open" ':'id="mfdmPill" data-drv="open" '}aria-haspopup="dialog" aria-label="${esc(T('Drive Mode is on. Open voice','وضع القيادة مفعّل. افتح الصوت'))}"><span class="mfdm-dot" aria-hidden="true"></span>${svg('mic',16)}<span class="mfdm-l">${esc(T('Drive Mode','وضع القيادة'))}</span><span class="mfdm-sh" aria-hidden="true">${esc(T('Drive','القيادة'))}</span></button>`; }
function bannerHTML(inline){ return `<div class="mfdm-banner${inline?' inline':''}" ${inline?'':'id="mfdmBanner" '}role="${inline?'group':'dialog'}" aria-labelledby="${inline?'mfdmBTi':'mfdmBT'}"><div class="mfdm-bh"><span class="mfdm-lead">${svg('car',22)}</span><div style="flex:1;min-width:0"><b id="${inline?'mfdmBTi':'mfdmBT'}">${esc(T('Looks like you’re driving','يبدو أنك تقود'))}</b><p>${esc(T('Turn on Drive Mode for hands-free voice? It reads orders and balances; you still tap to order or pay.','هل تريد تشغيل وضع القيادة للتحكم بالصوت؟ يقرأ الطلبات والأرصدة، وتبقى الطلبات والدفع بضغطة منك.'))}</p></div></div><div class="mfdm-acts"><button type="button" class="mfdm-btn" data-drv="accept">${esc(T('Turn on','تشغيل'))}</button><button type="button" class="mfdm-btn sec" data-drv="dismiss">${esc(T('Not now','ليس الآن'))}</button></div><button type="button" class="mfdm-link" data-drv="nosuggest">${esc(T('Don’t suggest again','لا تقترح مرة أخرى'))}</button></div>`; }
function voiceHTML(inline){
  const L=cmds();
  const qa=UI.confirm?`<div class="mfdm-confirm" role="alert"><b>${esc(T('Manual confirmation required','يلزم التأكيد اليدوي'))}</b>${esc(T('Voice can’t do this. Open the screen and confirm it yourself with a tap.','لا يمكن تنفيذ هذا بالصوت. افتح الشاشة وأكّده بنفسك بضغطة.'))}<div class="mfdm-acts">${UI.confirm.go&&FW==='mf'?`<button type="button" class="mfdm-btn sm" data-drv="opengo" data-go="${esc(UI.confirm.go)}">${esc(T('Open the screen','افتح الشاشة'))}</button>`:''}<button type="button" class="mfdm-btn sm sec" data-drv="undo">${esc(T('Dismiss','إغلاق'))}</button></div></div>`
   :(UI.heard?`<div class="mfdm-qa"><p><small>${esc(T('You said','قلت'))}</small>${esc(UI.heard)}</p>${UI.answer?`<p><small>${esc(T('Answer · sample','الرد · عينة'))}</small>${esc(UI.answer)}</p>`:''}</div>`:'');
  return `${inline?'':'<span class="mfdm-grab" aria-hidden="true"></span>'}<div class="mfdm-sh-h"><span class="mfdm-lead">${svg('car',22)}</span><h2 ${inline?'':'id="mfdmT"'}>${esc(T('Drive Mode','وضع القيادة'))}<span class="mfdm-src">${esc(inline?T('Connected to Hilux 2023 (sample) · automatic','متصل بـ Hilux 2023 (عينة) · تلقائي'):source())}</span></h2>${inline?'':`<button type="button" class="mfdm-x" data-drv="close" aria-label="${esc(T('Close','إغلاق'))}">${svg('x',20)}</button>`}</div>
  <div class="mfdm-micw"><button type="button" class="mfdm-mic${UI.listening?' on':''}" data-drv="mic" aria-pressed="${UI.listening}" aria-label="${esc(UI.listening?T('Stop listening','إيقاف الاستماع'):T('Start listening','ابدأ الاستماع'))}">${svg('mic',36)}</button></div>
  <p class="mfdm-state" role="status" aria-live="polite">${esc(UI.listening?T('Listening…','جارٍ الاستماع…'):T('Tap the microphone and speak','اضغط على الميكروفون وتحدث'))}</p>
  ${qa}
  <div class="mfdm-try"><span>${esc(T('Try saying','جرّب أن تقول'))}</span><div class="mfdm-chips">${L.map((c,i)=>`<button type="button" class="mfdm-chip" data-drv="say" data-i="${i}">${ctx().lang==='ar'?'«'+esc(c.q)+'»':'“'+esc(c.q)+'”'}</button>`).join('')}</div></div>
  <p class="mfdm-safe">${svg('shield',18)}<span>${esc(T('Voice only reads and opens screens. Orders, payments, deliveries, stock and approvals always need your tap. Keep your eyes on the road.','الصوت يقرأ ويفتح الشاشات فقط. الطلبات والمدفوعات والتسليم والمخزون والموافقات تحتاج دائمًا إلى ضغطة منك. أبقِ عينيك على الطريق.'))}</span></p>
  <div class="mfdm-acts"><button type="button" class="mfdm-btn sec" data-drv="settings">${svg('gear',18)}${esc(T('Drive Mode settings','إعدادات وضع القيادة'))}</button><button type="button" class="mfdm-btn sec" data-drv="off">${esc(P.mode==='auto'?T('Turn off for this trip','إيقاف لهذه الرحلة'):T('Turn off','إيقاف'))}</button></div>
  <p class="mfdm-note" style="justify-content:center;margin-top:10px">${esc(T('Preview: sample answers, no audio is recorded.','معاينة: ردود تجريبية ولا يُسجَّل أي صوت.'))}</p>`;
}
function container(){ if(FW==='b'){ return document.getElementById('screen'); } return document.body; }
function headerSlot(){
  if(FW==='mf'){ const h=document.querySelector('header.tb'); if(!h) return null; const ib=h.querySelector('a.ib:not(.flat),button.ib:not(.flat)'); return ib?{before:ib}:{append:h.querySelector('.tbr')||h}; }
  if(FW==='b'){ const sc=document.getElementById('screen'); const h=sc&&sc.querySelector('.topbar'); if(!h) return null; const lp=h.querySelector('.langpill'); return lp?{before:lp}:{append:h.querySelector('.row1')||h}; }
  const h=document.querySelector('#root header.topbar'); if(!h) return null; const lb=h.querySelector('.langbtn'); return lb?{before:lb}:{append:h};
}
const dirOf=el=>{ if(!el||!el.setAttribute) return; const ar=ctx().lang==='ar'; el.setAttribute('dir',ar?'rtl':'ltr'); el.setAttribute('lang',ar?'ar':'en'); };
let busy=false;
function ensure(){ markTheme();
  if(ctx().guest && (UI.open||UI.heard||UI.answer||UI.listening)){ clearVoice(); UI.open=false; }
  if(busy) return; busy=true;
  try{
    addCss();
    const c=ctx(); const on=active()&&!c.guest; const box=container();
    /* pill in the top bar */
    let pill=document.getElementById('mfdmPill');
    if(on){ const slot=headerSlot(); if(slot&&(!pill||!document.contains(pill)||(slot.before&&pill.nextElementSibling!==slot.before))){ if(pill) pill.remove(); const tmp=document.createElement('div'); tmp.innerHTML=pillHTML(false); pill=tmp.firstChild; dirOf(pill); if(slot.before) slot.before.parentNode.insertBefore(pill,slot.before); else slot.append.appendChild(pill); } else if(pill&&pill.querySelector('.mfdm-l').textContent!==T('Drive Mode','وضع القيادة')){ pill.outerHTML=pillHTML(false); } }
    else if(pill) pill.remove();
    /* suggestion banner */
    let bn=document.getElementById('mfdmBanner');
    const showBn=suggesting()&&!c.guest&&!UI.open&&!(UI.view==='suggest'&&isDriveScreen());
    if(showBn&&box){ if(!bn||!box.contains(bn)){ if(bn) bn.remove(); const tmp=document.createElement('div'); tmp.innerHTML=bannerHTML(false); bn=tmp.firstChild; dirOf(bn); box.appendChild(bn); } }
    else if(bn) bn.remove();
    /* voice sheet */
    let sh=document.getElementById('mfdmSheet'), sc=document.getElementById('mfdmScrim');
    if(UI.open&&on&&box){
      if(!sh||!box.contains(sh)){ if(sh) sh.remove(); if(sc) sc.remove(); sc=document.createElement('div'); sc.id='mfdmScrim'; sc.className='mfdm-scrim'; sc.setAttribute('data-drv','close'); sh=document.createElement('div'); sh.id='mfdmSheet'; sh.className='mfdm-sheet'; sh.setAttribute('role','dialog'); sh.setAttribute('aria-modal','true'); sh.setAttribute('aria-labelledby','mfdmT'); box.appendChild(sc); box.appendChild(sh); sh.innerHTML=voiceHTML(false); dirOf(sh); const m=sh.querySelector('[data-drv="mic"]'); if(m) m.focus(); }
    } else { if(sh) sh.remove(); if(sc) sc.remove(); if(UI.open&&!on) UI.open=false; }
    if(sh&&document.contains(sh)&&sh.getAttribute('lang')!==ctx().lang){ refreshSheet(); }
    if(FW==='b'&&box) box.classList.add('mfdm-in');
  }catch(e){ /* never break the host screen */ }
  busy=false;
}
function refreshSheet(){ const sh=document.getElementById('mfdmSheet'); if(sh){ dirOf(sh); const f=document.activeElement&&document.activeElement.dataset?document.activeElement.dataset.drv:''; sh.innerHTML=voiceHTML(false); const el=sh.querySelector(`[data-drv="${f||'mic'}"]`)||sh.querySelector('[data-drv="mic"]'); el&&el.focus(); } document.querySelectorAll('.mfdm-voice-inline').forEach(d=>{ d.innerHTML=voiceHTML(true); }); }
function isDriveScreen(){ const id=ctx().id; return id==='set.drive'||id==='c.drive'||id==='b-drive'; }
let tmr=0;
function listen(i){
  clearTimeout(tmr); const L=cmds(); const c=L[i==null?0:i]; UI.confirm=null; UI.heard=''; UI.answer=''; UI.listening=true; refreshSheet();
  tmr=setTimeout(()=>{ UI.listening=false; UI.heard=c.q; if(c.ctrl){ UI.confirm={go:c.go||''}; } else { UI.answer=c.a; } refreshSheet();
    if(c.nav&&c.go&&FW==='mf'&&window.MF.SCR[c.go]){ setTimeout(()=>{ location.hash=window.MF.href(c.go); },900); } },i==null?1200:500);
}

/* ---------- settings content (one model, rendered per framework) ---------- */
function model(){
  const c=ctx(), nat=native(), pwa=!nat;
  const S1={title:T('Enable Drive Mode','تفعيل وضع القيادة'),rows:[
    {k:'radio',v:'off',t:T('Off','إيقاف'),s:T('No Drive Mode button on your screens. You can still turn it on here anytime.','لا يظهر وضع القيادة على شاشاتك. يمكنك تشغيله من هنا في أي وقت.'),end:P.mode==='off'?tag(T('Default','افتراضي')):''},
    {k:'radio',v:'on',t:T('On','تشغيل'),s:T('A small Drive Mode pill stays at the top of every screen until you turn it off.','يبقى زر صغير لوضع القيادة أعلى كل شاشة حتى توقفه.')},
    {k:'radio',v:'auto',t:T('Automatic','تلقائي'),s:nat?T(`Turns on when your phone connects to ${carLink()} or your car’s Bluetooth, and off when it disconnects.`,`يعمل عند اتصال هاتفك بـ ${carLink()} أو بلوتوث السيارة، ويتوقف عند قطع الاتصال.`):T('In a browser we can’t see car or Bluetooth connections, so we suggest Drive Mode when you’re moving at driving speed.','في المتصفح لا يمكننا رؤية اتصال السيارة أو البلوتوث، لذلك نقترح وضع القيادة عندما تتحرك بسرعة القيادة.'),end:pwa?tag(T('Limited on web','محدود على الويب'),'warn'):tag(T('Recommended','موصى به'),'ok')}]};
  const out=[S1];
  if(P.mode==='auto'){
    const rows=[];
    rows.push({k:'tog',key:'carplay',on:nat&&P.carplay,dis:pwa,t:T(`When ${nat?carLink():'CarPlay / Android Auto'} connects`,`عند اتصال ${nat?carLink():'CarPlay / Android Auto'}`),s:pwa?T('Available in the iPhone and Android apps.','متاح في تطبيقي آيفون وأندرويد.'):T('Your car screen or USB / wireless projection.','شاشة السيارة أو الاتصال عبر USB أو لاسلكيًا.'),end:pwa?tag(T('App only','التطبيق فقط')):''});
    rows.push({k:'tog',key:'bt',on:nat&&P.bt,dis:pwa,t:T('When car Bluetooth connects','عند اتصال بلوتوث السيارة'),s:pwa?T('Available in the iPhone and Android apps.','متاح في تطبيقي آيفون وأندرويد.'):T('Only devices you mark as your car below.','فقط الأجهزة التي تحددها كسيارتك أدناه.'),end:pwa?tag(T('App only','التطبيق فقط')):''});
    if(nat&&P.bt){ rows.push({k:'chk',key:'devCar',on:P.devCar,sub:true,t:'Hilux 2023',s:T('Car audio · sample device','صوت السيارة · جهاز تجريبي')}); rows.push({k:'chk',key:'devSpk',on:P.devSpk,sub:true,t:T('Office speaker','سماعة المكتب'),s:T('Speaker · not a car · sample device','سماعة · ليست سيارة · جهاز تجريبي')}); }
    rows.push({k:'tog',key:'suggest',on:P.suggest,t:T('Suggest when I’m driving','اقترح عندما أقود'),s:pwa?T('Uses your location only while MENAFoods is open, to notice driving speed (over 20 km/h for about 1 minute). Location is never saved or sent.','يستخدم موقعك فقط أثناء فتح MENAFoods لملاحظة سرعة القيادة (أكثر من 20 كم/س لنحو دقيقة). لا يُحفظ الموقع ولا يُرسل.'):T(ctx().plat==='ios'?'Uses Motion & Fitness to notice driving. Nothing is saved or sent.':'Uses Physical activity to notice driving. Nothing is saved or sent.',ctx().plat==='ios'?'يستخدم الحركة واللياقة لملاحظة القيادة. لا يُحفظ أو يُرسل شيء.':'يستخدم النشاط البدني لملاحظة القيادة. لا يُحفظ أو يُرسل شيء.'),end:pwa?(P.locOk?tag(T('Location allowed','الموقع مسموح'),'ok'):tag(T('Needs location','يحتاج الموقع'),'warn')):''});
    out.push({title:T('Turn on automatically when','التشغيل التلقائي عند'),rows,note:T('Drive Mode turns off by itself when the car disconnects or you stop for 5 minutes.','يتوقف وضع القيادة تلقائيًا عند قطع اتصال السيارة أو التوقف 5 دقائق.')});
    if(pwa&&P.suggest&&!P.locOk) out.push({perm:'loc'});
  }
  out.push({title:T('While Drive Mode is on','أثناء تشغيل وضع القيادة'),rows:[
    {k:'tog',key:'read',on:P.read,t:T('Read answers aloud','قراءة الردود بصوت مسموع'),s:T('Uses your phone speaker or car audio.','يستخدم سماعة الهاتف أو صوت السيارة.')},
    {k:'tog',key:'listen',on:P.listen,t:T('Start listening when opened','ابدأ الاستماع عند الفتح'),s:T('Tap the Drive Mode pill and speak straight away.','اضغط زر وضع القيادة وتحدث مباشرة.')},
    {k:'info',t:T('Voice language','لغة الصوت'),s:T('Follows your device: English','حسب الجهاز: العربية')}]});
  return out;
}
const tag=(txt,k='')=>`<span class="mfdm-tag ${k}">${esc(txt)}</span>`;
function heroHTML(){ return `<div class="mfdm-hero"><span class="mfdm-lead">${svg('car',24)}</span><div><h2>${esc(T('Hands-free voice for the road','صوت دون استخدام اليدين أثناء الطريق'))}</h2><p>${esc(T('Hear orders, deliveries and balances read aloud, and open screens by voice. Voice never orders, pays or approves.','استمع إلى الطلبات والتوصيلات والأرصدة، وافتح الشاشات بالصوت. الصوت لا يطلب ولا يدفع ولا يعتمد.'))}</p></div></div>`; }
function platHTML(){ const p=ctx().plat; return `<div class="mfdm-plat" role="group" aria-label="${esc(T('Preview as','معاينة كـ'))}"><span>${esc(T('Preview as','معاينة كـ'))}</span>${[['pwa',T('Web app (PWA)','تطبيق الويب')],['ios','iPhone'],['android','Android']].map(([v,l])=>`<button type="button" data-drv="plat" data-v="${v}" aria-pressed="${p===v}">${esc(l)}</button>`).join('')}</div>`; }
function permHTML(kind){
  const M={loc:[svg('pin',22),T('Allow location to suggest Drive Mode','اسمح بالموقع لاقتراح وضع القيادة'),T('Your browser will ask once. MENAFoods checks speed only while the app is open and never stores where you are.','سيسألك المتصفح مرة واحدة. يتحقق MENAFoods من السرعة فقط أثناء فتح التطبيق ولا يحفظ موقعك.'),T('Allow location','اسمح بالموقع'),'allowloc'],
    bt:[svg('bt',22),T('Allow Nearby devices','اسمح بالأجهزة المجاورة'),T('Android needs this to know when your car’s Bluetooth connects. We only read the device type and name.','يحتاج أندرويد هذا لمعرفة اتصال بلوتوث السيارة. نقرأ نوع الجهاز واسمه فقط.'),T('Go to Settings','الانتقال إلى الإعدادات'),'toast'],
    motion:[svg('speed',22),T('Allow Motion & Fitness','اسمح بالحركة واللياقة'),T('iPhone uses this to notice when you’re driving. Nothing is saved or sent.','يستخدمه الآيفون لملاحظة أنك تقود. لا يُحفظ أو يُرسل شيء.'),T('Go to Settings','الانتقال إلى الإعدادات'),'toast'],
    mic:[svg('mic',22),T('Microphone is off for MENAFoods','الميكروفون مغلق لـ MENAFoods'),T('Drive Mode needs the microphone to hear you. You can still use every screen by touch.','يحتاج وضع القيادة إلى الميكروفون لسماعك. يمكنك استخدام كل الشاشات باللمس.'),T('Go to Settings','الانتقال إلى الإعدادات'),'toast']}[kind];
  return `<div class="mfdm-banner inline" role="group" aria-label="${esc(M[1])}"><div class="mfdm-bh"><span class="mfdm-lead">${M[0]}</span><div style="flex:1;min-width:0"><b>${esc(M[1])}</b><p>${esc(M[2])}</p></div></div><div class="mfdm-acts"><button type="button" class="mfdm-btn sec sm" data-drv="permno">${esc(T('Not now','ليس الآن'))}</button><button type="button" class="mfdm-btn sm" data-drv="${M[4]}">${esc(M[3])}</button></div></div>`;
}
function tryHTML(){
  const nat=native(); const b=[];
  if(P.mode==='on') b.push(`<button type="button" class="mfdm-btn" data-drv="open">${svg('mic',18)}${esc(T('Open Drive Mode','افتح وضع القيادة'))}</button>`);
  if(P.mode==='auto'){
    if(nat) b.push(`<button type="button" class="mfdm-btn sec" data-drv="simconn">${svg('car',18)}${esc(SS.conn?T('Simulate: car disconnects','محاكاة: فصل السيارة'):T('Simulate: car connects','محاكاة: اتصال السيارة'))}</button>`);
    b.push(`<button type="button" class="mfdm-btn sec" data-drv="simdrive">${svg('speed',18)}${esc(SS.driving?T('Simulate: stopped','محاكاة: توقف'):T('Simulate: driving speed','محاكاة: سرعة القيادة'))}</button>`);
    if(active()) b.push(`<button type="button" class="mfdm-btn" data-drv="open">${svg('mic',18)}${esc(T('Open Drive Mode','افتح وضع القيادة'))}</button>`);
  }
  if(!b.length) return '';
  return `<div class="mfdm-acts">${b.join('')}</div><p class="mfdm-note" style="margin-top:8px">${esc(T('Sample only: simulates the trip on this device. Nothing is sent.','تجريبي فقط: يحاكي الرحلة على هذا الجهاز. لا يُرسل شيء.'))}</p>`;
}
const safeTxt=()=>T('Voice only reads and opens screens. Orders, payments, deliveries, stock and approvals always need your tap. Always keep your eyes on the road.','الصوت يقرأ ويفتح الشاشات فقط. الطلبات والمدفوعات والتسليم والمخزون والموافقات تحتاج دائمًا إلى ضغطة منك. أبقِ عينيك على الطريق دائمًا.');
const deviceTxt=()=>T('Saved on this device only. Nothing is sent to MENAFoods.','محفوظ على هذا الجهاز فقط. لا يُرسل شيء إلى MENAFoods.');
const VIEWS=()=>[['set',T('Settings','الإعدادات')],['conn',T('Car connected','السيارة متصلة')],['suggest',T('Driving detected (web)','رصد القيادة (الويب)')],['perm',T('Permissions','الأذونات')],['voice',T('Voice panel','لوحة الصوت')]];
function viewHTML(v){
  if(v==='conn') return [[T('Automatic · car connected','تلقائي · السيارة متصلة'),`<div class="mfdm-hero"><span class="mfdm-lead">${svg('car',24)}</span><div><h2>${esc(T('Connected to Hilux 2023 (sample)','متصل بـ Hilux 2023 (عينة)'))}</h2><p>${esc(T('Drive Mode turned on automatically. It turns off when the car disconnects.','تم تشغيل وضع القيادة تلقائيًا. يتوقف عند قطع اتصال السيارة.'))}</p></div></div><p class="mfdm-note" style="margin:12px 0 6px">${esc(T('This pill sits in the top bar of every screen while Drive Mode is on:','يظهر هذا الزر أعلى كل شاشة أثناء تشغيل وضع القيادة:'))}</p><div>${pillHTML(true)}</div>`],[T('Where it shows','أين يظهر'),`<p class="mfdm-note">${esc(T('Native apps only (iPhone: CarPlay or car Bluetooth audio route · Android: Android Auto or a Bluetooth device of type car audio / hands-free).','في التطبيقات فقط (آيفون: CarPlay أو مسار صوت بلوتوث السيارة · أندرويد: Android Auto أو جهاز بلوتوث من نوع صوت السيارة / حر اليدين).'))}</p>`]];
  if(v==='suggest') return [[T('Web app (PWA) · driving speed detected','تطبيق الويب · رُصدت سرعة القيادة'),bannerHTML(true)],[T('When it shows','متى يظهر'),`<p class="mfdm-note">${esc(T('Automatic is on, “Suggest when I’m driving” is on, location is allowed, the app is open, and speed stays over 20 km/h for about 1 minute. Shown once per trip; “Not now” hides it until the next trip.','عندما يكون التلقائي مفعّلًا، و«اقترح عندما أقود» مفعّلًا، والموقع مسموحًا، والتطبيق مفتوحًا، والسرعة فوق 20 كم/س لنحو دقيقة. يظهر مرة لكل رحلة؛ و«ليس الآن» يخفيه حتى الرحلة التالية.'))}</p>`]];
  if(v==='perm') return [[T('Web app (PWA)','تطبيق الويب'),permHTML('loc')],[T('Android app','تطبيق أندرويد'),permHTML('bt')],[T('iPhone app','تطبيق آيفون'),permHTML('motion')],[T('All platforms','كل المنصات'),permHTML('mic')]];
  if(v==='voice') return [[T('Voice panel (opens from the pill)','لوحة الصوت (تفتح من الزر)'),`<div class="mfdm-voice-inline">${voiceHTML(true)}</div>`]];
  return null;
}

/* ---- MF runtime renderer (4 working themes) ---- */
/* mode picker in each theme's own idiom: v3/B = list radios, Souq = outlined square segment, Pro Ops = segmented control, Fresh = selectable cards, C = action tiles */
const PICK={souq:'chips',pro:'seg',fresh:'cards',c:'tiles'}[THEME]||'';
function pickHTML(sec){ const k=PICK, MI={off:'off',on:'mic',auto:'car'};
  const opts=sec.rows.map(r=>{ const id='mfdmp-'+r.v, on=P.mode===r.v;
    return `<label class="mfdm-opt${on?' on':''}" data-v="${r.v}" for="${id}"><input type="radio" name="mfdrv" id="${id}" value="${r.v}"${on?' checked':''}${k==='cards'?'':` aria-describedby="mfdmPd"`}>${k==='cards'||k==='tiles'?`<span class="mfdm-oi">${svg(MI[r.v],22)}</span>`:''}${k==='cards'?`<span class="mfdm-ob"><span class="mfdm-ot">${esc(r.t)}</span><span class="mfdm-os">${esc(r.s)}</span>${r.end?`<span class="mfdm-oe">${r.end}</span>`:''}</span><span class="mfdm-ocheck">${svg('check',16)}</span>`:`<span class="mfdm-ot">${esc(r.t)}</span>`}</label>`; }).join('');
  const cur=sec.rows.find(r=>r.v===P.mode)||sec.rows[0];
  return `<div class="mfdm-pick k-${k}">${opts}</div>${k==='cards'?'':`<div class="mfdm-pd" id="mfdmPd" aria-live="polite"><b>${esc(cur.t)}</b>${cur.end?' '+cur.end:''}<p>${esc(cur.s)}</p></div>`}`; }

function mfRows(rows){ return rows.map(r=>{
  const id='mfdm-'+(r.key||r.v||r.t).toString().replace(/\W/g,'');
  const sub=r.s?`<span class="s">${esc(r.s)}</span>`:'';
  if(r.k==='radio') return `<div class="row rad"><input type="radio" name="mfdrv" id="${id}" value="${r.v}"${P.mode===r.v?' checked':''}><span class="b"><label class="t" for="${id}">${esc(r.t)}</label>${sub}</span>${r.end?`<span class="e">${r.end}</span>`:''}</div>`;
  if(r.k==='tog') return `<div class="row tog${r.dis?' mfdm-dis':''}"><span class="b"><label class="t" for="${id}">${esc(r.t)}</label>${sub}</span>${r.end?`<span class="e">${r.end}</span>`:''}<input class="sw" type="checkbox" role="switch" id="${id}" data-drv-k="${r.key}"${r.on?' checked':''}${r.dis?' disabled aria-disabled="true"':''}></div>`;
  if(r.k==='chk') return `<div class="row tog mfdm-sub"><input class="cb" type="checkbox" id="${id}" data-drv-k="${r.key}"${r.on?' checked':''}><span class="b"><label class="t" for="${id}">${esc(r.t)}</label>${sub}</span></div>`;
  return `<div class="row"><span class="b"><span class="t">${esc(r.t)}</span>${sub}</span></div>`; }).join(''); }
function mfRender(c){
  const MF=window.MF, H=MF.H; UI.view=c.v||'set';
  const vv=viewHTML(UI.view);
  const o={raw:true,cls:'mfdm-s'};
  if(vv) return vv.map(([h,b])=>H.sec(esc(h),`<div class="card pad">${b}</div>`,o)).join('');
  let h=H.sec('',`<div class="card pad mfdm-herocard">${heroHTML()}</div>`,o);
  model().forEach((sec,i)=>{ if(sec.perm){ h+=H.sec('',permHTML(sec.perm),o); return; }
    const body=i===0&&PICK?(PICK==='seg'?`<div class="card pad">${pickHTML(sec)}</div>`:pickHTML(sec)):`<div class="card grp">${mfRows(sec.rows)}</div>`;
    h+=H.sec(esc(sec.title),`<fieldset style="border:0;padding:0;margin:0;min-width:0"><legend class="mfdm-vh">${esc(sec.title)}</legend>${body}</fieldset>${sec.note?H.note(esc(sec.note),'info'):''}`,o); });
  const tr=tryHTML(); if(tr) h+=H.sec(esc(T('Try it','جرّبه')),tr,o);
  h+=H.sec(esc(T('Preview platform','منصة المعاينة')),platHTML(),o);
  h+=H.note(esc(safeTxt()),'shield')+H.note(esc(deviceTxt()),'lock');
  return h;
}
/* ---- generic renderer (Direction B / C) ---- */
function gRows(rows){ return rows.map(r=>{
  const id='mfdmg-'+(r.key||r.v||r.t).toString().replace(/\W/g,'');
  const sub=r.s?`<span class="s">${esc(r.s)}</span>`:'';
  if(r.k==='radio') return `<label class="mfdm-row" for="${id}"><input type="radio" name="mfdrv" id="${id}" value="${r.v}"${P.mode===r.v?' checked':''}><span class="b"><span class="t">${esc(r.t)}</span>${sub}</span>${r.end||''}</label>`;
  if(r.k==='tog') return `<label class="mfdm-row${r.dis?' mfdm-dis':''}" for="${id}"><span class="b"><span class="t">${esc(r.t)}</span>${sub}</span>${r.end||''}<input class="mfdm-sw" type="checkbox" role="switch" id="${id}" data-drv-k="${r.key}"${r.on?' checked':''}${r.dis?' disabled aria-disabled="true"':''}></label>`;
  if(r.k==='chk') return `<label class="mfdm-row mfdm-sub" for="${id}"><input type="checkbox" id="${id}" data-drv-k="${r.key}"${r.on?' checked':''}><span class="b"><span class="t">${esc(r.t)}</span>${sub}</span></label>`;
  return `<div class="mfdm-row" style="cursor:default"><span class="b"><span class="t">${esc(r.t)}</span>${sub}</span></div>`; }).join(''); }
function genericHTML(){
  const seg=`<div class="mfdm-seg" role="group" aria-label="${esc(T('Prototype view','عرض النموذج'))}">${VIEWS().map(([v,l])=>`<button type="button" data-drv="view" data-v="${v}" aria-pressed="${UI.view===v}">${esc(l)}</button>`).join('')}</div>`;
  const vv=viewHTML(UI.view);
  if(vv) return `<div class="mfdm-g" dir="${ctx().lang==='ar'?'rtl':'ltr'}">${seg}${vv.map(([h,b])=>`<section><h3>${esc(h)}</h3><div class="mfdm-card pad">${b}</div></section>`).join('')}</div>`;
  let h=`<div class="mfdm-g" dir="${ctx().lang==='ar'?'rtl':'ltr'}">${seg}<div class="mfdm-card pad mfdm-herocard">${heroHTML()}</div>`;
  model().forEach((sec,i)=>{ if(sec.perm){ h+=permHTML(sec.perm); return; } h+=`<section><h3>${esc(sec.title)}</h3><fieldset style="border:0;padding:0;margin:0;min-width:0"><legend class="mfdm-vh">${esc(sec.title)}</legend>${i===0&&PICK?pickHTML(sec):`<div class="mfdm-card">${gRows(sec.rows)}</div>`}</fieldset>${sec.note?`<p class="mfdm-note" style="margin-top:8px">${esc(sec.note)}</p>`:''}</section>`; });
  const tr=tryHTML(); if(tr) h+=`<section><h3>${esc(T('Try it','جرّبه'))}</h3>${tr}</section>`;
  h+=`<section><h3>${esc(T('Preview platform','منصة المعاينة'))}</h3>${platHTML()}</section>`;
  h+=`<p class="mfdm-note">${svg('shield',18)}<span>${esc(safeTxt())}</span></p><p class="mfdm-note">${svg('lock',18)}<span>${esc(deviceTxt())}</span></p></div>`;
  return h;
}
function entryRow(){ return {t:T('Drive Mode','وضع القيادة'),s:modeLabel()+(active()?T(' · on now',' · يعمل الآن'):'')}; }

/* ---------- register per framework ---------- */
function registerMF(){
  const MF=window.MF; if(MF.SCR['set.drive']) return;
  MF.S('set.drive',{a:'settings',r:'owner bm buyer cashier sales van driver store acct mgr admin aff viewer recv cfin',t:['Drive Mode','وضع القيادة'],back:'more',
    v:[['set',['Settings','الإعدادات']],['conn',['Car connected','السيارة متصلة']],['suggest',['Driving detected (web)','رصد القيادة (الويب)']],['perm',['Permissions','الأذونات']],['voice',['Voice panel','لوحة الصوت']]],
    segLabel:['Drive Mode prototype view','عرض نموذج وضع القيادة'],render:mfRender});
  /* Settings › Account › App: add a Drive Mode row above Notifications */
  const acc=MF.SCR['set.account']; if(acc&&!acc.__mfdm){ const r0=acc.render; acc.render=function(c){ let h=r0.apply(this,arguments); const i=h.indexOf(`href="${MF.href('n.prefs')}"`); const row=MF.H.row({ic:'mic',t:esc(entryRow().t),s:esc(entryRow().s),go:'set.drive'}); if(i>0){ const a=h.lastIndexOf('<a ',i); if(a>=0) return h.slice(0,a)+row+h.slice(a); } return h; }; acc.__mfdm=true; }
  /* More: show the current value under the Drive Mode row */
  const addSub=()=>{ const m=document.querySelector('#main'); if(!m||!MF.C||MF.C.id!=='more') return; m.querySelectorAll('a.row[href^="#/set.drive"]').forEach(a=>{ const b=a.querySelector('.b'); if(b&&!b.querySelector('.s')){ const s=document.createElement('span'); s.className='s'; s.textContent=entryRow().s; b.appendChild(s); } }); };
  hook.push(addSub);
}
function registerB(){
  if(SC['c.drive']) return;
  screen('c.drive',{role:'customer',code:'2.16',en:'Drive Mode',ar:'وضع القيادة',nav:'c.profile',back:'c.profile',layout:'list',
    notes:['Drive Mode moved off every page into Account & settings: Off / On / Automatic (device-only preference).','Automatic: native apps detect CarPlay / Android Auto / car Bluetooth; the web app can only suggest it at driving speed (location permission).','Active state = small "Drive Mode" pill in the top bar; tap opens the voice panel. Voice never orders, pays or approves.'],
    render:()=>genericHTML()});
  const p=SC['c.profile']; if(p&&!p.__mfdm){ const r0=p.render; p.render=function(){ let h=r0.apply(this,arguments); const e=entryRow(); const row=li({lead:`<span class="mfdm-lead" style="width:40px;height:40px;border-radius:12px">${svg('mic',20)}</span>`,title:esc(e.t),meta:esc(e.s),act:'go:c.drive'}); const k=h.indexOf('<div class="list">',h.indexOf('<div class="list">')+1); return k>0?h.slice(0,k)+`<div class="list">${row}</div>`+h.slice(k):h+`<div class="list">${row}</div>`; }; p.__mfdm=true; }
}
function registerC(){
  if(SCREENS.some(s=>s.id==='b-drive')) return;
  SCREENS.push({id:'b-drive',role:'customer',nav:'more',title:['Drive Mode','وضع القيادة'],kind:'list',back:'b-profile',render:()=>genericHTML()});
  const p=SCREENS.find(s=>s.id==='b-profile'); if(p&&!p.__mfdm){ const r0=p.render; p.render=function(){ let h=r0.apply(this,arguments); const e=entryRow(); const row=list([{lead:`<div class="thumb">${svg('mic',20)}</div>`,t:esc(e.t),s:esc(e.s),go:'b-drive'}]); const so=h.indexOf(L('Sign out','تسجيل الخروج')); const k=so>0?h.lastIndexOf('<button',so):-1; return k>0?h.slice(0,k)+row+h.slice(k):h+row; }; p.__mfdm=true; }
}
const hook=[];

/* ---------- events ---------- */
document.addEventListener('change',e=>{
  const el=e.target; if(!el||!el.closest) return;
  if(el.name==='mfdrv'){ setMode(el.value); UI.view='set'; rerender(); const f=document.querySelector(`input[name="mfdrv"][value="${el.value}"]`); f&&f.focus(); return; }
  const k=el.dataset&&el.dataset.drvK; if(k){ P[k]=!!el.checked; save(); if(k==='suggest'&&el.checked&&!native()&&!P.locOk) UI.perm=true; rerender(); const f=document.querySelector(`[data-drv-k="${k}"]`); f&&f.focus(); }
},true);
document.addEventListener('click',e=>{
  const el=e.target.closest&&e.target.closest('[data-drv]'); if(!el) return;
  e.preventDefault(); e.stopPropagation();
  const a=el.dataset.drv;
  if(a==='open'){ if(!active()){ if(P.mode==='off'){ setMode('on'); } else { SS.trip='on'; ssave(); } } UI.open=true; UI.heard='';UI.answer='';UI.confirm=null; ensure(); if(P.listen) listen(null); if(FW!=='mf'||isDriveScreen()) rerender(); return; }
  if(a==='close'){ UI.open=false; UI.listening=false; clearTimeout(tmr); ensure(); const p=document.getElementById('mfdmPill'); p&&p.focus(); return; }
  if(a==='mic'){ if(UI.listening){ clearTimeout(tmr); UI.listening=false; refreshSheet(); } else listen(null); return; }
  if(a==='say'){ listen(+el.dataset.i); return; }
  if(a==='undo'){ UI.confirm=null; refreshSheet(); return; }
  if(a==='opengo'){ UI.open=false; goScreen(el.dataset.go); return; }
  if(a==='settings'){ goSettings(); return; }
  if(a==='off'){ UI.open=false; UI.listening=false; clearTimeout(tmr); if(P.mode==='auto'){ SS.trip='off'; ssave(); } else setMode('off'); rerender(); toastMsg(T('Drive Mode is off','تم إيقاف وضع القيادة')); return; }
  if(a==='accept'){ SS.trip='on'; ssave(); UI.open=true; ensure(); if(P.listen) listen(null); rerender(); return; }
  if(a==='dismiss'){ SS.dismissed=true; ssave(); rerender(); return; }
  if(a==='nosuggest'){ P.suggest=false; save(); SS.dismissed=true; ssave(); rerender(); toastMsg(T('We won’t suggest Drive Mode again. Change this in Settings.','لن نقترح وضع القيادة مرة أخرى. يمكنك تغيير ذلك من الإعدادات.')); return; }
  if(a==='simconn'){ SS.conn=!SS.conn; if(!SS.conn){ SS.trip=''; UI.open=false; } ssave(); rerender(); toastMsg(SS.conn?T('Car connected (sample) · Drive Mode on','السيارة متصلة (عينة) · وضع القيادة يعمل'):T('Car disconnected (sample) · Drive Mode off','فُصلت السيارة (عينة) · توقف وضع القيادة')); return; }
  if(a==='simdrive'){ SS.driving=!SS.driving; if(!SS.driving){ SS.dismissed=false; if(SS.trip==='on'&&!SS.conn) SS.trip=''; } ssave(); rerender(); return; }
  if(a==='allowloc'){ P.locOk=true; save(); rerender(); toastMsg(T('Location allowed (sample). The real app asks your browser.','تم السماح بالموقع (عينة). التطبيق الفعلي يسأل المتصفح.')); return; }
  if(a==='permno'){ if(isDriveScreen()&&UI.view==='set'){ P.suggest=false; save(); rerender(); } else toastMsg(T('OK, not now','حسنًا، ليس الآن')); return; }
  if(a==='toast'){ toastMsg(T('Opens the phone’s Settings in the app (preview only).','يفتح إعدادات الهاتف في التطبيق (معاينة فقط).')); return; }
  if(a==='plat'){ setPlat(el.dataset.v); return; }
  if(a==='view'){ UI.view=el.dataset.v; rerender(); return; }
},true);
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&UI.open){ UI.open=false; UI.listening=false; clearTimeout(tmr); ensure(); const p=document.getElementById('mfdmPill'); p&&p.focus(); } });
window.addEventListener('storage',e=>{ if(e.key===KEY){ P=load(); ensure(); } });
function toastMsg(m){
  if(FW==='mf'&&window.MF.toast){ window.MF.toast(m); return; }
  if(FW==='c'){ try{ toast(m,false); return; }catch(e){} }
  let b=document.getElementById('mfdmToast'); if(!b){ b=document.createElement('div'); b.id='mfdmToast'; b.setAttribute('role','status'); b.setAttribute('aria-live','polite'); b.style.cssText='position:fixed;z-index:2147483000;left:50%;bottom:28px;transform:translateX(-50%);max-width:min(92vw,420px);background:#1d2420;color:#fff;border-radius:12px;padding:12px 16px;font:500 14px/1.45 system-ui,sans-serif;opacity:0;transition:opacity .2s;pointer-events:none'; document.body.appendChild(b); }
  b.textContent=m; b.style.opacity='1'; clearTimeout(b._t); b._t=setTimeout(()=>{ b.style.opacity='0'; },2600);
}

/* ---------- boot ---------- */
if(FW==='mf') registerMF(); else if(FW==='b') registerB(); else registerC();
let q=0; const sched=()=>{ if(q) return; q=requestAnimationFrame(()=>{ q=0; hook.forEach(f=>{ try{ f(); }catch(e){} }); ensure(); }); };
function observe(){
  const tgt=FW==='b'?document.getElementById('viewer'):FW==='c'?document.getElementById('root'):document.body;
  if(!tgt){ return setTimeout(observe,50); }
  new MutationObserver(sched).observe(tgt,{childList:true});
  if(FW==='b'){ new MutationObserver(sched).observe(tgt,{childList:true,subtree:false}); }
  window.addEventListener('hashchange',sched); sched();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',observe); else observe();
window.MFDrive={version:'preview-1',pref:()=>Object.assign({},P),setMode:m=>{ setMode(m); rerender(); },active,ensure,_ui:UI,cmds,ctx,na:NA_TXT,brief:BRIEF_Q,canFin,canRewards,clearVoice};
})();
