import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-10.txt");

const closingChars = new Map<string, string>();
closingChars.set("(", ")");
closingChars.set("[", "]");
closingChars.set("{", "}");
closingChars.set("<", ">");

const closingScores = new Map<string, number>();
closingScores.set(")", 1);
closingScores.set("]", 2);
closingScores.set("}", 3);
closingScores.set(">", 4);

function score(line: string): number {
  const closing: string[] = [];
  for (const c of line) {
    const expectedClosing = closingChars.get(c);
    if (expectedClosing !== undefined) {
      closing.push(expectedClosing);
    } else if (c !== closing.pop()) {
      return 0;
    }
  }

  return closing
    .reverse()
    .reduce((score, c) => 5 * score + (closingScores.get(c) ?? 0), 0);
}

const scores: number[] = [];
for await (const line of readLines(file)) {
  const lineScore = score(line);
  if (lineScore > 0) {
    scores.push(lineScore);
  }
}
scores.sort((a, b) => a - b);

console.log(scores[Math.floor(scores.length / 2)]);
