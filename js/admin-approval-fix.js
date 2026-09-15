(function(){
'use strict';
/* Reliable admin approval UI for citizen profiles + news. Loaded after admin.js. */
const cfg=window.KURDUWADI_CONFIG||{};
const db=(window.supabase&&cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY)?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
const esc=v=>String(v??'').replace(/[&<>\'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const btnStyle='display:inline-flex!important;visibility:visible!important;opacity:1!important;align-items:center;justify-content:center;min-height:44px!important;padding:10px 18px!important;margin:8px 8px 4px 0!important;border:0!important;border-radius:11px!important;font-weight:800!important;cursor:pointer!important;box-shadow:0 3px 8px rgba(0,0,0,.12)!important';
function approvalButtons(table,id){return `<div class="approval-actions" style="margin-top:10px"><button type="button" data-approval-table="${esc(table)}" data-approval-id="${esc(id)}" data-approval-status="approved" style="${btnStyle};background:#087f5b!important;color:#fff!important">✅ मंजूर करा</button><button type="button" data-approval-table="${esc(table)}" data-approval-id="${esc(id)}" data-approval-status="rejected" style="${btnStyle};background:#b42318!important;color:#fff!important">❌ नकार</button></div>`}
async function update(table,id,status,button){
 if(!db){alert('❌ Supabase connection उपलब्ध नाही.');return}
 if(!id){alert('❌ Record ID मिळाला नाही.');return}
 const label=status==='approved'?'मंजूर':'नकार';
 if(!window.confirm(`ही ${table==='profiles'?'नागरिक प्रोफाइल':'बातमी'} ${label} करायची का?`))return;
 button.disabled=true;button.style.opacity='.65';
 try{
   const patch=table==='profiles'?{status}:{status,published:status==='approved'};
   const res=await db.from(table).update(patch).eq('id',id);
   if(res.error)throw res.error;
   if(!res.data && res.count===0){
     const check=await db.from(table).select('id,status,published').eq('id',id).maybeSingle();
     if(check.error)throw check.error;
     if(check.data&&check.data.status!==status)throw new Error('नोंद update झाली नाही. Admin permission/RLS तपासा.');
   }
   alert(`✅ ${label} यशस्वी.`);
   if(typeof window.showDashboard==='function')await window.showDashboard();else location.reload();
 }catch(err){console.error('Admin approval:',err);alert(`❌ ${label} अयशस्वी: ${err.message||err}`);button.disabled=false;button.style.opacity='1'}
}
function inject(container,table){
 if(!container)return;
 container.querySelectorAll('.admin-item').forEach(item=>{
   if(item.querySelector('.approval-actions'))return;
   const existing=item.querySelector('button[data-table]');
   const id=existing?.dataset?.id;
   if(id)item.insertAdjacentHTML('beforeend',approvalButtons(table,id));
 });
}
function run(){inject(document.getElementById('profiles'),'profiles');inject(document.getElementById('news'),'news')}
document.addEventListener('click',e=>{const b=e.target.closest('button[data-approval-table]');if(b)update(b.dataset.approvalTable,b.dataset.approvalId,b.dataset.approvalStatus,b)});
const start=()=>{run();['profiles','news'].forEach(id=>{const el=document.getElementById(id);if(el)new MutationObserver(run).observe(el,{childList:true,subtree:true})})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
