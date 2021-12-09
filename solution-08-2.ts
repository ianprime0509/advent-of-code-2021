import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-08.txt");

/*
  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
 */
function decode(observed: string[], digits: string[]): number {
  // 1 = the only digit with two segments
  // 4 = the only digit with four segments
  // 7 = the only digit with three segments
  // 8 = the only digit with seven segments
  // 9 = the only digit with six segments containing all the segments in 4
  // 0 = the only digit with six segments containing all the segments in 1, except for 9
  // 6 = the only digit with six segments except for 9 and 0
  // 3 = the only digit with five segments containing all the segments in 1
  // 5 = the only digit with five segments contained entirely within 9
  // 2 = the only digit with five segments except for 3 and 5

  const sort = (s: string) => s.split("").sort().join("");
  observed = observed.map(sort);
  digits = digits.map(sort);

  const byLength = new Map<number, string[]>();
  for (const s of observed) {
    let members = byLength.get(s.length);
    if (members === undefined) {
      byLength.set(s.length, (members = []));
    }
    members.push(s);
  }

  const translations = new Map<string, number>();
  const reverseTranslations = new Map<number, string>();
  const defineTranslation = (segments: string, digit: number) => {
    translations.set(segments, digit);
    reverseTranslations.set(digit, segments);
  };

  defineTranslation(byLength.get(2)![0], 1);
  defineTranslation(byLength.get(4)![0], 4);
  defineTranslation(byLength.get(3)![0], 7);
  defineTranslation(byLength.get(7)![0], 8);

  const contains = (s: string, sub: string) => {
    const chars = new Set(s);
    return [...sub].findIndex((subChar) => !chars.has(subChar)) === -1;
  };

  const sixSegments = byLength.get(6)!;
  const indexOfNine = sixSegments.findIndex((s) =>
    contains(s, reverseTranslations.get(4)!)
  );
  defineTranslation(sixSegments[indexOfNine], 9);
  sixSegments.splice(indexOfNine, 1);

  const indexOfZero = sixSegments.findIndex((s) =>
    contains(s, reverseTranslations.get(1)!)
  );
  defineTranslation(sixSegments[indexOfZero], 0);
  sixSegments.splice(indexOfZero, 1);

  defineTranslation(sixSegments[0], 6);

  const fiveSegments = byLength.get(5)!;
  const indexOfThree = fiveSegments.findIndex((s) =>
    contains(s, reverseTranslations.get(1)!)
  );
  defineTranslation(fiveSegments[indexOfThree], 3);
  fiveSegments.splice(indexOfThree, 1);

  const indexOfFive = fiveSegments.findIndex((s) =>
    contains(reverseTranslations.get(9)!, s)
  );
  defineTranslation(fiveSegments[indexOfFive], 5);
  fiveSegments.splice(indexOfFive, 1);

  defineTranslation(fiveSegments[0], 2);

  return digits
    .map((digit) => translations.get(digit)!)
    .reduce((n, digit) => 10 * n + digit);
}

let sum = 0;
for await (const line of readLines(file)) {
  const [observed, digits] = line.split(" | ");
  const decoded = decode(observed.split(" "), digits.split(" "));
  sum += decoded;
}
console.log(sum);
