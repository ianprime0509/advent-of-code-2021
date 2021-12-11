const map = (await Deno.readTextFile(Deno.args[0] ?? "input-11.txt"))
  .split(/\r?\n/)
  .map((row) => row.split("").map((energy) => parseInt(energy, 10)));

function step(map: number[][]): boolean {
  map.forEach((row, i) => row.forEach((energy, j) => (map[i][j] = energy + 1)));

  const hasFlashed = map.map((row) => row.map(() => false));
  const tryFlash = (i: number, j: number) => {
    if (map[i][j] > 9 && !hasFlashed[i][j]) {
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

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (!hasFlashed[i][j]) return false;
    }
  }
  return true;
}

for (let i = 0; ; i++) {
  if (step(map)) {
    console.log(i + 1);
    break;
  }
}
