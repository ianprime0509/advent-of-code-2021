// Considerably more efficient than the first version...

const inputBytes = await Deno.readFile(Deno.args[0] ?? "input-06.txt");
const input = new TextDecoder("utf-8").decode(inputBytes);

function nextDay(fishCounts: Map<number, bigint>) {
  const newFish = fishCounts.get(0) ?? 0n;
  fishCounts.set(0, 0n);

  const ages = [...fishCounts.keys()].filter((age) => age > 0).sort();
  for (const age of ages) {
    fishCounts.set(
      age - 1,
      (fishCounts.get(age - 1) ?? 0n) + (fishCounts.get(age) ?? 0n)
    );
    fishCounts.set(age, 0n);
  }

  fishCounts.set(6, (fishCounts.get(6) ?? 0n) + newFish);
  fishCounts.set(8, (fishCounts.get(8) ?? 0n) + newFish);
}

const fish = input
  .trim()
  .split(",")
  .map((n) => parseInt(n, 10));
const fishCounts = new Map<number, bigint>();
for (const age of fish) {
  fishCounts.set(age, (fishCounts.get(age) ?? 0n) + 1n);
}

for (let i = 0; i < 256; i++) {
  nextDay(fishCounts);
}

let totalFish = 0n;
for (const n of fishCounts.values()) {
  totalFish += n;
}

console.log(totalFish);
