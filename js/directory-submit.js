(function(){'use strict';
const c=window.KURDUWADI_CONFIG||{};const sb=window.supabase?.createClient?.(c.SUPABASE_URL,c.SUPABASE_ANON_KEY);const form=document.getElementById('directoryForm'),msg=document.getElementById('msg');if(!form||!sb)return;
const $=id=>document.getElementById(id);const val=id=>($(id)?.value||'').trim()||null;const safeName=v=>String(v||'business-photo').replace(/[^a-zA-Z0-9._-]/g,'_');
$('business_photo')?.addEventListener('change',()=>{const f=$('business_photo').files?.[0],p=$('photoPreview');if(!f||!p){if(p)p.style.display='none';return}if(!f.type.startsWith('image/')){msg.textContent='❌ फक्त फोटो निवडा.';$('business_photo').value='';p.style.display='none';return}if(f.size>10*1024*1024){msg.textContent='❌ फोटो 10 MB पेक्षा कमी असावा.';$('business_photo').value='';p.style.display='none';return}p.src=URL.createObjectURL(f);p.style.display='block'});
form.addEventListener('submit',async e=>{e.preventDefault();msg.textContent='Submit होत आहे…';
 const f=$('business_photo')?.files?.[0];let image_url=null;let uploadedPath=null;
 const row={business_name:val('business_name'),category:val('category'),owner_name:val('owner_name'),founded_year:val('founded_year')?Number(val('founded_year')):null,contact_number:val('contact_number'),email:val('email'),address:val('address'),timings:val('timings'),google_maps_link:val('google_maps_link'),products_services:val('products_services'),origin_story:val('origin_story'),business_history:val('business_history'),inspiration:val('inspiration'),family_story:val('family_story'),achievements:val('achievements'),community_contribution:val('community_contribution'),future_vision:val('future_vision'),website:val('website'),instagram:val('instagram'),facebook:val('facebook'),status:'pending',is_approved:false};
 try{
  const {data:{user}}=await sb.auth.getUser();if(user)row.submitted_by=user.id;
  if(f){const path=`business/${new Date().getFullYear()}/${Date.now()}-${safeName(f.name)}`;const {error:upErr}=await sb.storage.from(c.STORAGE_BUCKET||'community-images').upload(path,f,{upsert:false,contentType:f.type,cacheControl:'31536000'});if(upErr)throw upErr;uploadedPath=path;const {data:urlData}=sb.storage.from(c.STORAGE_BUCKET||'community-images').getPublicUrl(path);image_url=urlData?.publicUrl||null;if(!image_url)throw Error('फोटो URL तयार झाला नाही');row.image_url=image_url}
  const {error}=await sb.from('kurduwadi_directory').insert(row);if(error){if(uploadedPath)await sb.storage.from(c.STORAGE_BUCKET||'community-images').remove([uploadedPath]);throw error}
  form.reset();if($('is_public'))$('is_public').checked=true;if($('photoPreview')){$('photoPreview').style.display='none';$('photoPreview').removeAttribute('src')}
  msg.textContent='✅ माहिती आणि व्यवसायाची कहाणी submit झाली. Admin पडताळणीनंतर ती Directory मध्ये प्रकाशित केली जाईल.';
 }catch(err){console.error(err);msg.textContent='❌ Submit करताना अडचण: '+(err.message||err)}
});})();
