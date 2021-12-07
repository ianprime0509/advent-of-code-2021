import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-05.txt");

class VentMap {
  counts: number[][] = [];

  add(x: number, y: number) {
    // Ensure space
    while (this.counts.length <= y) {
      this.counts.push([]);
    }
    this.counts.forEach((row) => {
      while (row.length <= x) {
        row.push(0);
      }
    });

    this.counts[y][x]++;
  }

  addLine([x1, y1]: [number, number], [x2, y2]: [number, number]) {
    const xInc = Math.sign(x2 - x1);
    const yInc = Math.sign(y2 - y1);
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));

    for (let i = 0; i <= steps; i++) {
      this.add(x1 + i * xInc, y1 + i * yInc);
    }
  }
}

const map = new VentMap();
const inputPattern = /^([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)$/;
for await (const line of readLines(file)) {
  const match = line.match(inputPattern);
  if (match === null) {
    throw new Error(`Invalid input line: ${line}`);
  }
  const [, x1, y1, x2, y2] = match;
  map.addLine(
    [parseInt(x1, 10), parseInt(y1, 10)],
    [parseInt(x2, 10), parseInt(y2, 10)]
  );
}

let overlaps = 0;
map.counts.forEach((row) =>
  row.forEach((count) => {
    if (count >= 2) overlaps++;
  })
);
console.log(overlaps);
