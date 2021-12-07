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
    if (x1 === x2) {
      if (y2 < y1) [y1, y2] = [y2, y1];

      for (let y = y1; y <= y2; y++) {
        this.add(x1, y);
      }
    } else if (y1 === y2) {
      if (x2 < x1) [x1, x2] = [x2, x1];

      for (let x = x1; x <= x2; x++) {
        this.add(x, y1);
      }
    } else {
      // Ignore
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
