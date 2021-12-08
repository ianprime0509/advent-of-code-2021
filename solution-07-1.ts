const inputBytes = await Deno.readFile(Deno.args[0] ?? "input-06.txt");
const input = new TextDecoder("utf-8").decode(inputBytes);

function fuelCost(positions: number[], target: number): number {
  let cost = 0;
  positions.forEach((pos) => (cost += Math.abs(pos - target)));
  return cost;
}

const positions = input
  .trim()
  .split(",")
  .map((p) => parseInt(p, 10));
const minPosition = Math.min(...positions);
const maxPosition = Math.max(...positions);

let minCost = Infinity;
for (let pos = minPosition; pos <= maxPosition; pos++) {
  const cost = fuelCost(positions, pos);
  if (cost < minCost) minCost = cost;
}

console.log(minCost);
