const mapData = await Deno.readTextFile(Deno.args[0] ?? "input-09.txt");
const map = mapData
  .split(/\r?\n/)
  .filter((line) => line.trim() !== "")
  .map((line) => line.split("").map((height) => parseInt(height, 10)));

let sum = 0;
map.forEach((row, i) => {
  row.forEach((height, j) => {
    if (
      (i === 0 || map[i - 1][j] > height) &&
      (i === map.length - 1 || map[i + 1][j] > height) &&
      (j === 0 || map[i][j - 1] > height) &&
      (j === row.length - 1 || map[i][j + 1] > height)
    ) {
      sum += 1 + height;
    }
  });
});
console.log(sum);
