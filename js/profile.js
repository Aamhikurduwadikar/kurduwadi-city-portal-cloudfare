const {SUPABASE_URL,SUPABASE_ANON_KEY}=window.KURDUWADI_CONFIG||{};
const db = window.supabase && SUPABASE_URL && !SUPABASE_URL.startsWith("YOUR_") ? window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY) : null;
const form=document.getElementById("profileForm");
const photoInput=document.getElementById("profilePhotoInput");
form?.addEventListener("submit",async(e)=>{
 e.preventDefault();
 const msg=document.getElementById("formMessage");
 if(!db){msg.textContent="Supabase connection उपलब्ध नाही.";return}
 const f=new FormData(form);
 const work_fields=[...form.querySelectorAll('input[name="work_field"]:checked')].map(x=>x.value);
 if(!work_fields.length){msg.textContent="कृपया किमान एक कार्यक्षेत्र निवडा.";return}
 const id=crypto.randomUUID();
 let photoUrl=null,uploadedPath=null;
 const photo=photoInput?.files?.[0]||null;
 try{
   if(photo){
     if(!/^image\/(jpeg|png|webp)$/.test(photo.type)||photo.size>5*1024*1024) throw new Error("फोटो JPG, PNG किंवा WebP आणि 5 MB पेक्षा कमी असावा.");
     const ext=photo.type==='image/png'?'png':photo.type==='image/webp'?'webp':'jpg';
     uploadedPath='profiles/'+id+'.'+ext;
     const up=await db.storage.from(window.KURDUWADI_CONFIG.STORAGE_BUCKET||'community-images').upload(uploadedPath,photo,{contentType:photo.type,upsert:false});
     if(up.error)throw up.error;
     photoUrl=db.storage.from(window.KURDUWADI_CONFIG.STORAGE_BUCKET||'community-images').getPublicUrl(uploadedPath).data.publicUrl;
   }
   const row={id,name:f.get("name"),education:f.get("education"),job:f.get("job"),city:f.get("city"),state:f.get("state"),country:f.get("country"),blood_group:f.get("blood_group"),skills:f.get("skills"),phone:f.get("phone"),work_fields,is_public:f.get("is_public")==="on",blood_public:f.get("blood_public")==="on",photo_url:photoUrl,status:"pending"};
   const {error}=await db.from("profiles").insert(row);
   if(error)throw error;
   msg.textContent=photo?"✅ माहिती व फोटो submit झाले. Admin approval नंतर profile दिसेल.":"✅ माहिती submit झाली. Admin approval नंतर profile दिसेल.";
   form.reset();
   const preview=document.getElementById('profilePhotoPreview');if(preview)preview.hidden=true;
 }catch(err){
   if(uploadedPath)await db.storage.from(window.KURDUWADI_CONFIG.STORAGE_BUCKET||'community-images').remove([uploadedPath]).catch(()=>{});
   console.error(err);msg.textContent="❌ Submit करताना अडचण आली. कृपया माहिती/फोटो तपासा.";
 }
});