// Gallery upload fallback: sends public submissions through the Supabase Edge Function.
(function(){
  if(!location.pathname.toLowerCase().includes('gallery-submit')) return;
  document.addEventListener('submit', async function(ev){
    const form=ev.target;
    if(!form || form.id!=='galleryForm') return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    const btn=document.getElementById('submitBtn'), msg=document.getElementById('galleryMsg'), fileEl=document.getElementById('mediaFile'), typeEl=document.getElementById('mediaType'), categoryEl=document.getElementById('category');
    const file=fileEl && fileEl.files && fileEl.files[0];
    if(!file){msg.textContent='❌ फोटो/व्हिडिओ निवडा.';return;}
    const wanted=typeEl.value==='image'?'image':'video';
    const max=wanted==='image'?10:100;
    if((wanted==='image'&&!file.type.startsWith('image/'))||(wanted==='video'&&!file.type.startsWith('video/'))){msg.textContent='❌ निवडलेली file प्रकाराशी जुळत नाही.';return;}
    if(file.size>max*1024*1024){msg.textContent=`❌ File size ${max} MB पेक्षा जास्त आहे.`;return;}
    const isGanpati=new URLSearchParams(location.search).get('category')==='ganpati-2026';
    btn.disabled=true;btn.textContent='Upload होत आहे...';msg.textContent='';
    try{
      const data=new FormData();
      data.append('title',form.elements.title.value.trim());
      data.append('description',form.elements.description.value.trim());
      data.append('media_type',wanted);
      data.append('category',isGanpati?'ganpati-2026':categoryEl.value.trim());
      data.append('media_file',file);
      const res=await fetch(`${KURDUWADI_CONFIG.SUPABASE_URL}/functions/v1/gallery-upload`,{method:'POST',body:data,headers:{apikey:KURDUWADI_CONFIG.SUPABASE_ANON_KEY}});
      let result={};try{result=await res.json()}catch(_){ }
      if(!res.ok||!result.ok) throw new Error(result.error||`Upload failed (${res.status})`);
      msg.textContent=isGanpati?'✅ गणेशोत्सवाचा फोटो/व्हिडिओ upload झाला. Admin मंजुरीनंतर गणेशोत्सव गॅलरीत प्रकाशित होईल.':'✅ फोटो/व्हिडिओ upload झाला. Admin मंजुरीनंतर प्रकाशित केला जाईल.';
      form.reset();
      if(isGanpati){categoryEl.value='ganpati-2026';categoryEl.readOnly=true;}
      document.getElementById('preview').innerHTML='';
    }catch(err){console.error(err);msg.textContent='❌ Submit करताना अडचण: '+(err&&err.message?err.message:err)}
    finally{btn.disabled=false;btn.textContent='Upload करून पाठवा →'}
  },true);
})();
