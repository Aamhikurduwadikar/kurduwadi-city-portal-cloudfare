/* Homepage: load approved gallery media without waiting on DOMContentLoaded. */
(function(){
  const cfg=window.KURDUWADI_CONFIG||{};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const mediaUrl=v=>{let u=String(v||'').trim();if(u&&!/^https?:\/\//i.test(u)&&cfg.SUPABASE_URL)u=cfg.SUPABASE_URL.replace(/\/$/,'')+'/storage/v1/object/public/'+(cfg.STORAGE_BUCKET||'community-images')+'/'+u.replace(/^\/+/, '');return u;};
  async function run(){
    const host=document.getElementById('homeGallery');
    if(!host||!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY)return;
    try{
      const params=new URLSearchParams({select:'id,title,description,category,media_type,media_url,created_at',status:'eq.approved',order:'created_at.desc',limit:'6'});
      const r=await fetch(cfg.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1/gallery_items?'+params,{headers:{apikey:cfg.SUPABASE_ANON_KEY,Authorization:'Bearer '+cfg.SUPABASE_ANON_KEY}});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const rows=await r.json();
      if(!rows.length){host.innerHTML='<div class="citizen-empty"><strong>अजून मंजूर फोटो किंवा व्हिडिओ उपलब्ध नाहीत.</strong><br><a href="gallery.html">गॅलरी पहा →</a></div>';return;}
      host.innerHTML=rows.map(x=>{const u=mediaUrl(x.media_url),title=x.title||'कुर्डुवाडी';return `<a class="home-gallery-item" href="gallery.html" aria-label="${esc(title)}">${x.media_type==='video'?`<video src="${esc(u)}" muted playsinline preload="metadata"></video><span class="home-gallery-play">▶</span>`:`<img src="${esc(u)}" alt="${esc(title)}" loading="lazy" decoding="async">`}<span class="home-gallery-caption"><b>${esc(title)}</b>${x.category?`<small>${esc(x.category)}</small>`:''}</span></a>`;}).join('');
      host.classList.add('kp-home-gallery');
    }catch(err){console.warn('Home gallery:',err);host.innerHTML='<div class="citizen-empty"><strong>फोटो आणि व्हिडिओ सध्या लोड होत नाहीत.</strong><br><a href="gallery.html">गॅलरी उघडा →</a></div>';}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
})();
