// Universal share controls for Kurduwadi City Portal
(function(){
  function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function build(){
    if(document.getElementById('kpShareFab')) return;
    var fab=document.createElement('button');
    fab.id='kpShareFab'; fab.type='button'; fab.setAttribute('aria-label','Share this page'); fab.innerHTML='📤 <span>Share</span>';
    fab.style.cssText='position:fixed;right:16px;bottom:86px;z-index:99990;border:0;border-radius:999px;padding:12px 17px;background:linear-gradient(135deg,#0b2e59,#1468b8);color:#fff;font:800 14px/1.2 Arial,sans-serif;box-shadow:0 10px 28px rgba(15,23,42,.25);cursor:pointer';
    document.body.appendChild(fab);
    fab.addEventListener('click',openShare);
  }
  function openShare(){
    var url=location.href.split('#')[0],title=document.title||'कुर्डुवाडी सिटी पोर्टल';
    if(navigator.share){navigator.share({title:title,text:'कुर्डुवाडी सिटी पोर्टल',url:url}).catch(function(){});return}
    if(document.getElementById('kpShareSheet')) return;
    var wa='https://wa.me/?text='+encodeURIComponent(title+'\n\n'+url);
    var fb='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url);
    var sheet=document.createElement('div');sheet.id='kpShareSheet';sheet.innerHTML='<div class="kp-share-backdrop"></div><div class="kp-share-panel"><button class="kp-share-close" type="button">×</button><h3>📤 हे पेज शेअर करा</h3><p>'+esc(title)+'</p><div class="kp-share-grid"><a class="kp-wa" target="_blank" rel="noopener" href="'+wa+'">🟢 WhatsApp</a><a class="kp-fb" target="_blank" rel="noopener" href="'+fb+'">📘 Facebook</a><button class="kp-copy" type="button">🔗 Link Copy</button></div></div>';
    var style=document.createElement('style');style.textContent='#kpShareSheet{position:fixed;inset:0;z-index:99999}.kp-share-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.52)}.kp-share-panel{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:min(520px,94vw);box-sizing:border-box;background:#fff;border-radius:24px 24px 0 0;padding:22px 18px 28px;box-shadow:0 -12px 40px rgba(15,23,42,.22)}.kp-share-panel h3{margin:0 36px 6px 0;color:#0b2e59}.kp-share-panel p{margin:0 0 16px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kp-share-close{position:absolute;right:14px;top:12px;width:38px;height:38px;border:0;border-radius:12px;background:#f1f5f9;font-size:25px;cursor:pointer}.kp-share-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.kp-share-grid a,.kp-share-grid button{display:flex;align-items:center;justify-content:center;min-height:46px;border:0;border-radius:12px;text-decoration:none;font:800 13px Arial,sans-serif;cursor:pointer}.kp-wa{background:#dcfce7;color:#166534}.kp-fb{background:#dbeafe;color:#1d4ed8}.kp-copy{background:#fff7ed;color:#9a4b13}@media(max-width:520px){#kpShareFab{right:12px;bottom:78px;padding:11px 14px}.kp-share-grid{grid-template-columns:1fr}.kp-share-panel{padding-bottom:24px}}';document.head.appendChild(style);document.body.appendChild(sheet);
    var close=function(){sheet.remove();style.remove()};sheet.querySelector('.kp-share-close').onclick=close;sheet.querySelector('.kp-share-backdrop').onclick=close;sheet.querySelector('.kp-copy').onclick=async function(){try{await navigator.clipboard.writeText(url);alert('✅ लिंक कॉपी झाली.')}catch(e){prompt('ही लिंक कॉपी करा:',url)}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();
