const {SUPABASE_URL,SUPABASE_ANON_KEY,STORAGE_BUCKET}=window.KURDUWADI_CONFIG;
const db=window.supabase && SUPABASE_URL.startsWith('http') && !SUPABASE_ANON_KEY.startsWith('YOUR_') ? window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY) : null;
const form=document.getElementById('ideaForm'), msg=document.getElementById('ideaMsg'), imageInput=document.getElementById('ideaImage');
function safe(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
form.addEventListener('submit',async e=>{e.preventDefault();
 if(!db){msg.textContent='पहिले js/ideas.js मध्ये Supabase URL आणि Anon Key भरा.';return;}
 const f=new FormData(form), file=imageInput.files?.[0];
 if(file && (!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)){msg.textContent='फोटो JPG, PNG किंवा WebP आणि 5 MB पेक्षा कमी असावा.';return;}
 msg.textContent='पाठवत आहे...';
 let image_url=null;
 try{
  if(file){const ext=file.name.split('.').pop().toLowerCase();const path=`ideas/${crypto.randomUUID()}.${ext}`;const up=await db.storage.from(STORAGE_BUCKET).upload(path,file,{cacheControl:'31536000',upsert:false,contentType:file.type});if(up.error) throw up.error;image_url=db.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;}
  const {error}=await db.from('ideas').insert({name:f.get('name')?.trim()||null,area:f.get('area')?.trim()||null,title:f.get('title')?.trim(),description:f.get('description')?.trim(),contact:f.get('contact')?.trim()||null,image_url,status:'pending',published:false});
  if(error) throw error; msg.textContent='✅ तुमची कल्पना submit झाली. Admin तपासणीनंतर ती वेबसाइटवर दिसेल.';form.reset();
 }catch(err){msg.textContent='Submit करताना अडचण आली. Supabase Table/Storage setup तपासा.';console.error(err);}
});
