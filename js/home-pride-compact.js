/* Homepage: keep the pride section compact and send the rest to the full page. */
(function(){
  function compact(){
    if(!document.body.classList.contains('premium-home'))return;
    const grid=document.getElementById('homePride')||document.getElementById('homePrideGrid');
    if(!grid||grid.dataset.compactDone==='1')return;
    const cards=Array.from(grid.querySelectorAll('.pride-card'));
    if(cards.length<1)return;
    grid.dataset.compactDone='1';
    cards.forEach((card,i)=>{if(i>=3)card.hidden=true;});
    if(cards.length>3){
      const more=document.createElement('div');
      more.className='home-pride-more-wrap';
      more.innerHTML='<a class="home-pride-more" href="personalities.html">🏅 आणखी अभिमानास्पद व्यक्तिमत्त्वे पहा <span>→</span></a>';
      grid.insertAdjacentElement('afterend',more);
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{
    compact();
    const obs=new MutationObserver(compact);
    const start=()=>{const grid=document.getElementById('homePride')||document.getElementById('homePrideGrid');if(grid)obs.observe(grid,{childList:true,subtree:true});};
    start();setTimeout(start,500);setTimeout(start,1500);setTimeout(start,3000);
  });
})();
