const CACHE_PREFIX='groklassen-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=CACHE_PREFIX+'46b781fc67c5';
const ASSETS=['./','./index.html','./app.css','./app.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'];
const local=path=>new URL(path,self.registration.scope).href;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(local))))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(CACHE_PREFIX)&&name!==CACHE)await caches.delete(name);await self.clients.claim()})())});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 if(request.mode==='navigate'){event.respondWith((async()=>{const shell=await caches.match(local('./index.html'));if(shell)return shell;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3000);try{const response=await fetch(request,{signal:controller.signal});if(response.ok)return response;throw Error('navigation')}catch{return await caches.match(local('./index.html'))||Response.error()}finally{clearTimeout(timer)}})());return}
 if(ASSETS.map(local).includes(url.href))event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});
