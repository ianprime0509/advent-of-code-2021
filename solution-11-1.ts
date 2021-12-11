const map = (await Deno.readTextFile(Deno.args[0] ?? "input-11.txt"))
  .split(/\r?\n/)
  .map((row) => row.split("").map((energy) => parseInt(energy, 10)));

function step(map: number[][]): number {
  map.forEach((row, i) => row.forEach((energy, j) => (map[i][j] = energy + 1)));

  let flashes = 0;
  const hasFlashed = map.map((row) => row.map(() => false));
  const tryFlash = (i: number, j: number) => {
    if (map[i][j] > 9 && !hasFlashed[i][j]) {
      flashes++;
      hasFlashed[i][j] = true;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          const ni = i + di;
          const nj = j + dj;
          if (0 <= ni && ni < map.length && 0 <= nj && nj < map[ni].length) {
            map[ni][nj]++;
            tryFlash(ni, nj);
          }
        }
      }
    }
  };
  map.forEach((row, i) => row.forEach((_energy, j) => tryFlash(i, j)));

  map.forEach((row, i) =>
    row.forEach((energy, j) => {
      if (energy > 9) {
        map[i][j] = 0;
      }
    })
  );

  return flashes;
}

let totalFlashes = 0;
for (let i = 0; i < 100; i++) {
  totalFlashes += step(map);
}
console.log(totalFlashes);
