/* 내도감 서비스워커 · network-first
   - HTML 문서는 항상 최신 우선(온라인), 오프라인일 때만 캐시로 폴백 → "옛 화면" 문제 원천 차단.
   - ★로그인(accounts.google.com)·구글시트/드라이브(googleapis.com) 등 다른 오리진은 절대 안 건드림.
   - skipWaiting + clients.claim 로 새 버전 즉시 반영. 옛 캐시는 activate에서 정리.
   - 비상 해제: 앱을 ?nosw=1 로 열면 등록 해제 + 캐시 삭제(등록 스크립트에서 처리). */
var VERSION = 'v361';
var CACHE = 'naedogam-' + VERSION;

self.addEventListener('install', function(e){ self.skipWaiting(); });

self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    try{
      var keys = await caches.keys();
      await Promise.all(keys
        .filter(function(k){ return k.indexOf('naedogam-') === 0 && k !== CACHE; })
        .map(function(k){ return caches.delete(k); }));
    }catch(err){}
    try{ await self.clients.claim(); }catch(err){}
  })());
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;                    // 쓰기 요청(POST 등)은 그대로 통과
  var url;
  try{ url = new URL(req.url); }catch(err){ return; }
  if(url.origin !== self.location.origin) return;     // 타 오리진(구글 로그인·API·외부 이미지)은 통과

  var accept = req.headers.get('accept') || '';
  var isHTML = req.mode === 'navigate' || url.pathname.endsWith('.html') || accept.indexOf('text/html') >= 0;
  var key = url.origin + url.pathname;                 // 쿼리 뗀 캐시 키(?cb=·?ndv= 난립 방지)

  if(isHTML){
    // network-first: 항상 최신 우선, 실패(오프라인)면 캐시
    e.respondWith((async function(){
      try{
        var fresh = await fetch(req, { cache: 'no-store' });
        try{ var c = await caches.open(CACHE); await c.put(key, fresh.clone()); }catch(e2){}
        return fresh;
      }catch(err){
        var cached = await caches.match(key);
        return cached || Response.error();
      }
    })());
    return;
  }

  // 그 외 같은-오리진 정적 자원: stale-while-revalidate(빠르게 + 백그라운드 갱신)
  e.respondWith((async function(){
    var cached = await caches.match(key);
    var net = fetch(req).then(function(res){
      if(res && res.status === 200){ caches.open(CACHE).then(function(c){ c.put(key, res.clone()); }); }
      return res;
    }).catch(function(){ return cached; });
    return cached || net;
  })());
});
