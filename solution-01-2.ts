import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-01.txt");

let increases = 0;
let m1: number | null = null;
let m2: number | null = null;
let m3: number | null = null;
for await (const line of readLines(file)) {
  const depth = parseInt(line, 10);
  if (
    m1 !== null &&
    m2 !== null &&
    m3 !== null &&
    m2 + m3 + depth > m1 + m2 + m3
  ) {
    increases++;
  }
  [m1, m2, m3] = [m2, m3, depth];
}

console.log(increases);
