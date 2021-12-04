import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-03.txt");

let measurements = 0;
let onesCount: number[] | null = null;
for await (const line of readLines(file)) {
  if (onesCount === null) {
    onesCount = Array.from(Array(line.length), () => 0);
  }
  // All measurements are assumed to have the same number of bits
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "1") {
      onesCount[i]++;
    }
  }
  measurements++;
}

if (onesCount === null) {
  throw new Error("No input");
}

let gammaRate = "";
let epsilonRate = "";
for (const count of onesCount) {
  if (count >= measurements / 2) {
    gammaRate += "1";
    epsilonRate += "0";
  } else {
    gammaRate += "0";
    epsilonRate += "1";
  }
}

console.log(parseInt(gammaRate, 2) * parseInt(epsilonRate, 2));
