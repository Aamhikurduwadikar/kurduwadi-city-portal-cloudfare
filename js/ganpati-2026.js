/* Ganpati Utsav 2026 — temporary homepage promotion. No existing database data is modified. */
(function(){'use strict';
  if(location.pathname!=='/' && !/\/index\.html$/i.test(location.pathname)) return;
  var end=new Date('2026-09-25T23:59:59+05:30');
  if(new Date()>end) return;
  if(document.getElementById('ganpati2026Banner')) return;
  var style=document.createElement('style');
  style.textContent='#ganpati2026Banner{margin:0 0 18px;padding:14px 18px;border:1px solid #ffd38a;border-radius:16px;background:linear-gradient(135deg,#fff7e6,#fff);display:flex;align-items:center;justify-content:space-between;gap:14px;box-shadow:0 8px 24px rgba(16,42,67,.06)}#ganpati2026Banner .gcopy{display:flex;align-items:center;gap:12px}#ganpati2026Banner .gicon{font-size:30px}#ganpati2026Banner b{display:block;color:#102a43}#ganpati2026Banner small{display:block;color:#627d98;margin-top:3px}#ganpati2026Banner a{background:#ff8a00;color:#fff;text-decoration:none;padding:10px 15px;border-radius:10px;font-weight:700;white-space:nowrap}@media(max-width:600px){#ganpati2026Banner{align-items:flex-start}#ganpati2026Banner a{padding:9px 12px;font-size:13px}.gcopy{min-width:0}}';
  document.head.appendChild(style);
  function add(){
    var main=document.querySelector('main'); if(!main) return;
    var el=document.createElement('section'); el.id='ganpati2026Banner'; el.setAttribute('aria-label','गणेशोत्सव 2026');
    el.innerHTML='<div class="gcopy"><span class="gicon">🙏</span><div><b>गणपती बाप्पा मोरया! • गणेशोत्सव 2026</b><small>कुर्डुवाडीतील गणेशोत्सवाची माहिती, कार्यक्रम आणि फोटो</small></div></div><a href="ganpati-2026.html">विशेष पेज पहा →</a>';
    main.insertBefore(el,main.firstElementChild);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',add,{once:true}); else add();
})();
