/* Premium header shortcuts: keep key pages visible in the main navigation. */
(function(){
  const ITEMS=[
    {href:'business-card.html',label:'💳 डिजिटल बिझनेस कार्ड',key:'business-card.html'},
    {href:'representatives.html',label:'👥 लोकप्रतिनिधी',key:'representatives.html'}
  ];
  function clean(){
    document.querySelectorAll('header nav[aria-label="मुख्य मेनू"]').forEach(nav=>{
      ITEMS.forEach(item=>{
        if(!nav.querySelector('a[href="'+item.href+'"]')){
          const a=document.createElement('a');
          a.href=item.href;
          a.textContent=item.label;
          a.dataset.kpHeaderShortcut='true';
          nav.appendChild(a);
        }
      });
    });
    const styleId='kpHeaderShortcutStyle';
    if(!document.getElementById(styleId)){
      const s=document.createElement('style');s.id=styleId;
      s.textContent='header nav a[data-kp-header-shortcut]{font-weight:700} @media(max-width:900px){header nav a[data-kp-header-shortcut]{display:none}}';
      document.head.appendChild(s);
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{
    clean();
    const o=new MutationObserver(clean);o.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>o.disconnect(),8000);
  });
})();
