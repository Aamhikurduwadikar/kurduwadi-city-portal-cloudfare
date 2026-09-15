(function(){
'use strict';
const OLD='https://kurduwadi-city-portal.vercel.app/';
const NEW=(window.KURDUWADI_CONFIG&&window.KURDUWADI_CONFIG.SITE_URL)||'https://aamhikurduwadikar.com/';
function rewrite(){
  document.querySelectorAll('a[href*="kurduwadi-city-portal.vercel.app"]').forEach(a=>{a.href=a.href.replace(OLD,NEW)});
  document.querySelectorAll('[data-card-url*="kurduwadi-city-portal.vercel.app"]').forEach(el=>{el.dataset.cardUrl=el.dataset.cardUrl.replace(OLD,NEW)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rewrite,{once:true});else rewrite();
new MutationObserver(()=>requestAnimationFrame(rewrite)).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['href','data-card-url']});
})();
