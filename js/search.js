const db=supabase.createClient(window.KURDUWADI_CONFIG.SUPABASE_URL,window.KURDUWADI_CONFIG.SUPABASE_ANON_KEY);
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const qEl=document.getElementById('q'),results=document.getElementById('results'),status=document.getElementById('status');
const sources=[
 ['profiles','id,name,education,job,city,state,skills','नागरिक','directory.html'],
 ['news','id,title,content,category,created_at','बातमी','news.html'],
 ['events','id,title,description,location,event_date,event_time','कार्यक्रम','events.html'],
 ['personalities','id,name,field,major_work,achievements,reference_url','अभिमानास्पद व्यक्तिमत्त्व','personalities.html'],
 ['business_cards','id,name,designation,business_name,address,slug','व्यवसाय / Digital Card','business-card-view.html'],
 ['gallery_items','id,title,description,category,media_type,media_url','गॅलरी','gallery.html']
];
function hay(x){return Object.values(x).filter(v=>typeof v==='string').join(' ').toLowerCase()}
async function search(){const q=qEl.value.trim();if(!q){status.textContent='शोधण्यासाठी शब्द लिहा.';results.innerHTML='';return}status.textContent='शोधत आहे...';results.innerHTML='';const needle=q.toLowerCase();const all=await Promise.all(sources.map(async s=>{try{let query=db.from(s[0]).select(s[1]);if(s[0]==='profiles')query=query.eq('status','approved').eq('is_public',true);else if(['news','events'].includes(s[0]))query=query.eq('status','approved').eq('published',true);else if(s[0]==='personalities')query=query.eq('status','approved');else if(s[0]==='business_cards')query=query.eq('status','approved');else query=query.eq('status','approved');const {data,error}=await query.limit(100);return error?[]:(data||[]).filter(x=>hay(x).includes(needle)).slice(0,20).map(x=>({...x,_type:s[2],_page:s[3],_source:s[0]}));}catch(e){return []}}));const items=all.flat();status.textContent=`${items.length} निकाल सापडले.`;results.innerHTML=items.length?items.map(x=>{const title=x.name||x.title||x.business_name||'निकाल';let href=x._page;if(x._source==='business_cards')href+=`?slug=${encodeURIComponent(x.slug)}`;return `<article class="news-card"><span class="news-tag">${esc(x._type)}</span><b>${esc(title)}</b><small>${esc(x.city||x.location||x.category||x.designation||x.field||x.description||'')}</small><a class="text-btn" href="${esc(href)}">पहा →</a></article>`}).join(''):'<div class="empty">शोधानुसार माहिती सापडली नाही.</div>'}
document.getElementById('searchForm').addEventListener('submit',e=>{e.preventDefault();const q=qEl.value.trim();history.replaceState({},'',q?'search.html?q='+encodeURIComponent(q):'search.html');search()});
const initial=new URLSearchParams(location.search).get('q');if(initial){qEl.value=initial;search()}
