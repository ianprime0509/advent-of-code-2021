const inputBytes = await Deno.readFile(Deno.args[0] ?? "input-06.txt");
const input = new TextDecoder("utf-8").decode(inputBytes);

function nextDay(fish: number[]) {
  for (let i = fish.length - 1; i >= 0; i--) {
    if (fish[i] === 0) {
      fish[i] = 6;
      fish.push(8);
    } else {
      fish[i]--;
    }
  }
}

const fish = input
  .trim()
  .split(",")
  .map((n) => parseInt(n, 10));

for (let i = 0; i < 80; i++) {
  nextDay(fish);
}

console.log(fish.length);
