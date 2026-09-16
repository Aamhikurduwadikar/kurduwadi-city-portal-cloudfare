const cfg=window.KURDUWADI_CONFIG||{};
const db=window.supabase&&cfg.SUPABASE_URL?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
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
const staticPages=[
 ['कुर्डुवाडीचा इतिहास शहराची माहिती लोकसंख्या इतिहास वारसा रेल्वे वर्कशॉप','कुर्डुवाडीचा इतिहास व शहर माहिती','शहर माहिती','city-info.html'],
 ['शिक्षण शाळा कॉलेज महाविद्यालय ITI शिक्षक','शाळा व कॉलेज','शिक्षण','education.html'],
 ['आरोग्य हॉस्पिटल दवाखाना रुग्णालय','आरोग्य सेवा','आरोग्य','health.html'],
 ['शेती कृषी शेतकरी बाजारभाव APMC','कृषी व कृषीउद्योजकता','शेती','agriculture.html'],
 ['नकाशा ठिकाणे map','नकाशा व ठिकाणे','शहर सेवा','map.html'],
 ['लोकप्रतिनिधी आमदार खासदार नगराध्यक्ष','लोकप्रतिनिधी','लोकप्रतिनिधी','representatives.html'],
 ['सूचनाफलक जन्म विवाह यश निधन सूचना','सूचनाफलक','सूचना','noticeboard.html'],
 ['गॅलरी फोटो व्हिडिओ','फोटो / व्हिडिओ गॅलरी','गॅलरी','gallery.html']
];
function hay(x){return Object.values(x).filter(v=>typeof v==='string').join(' ').toLowerCase()}
function normalize(s){return String(s||'').toLowerCase().normalize('NFC').replace(/[.,!?;:()\[\]{}"'`]/g,' ').replace(/\s+/g,' ').trim()}
function staticMatches(needle){const n=normalize(needle);return staticPages.filter(x=>normalize(x[0]).includes(n)||n.split(' ').filter(Boolean).some(t=>t.length>1&&normalize(x[0]).includes(t))).map(x=>({_type:x[2],_page:x[3],_static:true,name:x[1]}))}
async function querySource(s,needle){if(!db)return [];try{let query=db.from(s[0]).select(s[1]);if(s[0]==='profiles')query=query.eq('status','approved').eq('is_public',true);else if(['news','events'].includes(s[0]))query=query.eq('status','approved').eq('published',true);else if(s[0]==='personalities')query=query.eq('status','approved');else query=query.eq('status','approved');const {data,error}=await query.limit(100);return error?[]:(data||[]).filter(x=>hay(x).includes(needle)).slice(0,20).map(x=>({...x,_type:s[2],_page:s[3],_source:s[0]}));}catch(e){console.warn('Search source',s[0],e);return []}}
async function search(){const q=qEl.value.trim();if(!q){status.textContent='शोधण्यासाठी शब्द लिहा.';results.innerHTML='';return}status.textContent='शोधत आहे...';results.innerHTML='';const needle=normalize(q);const all=await Promise.all(sources.map(s=>querySource(s,needle)));const items=[...staticMatches(q),...all.flat()];const seen=new Set();const unique=items.filter(x=>{const key=(x._page||'')+'|'+(x.name||x.title||x.business_name||'');if(seen.has(key))return false;seen.add(key);return true}).slice(0,30);status.textContent=`${unique.length} निकाल सापडले.`;results.innerHTML=unique.length?unique.map(x=>{const title=x.name||x.title||x.business_name||'निकाल';let href=x._page;if(x._source==='business_cards')href+=`?slug=${encodeURIComponent(x.slug)}`;return `<article class="news-card"><span class="news-tag">${esc(x._type)}</span><b>${esc(title)}</b><small>${esc(x.city||x.location||x.category||x.designation||x.field||x.description||'कुर्डुवाडी सिटी पोर्टल')}</small><a class="text-btn" href="${esc(href)}">पहा →</a></article>`}).join(''):'<div class="empty">शोधानुसार माहिती सापडली नाही.</div>'}
document.getElementById('searchForm').addEventListener('submit',e=>{e.preventDefault();const q=qEl.value.trim();history.replaceState({},'',q?'search.html?q='+encodeURIComponent(q):'search.html');search()});
const initial=new URLSearchParams(location.search).get('q');if(initial){qEl.value=initial;search()}
