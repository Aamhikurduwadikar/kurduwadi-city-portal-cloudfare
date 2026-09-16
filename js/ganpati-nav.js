// Ganeshotsav 2026 discovery UI — public pages only
(function(){
  'use strict';
  function start(){
    var cfg=window.KURDUWADI_CONFIG||{};
    if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY)return;
    var base=String(cfg.SUPABASE_URL).replace(/\/$/,''), key=cfg.SUPABASE_ANON_KEY;
    function api(path){return fetch(base+path,{headers:{apikey:key,Authorization:'Bearer '+key}}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})}
    function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
    function mediaUrl(v){var u=String(v||'').trim();if(u&&!/^https?:\/\//i.test(u))u=base+'/storage/v1/object/public/'+(cfg.STORAGE_BUCKET||'community-images')+'/'+u.replace(/^\/+/, '');return u}
    api('/rest/v1/site_settings?select=setting_value&setting_key=eq.ganpati_2026_enabled&limit=1').then(function(rows){
      var enabled=rows&&rows[0]&&String(rows[0].setting_value).toLowerCase()==='true';
      if(!enabled)return;
      document.querySelectorAll('nav').forEach(function(nav){
        if(nav.querySelector('a[href="ganpati-2026.html"]'))return;
        var a=document.createElement('a');a.href='ganpati-2026.html';a.className='ganpati-nav-link';a.innerHTML='🙏 गणेशोत्सव २०२६';nav.appendChild(a);
      });
      if(!document.body.classList.contains('premium-home'))return;
      var old=document.getElementById('ganpatiHomeBanner');if(old)return;
      var sec=document.createElement('section');sec.id='ganpatiHomeBanner';sec.className='section';
      sec.innerHTML='<div class="ghb-wrap"><div class="ghb-copy"><span class="ghb-badge">🙏 विशेष विभाग • गणेशोत्सव २०२६</span><h2>गणपती बाप्पा मोरया!</h2><p>कुर्डुवाडीतील गणेशोत्सवाचे फोटो, व्हिडिओ, कार्यक्रम आणि मंडळांची माहिती एका ठिकाणी.</p><div class="ghb-actions"><a href="ganpati-2026.html" class="ghb-primary">गणेशोत्सव पाहा →</a><a href="gallery-submit.html?category=ganpati-2026" class="ghb-secondary">📸 फोटो / व्हिडिओ पाठवा</a></div></div><a class="ghb-photo" href="ganpati-2026.html" aria-label="गणेशोत्सव २०२६"><div class="ghb-placeholder">🙏<b>गणेशोत्सव<br>२०२६</b><small>Admin-मंजूर फोटो येथे दिसतील</small></div></a></div>';
      var style=document.createElement('style');style.textContent='.ganpati-nav-link{background:linear-gradient(135deg,#8f0909,#c51f1f)!important;color:#fff!important;border-radius:10px!important;font-weight:800!important}.ghb-wrap{display:grid;grid-template-columns:1.15fr .85fr;gap:0;overflow:hidden;border-radius:28px;background:linear-gradient(120deg,#2b0d05,#6f1708 55%,#a53b0c);box-shadow:0 18px 50px rgba(80,25,5,.2);min-height:310px}.ghb-copy{padding:42px;color:#fff;align-self:center}.ghb-badge{display:inline-block;padding:8px 13px;border:1px solid rgba(255,214,93,.5);border-radius:999px;background:rgba(255,196,55,.12);color:#ffd65a;font-weight:800}.ghb-copy h2{font-size:clamp(30px,5vw,52px);margin:15px 0 8px;color:#fff}.ghb-copy p{font-size:17px;line-height:1.7;max-width:620px;color:#fff1dc}.ghb-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.ghb-actions a{display:inline-block;padding:12px 17px;border-radius:12px;text-decoration:none;font-weight:800}.ghb-primary{background:#ffd04a;color:#4a1604}.ghb-secondary{border:1px solid rgba(255,255,255,.45);color:#fff}.ghb-photo{min-height:310px;display:block;text-decoration:none;background:radial-gradient(circle at 50% 35%,#ffcf66 0,#b54a12 35%,#2b0d05 78%);position:relative}.ghb-placeholder{position:absolute;inset:0;display:grid;place-items:center;align-content:center;text-align:center;color:#fff3cf;font-size:82px;text-shadow:0 8px 30px rgba(0,0,0,.45)}.ghb-placeholder b{display:block;font-size:30px;line-height:1.2}.ghb-placeholder small{display:block;margin-top:8px;font-size:13px;color:#ffe8bd}@media(max-width:700px){.ghb-wrap{grid-template-columns:1fr}.ghb-copy{padding:28px 22px}.ghb-photo{min-height:230px}.ghb-placeholder{font-size:62px}.ghb-placeholder b{font-size:25px}}';document.head.appendChild(style);
      var hero=document.querySelector('.premium-home .hero');if(hero)hero.insertAdjacentElement('afterend',sec);else document.querySelector('main')?.prepend(sec);
      api('/rest/v1/gallery_items?select=media_url,media_type,title&status=eq.approved&category=eq.ganpati-2026&order=created_at.desc&limit=1').then(function(items){
        if(!items||!items[0])return;var x=items[0],u=mediaUrl(x.media_url),box=sec.querySelector('.ghb-photo');if(!box||!u)return;
        box.innerHTML=x.media_type==='video'?'<video src="'+esc(u)+'" muted autoplay loop playsinline></video>':'<img src="'+esc(u)+'" alt="'+esc(x.title||'गणेशोत्सव २०२६')+'">';
        var st=document.createElement('style');st.textContent='#ganpatiHomeBanner .ghb-photo img,#ganpatiHomeBanner .ghb-photo video{width:100%;height:100%;min-height:310px;object-fit:cover;display:block}@media(max-width:700px){#ganpatiHomeBanner .ghb-photo img,#ganpatiHomeBanner .ghb-photo video{min-height:230px}}';document.head.appendChild(st);
      }).catch(function(){});
    }).catch(function(e){console.warn('Ganpati discovery unavailable',e)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
