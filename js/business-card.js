(function(){
  'use strict';
  const form=document.getElementById('cardForm');
  const msg=document.getElementById('cardMsg');
  if(!form||!msg)return;

  function show(text,type='info'){
    msg.textContent=text;
    msg.style.color=type==='error'?'#b42318':type==='success'?'#067647':'';
  }
  function slugify(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}

  form.addEventListener('submit',async function(e){
    e.preventDefault();
    const btn=form.querySelector('button[type="submit"],button');
    if(btn)btn.disabled=true;
    show('⏳ डिजिटल कार्ड तयार करत आहे...');
    try{
      const cfg=window.KURDUWADI_CONFIG;
      if(!cfg?.SUPABASE_URL||!cfg?.SUPABASE_ANON_KEY)throw new Error('Supabase configuration सापडली नाही.');
      if(!window.supabase?.createClient)throw new Error('Supabase library load झाली नाही.');
      const db=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
      const f=new FormData(form);
      const name=String(f.get('name')||'').trim();
      if(!name)throw new Error('कृपया नाव भरा.');
      const slug=(slugify(name)+'-'+Date.now()).replace(/^-+|-+$/g,'')||('card-'+Date.now());
      const {data:authData,error:authError}=await db.auth.getUser();
      if(authError)console.warn('Auth check:',authError.message);
      const user=authData?.user||null;
      const row={
        user_id:user?.id||null,name,
        designation:String(f.get('designation')||'').trim()||null,
        business_name:String(f.get('business_name')||'').trim()||null,
        phone:String(f.get('phone')||'').trim()||null,
        whatsapp:String(f.get('whatsapp')||'').trim()||null,
        email:String(f.get('email')||'').trim()||null,
        address:String(f.get('address')||'').trim()||null,
        website:String(f.get('website')||'').trim()||null,
        instagram:String(f.get('instagram')||'').trim()||null,
        facebook:String(f.get('facebook')||'').trim()||null,
        bio:String(f.get('bio')||'').trim()||null,
        slug,status:'pending'
      };
      const {data,error}=await db.from('business_cards').insert(row).select('id,slug').single();
      if(error)throw error;
      form.reset();
      const publicUrl=location.origin+location.pathname.replace(/[^/]+$/,'')+'business-card-view.html?slug='+encodeURIComponent(data.slug)+'&download=1';
      show('✅ तुमची माहिती submit झाली आहे. Admin मंजुरीनंतर ही Card Download Link सक्रिय होईल.','success');
      const box=document.createElement('div');
      box.style.cssText='margin-top:14px;padding:14px;border:1px solid #d9e7f7;border-radius:14px;background:#f5f9ff';
      box.innerHTML='<strong>🔗 तुमची Card Download Link</strong><br><small>Admin मंजुरीनंतर ही लिंक उघडल्यावर कार्ड browser मध्ये आपोआप download होईल.</small>';
      const copy=document.createElement('button');copy.type='button';copy.className='primary-btn';copy.style.marginTop='10px';copy.textContent='🔗 Link Copy करा';
      copy.onclick=async()=>{try{await navigator.clipboard.writeText(publicUrl);copy.textContent='✅ Link Copy झाली';}catch{prompt('Card Download Link',publicUrl)}};
      box.appendChild(copy);msg.appendChild(box);
    }catch(err){
      console.error('Digital business card error:',err);
      show('❌ कार्ड submit झाले नाही: '+(err?.message||'अज्ञात त्रुटी'),'error');
    }finally{if(btn)btn.disabled=false;}
  });
})();
