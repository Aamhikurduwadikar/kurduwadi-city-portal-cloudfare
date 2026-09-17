/* Fixed mobile app navigation — hidden on desktop */
(function(){
  const items=[
    ['/','🏠','मुख्यपृष्ठ'],
    ['/city-info.html','🏛️','इतिहास'],
    ['/directory.html','👥','निर्देशिका'],
    ['/schemes.html','💡','विकास'],
    ['/events.html','📅','कार्यक्रम'],
    ['/ganpati-2026.html','🙏','गणेशोत्सव']
  ];
  function init(){
    if(document.querySelector('.mobile-bottom-nav')||location.pathname.includes('/admin/'))return;
    const nav=document.createElement('nav');nav.className='mobile-bottom-nav';nav.setAttribute('aria-label','मोबाइल मुख्य नेव्हिगेशन');
    const path=location.pathname.toLowerCase();
    const current=path==='/'||path.endsWith('/index.html')?'/':('/'+(path.split('/').pop()||''));
    nav.innerHTML=items.map(([href,icon,label])=>`<a href="${href}" class="${current===href?'active':''}" aria-label="${label}"><span class="mbn-icon" aria-hidden="true">${icon}</span><span class="mbn-label">${label}</span></a>`).join('');
    document.body.appendChild(nav);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
