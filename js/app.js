const game = new Chess();
const el = id => document.getElementById(id);
const G = {p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"};
let me = "w", flipped = false, sel = null, targets = [], last = null, hint = null,
    purpose = "move", thinkingFen = "";

function draw() {
  const b = el("board"); b.innerHTML = "";
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    const r = flipped ? i : 7 - i, f = flipped ? 7 - j : j;
    const sq = "abcdefgh"[f] + (r + 1), p = game.get(sq);
    const d = document.createElement("div");
    d.className = "sq " + ((r + f) % 2 ? "l" : "d");
    if (sel === sq) d.classList.add("sel");
    if (last && (last.from === sq || last.to === sq)) d.classList.add("last");
    if (hint && (hint[0] === sq || hint[1] === sq)) d.classList.add("hint");
    if (targets.includes(sq)) d.classList.add("tgt");
    if (p) { d.textContent = G[p.type]; d.classList.add(p.color); }
    d.onclick = () => tap(sq);
    b.appendChild(d);
  }
  el("status").textContent = game.in_checkmate() ? "Jaque mate"
    : game.in_draw() ? "Tablas"
    : (game.turn() === "w" ? "Blancas" : "Negras") + " juegan" + (game.in_check() ? " (jaque)" : "");
  el("moves").textContent = game.pgn();
}

function tap(sq) {
  if (game.game_over() || game.turn() !== me) return;
  if (sel && targets.includes(sq)) {
    last = game.move({ from: sel, to: sq, promotion: "q" });
    sel = null; targets = []; hint = null; draw(); engineMove(); return;
  }
  const p = game.get(sq);
  if (p && p.color === me) {
    sel = sq; targets = game.moves({ square: sq, verbose: true }).map(m => m.to);
  } else { sel = null; targets = []; }
  draw();
}

function engineMove() {
  if (game.game_over()) return;
  const [skill, ms] = el("level").value.split(",");
  purpose = "move"; thinkingFen = game.fen();
  setLevel(+skill); think(thinkingFen, +ms);
}

onInfo = line => {
  const s = line.match(/score (cp|mate) (-?\d+)/);
  if (s) {
    let v = +s[2]; if (game.turn() === "b") v = -v;
    el("eval").textContent = "Eval: " + (s[1] === "cp" ? (v / 100).toFixed(2) : "mate " + v);
  }
  const b = line.match(/^bestmove (\w\w)(\w\w)(\w)?/);
  if (b && game.fen() === thinkingFen) {
    if (purpose === "hint") hint = [b[1], b[2]];
    else last = game.move({ from: b[1], to: b[2], promotion: b[3] || "q" });
    draw();
  }
};

el("new").onclick = () => {
  send("stop"); game.reset(); me = el("side").value; flipped = me === "b";
  sel = null; targets = []; last = null; hint = null; thinkingFen = "";
  send("ucinewgame"); draw();
  if (me === "b") engineMove();
};
el("undo").onclick = () => {
  send("stop"); thinkingFen = "";
  do { game.undo(); } while (game.history().length && game.turn() !== me);
  sel = null; targets = []; last = null; hint = null; draw();
};
el("hintBtn").onclick = () => {
  if (game.game_over() || game.turn() !== me) return;
  purpose = "hint"; thinkingFen = game.fen(); setLevel(20); think(thinkingFen, 1000);
};
el("flip").onclick = () => { flipped = !flipped; draw(); };
draw();
