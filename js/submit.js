const C=window.KURDUWADI_CONFIG||{};
const base=(C.SUPABASE_URL||'').replace(/\/$/,'');
const headers=()=>({apikey:C.SUPABASE_ANON_KEY,Authorization:'Bearer '+C.SUPABASE_ANON_KEY,'Content-Type':'application/json','Prefer':'return=minimal'});
const tabs=document.querySelectorAll('.tab');
tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById('newsTab').hidden=t.dataset.tab!=='news';document.getElementById('eventTab').hidden=t.dataset.tab!=='event';}));
function val(form,name){return form.elements[name]?.value?.trim()||null}
async function request(path,options={}){
 if(!base||!C.SUPABASE_ANON_KEY)throw new Error('Supabase configuration उपलब्ध नाही.');
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
 try{const r=await fetch(base+'/rest/v1/'+path,{...options,headers:{...headers(),...(options.headers||{})},signal:controller.signal});const text=await r.text();if(!r.ok)throw new Error(text||('Supabase HTTP '+r.status));return text?JSON.parse(text):null}finally{clearTimeout(timer)}
}
async function uploadImage(file,folder){
 if(!file)return null;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)throw new Error('फोटो JPG, PNG किंवा WebP आणि 5 MB पेक्षा कमी असावा.');
 const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
 const path=folder+'/'+crypto.randomUUID()+'.'+ext;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
 try{const r=await fetch(base+'/storage/v1/object/'+encodeURIComponent(C.STORAGE_BUCKET||'community-images')+'/'+path,{method:'POST',headers:{apikey:C.SUPABASE_ANON_KEY,Authorization:'Bearer '+C.SUPABASE_ANON_KEY,'Content-Type':file.type,'x-upsert':'false'},body:file,signal:controller.signal});if(!r.ok)throw new Error((await r.text())||'Photo upload failed');return base+'/storage/v1/object/public/'+(C.STORAGE_BUCKET||'community-images')+'/'+path}finally{clearTimeout(timer)}
}
async function submitRow(table,row,msgEl,form,file){
 if(!base||!C.SUPABASE_ANON_KEY){msgEl.textContent='❌ Supabase configuration उपलब्ध नाही.';return}
 const submit=form.querySelector('button[type="submit"]');if(submit)submit.disabled=true;msgEl.textContent='पाठवत आहे…';
 let imageUrl=null;
 try{
  if(file){imageUrl=await uploadImage(file,table);row.image_url=imageUrl}
  await request(table,{method:'POST',body:JSON.stringify(row)});
  msgEl.textContent='✅ माहिती submit झाली. Admin तपासणी व मंजुरीनंतर ती वेबसाइटवर दिसेल.';form.reset();
 }catch(err){console.error('Submission:',err);msgEl.textContent=err?.name==='AbortError'?'❌ कनेक्शनला वेळ लागला. Internet तपासून पुन्हा प्रयत्न करा.':('❌ Submit अयशस्वी: '+(err?.message||'कृपया पुन्हा प्रयत्न करा.')).slice(0,500)}finally{if(submit)submit.disabled=false}
}
document.getElementById('newsForm')?.addEventListener('submit',e=>{e.preventDefault();const f=e.target;submitRow('news',{title:val(f,'title'),content:val(f,'content'),category:val(f,'category'),author_name:val(f,'author_name'),author_phone:val(f,'author_phone'),image_url:null,source_url:val(f,'source_url'),published:false,status:'pending'},document.getElementById('newsMsg'),f,f.elements.image?.files?.[0])});
document.getElementById('eventForm')?.addEventListener('submit',e=>{e.preventDefault();const f=e.target;submitRow('events',{title:val(f,'title'),event_date:val(f,'event_date'),event_time:val(f,'event_time'),location:val(f,'location'),description:val(f,'description'),organizer:val(f,'organizer'),contact:val(f,'contact'),image_url:null,published:false,status:'pending'},document.getElementById('eventMsg'),f,f.elements.image?.files?.[0])});
