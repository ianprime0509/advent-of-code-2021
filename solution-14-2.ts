function parseInput(input: string): {
  polymer: Map<string, bigint>;
  rules: Map<string, string>;
} {
  const [polymerString, rules] = input.trim().split("\n\n");

  const polymer = new Map<string, bigint>();
  // Intentionally, there will be one "pair" with only one element in it (the
  // last one) so that countElements will work correctly
  for (let i = 0; i < polymerString.length; i++) {
    const pair = polymerString.substring(i, i + 2);
    polymer.set(pair, (polymer.get(pair) ?? 0n) + 1n);
  }

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

function applyRules(polymer: Map<string, bigint>, rules: Map<string, string>) {
  const insertedPairs = new Map<string, bigint>();
  for (const [pair, insertion] of rules.entries()) {
    const n = polymer.get(pair) ?? 0n;
    if (n > 0n) {
      const p1 = pair[0] + insertion;
      const p2 = insertion + pair[1];
      insertedPairs.set(p1, (insertedPairs.get(p1) ?? 0n) + n);
      insertedPairs.set(p2, (insertedPairs.get(p2) ?? 0n) + n);
      insertedPairs.set(pair, (insertedPairs.get(pair) ?? 0n) - n);
    }
  }

  for (const [pair, count] of insertedPairs) {
    polymer.set(pair, (polymer.get(pair) ?? 0n) + count);
  }
}

function countElements(polymer: Map<string, bigint>): Map<string, bigint> {
  const counts = new Map<string, bigint>();
  for (const [pair, count] of polymer.entries()) {
    counts.set(pair[0], (counts.get(pair[0]) ?? 0n) + count);
  }
  return counts;
}

const { polymer, rules } = parseInput(
  await Deno.readTextFile(Deno.args[0] ?? "input-14.txt")
);

for (let i = 0; i < 40; i++) {
  applyRules(polymer, rules);
}

const sortedCounts = [...countElements(polymer).entries()].sort(
  ([, c1], [, c2]) => (c1 > c2 ? 1 : c1 < c2 ? -1 : 0)
);
console.log(sortedCounts[sortedCounts.length - 1][1] - sortedCounts[0][1]);
