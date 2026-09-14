const HOME_CFG=window.KURDUWADI_CONFIG||{};
const HOME_API=HOME_CFG.SUPABASE_URL;
const HOME_KEY=HOME_CFG.SUPABASE_ANON_KEY;
const homeHeaders={apikey:HOME_KEY,Authorization:`Bearer ${HOME_KEY}`};
function homeEsc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function homeDate(v){if(!v)return '';try{return new Date(v).toLocaleDateString('mr-IN',{day:'numeric',month:'short',year:'numeric'});}catch{return '';}}
async function homeGet(path){const r=await fetch(`${HOME_API}/rest/v1/${path}`,{headers:homeHeaders});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}
async function loadHomeData(){
  if(!HOME_API||!HOME_KEY)return;
  const newsEl=document.getElementById('homeNewsGrid'), eventsEl=document.getElementById('homeEventsGrid'), peopleEl=document.getElementById('homePeopleGrid');
  try{
    const [news,events,people]=await Promise.all([
      homeGet('news?select=id,title,content,image_url,created_at,category&status=eq.approved&published=eq.true&order=created_at.desc&limit=3'),
      homeGet('events?select=id,title,event_date,event_time,location,description,image_url&status=eq.approved&published=eq.true&order=event_date.asc&limit=3'),
      homeGet('personalities?select=id,name,photo_url,field,position,major_work,achievements&status=eq.approved&published=eq.true&order=name.asc&limit=4')
    ]);
    if(newsEl)newsEl.innerHTML=news.length?news.map(n=>`<a class="news-card premium-data-card" href="news.html"><span class="news-tag">${homeEsc(n.category||'बातमी')}</span><b>${homeEsc(n.title)}</b><small>${homeEsc((n.content||'').replace(/<[^>]*>/g,'').slice(0,110))}</small><time>${homeDate(n.created_at)} · अधिक पहा →</time></a>`).join(''):`<div class="citizen-empty"><strong>सध्या मंजूर बातम्या उपलब्ध नाहीत.</strong></div>`;
    if(eventsEl)eventsEl.innerHTML=events.length?events.map(e=>`<a class="news-card premium-data-card" href="events.html"><span class="news-tag purple">कार्यक्रम</span><b>${homeEsc(e.title)}</b><small>📍 ${homeEsc(e.location||'कुर्डुवाडी')} ${e.event_time?'· '+homeEsc(e.event_time):''}</small><time>${homeDate(e.event_date)} · अधिक पहा →</time></a>`).join(''):`<div class="citizen-empty"><strong>सध्या आगामी कार्यक्रम उपलब्ध नाहीत.</strong></div>`;
    if(peopleEl)peopleEl.innerHTML=people.length?people.map(p=>`<a class="home-person-card" href="personalities.html"><div class="home-person-photo">${p.photo_url?`<img src="${homeEsc(p.photo_url)}" alt="${homeEsc(p.name)}" loading="lazy">`:'🏅'}</div><div><b>${homeEsc(p.name)}</b><span>${homeEsc(p.field||p.position||'अभिमानास्पद व्यक्तिमत्त्व')}</span><small>✓ Admin Verified</small></div></a>`).join(''):`<div class="citizen-empty"><strong>सध्या व्यक्तिमत्त्वांची माहिती उपलब्ध नाही.</strong></div>`;
  }catch(err){console.error('Home data:',err);}
}
document.addEventListener('DOMContentLoaded',loadHomeData);
