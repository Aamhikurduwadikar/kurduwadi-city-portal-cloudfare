(function(){'use strict';
const nav=()=>document.querySelector('.premium-home .header nav');
const btn=()=>document.getElementById('menuBtn');
function init(){
  const n=nav(),b=btn();
  if(!b)return;
  b.setAttribute('aria-expanded','false');
  b.addEventListener('click',function(e){e.preventDefault();const open=!n?.classList.contains('open');n?.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));});
  n?.addEventListener('click',e=>{if(e.target.closest('a')){n.classList.remove('open');b.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){n?.classList.remove('open');b.setAttribute('aria-expanded','false');}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
