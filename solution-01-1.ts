import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const reader = await Deno.open(Deno.args[0] ?? "input-01.txt");

let increases = 0;
let last: number | null = null;
for await (const line of readLines(reader)) {
  const depth = parseInt(line, 10);
  if (last !== null && depth > last) {
    increases++;
  }
  last = depth;
}

console.log(increases);
