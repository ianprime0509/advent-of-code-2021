import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-02.txt");

let depth = 0;
let pos = 0;
for await (const line of readLines(file)) {
  const [command, amount] = line.split(" ");
  switch (command) {
    case "forward":
      pos += parseInt(amount, 10);
      break;
    case "down":
      depth += parseInt(amount, 10);
      break;
    case "up":
      depth -= parseInt(amount, 10);
      break;
  }
}

console.log(depth * pos);
