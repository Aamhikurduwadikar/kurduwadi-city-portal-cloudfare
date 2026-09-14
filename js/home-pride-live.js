/* Homepage: load approved Kurduwadi pride personalities into the premium home section. */
(function(){
  const cfg=window.KURDUWADI_CONFIG||{};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const mediaUrl=v=>{let u=String(v||'').trim();if(u&&!/^https?:\/\//i.test(u)&&cfg.SUPABASE_URL){u=cfg.SUPABASE_URL.replace(/\/$/,'')+'/storage/v1/object/public/'+(cfg.STORAGE_BUCKET||'community-images')+'/'+u.replace(/^\/+/, '');}return u;};
  async function run(){
    const host=document.getElementById('homePride');
    if(!host||!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY)return;
    try{
      const params=new URLSearchParams({select:'id,name,photo_url,field,position,major_work,achievements,social_contribution,created_at',status:'eq.approved',order:'created_at.desc',limit:'6'});
      const r=await fetch(cfg.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1/personalities?'+params,{headers:{apikey:cfg.SUPABASE_ANON_KEY,Authorization:'Bearer '+cfg.SUPABASE_ANON_KEY}});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const rows=await r.json();
      if(!rows.length){host.innerHTML='<div class="citizen-empty"><strong>अजून अभिमानास्पद व्यक्तिमत्त्वांची माहिती प्रकाशित झालेली नाही.</strong><br><a href="personality-submit.html">व्यक्तिमत्त्व सुचवा →</a></div>';return;}
      host.innerHTML=rows.map(p=>{
        const photo=mediaUrl(p.photo_url), desc=p.major_work||p.achievements||p.social_contribution||'कुर्डुवाडीचे प्रेरणादायी व्यक्तिमत्त्व.';
        return `<a class="pride-card home-pride-card" href="personality-view.html?id=${encodeURIComponent(p.id)}"><div class="pride-card-photo">${photo?`<img src="${esc(photo)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:'<span>🏅</span>'}</div><div class="pride-card-body"><span class="pride-card-label">KURDUWADI PRIDE</span><b>${esc(p.name)}</b><small>${esc(p.field||p.position||'अभिमानास्पद व्यक्तिमत्त्व')}${p.position&&p.field?' • '+esc(p.position):''}</small><p>${esc(String(desc).replace(/<[^>]*>/g,'').slice(0,105))}</p><strong class="pride-card-link">Profile पहा →</strong></div></a>`;
      }).join('');
    }catch(err){console.warn('Home pride:',err);host.innerHTML='<div class="citizen-empty"><strong>व्यक्तिमत्त्वांची माहिती सध्या लोड होत नाही.</strong><br><a href="personalities.html">सर्व व्यक्तिमत्त्वे पहा →</a></div>';}
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(run,300));
})();
