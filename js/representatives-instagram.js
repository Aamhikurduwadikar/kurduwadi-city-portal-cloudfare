/* Premium social layer for the public representatives page. */
(function(){
  function instagramUrl(v){
    const s=String(v||'').trim();
    if(!s)return '';
    if(/^https?:\/\//i.test(s))return s;
    return 'https://www.instagram.com/'+encodeURIComponent(s.replace(/^@/,''))+'/';
  }
  function addStyles(){
    if(document.getElementById('repSocialPremium'))return;
    const s=document.createElement('style');s.id='repSocialPremium';s.textContent=`
      .rep-card{position:relative;transition:transform .25s ease,box-shadow .25s ease!important}
      .rep-card:hover{transform:translateY(-6px);box-shadow:0 24px 55px rgba(15,23,42,.16)!important}
      .rep-social-row{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin:14px 0 2px}
      .rep-social{display:inline-flex;align-items:center;gap:7px;min-height:40px;padding:0 15px;border-radius:999px;text-decoration:none!important;font-weight:800;font-size:13px;border:1px solid #e2e8f0;background:#fff;color:#0f172a;transition:.2s ease}
      .rep-social:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(15,23,42,.12)}
      .rep-social.instagram{background:linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045);border:0;color:#fff!important}
      .rep-social.website{background:#0f172a;color:#fff!important;border-color:#0f172a}
      @media(max-width:600px){.rep-social-row{display:grid;grid-template-columns:1fr 1fr}.rep-social{justify-content:center;width:100%;box-sizing:border-box}}
    `;document.head.appendChild(s);
  }
  async function enhance(){
    const root=document.getElementById('reps');
    const cfg=window.KURDUWADI_CONFIG;
    if(!root||!cfg||!window.supabase)return;
    const db=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
    const {data}=await db.from('representatives').select('*').eq('status','approved').order('name');
    if(!data?.length)return;
    const cards=root.querySelectorAll('.rep-card');
    data.forEach((r,i)=>{
      const card=cards[i];if(!card)return;
      const row=document.createElement('div');row.className='rep-social-row';
      const ig=instagramUrl(r.instagram_url||r.instagram||r.instagramUrl);
      if(ig){const a=document.createElement('a');a.className='rep-social instagram';a.href=ig;a.target='_blank';a.rel='noopener noreferrer';a.textContent='📷 Instagram';row.appendChild(a)}
      const site=String(r.social_url||'').trim();
      if(/^https?:\/\//i.test(site)&&site!==ig){const a=document.createElement('a');a.className='rep-social website';a.href=site;a.target='_blank';a.rel='noopener noreferrer';a.textContent='🌐 अधिकृत लिंक';row.appendChild(a)}
      if(row.children.length)card.querySelector('.rep-body')?.appendChild(row);
    });
  }
  document.addEventListener('DOMContentLoaded',()=>{addStyles();setTimeout(enhance,700);});
})();
