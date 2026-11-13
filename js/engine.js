const sf = new Worker(URL.createObjectURL(new Blob([
  `importScripts("https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js");`
])));
let onInfo = () => {};
sf.onmessage = e => onInfo(String(e.data));
const send = c => sf.postMessage(c);
send("uci");
const setLevel = n => send("setoption name Skill Level value " + n);
const think = (fen, ms) => { send("position fen " + fen); send("go movetime " + ms); };
