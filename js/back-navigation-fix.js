/* Prevent duplicate homepage initialization after Back/Forward navigation. */
(function(){
  'use strict';
  if(window.__KURDUWADI_BACK_FIX__) return;
  window.__KURDUWADI_BACK_FIX__=true;
  window.addEventListener('pageshow',function(e){
    if(e.persisted){
      document.documentElement.classList.remove('loading');
      window.dispatchEvent(new Event('kurduwadi:bfcache-restore'));
    }
  });
})();
