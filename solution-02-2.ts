import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-02.txt");

let aim = 0;
let depth = 0;
let pos = 0;
for await (const line of readLines(file)) {
  const [command, amount] = line.split(" ");
  const parsedAmount = parseInt(amount, 10);
  switch (command) {
    case "down":
      aim += parsedAmount;
      break;
    case "up":
      aim -= parsedAmount;
      break;
    case "forward":
      pos += parsedAmount;
      depth += aim * parsedAmount;
      break;
  }
}

console.log(depth * pos);
