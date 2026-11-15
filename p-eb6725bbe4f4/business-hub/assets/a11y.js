/* v2 accessibility layer for the prototype. Production code sets these at source (see components.md);
   this pass guarantees names/roles/lang/focus for every rendered state so axe runs stay clean. */
(function(){
const MF = window.MF, L = MF.L;
const IL = {bell:['Notifications','الإشعارات'],phone:['Call','اتصال'],whatsapp:['WhatsApp','واتساب'],more:['More actions','إجراءات أخرى'],x:['Remove','إزالة'],nav:['Navigate','تنقّل'],upload:['Upload','رفع'],list:['Menu','القائمة'],users:['Approvals','الاعتمادات'],back:['Back','رجوع'],refresh:['Retry','إعادة المحاولة'],camera:['Take photo','التقاط صورة'],scan:['Scan barcode','مسح الباركود'],search:['Search','بحث'],plus:['Add','إضافة'],minus:['Decrease','إنقاص'],filter:['Filter','تصفية'],clock:['History','السجل'],history:['Change history','سجل التغييرات'],pen:['Edit','تعديل'],info:['More info','مزيد من المعلومات'],printer:['Print','طباعة'],share:['Share','مشاركة'],check:['Confirm','تأكيد'],sync:['Sync','مزامنة'],file:['Open document','فتح المستند'],cart:['Cart','السلة'],pin:['Location','الموقع'],cash:['Collect','تحصيل']};
const FOC = 'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
let uid = 0;
const LAT = /[A-Za-z][A-Za-z0-9&'’.\-]*(?:\s+[A-Za-z0-9&'’.\-]*[A-Za-z][A-Za-z0-9&'’.\-]*)*/g;
const ARA = /[\u0600-\u06FF][\u0600-\u06FF\u064B-\u065F\s،]*[\u0600-\u06FF]|[\u0600-\u06FF]/g;
function wrapLang(root, uiLang){
  const re = uiLang==='ar' ? LAT : ARA, tag = uiLang==='ar' ? 'en' : 'ar';
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode(n){
    const p = n.parentElement; if (!p || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
    if (p.closest('script,style,svg,textarea,code,.mono,[translate=no],[data-nolang],.statusbar,.kbd')) return NodeFilter.FILTER_REJECT;
    const l = p.closest('[lang]'); if (l && l.getAttribute('lang')!==uiLang) return NodeFilter.FILTER_REJECT;
    re.lastIndex = 0; return re.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }});
  const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(n => { const v = n.nodeValue; re.lastIndex = 0; const frag = document.createDocumentFragment(); let last = 0, m;
    while ((m = re.exec(v))) { if (tag==='en' && !/[A-Za-z]{2,}/.test(m[0])) continue; frag.append(v.slice(last, m.index)); const sp = document.createElement('span'); sp.lang = tag; if (tag==='ar') sp.dir='rtl'; sp.textContent = m[0]; frag.append(sp); last = m.index + m[0].length; }
    if (last===0) return; frag.append(v.slice(last)); n.replaceWith(frag); });
}
MF.enhance = (root) => {
  if (!root) return; const ui = root.getAttribute('lang') || 'en';
  // 1) icon-only controls get bilingual names
  root.querySelectorAll('button,a,[data-go],[data-act]').forEach(b => {
    if (b.classList.contains('scrim') || b.getAttribute('aria-label') || b.getAttribute('aria-labelledby')) return;
    if ((b.textContent||'').trim()) return;
    const sv = b.querySelector('svg[data-i]'); const k = sv && sv.dataset.i; const lab = b.dataset.label || (IL[k] ? L(IL[k][0], IL[k][1]) : L('Action','إجراء'));
    b.setAttribute('aria-label', lab); if (!b.title) b.title = lab; });
  // 2) clickable non-native elements become keyboard operable (no nested interactive)
  root.querySelectorAll('[data-go],[data-act]').forEach(el => {
    if (el.matches('a[href],button,input,select,textarea,label,.scrim,option') || el.hasAttribute('role') && el.getAttribute('role')!=='none') return;
    if (el.tagName==='TR') { const td = el.querySelector('td'); if (td && !td.querySelector(FOC)) { const a = document.createElement('a'); a.href = '#'; a.className = 'rowlink'; if (el.dataset.go) a.dataset.go = el.dataset.go; else a.dataset.act = el.dataset.act; while (td.firstChild) a.append(td.firstChild); td.append(a); } return; }
    if (el.querySelector(FOC)) { const t = el.querySelector('.t,.nm'); if (t && !t.querySelector(FOC)) { t.setAttribute('role', el.dataset.go?'link':'button'); t.tabIndex = 0; if (el.dataset.go) t.dataset.go = el.dataset.go; else t.dataset.act = el.dataset.act; } return; }
    el.setAttribute('role', el.dataset.go && !el.classList.contains('chip') ? 'link' : 'button'); el.tabIndex = 0;
    if (el.classList.contains('chip') && !el.closest('[role=tablist]')) el.setAttribute('aria-pressed', el.classList.contains('on') ? 'true' : 'false');
    if (el.classList.contains('li') && el.classList.contains('sel')) el.setAttribute('aria-current', 'true'); });
  // 3) static chips/tags that look like filters but are not operable: expose as buttons (prototype filters are live)
  root.querySelectorAll('.chip:not([role]):not([data-act]):not([data-go])').forEach(c => { c.setAttribute('role','button'); c.tabIndex = 0; c.setAttribute('aria-pressed', c.classList.contains('on')?'true':'false'); c.dataset.act = 'noop'; });
  // 4) form fields: label + error/hint association
  root.querySelectorAll('input,textarea,select').forEach(i => {
    if (i.type==='hidden') return;
    const lab = i.closest('label'); const f = i.closest('.field');
    if (!i.getAttribute('aria-label') && !lab && !(i.id && root.querySelector(`label[for="${i.id}"]`))) {
      const fs = f && f.querySelector(':scope>span'); const row = i.closest('.li,.rl,tr,.upl');
      const ctx = row && (row.querySelector('.t,.nm,td b,.strong'));
      i.setAttribute('aria-label', i.dataset.label || (fs && fs.textContent.trim()) || i.placeholder || (ctx ? ctx.textContent.trim()+' — '+L('quantity','الكمية') : L('Input','حقل'))); }
    if (f) { const em = f.querySelector(':scope>em'); if (em) { em.id = em.id || 'd'+(++uid); i.setAttribute('aria-describedby', em.id); if (em.classList.contains('err')) { i.setAttribute('aria-invalid','true'); em.setAttribute('role','alert'); } } }
    if (i.readOnly) i.setAttribute('aria-readonly','true'); });
  // 5) scrollable regions are focusable when they hold no focusable content
  root.querySelectorAll('.content,.tbwrap,.chips,.steps,.pane,.receipt-wrap').forEach(r => { if (!r.querySelector(FOC)) { r.tabIndex = 0; if (!r.getAttribute('aria-label')) { r.setAttribute('role','region'); r.setAttribute('aria-label', r.classList.contains('tbwrap') ? L('Table','جدول') : L('Scrollable area','منطقة قابلة للتمرير')); } } });
  // 6) tables
  root.querySelectorAll('table.tb th').forEach(th => th.setAttribute('scope','col'));
  root.querySelectorAll('table.tb th:empty').forEach(th => { th.innerHTML = `<span class="sr">${L('Actions','الإجراءات')}</span>`; });
  // 7) mixed-language runs get lang (Latin inside Arabic UI and vice versa)
  wrapLang(root, ui);
};
})();

// 1.3.5 input purpose: autocomplete from the field label (production: set at source)
MF.autoPurpose = (root) => { const map=[[/legal name|company name|trade name|الاسم التجاري|اسم المنشأة/i,'organization'],[/full name|receiver name|signatory$|^name$|المفوّض بالتوقيع|الاسم الكامل|اسم المستلم/i,'name'],[/e-?mail|البريد/i,'email'],[/mobile|phone|الجوال|الهاتف/i,'tel-national'],[/postal|الرمز البريدي/i,'postal-code'],[/city|المدينة/i,'address-level2'],[/street|الشارع/i,'address-line1'],[/district|الحي/i,'address-level3'],[/iban|آيبان/i,'off']];
  root.querySelectorAll('input:not([autocomplete]):not([type=checkbox]):not([type=radio])').forEach(i=>{ const t=(i.closest('label')?.querySelector('span')?.textContent||i.getAttribute('aria-label')||'').trim(); for(const [re,v] of map){ if(re.test(t)){ i.setAttribute('autocomplete',v); break; } } }); };
(()=>{ const e=MF.enhance; MF.enhance=(r)=>{ e(r); if(r) MF.autoPurpose(r); }; })();
