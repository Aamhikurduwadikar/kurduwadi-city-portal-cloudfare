// Supabase public frontend configuration.
// Only publishable/anon keys belong in browser code. NEVER put a service_role/secret key here.
window.KURDUWADI_CONFIG={SUPABASE_URL:'https://rjfgfdgrqficffbyqvlf.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_G3lGu7INXtIGmjum8nj7_A_opGtO3B2',STORAGE_BUCKET:'community-images',GA_MEASUREMENT_ID:'',SITE_NAME:'Kurduwadi City Portal',SITE_URL:'https://aamhikurduwadikar.com/'};
(function(){
 var path=location.pathname.toLowerCase(),home=/\/(index\.html)?$/.test(path),profile=path.endsWith('/profile.html'),reps=path.endsWith('/representatives.html'),admin=path.includes('/admin/');
 function css(id,href){if(!document.getElementById(id)){var l=document.createElement('link');l.id=id;l.rel='stylesheet';l.href=href;document.head.appendChild(l)}}
 function js(src){var s=document.createElement('script');s.src=src;s.defer=true;document.head.appendChild(s)}
 function applyCanonical(){
   var base=window.KURDUWADI_CONFIG.SITE_URL.replace(/\/$/,'');
   var canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=base+(location.pathname==='/'?'':location.pathname);
   document.querySelectorAll('meta[property="og:url"]').forEach(function(m){m.content=base+(location.pathname==='/'?'':location.pathname)});
   document.querySelectorAll('script[type="application/ld+json"]').forEach(function(s){try{var o=JSON.parse(s.textContent);if(o&&o.url)o.url=base+(location.pathname==='/'?'':location.pathname);if(o&&o.logo&&o.logo.indexOf('kurduwadi-city-portal-cloudfare')!==-1)o.logo=base+'/assets/kurduwadi-logo.svg';s.textContent=JSON.stringify(o)}catch(e){}});
 }
 function forceCitizenProfile(){
   document.querySelectorAll('a').forEach(function(a){
     var text=(a.innerText||a.textContent||'').replace(/\s+/g,' ').trim();
     if(text.indexOf('नागरिक प्रोफाइल')!==-1){a.setAttribute('href','profile.html');a.onclick=function(ev){if(ev)ev.preventDefault();location.assign('profile.html');return false;};}
   });
 }
 applyCanonical();
 css('kpModernFonts','css/font-modern.css');css('kpResponsiveFinal','css/responsive-final.css');
 if(!admin)css('kpMobileBottomNavCss','css/mobile-bottom-nav.css');
 if(home){css('kpWorldPeopleLight','css/world-people-light.css');css('kpHeroRestore','css/hero-restore.css');css('kpPrideCompact','css/personalities-compact.css');js('js/site-enhancements.js');js('js/world-people.js');js('js/sidebar-cleanup.js');js('js/header-enhancement.js');js('js/final-home-trust-fix.js');js('js/home-pride-compact.js');js('js/home-pride-live.js');js('js/home-updates-live.js');js('js/city-services-home.js');js('js/perf-gallery.js');js('js/home-profiles-live.js');forceCitizenProfile();document.addEventListener('DOMContentLoaded',forceCitizenProfile);window.addEventListener('load',forceCitizenProfile);window.addEventListener('pageshow',forceCitizenProfile);new MutationObserver(forceCitizenProfile).observe(document.documentElement,{childList:true,subtree:true});}
 if(profile){css('kpProfileMobile','css/profile-mobile.css');js('js/portal-ui-fixes.js');js('js/profile-edit.js')}
 if(reps){js('js/representatives-instagram.js');js('js/portal-ui-fixes.js')}
 if(admin){js('js/work-fields-admin.js');js('js/profile-edit-admin.js');js('js/admin-super-control.js')}
 if(!admin)js('js/mobile-bottom-nav.js');
 if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js?portal=20260915-domain').catch(function(){});
})();
