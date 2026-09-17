const CACHE='kurduwadi-static-v7';
const ASSETS=['/','/css/style.css','/css/responsive-final.css','/css/mobile-bottom-nav.css','/js/site.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.origin!==location.origin||e.request.method!=='GET')return;
 if(u.pathname.includes('/rest/')||u.pathname.includes('/auth/')||u.pathname.includes('/storage/'))return;
 const navigation=e.request.mode==='navigate'||e.request.destination==='document';
 if(navigation){
   e.respondWith(caches.match(e.request).then(cached=>{
     if(cached){fetch(e.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}}).catch(()=>{});return cached;}
     return fetch(e.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}return res}).catch(()=>caches.match('/'));
   }));return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{
   // Keep dynamic JavaScript uncached so fixes propagate immediately.
   if(res.ok&&(/\.(css|svg|png|jpg|jpeg|webp|woff2?)$/i.test(u.pathname))){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}
   return res;
 }).catch(()=>cached)));
});
