// Homepage gallery performance: keep below-the-fold media out of the critical network path.
(function(){
  function optimize(root){
    (root||document).querySelectorAll('.kp-home-gallery img').forEach(function(img){
      img.loading='lazy';
      img.decoding='async';
      img.fetchPriority='low';
    });
    (root||document).querySelectorAll('.kp-home-gallery video').forEach(function(video){
      video.preload='none';
    });
  }
  optimize(document);
  new MutationObserver(function(mutations){
    mutations.forEach(function(m){
      m.addedNodes.forEach(function(node){
        if(node.nodeType===1) optimize(node);
      });
    });
  }).observe(document.body,{childList:true,subtree:true});
})();
