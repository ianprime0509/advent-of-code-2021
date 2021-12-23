let [pos1, pos2] = (await Deno.readTextFile(Deno.args[0] ?? "input-21.txt"))
  .trim()
  .split("\n")
  .map((line) =>
    parseInt(line.match(/^Player [12] starting position: ([0-9]+)$/)![1], 10)
  );
let [score1, score2] = [0, 0];
const nextRoll = (() => {
  let current = 1;
  return () => {
    const roll = current;
    current = (current % 100) + 1;
    return roll;
  };
})();
let rolls = 0;
let p1Turn = true;

while (score1 < 1000 && score2 < 1000) {
  const advance = nextRoll() + nextRoll() + nextRoll();
  rolls += 3;
  if (p1Turn) {
    pos1 = ((pos1 + advance - 1) % 10) + 1;
    score1 += pos1;
  } else {
    pos2 = ((pos2 + advance - 1) % 10) + 1;
    score2 += pos2;
  }
  p1Turn = !p1Turn;
}

console.log(Math.min(score1, score2) * rolls);
