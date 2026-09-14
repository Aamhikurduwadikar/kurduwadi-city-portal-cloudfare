/* Mobile profile photo + representative hierarchy fixes */
(function(){
  function profilePhoto(){
    const form=document.getElementById('profileForm');
    if(!form||document.getElementById('profilePhotoInput'))return;
    const wrap=document.createElement('div');
    wrap.className='profile-photo-box';
    wrap.innerHTML='<label>📷 प्रोफाइल फोटो <span class="optional">ऐच्छिक</span><input id="profilePhotoInput" type="file" accept="image/jpeg,image/png,image/webp" capture="environment"><small>मोबाईलवर Camera किंवा Gallery मधून फोटो निवडा. JPG, PNG किंवा WebP • कमाल 5 MB.</small><img id="profilePhotoPreview" alt="फोटो preview" hidden></label>';
    const first=form.querySelector('label');
    if(first)first.insertAdjacentElement('afterend',wrap);else form.prepend(wrap);
    const input=wrap.querySelector('#profilePhotoInput'),preview=wrap.querySelector('#profilePhotoPreview');
    input.addEventListener('change',()=>{const f=input.files?.[0];if(!f){preview.hidden=true;return}if(!/^image\/(jpeg|png|webp)$/.test(f.type)||f.size>5*1024*1024){alert('फक्त JPG, PNG किंवा WebP फोटो (कमाल 5 MB) निवडा.');input.value='';preview.hidden=true;return}preview.src=URL.createObjectURL(f);preview.hidden=false});
    form.addEventListener('submit',async e=>{
      if(e.defaultPrevented)return;
      e.preventDefault();e.stopImmediatePropagation();
      const msg=document.getElementById('formMessage'),db=window.supabase&&window.KURDUWADI_CONFIG?window.supabase.createClient(window.KURDUWADI_CONFIG.SUPABASE_URL,window.KURDUWADI_CONFIG.SUPABASE_ANON_KEY):null;
      if(!db){msg.textContent='Supabase connection उपलब्ध नाही.';return}
      const f=new FormData(form),fields=[...form.querySelectorAll('input[name="work_field"]:checked')].map(x=>x.value);
      if(!fields.length){msg.textContent='कृपया किमान एक कार्यक्षेत्र निवडा.';return}
      const id=crypto.randomUUID();let photoUrl=null,uploadedPath=null;const photo=input.files?.[0];
      try{
        if(photo){const ext=photo.type==='image/png'?'png':photo.type==='image/webp'?'webp':'jpg';uploadedPath='profiles/'+id+'.'+ext;const up=await db.storage.from(window.KURDUWADI_CONFIG.STORAGE_BUCKET||'community-images').upload(uploadedPath,photo,{contentType:photo.type,upsert:false});if(up.error)throw up.error;photoUrl=db.storage.from(window.KURDUWADI_CONFIG.STORAGE_BUCKET||'community-images').getPublicUrl(uploadedPath).data.publicUrl}
        const row={id,name:f.get('name'),education:f.get('education'),job:f.get('job'),city:f.get('city'),state:f.get('state'),country:f.get('country'),blood_group:f.get('blood_group'),skills:f.get('skills'),phone:f.get('phone'),work_fields:fields,is_public:f.get('is_public')==='on',blood_public:f.get('blood_public')==='on',photo_url:photoUrl,status:'pending'};
        const {error}=await db.from('profiles').insert(row);if(error)throw error;
        msg.textContent='✅ माहिती व फोटो submit झाले. Admin approval नंतर profile Directory मध्ये दिसेल.';form.reset();preview.hidden=true;
      }catch(err){if(uploadedPath)await db.storage.from(window.KURDUWADI_CONFIG.STORAGE_BUCKET||'community-images').remove([uploadedPath]).catch(()=>{});console.error(err);msg.textContent='❌ Submit करताना अडचण आली. फोटो/माहिती पुन्हा तपासा.'}
    },true);
  }
  function orderReps(){
    const root=document.getElementById('reps');if(!root)return;
    const cards=[...root.querySelectorAll('.rep-card')];if(cards.length<2)return;
    const rank=s=>{const x=String(s||'').toLowerCase();
      if(x.includes('पंचायत समिती')||x.includes('पंचायत समिति')||x.includes('सभापती, पंचायत')||x.includes('उपसभापती, पंचायत'))return 10;
      if(x.includes('नगराध्यक्ष')||x.includes('नगराध्यक्षा'))return 1;
      if(x.includes('उपनगराध्यक्ष')||x.includes('उपनगराध्यक्षा'))return 2;
      if(x.includes('सभापती')&&!x.includes('उपसभापती'))return 3;
      if(x.includes('उपसभापती'))return 4;
      if(x.includes('आमदार')||x.includes('विधानसभा'))return 20;
      if(x.includes('खासदार')||x.includes('सांसद')||x.includes('लोकसभा'))return 30;
      return 99;
    };
    cards.sort((a,b)=>rank(a.querySelector('.rep-role')?.textContent)-rank(b.querySelector('.rep-role')?.textContent));cards.forEach(c=>root.appendChild(c));
  }
  function init(){profilePhoto();orderReps();const root=document.getElementById('reps');if(root)new MutationObserver(()=>orderReps()).observe(root,{childList:true});}
  document.addEventListener('DOMContentLoaded',init);
})();
