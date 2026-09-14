/* आपली माणसं, जगभर — homepage-only live directory from approved public profiles. */
(function(){
  const CFG=window.KURDUWADI_CONFIG||{};
  const API=CFG.SUPABASE_URL, KEY=CFG.SUPABASE_ANON_KEY;
  if(!API||!KEY)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const norm=v=>String(v||'').trim().replace(/\s+/g,' ');
  const cityKey=(city,country)=>`${norm(city).toLowerCase()}|${norm(country).toLowerCase()}`;
  const FIELD_LABELS={
    administration:'🏛️ प्रशासकीय सेवा',law:'⚖️ न्याय व विधी',business:'🏭 उद्योग व उद्योजकता',engineering:'⚙️ अभियांत्रिकी व तंत्रज्ञान',health:'👨‍⚕️ वैद्यकीय व आरोग्य',education:'👨‍🏫 शिक्षण',it:'💻 IT / संगणक',agriculture:'🌾 शेती',media:'📰 पत्रकारिता / मीडिया',arts:'🎨 कला व संस्कृती',sports:'🏅 क्रीडा',social:'🤝 सामाजिक कार्य',corporate:'💼 नोकरी / कॉर्पोरेट',trades:'👷 बांधकाम / तांत्रिक व्यवसाय',other:'➕ इतर'
  };
  const fieldList=v=>Array.isArray(v)?v:(typeof v==='string'&&v.trim()?v.split(',').map(x=>x.trim()).filter(Boolean):[]);
  let people=[];

  function injectStyles(){
    if(document.getElementById('worldPeopleStyles'))return;
    const s=document.createElement('style');s.id='worldPeopleStyles';s.textContent=`
      .world-people-section{position:relative;overflow:hidden;background:linear-gradient(135deg,#f7fbff,#edf6ff 52%,#f9fcff);color:#102a43;border:1px solid #dbeaf7;border-radius:24px;padding:30px 30px 24px;margin:0 auto 28px;max-width:1180px;box-shadow:0 12px 35px rgba(32,88,125,.08);font-family:'Noto Sans Devanagari',system-ui,sans-serif}
      .world-people-section:before{content:'🌍';position:absolute;right:-8px;top:-38px;font-size:145px;opacity:.045;pointer-events:none}.world-people-head{display:flex;justify-content:space-between;gap:24px;align-items:center;position:relative;z-index:1}.world-people-section .section-label{color:#1976c8;font-size:11px;letter-spacing:2px;font-weight:800}.world-people-section h2{color:#123b5a;font-size:34px;line-height:1.25;margin:5px 0 6px;font-weight:800}.world-people-section .section-sub{color:#587188;font-size:15px;line-height:1.6;margin:0}.world-people-count{min-width:112px;padding:12px 18px;text-align:center;border:1px solid #d7e7f4;border-radius:17px;background:rgba(255,255,255,.8);box-shadow:0 6px 18px rgba(37,92,130,.06);color:#123b5a}.world-people-count b{display:block;font-size:30px;line-height:1;color:#156fbe}.world-people-count span{font-size:12px;color:#647b8d;font-weight:600}
      .world-city-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:18px;position:relative;z-index:1}.world-city-card{display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px solid #dceaf5;border-radius:14px;background:rgba(255,255,255,.78);color:#173b56;text-decoration:none;box-shadow:0 5px 16px rgba(40,95,130,.05);transition:.18s}.world-city-card:hover{background:#fff;transform:translateY(-2px)}.world-city-pin{font-size:19px}.world-city-info{min-width:0;flex:1}.world-city-name{display:block;font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.world-city-country{display:block;font-size:10px;color:#74899a}.world-city-count{font-size:14px;color:#1976c8;font-weight:900}
      .world-field-title{margin:20px 0 9px;font-size:13px;font-weight:900;color:#244a64;position:relative;z-index:1}.world-field-grid{display:flex;gap:8px;flex-wrap:wrap;position:relative;z-index:1}.world-field-chip{border:1px solid #d7e7f4;background:#fff;border-radius:999px;padding:8px 11px;color:#24536e;font-size:11px;font-weight:800;cursor:pointer}.world-field-chip:hover{border-color:#a9d1eb;background:#eef8ff}.world-field-chip b{color:#1976c8;margin-left:4px}.world-people-all{display:inline-flex;margin-top:16px;padding:10px 17px;border:1px solid #b9d9f0;border-radius:12px;color:#1167a8;background:#fff;text-decoration:none;font-size:13px;font-weight:800;box-shadow:0 5px 15px rgba(36,102,146,.06)}.world-empty{padding:16px;margin-top:16px;border:1px dashed #c9dfef;border-radius:15px;color:#637b8d;background:rgba(255,255,255,.55);font-size:13px;line-height:1.6}.world-empty b{display:block;color:#173b56;font-size:17px;margin-bottom:3px}.world-people-modal{position:fixed;inset:0;background:rgba(3,15,25,.72);backdrop-filter:blur(6px);z-index:9999;display:none;align-items:center;justify-content:center;padding:20px}.world-people-modal.open{display:flex}.world-modal-card{width:min(760px,100%);max-height:86vh;overflow:auto;background:#fff;color:#102a43;border-radius:24px;padding:24px;box-shadow:0 30px 80px rgba(0,0,0,.3)}.world-modal-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.world-modal-head h3{margin:0;font-size:25px}.world-modal-close{border:0;background:#edf3f7;border-radius:50%;width:38px;height:38px;font-size:20px;cursor:pointer}.world-person-list{display:grid;gap:10px;margin-top:18px}.world-person{border:1px solid #e5edf2;border-radius:16px;padding:15px}.world-person b{display:block;font-size:17px}.world-person small{display:block;color:#5d7284;margin-top:4px}.world-person-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.world-person-actions a{padding:8px 12px;border-radius:999px;text-decoration:none;background:#edf6fb;color:#0b4d70;font-size:13px;font-weight:700}
      @media(max-width:900px){.world-city-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.world-people-section{margin-left:14px;margin-right:14px;padding:26px 22px 22px}}@media(max-width:600px){.world-people-section{border-radius:20px;padding:22px 16px 18px;margin-bottom:20px}.world-people-head{align-items:flex-start;gap:12px}.world-people-section h2{font-size:25px;line-height:1.3}.world-people-section .section-sub{font-size:12px}.world-people-count{min-width:88px;padding:9px 13px}.world-people-count b{font-size:24px}.world-city-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:14px}.world-city-card{padding:10px;border-radius:12px;gap:7px}.world-city-name{font-size:11px}.world-city-country{font-size:8px}.world-city-count{font-size:12px}.world-field-chip{font-size:10px;padding:7px 9px}.world-people-all{width:100%;justify-content:center;font-size:11px}}@media(max-width:360px){.world-people-section h2{font-size:22px}.world-city-card{padding:8px}}
    `;document.head.appendChild(s);
  }

  function mount(){
    /* This component belongs only on the main homepage. */
    if(!document.body.classList.contains('premium-home'))return;
    if(document.getElementById('worldPeopleSection'))return;
    const main=document.querySelector('main');if(!main)return;
    injectStyles();
    const section=document.createElement('section');section.id='worldPeopleSection';section.className='section world-people-section';
    section.innerHTML=`<div class="world-people-head"><div><div class="section-label">KURDUWADI • EVERYWHERE</div><h2>🌍 आपली माणसं, जगभर</h2><p class="section-sub">कुर्डूवाडीतील आपली माणसं आज कोणकोणत्या शहरांत आणि कोणत्या क्षेत्रात आहेत ते जाणून घ्या.</p></div><div class="world-people-count"><b id="worldPeopleTotal">—</b><span>कुर्डूवाडीकर</span></div></div><div id="worldCityGrid" class="world-city-grid"><div class="world-empty" style="grid-column:1/-1"><b>शहरे शोधत आहोत…</b><span>मंजूर सार्वजनिक प्रोफाइलमधून माहिती तयार होत आहे.</span></div></div><div id="worldFieldTitle" class="world-field-title" hidden>🎯 कार्यक्षेत्रानुसार कुर्डूवाडीकर</div><div id="worldFieldGrid" class="world-field-grid"></div><a class="world-people-all" href="profile.html">👥 आपली प्रोफाइल माहिती जोडा →</a>`;
    const anchor=main.querySelector('.home-photo-section')||main.firstElementChild;main.insertBefore(section,anchor);
    const modal=document.createElement('div');modal.id='worldPeopleModal';modal.className='world-people-modal';modal.innerHTML=`<div class="world-modal-card" role="dialog" aria-modal="true" aria-labelledby="worldModalTitle"><div class="world-modal-head"><div><div class="section-label" style="color:#16709d">कुर्डूवाडीकर</div><h3 id="worldModalTitle">माहिती</h3></div><button class="world-modal-close" type="button" aria-label="बंद करा">×</button></div><div id="worldPersonList" class="world-person-list"></div></div>`;document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});modal.querySelector('.world-modal-close').addEventListener('click',closeModal);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});load();
  }
  function closeModal(){document.getElementById('worldPeopleModal')?.classList.remove('open');}
  function openPeople(title,rows){
    const list=document.getElementById('worldPersonList');if(!list)return;
    document.getElementById('worldModalTitle').textContent=title;
    list.innerHTML=rows.map(p=>{const phone=String(p.phone||'').replace(/[^0-9+]/g,'');const fields=fieldList(p.work_fields).map(x=>FIELD_LABELS[x]||x);return `<article class="world-person"><b>${esc(p.name||'कुर्डूवाडीकर')}</b>${p.job?`<small>💼 ${esc(p.job)}</small>`:''}${p.education?`<small>🎓 ${esc(p.education)}</small>`:''}${p.city?`<small>📍 ${esc(p.city)}${p.country?' • '+esc(p.country):''}</small>`:''}${fields.length?`<small>🎯 ${esc(fields.join(' • '))}</small>`:''}<div class="world-person-actions">${phone?`<a href="tel:${esc(phone)}">📞 संपर्क</a><a href="https://wa.me/${encodeURIComponent(phone.replace(/^\+/,''))}" target="_blank" rel="noopener">💬 WhatsApp</a>`:''}</div></article>`;}).join('');
    document.getElementById('worldPeopleModal').classList.add('open');
  }
  function openCity(key){const parts=key.split('|');const rows=people.filter(p=>cityKey(p.city,p.country)===key);openPeople(`${norm(rows[0]?.city)||parts[0]}${norm(rows[0]?.country)?' • '+norm(rows[0].country):''}`,rows);}
  function renderFields(){
    const title=document.getElementById('worldFieldTitle'),grid=document.getElementById('worldFieldGrid');if(!grid)return;
    const counts=new Map();people.forEach(p=>fieldList(p.work_fields).forEach(f=>counts.set(f,(counts.get(f)||0)+1)));
    const fields=[...counts.entries()].sort((a,b)=>b[1]-a[1]);if(!fields.length){if(title)title.hidden=true;grid.innerHTML='';return}
    if(title)title.hidden=false;grid.innerHTML=fields.map(([f,n])=>`<button class="world-field-chip" type="button" data-field="${esc(f)}">${esc(FIELD_LABELS[f]||f)} <b>${n}</b></button>`).join('');
    grid.querySelectorAll('[data-field]').forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.field;openPeople(FIELD_LABELS[f]||f,people.filter(p=>fieldList(p.work_fields).includes(f)));}));
  }
  async function load(){
    const grid=document.getElementById('worldCityGrid');try{
      const params=new URLSearchParams({select:'id,name,job,education,city,state,country,phone,work_fields',status:'eq.approved',is_public:'eq.true',order:'city.asc',limit:'5000'});
      const r=await fetch(`${API}/rest/v1/profiles?${params}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}});if(!r.ok)throw new Error(`profiles HTTP ${r.status}`);people=await r.json();
      const groups=new Map();people.forEach(p=>{if(!norm(p.city))return;const key=cityKey(p.city,p.country);if(!groups.has(key))groups.set(key,{key,city:norm(p.city),country:norm(p.country),count:0});groups.get(key).count++;});
      const cities=[...groups.values()].sort((a,b)=>b.count-a.count||a.city.localeCompare(b.city,'mr'));document.getElementById('worldPeopleTotal').textContent=people.length;renderFields();
      if(!cities.length){grid.innerHTML='<div class="world-empty" style="grid-column:1/-1"><b>अजून शहरांची माहिती उपलब्ध नाही.</b><span>नागरिकांची प्रोफाइल Admin ने मंजूर झाल्यानंतर येथे शहर आणि संख्या आपोआप दिसेल.</span></div>';return;}
      grid.innerHTML=cities.map(c=>`<a href="#" class="world-city-card" data-city-key="${esc(c.key)}"><span class="world-city-pin">📍</span><span class="world-city-info"><span class="world-city-name">${esc(c.city)}</span><span class="world-city-country">${esc(c.country||'भारत')}</span></span><span class="world-city-count">${c.count}</span></a>`).join('');grid.querySelectorAll('[data-city-key]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openCity(a.dataset.cityKey);}));
    }catch(err){console.error('World people:',err);grid.innerHTML='<div class="world-empty" style="grid-column:1/-1"><b>माहिती सध्या लोड झाली नाही.</b><span>कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.</span></div>';}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
