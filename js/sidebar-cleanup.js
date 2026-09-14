/* Keep the premium side drawer focused: remove items already represented on the homepage/header. */
(function(){
  const HOME_LINKS=new Set(['map.html','representatives.html','city-info.html','directory.html','business-card.html','ideas.html']);
  function clean(){
    const drawer=document.getElementById('kpPremiumDrawer');
    if(!drawer)return;
    drawer.querySelectorAll('.kp-drawer-links a').forEach(a=>{
      const href=(a.getAttribute('href')||'').split('?')[0].split('#')[0].trim();
      if(HOME_LINKS.has(href))a.remove();
    });
    const links=drawer.querySelector('.kp-drawer-links');
    if(links)links.querySelectorAll('a').forEach((a,i)=>{const num=a.querySelector('em');if(num)num.textContent=String(i+1).padStart(2,'0');});
  }
  document.addEventListener('DOMContentLoaded',()=>{clean();const observer=new MutationObserver(clean);observer.observe(document.body,{childList:true,subtree:true});setTimeout(()=>observer.disconnect(),8000);});
})();
