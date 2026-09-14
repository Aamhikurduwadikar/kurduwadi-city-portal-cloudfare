/* FINAL HOMEPAGE + TRUST FIXES */
(function(){
  function run(){
    var home=document.body && document.body.classList.contains('premium-home');
    if(!home) return;

    /* Remove the decorative right-side hero card and old stats. */
    document.querySelectorAll('.premium-home .hero-card,.premium-home .hero-stats').forEach(function(el){el.remove();});

    /* Keep the hero clean and full-width after removing the card. */
    if(!document.getElementById('finalHomeTrustStyle')){
      var st=document.createElement('style');
      st.id='finalHomeTrustStyle';
      st.textContent='.premium-home .hero{grid-template-columns:1fr!important}.premium-home .hero-copy{max-width:980px!important}.premium-home footer a{text-decoration:none}.premium-home footer a:hover{text-decoration:underline}.premium-home .final-footer-grid{grid-template-columns:2fr 1fr 1fr 1fr!important}@media(max-width:800px){.premium-home .final-footer-grid{grid-template-columns:1fr!important}.premium-home footer{padding-top:34px!important}}';
      document.head.appendChild(st);
    }

    /* Add History to the main header navigation. */
    var nav=document.querySelector('.premium-home .header nav');
    if(nav && !nav.querySelector('a[href="kurduwadi.html"]')){
      var a=document.createElement('a');
      a.href='kurduwadi.html';
      a.textContent='इतिहास';
      nav.appendChild(a);
    }

    /* Move the world-people section to the bottom, immediately before CTA. */
    function placeWorldPeople(){
      var section=document.querySelector('.world-people-section');
      var cta=document.querySelector('.home-cta');
      if(section && cta && section.parentNode===cta.parentNode){
        cta.parentNode.insertBefore(section,cta);
        return true;
      }
      return false;
    }
    placeWorldPeople();
    var tries=0;
    var timer=setInterval(function(){
      if(placeWorldPeople() || ++tries>30) clearInterval(timer);
    },250);

    /* Replace footer with clear ownership/contact/contribution/admin structure. */
    var footer=document.querySelector('.premium-home > footer');
    if(footer && !footer.dataset.finalTrust){
      footer.dataset.finalTrust='1';
      footer.innerHTML='<div class="final-footer-grid" style="max-width:1180px;margin:auto;display:grid;gap:30px">'
        +'<div><h2 style="margin:0 0 8px">कुर्डूवाडी सिटी पोर्टल</h2><p style="margin:0;opacity:.82;line-height:1.7">आपली कुर्डूवाडी — स्थानिक माहिती, बातम्या, कार्यक्रम आणि नागरिकांचा डिजिटल समुदाय.</p></div>'
        +'<div><h3 style="margin:0 0 10px">पोर्टल</h3><p style="margin:6px 0"><a href="about.html" style="color:#fff">आमच्याबद्दल</a></p><p style="margin:6px 0"><a href="kurduwadi.html" style="color:#fff">इतिहास</a></p><p style="margin:6px 0"><a href="privacy.html" style="color:#fff">गोपनीयता</a></p></div>'
        +'<div><h3 style="margin:0 0 10px">सहभाग</h3><p style="margin:6px 0"><a href="profile.html" style="color:#fff">माझे प्रोफाइल</a></p><p style="margin:6px 0"><a href="gallery-submit.html" style="color:#fff">फोटो / व्हिडिओ पाठवा</a></p><p style="margin:6px 0"><a href="noticeboard-submit.html" style="color:#fff">सूचना द्या</a></p></div>'
        +'<div><h3 style="margin:0 0 10px">संपर्क</h3><p style="margin:6px 0"><a href="contact.html" style="color:#fff">संपर्क पृष्ठ</a></p><p style="margin:6px 0"><a href="mailto:aamhikurduwadikar@gmail.com" style="color:#fff">aamhikurduwadikar@gmail.com</a></p><p style="margin:12px 0 0"><a href="admin/" style="color:#fff;font-weight:700">🔐 Admin Login</a></p></div>'
        +'</div><div style="max-width:1180px;margin:26px auto 0;padding-top:18px;border-top:1px solid rgba(255,255,255,.16);font-size:13px;opacity:.72">© 2026 कुर्डूवाडी सिटी पोर्टल • सर्व हक्क राखीव • माहिती पडताळणीनंतर प्रकाशित केली जाते.</div>';
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  window.addEventListener('load',run);
})();
