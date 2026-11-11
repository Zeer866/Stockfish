const game = new Chess();
const boardEl = document.getElementById("board");
const P = {p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚",P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔"};

function draw() {
  boardEl.innerHTML = "";
  game.board().forEach((row, r) => row.forEach((c, f) => {
    const d = document.createElement("div");
    d.className = "sq " + ((r + f) % 2 ? "d" : "l");
    if (c) d.textContent = P[c.color === "w" ? c.type.toUpperCase() : c.type];
    boardEl.appendChild(d);
  }));
}

onInfo = line => {
  const m = line.match(/score (cp|mate) (-?\d+).* pv (.+)/);
  if (m) {
    document.getElementById("eval").textContent =
      "Evaluación: " + (m[1] === "cp" ? (m[2] / 100).toFixed(2) : "mate en " + m[2]);
    document.getElementById("line").textContent = "Línea: " + m[3].split(" ").slice(0, 8).join(" ");
  }
  const b = line.match(/^bestmove (\S+)/);
  if (b) document.getElementById("best").textContent = "Mejor jugada: " + b[1];
};

document.getElementById("load").onclick = () => {
  const t = document.getElementById("pgn").value.trim();
  if (!game.load_pgn(t)) game.load(t);
  draw();
  analyze(game.fen(), +document.getElementById("depth").value);
};
draw();
