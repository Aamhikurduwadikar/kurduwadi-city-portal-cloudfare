const {SUPABASE_URL,SUPABASE_ANON_KEY,STORAGE_BUCKET}=window.KURDUWADI_CONFIG;
const db = window.supabase && SUPABASE_URL.startsWith('http') && !SUPABASE_ANON_KEY.startsWith('YOUR_') ? window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY) : null;
const tabs=document.querySelectorAll('.tab');
tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById('newsTab').hidden=t.dataset.tab!=='news';document.getElementById('eventTab').hidden=t.dataset.tab!=='event';}));
function val(form,name){return form.elements[name]?.value?.trim()||null}
async function uploadImage(file,folder){
  if(!file) return null;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024) throw new Error('फोटो JPG, PNG किंवा WebP आणि 5 MB पेक्षा कमी असावा.');
  const ext=file.name.split('.').pop().toLowerCase();
  const path=`${folder}/${crypto.randomUUID()}.${ext}`;
  const up=await db.storage.from(STORAGE_BUCKET).upload(path,file,{cacheControl:'31536000',upsert:false,contentType:file.type});
  if(up.error) throw up.error;
  return db.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
async function submitRow(table,row,msgEl,form,file){
  if(!db){msgEl.textContent='पहिले js/config.js मध्ये Supabase URL आणि Anon Key भरा.';return}
  msgEl.textContent='पाठवत आहे...';
  try{
    if(file) row.image_url=await uploadImage(file,table);
    const {error}=await db.from(table).insert(row);
    if(error) throw error;
    msgEl.textContent='✅ माहिती submit झाली. Admin तपासणी व मंजुरीनंतर ती वेबसाइटवर दिसेल.';
    form.reset();
  }catch(err){msgEl.textContent=err.message||'Submit करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.';}
}
document.getElementById('newsForm').addEventListener('submit',e=>{e.preventDefault();const f=e.target;submitRow('news',{title:val(f,'title'),content:val(f,'content'),category:val(f,'category'),author_name:val(f,'author_name'),author_phone:val(f,'author_phone'),image_url:null,source_url:val(f,'source_url'),published:false,status:'pending'},document.getElementById('newsMsg'),f,f.elements.image?.files?.[0])});
document.getElementById('eventForm').addEventListener('submit',e=>{e.preventDefault();const f=e.target;submitRow('events',{title:val(f,'title'),event_date:val(f,'event_date'),event_time:val(f,'event_time'),location:val(f,'location'),description:val(f,'description'),organizer:val(f,'organizer'),contact:val(f,'contact'),image_url:null,published:false,status:'pending'},document.getElementById('eventMsg'),f,f.elements.image?.files?.[0])});
