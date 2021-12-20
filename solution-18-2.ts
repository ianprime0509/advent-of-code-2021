import { readLines } from "https://deno.land/std@0.118.0/io/mod.ts";

type Pair = [Pair | number, Pair | number];

function parsePair(input: string): Pair {
  function readNumber(s: string): [number, string] {
    const match = s.match(/[0-9]+/)!;
    return [parseInt(match[0], 10), s.substring(match[0].length)];
  }
  function readPair(s: string): [Pair, string] {
    s = s.substring(1);
    const [part1, rest1] = readElement(s);
    s = rest1.substring(1);
    const [part2, rest2] = readElement(s);
    return [[part1, part2], rest2.substring(1)];
  }
  function readElement(s: string): [Pair | number, string] {
    return s[0] === "[" ? readPair(s) : readNumber(s);
  }

  return readPair(input)[0];
}

function tryExplode(pair: Pair): boolean {
  type Pointer = [Pair, 0 | 1];
  let before: Pointer | null = null;
  let at: Pointer | null = null;
  let after: Pointer | null = null;

  const traverse = (pair: Pair, depth: number) => {
    const traverseSide = (side: 0 | 1) => {
      const element = pair[side];
      if (typeof element === "number") {
        if (at === null) {
          before = [pair, side];
        } else if (after === null) {
          after = [pair, side];
        }
      } else if (depth >= 4 && at === null) {
        at = [pair, side];
      } else {
        traverse(element, depth + 1);
      }
    };

    traverseSide(0);
    traverseSide(1);
  };

  traverse(pair, 1);

  if (at === null) return false;

  if (before !== null) {
    const b = before as Pointer;
    (b[0][b[1]] as number) += (at[0][at[1]] as Pair)[0] as number;
  }
  if (after !== null) {
    const a = after as Pointer;
    (a[0][a[1]] as number) += (at[0][at[1]] as Pair)[1] as number;
  }
  (at[0][at[1]] as number) = 0;
  return true;
}

function trySplit(pair: Pair): boolean {
  const traverse = (p: Pair): boolean => {
    const traverseSide = (side: 0 | 1): boolean => {
      const element = p[side];
      if (typeof element === "number") {
        if (element >= 10) {
          p[side] = [Math.floor(element / 2), Math.ceil(element / 2)];
          return true;
        }
        return false;
      }
      return traverse(element);
    };

    if (traverseSide(0)) return true;
    if (traverseSide(1)) return true;
    return false;
  };

  return traverse(pair);
}

function reduce(pair: Pair) {
  while (true) {
    if (tryExplode(pair)) continue;
    if (!trySplit(pair)) break;
  }
}

export function add(p1: Pair, p2: Pair): Pair {
  const result: Pair = JSON.parse(JSON.stringify([p1, p2]));
  reduce(result);
  return result;
}

export function magnitude(x: Pair | number): number {
  if (typeof x === "number") return x;

  return 3 * magnitude(x[0]) + 2 * magnitude(x[1]);
}

const input = await Deno.open(Deno.args[0] ?? "input-18.txt");
const pairs: Pair[] = [];
for await (const line of readLines(input)) {
  pairs.push(parsePair(line));
}

let largest = -Infinity;
pairs.forEach((p1, i) =>
  pairs.forEach((p2, j) => {
    if (i === j) return;

    const m = magnitude(add(p1, p2));
    if (m > largest) {
      largest = m;
    }
  })
);
console.log(largest);
