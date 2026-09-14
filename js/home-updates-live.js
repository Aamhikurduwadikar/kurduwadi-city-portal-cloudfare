(function(){
  const cfg=window.KURDUWADI_CONFIG||{};
  if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY||!document.body.classList.contains('premium-home')) return;
  const headers={apikey:cfg.SUPABASE_ANON_KEY,Authorization:'Bearer '+cfg.SUPABASE_ANON_KEY};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const date=v=>{if(!v)return '';try{return new Date(v).toLocaleDateString('mr-IN',{day:'numeric',month:'short'});}catch{return ''}};
  async function get(path){const r=await fetch(cfg.SUPABASE_URL+'/rest/v1/'+path,{headers});if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
  async function load(){
    const grid=document.querySelector('.updates-section .update-grid'); if(!grid)return;
    try{
      const [news,events,notices]=await Promise.all([
        get('news?select=id,title,content,created_at,category&status=eq.approved&published=eq.true&order=created_at.desc&limit=2'),
        get('events?select=id,title,event_date,event_time,location,description&status=eq.approved&published=eq.true&order=event_date.asc&limit=2'),
        get('noticeboard?select=id,title,description,type,notice_date,created_at&status=eq.approved&published=eq.true&order=notice_date.desc&order=created_at.desc&limit=2')
      ]);
      const noticeLabels={birth:'👶 जन्म',marriage:'💍 विवाह',achievement:'🏅 यश',obituary:'🕯️ श्रद्धांजली',lost_found:'🔍 हरवले/सापडले',other:'📌 इतर'};
      const card=(cls,icon,label,title,meta,href)=>`<a class="update-card ${cls} update-live-card" href="${href}"><span>${icon}</span><div><small>${label}</small><b>${title}</b>${meta?`<p>${meta}</p>`:''}<em>अधिक पहा →</em></div><strong>→</strong></a>`;
      const newsTitle=news[0]?.title||'नवीन बातम्या लवकरच';
      const newsMeta=news[0]?date(news[0].created_at):'मंजूर बातम्या येथे दिसतील';
      const eventTitle=events[0]?.title||'नवीन कार्यक्रम लवकरच';
      const eventMeta=events[0]?[date(events[0].event_date)+(events[0].location?' · 📍 '+events[0].location:'')].filter(Boolean).join(''):'मंजूर कार्यक्रम येथे दिसतील';
      const noticeTitle=notices[0]?.title||'नवीन सूचना लवकरच';
      const noticeMeta=notices[0]?[noticeLabels[notices[0].type]||'📌 इतर',date(notices[0].notice_date||notices[0].created_at)].filter(Boolean).join(' · '):'मंजूर सूचना येथे दिसतील';
      grid.innerHTML=card('update-news','📰','LOCAL NEWS',esc(newsTitle),esc(newsMeta),'news.html')+card('update-notice','📌','NOTICEBOARD',esc(noticeTitle),esc(noticeMeta),'noticeboard.html')+card('update-event','📅','EVENTS',esc(eventTitle),esc(eventMeta),'events.html');
    }catch(e){console.warn('Home updates:',e)}
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',load):load();
})();
