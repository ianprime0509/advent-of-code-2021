function parseInput(input: string): {
  polymer: string;
  rules: Map<string, string>;
} {
  const [polymer, rules] = input.trim().split("\n\n");
  return {
    polymer,
    rules: new Map(
      rules.split("\n").map((rule) => {
        const match = rule.match(/^([A-Z]{2}) -> ([A-Z])$/)!;
        return [match[1], match[2]];
      })
    ),
  };
}

function applyRules(polymer: string, rules: Map<string, string>): string {
  const chars = [...polymer];
  for (let i = polymer.length - 2; i >= 0; i--) {
    const insertion = rules.get(polymer.substring(i, i + 2));
    if (insertion !== undefined) {
      chars.splice(i + 1, 0, insertion);
    }
  }
  return chars.join("");
}

function countElements(polymer: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const e of polymer) {
    counts.set(e, (counts.get(e) ?? 0) + 1);
  }
  return counts;
}

let { polymer, rules } = parseInput(
  await Deno.readTextFile(Deno.args[0] ?? "input-14.txt")
);

for (let i = 0; i < 10; i++) {
  polymer = applyRules(polymer, rules);
}

const elementCounts = countElements(polymer);
const sortedCounts = [...elementCounts.entries()].sort(
  ([, c1], [, c2]) => c1 - c2
);
console.log(sortedCounts[sortedCounts.length - 1][1] - sortedCounts[0][1]);
