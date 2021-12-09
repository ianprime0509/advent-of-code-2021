import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-08.txt");

// 1 = 2 segments
// 4 = 4 segments
// 7 = 3 segments
// 8 = 7 segments
let count = 0;
for await (const line of readLines(file)) {
  const outputs = line.split(" | ")[1].split(" ");
  for (const output of outputs) {
    if (
      output.length === 2 ||
      output.length === 3 ||
      output.length === 4 ||
      output.length === 7
    ) {
      count++;
    }
  }
}
console.log(count);
