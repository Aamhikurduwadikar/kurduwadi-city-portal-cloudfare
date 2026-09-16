/* Reliable local-news loader: direct REST fetch, timeout, retry and load-more. */
(function(){
  'use strict';
  const cfg=window.KURDUWADI_CONFIG||{},box=document.getElementById('newsList');
  if(!box||!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY)return;
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const fmtDate=v=>{try{return new Date(v).toLocaleDateString('mr-IN',{day:'numeric',month:'long',year:'numeric'})}catch(e){return v||''}};
  const endpoint=cfg.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1/news',headers={apikey:cfg.SUPABASE_ANON_KEY,Authorization:'Bearer '+cfg.SUPABASE_ANON_KEY};
  let offset=0,limit=8,busy=false,more=false;
  function card(n,i){return `<article class="article-item news-card"><div class="news-meta"><span>${esc(n.category||'शहर')}</span><span>📅 ${esc(fmtDate(n.created_at))}</span>${n.author_name?`<span>✍️ ${esc(n.author_name)}</span>`:''}</div><h2>${esc(n.title||'बातमी')}</h2>${n.image_url?`<img src="${esc(n.image_url)}" alt="${esc(n.title||'बातमी')}" loading="lazy" style="width:100%;max-height:220px;object-fit:cover;border-radius:12px;margin:10px 0">`:''}<p>${esc((n.content||'').slice(0,240))}${(n.content||'').length>240?'...':''}</p><a class="news-read" href="news-view.html?id=${encodeURIComponent(n.id)}">📖 पूर्ण बातमी वाचा</a></article>`}
  function controls(){let c=document.getElementById('newsLoadMore');if(c)c.remove();if(!more)return;c=document.createElement('div');c.id='newsLoadMore';c.style='text-align:center;margin:20px 0';c.innerHTML='<button class="feed-primary" type="button">आणखी बातम्या →</button>';c.querySelector('button').onclick=()=>load(false);box.insertAdjacentElement('afterend',c)}
  async function load(initial){if(busy)return;busy=true;if(initial){offset=0;more=false;box.innerHTML='<div class="article-item"><h2>बातम्या लोड होत आहेत...</h2></div>'}else{const b=document.querySelector('#newsLoadMore button');if(b)b.disabled=true}
    const params=new URLSearchParams({select:'id,title,content,category,author_name,image_url,created_at',status:'eq.approved',published:'eq.true',order:'created_at.desc',limit:String(limit),offset:String(offset)});
    try{const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),8000);const r=await fetch(endpoint+'?'+params,{headers,signal:ctl.signal});clearTimeout(timer);if(!r.ok)throw new Error('HTTP '+r.status);const rows=await r.json();if(initial)box.innerHTML='';if(!rows.length&&!offset)box.innerHTML='<div class="article-item"><h2>सध्या नवीन बातम्या उपलब्ध नाहीत.</h2><p>नवीन बातमी पाठवा — Admin मंजुरीनंतर ती येथे दिसेल.</p></div>';else if(rows.length)box.insertAdjacentHTML('beforeend',rows.map(card).join(''));offset+=rows.length;more=rows.length===limit;controls()}
    catch(err){console.warn('News load:',err);if(initial){box.innerHTML='<div class="article-item"><h2>बातम्या सध्या लोड होत नाहीत.</h2><p>कृपया पुन्हा प्रयत्न करा.</p><button class="feed-primary" type="button" id="newsRetry">↻ पुन्हा प्रयत्न</button></div>';document.getElementById('newsRetry')?.addEventListener('click',()=>load(true),{once:true})}else{const b=document.querySelector('#newsLoadMore button');if(b)b.disabled=false}}
    finally{busy=false}
  }
  load(true);
})();
