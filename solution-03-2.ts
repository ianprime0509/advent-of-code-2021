import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-03.txt");

const values: string[] = [];
for await (const line of readLines(file)) {
  values.push(line);
}

function partition(values: string[], digit: number): [string[], string[]] {
  const [zeros, ones]: [string[], string[]] = [[], []];
  for (const value of values) {
    if (value[digit] === "0") {
      zeros.push(value);
    } else {
      ones.push(value);
    }
  }
  return [zeros, ones];
}

function calculateRating(
  values: string[],
  choose: (zeros: string[], ones: string[]) => string[],
): string {
  const bits = values[0].length;
  for (let i = 0; i < bits; i++) {
    if (values.length === 1) return values[0];

    const [zeros, ones] = partition(values, i);
    values = choose(zeros, ones);
  }

  if (values.length > 1) {
    throw new Error("Non-unique value after filtering");
  }
  return values[0];
}

const oxygenGeneratorRating = calculateRating(
  values,
  (zeros, ones) => zeros.length > ones.length ? zeros : ones,
);
const co2ScrubberRating = calculateRating(
  values,
  (zeros, ones) => ones.length < zeros.length ? ones : zeros,
);

console.log(
  parseInt(oxygenGeneratorRating, 2) * parseInt(co2ScrubberRating, 2),
);
