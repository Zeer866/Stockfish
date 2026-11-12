const CACHE = "stockfish-v1";
const FILES = [
  "./", "index.html", "css/style.css", "js/app.js", "js/engine.js",
  "https://cdn.jsdelivr.net/npm/chess.js@0.13.4/chess.min.js",
  "https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js"
];
self.addEventListener("install", e =>
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener("fetch", e =>
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
