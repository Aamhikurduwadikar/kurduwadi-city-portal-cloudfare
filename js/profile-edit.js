(function(){
function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function init(){
 const form=document.getElementById('profileEditForm');if(!form||form.dataset.enhanced)return;form.dataset.enhanced='1';
 const fields=document.createElement('div');fields.className='two';fields.innerHTML='<label>नवीन शिक्षण<input name="new_education" placeholder="बदलायचे असल्यास भरा"></label><label>नवीन नोकरी / व्यवसाय<input name="new_job" placeholder="बदलायचे असल्यास भरा"></label><label>नवीन शहर<input name="new_city" placeholder="बदलायचे असल्यास भरा"></label><label>नवीन कौशल्ये<input name="new_skills" placeholder="बदलायचे असल्यास भरा"></label><label>नवीन मोबाईल<input name="new_phone" inputmode="tel" placeholder="बदलायचा असल्यास भरा"></label><label>नवीन Blood Group<select name="new_blood_group"><option value="">बदलायचा नसल्यास</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></label><label style="grid-column:1/-1">नवीन फोटो (ऐच्छिक)<input name="new_photo" type="file" accept="image/jpeg,image/png,image/webp"></label>';
 const msg=form.querySelector('#profileEditMessage');const message=form.querySelector('[name="edit_message"]');message?.setAttribute('placeholder','इतर बदल/नाव बदलायचे असल्यास येथे लिहा');
 const submit=form.querySelector('button[type="submit"]');if(submit)submit.textContent='✏️ बदलाची विनंती पाठवा';form.insertBefore(fields,message?.closest('label')||submit);
 form.addEventListener('submit',async e=>{
  e.preventDefault();e.stopImmediatePropagation();
  const cfg=window.KURDUWADI_CONFIG;if(!window.supabase||!cfg){msg.textContent='❌ Supabase connection उपलब्ध नाही.';return}
  const db=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY),f=new FormData(form),name=String(f.get('edit_name')||'').trim(),phone=String(f.get('edit_phone')||'').trim();
  if(!name){msg.textContent='कृपया profile मधील नाव द्या.';return}
  let q=db.from('profiles').select('id,name,phone').eq('status','approved').eq('name',name).limit(5);if(phone)q=q.eq('phone',phone);
  const found=await q;if(found.error){msg.textContent='❌ Profile शोधता आला नाही.';return}const profile=found.data?.[0];if(!profile){msg.textContent='❌ मंजूर profile सापडली नाही. नाव व मोबाईल नंबर तपासा.';return}
  const changes={};
  const map={name:'edit_name',education:'new_education',job:'new_job',city:'new_city',skills:'new_skills',phone:'new_phone',blood_group:'new_blood_group'};
  Object.entries(map).forEach(([k,n])=>{const v=String(f.get(n)||'').trim();if(k!=='name'&&v)changes[k]=v});
  const note=String(f.get('edit_message')||'').trim();if(note)changes.message=note;
  if(!Object.keys(changes).length && !f.get('new_photo')?.name){msg.textContent='कृपया किमान एक बदल द्या.';return}
  let photoUrl=null,photoPath=null;const photo=f.get('new_photo');
  try{
   if(photo?.name){if(!/^image\/(jpeg|png|webp)$/.test(photo.type)||photo.size>5*1024*1024)throw new Error('फोटो JPG, PNG किंवा WebP आणि 5 MB पेक्षा कमी असावा.');const ext=photo.type==='image/png'?'png':photo.type==='image/webp'?'webp':'jpg';photoPath='profiles/edits/'+crypto.randomUUID()+'.'+ext;const up=await db.storage.from(cfg.STORAGE_BUCKET||'community-images').upload(photoPath,photo,{contentType:photo.type,upsert:false});if(up.error)throw up.error;photoUrl=db.storage.from(cfg.STORAGE_BUCKET||'community-images').getPublicUrl(photoPath).data.publicUrl}
   const res=await db.from('profile_edit_requests').insert({profile_id:profile.id,name,phone,requested_changes:changes,photo_url:photoUrl,message:note||null});if(res.error)throw res.error;
   msg.textContent='✅ बदलाची विनंती Admin कडे पाठवली. मंजुरीनंतर नवीन माहिती लागू होईल.';form.reset();
  }catch(err){if(photoPath)await db.storage.from(cfg.STORAGE_BUCKET||'community-images').remove([photoPath]).catch(()=>{});console.error(err);msg.textContent='❌ विनंती पाठवता आली नाही. कृपया पुन्हा प्रयत्न करा.'}
 },true);
}
document.addEventListener('DOMContentLoaded',init);
})();
