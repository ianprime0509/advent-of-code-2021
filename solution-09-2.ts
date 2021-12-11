const mapData = await Deno.readTextFile(Deno.args[0] ?? "input-09.txt");
const map = mapData
  .split(/\r?\n/)
  .filter((line) => line.trim() !== "")
  .map((line) => line.split("").map((height) => parseInt(height, 10)));

const basins: (number | null)[][] = map.map((row) => row.map(() => null));

function fillBasin(startRow: number, startCol: number, n: number) {
  if (basins[startRow][startCol] !== null || map[startRow][startCol] === 9) {
    return;
  }

  basins[startRow][startCol] = n;

  if (startRow > 0) {
    fillBasin(startRow - 1, startCol, n);
  }
  if (startRow < basins.length - 1) {
    fillBasin(startRow + 1, startCol, n);
  }
  if (startCol > 0) {
    fillBasin(startRow, startCol - 1, n);
  }
  if (startCol < basins[startRow].length - 1) {
    fillBasin(startRow, startCol + 1, n);
  }
}

let currentBasin = 1;
for (let row = 0; row < basins.length; row++) {
  for (let col = 0; col < basins[row].length; col++) {
    if (basins[row][col] === null && map[row][col] !== 9) {
      fillBasin(row, col, currentBasin++);
    }
  }
}

const basinSizes = new Map<number, number>();
basins.forEach((row) =>
  row.forEach((basin) => {
    if (basin !== null) {
      basinSizes.set(basin, (basinSizes.get(basin) ?? 0) + 1);
    }
  })
);

const largest = [...basinSizes.values()].sort((a, b) => b - a).slice(0, 3);
console.log(largest.reduce((a, b) => a * b));
