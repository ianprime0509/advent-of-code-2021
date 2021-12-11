import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-10.txt");

const closingChars = new Map<string, string>();
closingChars.set("(", ")");
closingChars.set("[", "]");
closingChars.set("{", "}");
closingChars.set("<", ">");

const scores = new Map<string, number>();
scores.set(")", 3);
scores.set("]", 57);
scores.set("}", 1197);
scores.set(">", 25137);

function score(line: string): number {
  const closing: string[] = [];
  for (const c of line) {
    const expectedClosing = closingChars.get(c);
    if (expectedClosing !== undefined) {
      closing.push(expectedClosing);
    } else if (c !== closing.pop()) {
      return scores.get(c) ?? 0;
    }
  }
  return 0;
}

let totalScore = 0;
for await (const line of readLines(file)) {
  totalScore += score(line);
}
console.log(totalScore);
