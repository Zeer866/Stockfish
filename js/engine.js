const sf = new Worker(URL.createObjectURL(new Blob([
  `importScripts("https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js");`
])));
let onInfo = () => {};
sf.onmessage = e => onInfo(String(e.data));
function analyze(fen, depth) {
  sf.postMessage("uci");
  sf.postMessage("setoption name MultiPV value 1");
  sf.postMessage("position fen " + fen);
  sf.postMessage("go depth " + depth);
}
