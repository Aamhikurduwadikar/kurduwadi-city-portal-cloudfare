/* Kurduwadi homepage final mobile/layout polish */
(function(){
  'use strict';
  if(!document.body.classList.contains('premium-home')) return;

  function removeDuplicatePride(){
    const sections=[...document.querySelectorAll('section')].filter(s=>/अभिमानास्पद व्यक्तिमत्त्वे/.test(s.textContent||''));
    sections.slice(1).forEach(s=>s.remove());
  }

  function polish(){
    removeDuplicatePride();
    document.querySelectorAll('.premium-home .hero-card').forEach(el=>el.classList.add('compact-hero-card'));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',polish); else polish();
  const observer=new MutationObserver(function(){ removeDuplicatePride(); });
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),12000);
})();
