/* Export-only helper (not part of the prototype UI): bakes RTL layout into physical LTR layout so Figma's
   capture (auto-layout has no RTL mode) keeps the right-to-left arrangement. Browser render must stay identical. */
window.bakeRTL = function(root){
  const stats={flexRow:0,flexCol:0,grid:0,leaf:0,tables:0,els:0};
  [...root.querySelectorAll('.app[dir=rtl]')].forEach(app=>{
    const inlineLike = n => { const d=getComputedStyle(n).display; return /^(inline|inline-block|inline-flex|inline-grid|contents)$/.test(d) && getComputedStyle(n).position!=='absolute'; };
    const isTextHolder = el => [...el.childNodes].some(n=>(n.nodeType===3&&n.textContent.trim())||(n.nodeType===1&&!(n instanceof SVGElement)&&inlineLike(n)));
    const sw=[], leaves=[];
    (function walk(el){
      if (el instanceof SVGElement) return;
      const cs=getComputedStyle(el);
      if (cs.direction!=='rtl' || cs.display==='none') return;
      if (/^table/.test(cs.display) || (/auto|scroll/.test(cs.overflowX) && el.querySelector('table'))) { leaves.push(el); stats.tables++; return; }
      const fl=/flex|grid/.test(cs.display);
      if (!fl && isTextHolder(el)) { leaves.push(el); return; }
      sw.push(el); [...el.children].forEach(walk);
    })(app);
    const rec=new Map(); const all=[...sw,...leaves];
    all.forEach(el=>{ const cs=getComputedStyle(el);
      rec.set(el,{d:cs.display,fd:cs.flexDirection,fw:cs.flexWrap,jc:cs.justifyContent,ai:cs.alignItems,as:cs.alignSelf,ta:cs.textAlign,ml:cs.marginLeft,mr:cs.marginRight,pl:cs.paddingLeft,pr:cs.paddingRight,
        bl:`${cs.borderLeftWidth} ${cs.borderLeftStyle} ${cs.borderLeftColor}`,br:`${cs.borderRightWidth} ${cs.borderRightStyle} ${cs.borderRightColor}`,
        pos:cs.position,l:cs.left,r:cs.right,r1:cs.borderTopLeftRadius,r2:cs.borderTopRightRadius,r3:cs.borderBottomLeftRadius,r4:cs.borderBottomRightRadius,
        gtc:cs.gridTemplateColumns}); });
    // grids: measure children before any change
    const grids=[];
    sw.forEach(el=>{ const R=rec.get(el); if(/grid/.test(R.d) || (/flex/.test(R.d) && R.fd==='row' && /^wrap/.test(R.fw))){ const er=el.getBoundingClientRect(); const cs=getComputedStyle(el);
      grids.push([el,er,parseFloat(cs.borderLeftWidth),parseFloat(cs.borderTopWidth),[...el.children].map(c=>[c,c.getBoundingClientRect(),getComputedStyle(c).position])]); } });
    all.forEach(el=>{ const R=rec.get(el), s=el.style;
      s.marginLeft=R.ml; s.marginRight=R.mr; s.paddingLeft=R.pl; s.paddingRight=R.pr; s.borderLeft=R.bl; s.borderRight=R.br;
      s.borderTopLeftRadius=R.r1; s.borderTopRightRadius=R.r2; s.borderBottomLeftRadius=R.r3; s.borderBottomRightRadius=R.r4;
      if (R.pos==='absolute'||R.pos==='fixed'||R.pos==='sticky'||R.pos==='relative'){ s.left=R.l; s.right=R.r; }
      s.textAlign = R.ta==='start'?'right':R.ta==='end'?'left':R.ta; stats.els++; });
    leaves.forEach(el=>{ el.style.direction='rtl'; stats.leaf++; });
    const swapCross={'flex-start':'flex-end','start':'flex-end','self-start':'flex-end','flex-end':'flex-start','end':'flex-start','self-end':'flex-start'};
    sw.forEach(el=>{ const R=rec.get(el);
      if (/flex/.test(R.d)){
        if (R.fd==='row' && !/^wrap/.test(R.fw)){
          [...el.childNodes].forEach(n=>{ if(n.nodeType===3&&n.textContent.trim()){ const sp=document.createElement('span'); sp.style.direction='rtl'; n.replaceWith(sp); sp.appendChild(n);} });
          const kids=[...el.childNodes].filter(n=>n.nodeType===1); kids.reverse().forEach(k=>el.appendChild(k));
          const m={'flex-start':'flex-end','start':'flex-end','normal':'flex-end','flex-end':'flex-start','end':'flex-start','left':'right','right':'left'};
          if (m[R.jc]) el.style.justifyContent=m[R.jc]; stats.flexRow++; }
        else if (R.fd==='row'){ /* wrapping rows handled as absolute below */ }
        else if (R.fd==='row-reverse'){ el.style.flexDirection='row'; stats.flexRow++; }
        else { if (swapCross[R.ai]) el.style.alignItems=swapCross[R.ai]; stats.flexCol++; }
        [...el.children].forEach(c=>{ const cr=rec.get(c); const as=cr?cr.as:getComputedStyle(c).alignSelf; if(/column/.test(R.fd)&&swapCross[as]) c.style.alignSelf=swapCross[as]; });
      }
    });
    // grids → absolute children at measured positions (identical visual, explicit physical layout)
    grids.forEach(([el,er,bw,bt,kids])=>{ const st=el.style;
      st.display='block'; st.height=er.height+'px'; st.boxSizing='border-box'; if(getComputedStyle(el).position==='static') st.position='relative';
      kids.forEach(([c,r,p])=>{ if(p==='absolute'||p==='fixed') return; const s=c.style; s.position='absolute'; s.boxSizing='border-box';
        s.left=(r.left-er.left-bw)+'px'; s.top=(r.top-er.top-bt)+'px'; s.width=r.width+'px'; s.height=r.height+'px'; s.margin='0'; s.right='auto'; });
      stats.grid++; });
    sw.forEach(el=>{ el.style.direction='ltr'; });
  });
  return stats;
};
