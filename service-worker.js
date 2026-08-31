const CACHE="edan-tabasco-v47";
const PRECACHE=["./", "./index.html", "./manifest.webmanifest", "./assets/apple-touch-icon.png", "./assets/favicon-32.png", "./assets/form_step1.jpg", "./assets/form_step6.jpg", "./assets/form_step7.jpg", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/icon-edan-original.png", "./assets/icon-maskable-512.png", "./assets/inicio-edan.jpg", "./assets/logo.png", "./assets/m1.jpg", "./assets/m1_responsables_edan.jpg", "./assets/m2.jpg", "./assets/m3.jpg", "./assets/m4_main.jpg", "./assets/m4_quality.jpg", "./assets/m5_case.jpg", "./assets/m5_priority.jpg", "./assets/m6_glance.jpg", "./assets/m6_quality.jpg", "./assets/m6_report.jpg"];
const OPTIONAL=["https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js","https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js","https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js","https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js","https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js","https://unpkg.com/qrcodejs@1.0.0/qrcode.min.js"];
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(PRECACHE);
  for(const url of OPTIONAL){try{const r=await fetch(url,{mode:"cors"});if(r.ok)await cache.put(url,r.clone())}catch(e){}}
 })());
 self.skipWaiting();
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();
 })());
});
self.addEventListener("message",event=>{if(event.data==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("fetch",event=>{
 const req=event.request;if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(req.mode==="navigate"){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const fallback=await cache.match("./index.html")||await cache.match("./");
   try{const net=await fetch(req);if(net&&net.ok)await cache.put("./index.html",net.clone());return net}catch(e){return fallback||new Response("Guía EDAN sin conexión",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}})}
  })());return;
 }
 if(url.origin===self.location.origin){
  event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(req);if(cached)return cached;try{const net=await fetch(req);if(net&&net.ok)await cache.put(req,net.clone());return net}catch(e){return cached}})());return;
 }
 if(OPTIONAL.includes(req.url)){
  event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(req.url);if(cached)return cached;try{const net=await fetch(req);if(net&&net.ok)await cache.put(req.url,net.clone());return net}catch(e){return cached}})());
 }
});