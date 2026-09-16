const CACHE='kurduwadi-static-v5';
const ASSETS=['/','/css/style.css','/css/responsive-final.css','/css/mobile-bottom-nav.css','/js/site.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.origin!==location.origin||e.request.method!=='GET')return;
 if(u.pathname.includes('/rest/')||u.pathname.includes('/auth/')||u.pathname.includes('/storage/'))return;
 const navigation=e.request.mode==='navigate'||e.request.destination==='document';
 const dynamic=/\/js\/(config|submit|profile|app|home-sections|home-updates-live|home-pride-live)\.js$/i.test(u.pathname);
 if(navigation){
   e.respondWith(caches.match(e.request).then(cached=>{
     const network=fetch(e.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}return res}).catch(()=>null);
     return cached||network.then(res=>res||caches.match('/'));
   }));
   return;
 }
 if(dynamic){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));return;}
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{
   if(res.ok&&(/\.(css|js|svg|png|jpg|jpeg|webp|woff2?)$/i.test(u.pathname))){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}
   return res;
 }).catch(()=>cached)));
});
