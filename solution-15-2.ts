function parseMap(map: string): number[][] {
  return map
    .trim()
    .split("\n")
    .map((row) => row.split("").map((risk) => parseInt(risk, 10)));
}

function tileMap(map: number[][], times: number): number[][] {
  const tiled = [...Array(map.length * times)].map((_row, i) =>
    Array(map[i % map.length].length * times)
  );

  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      const original = map[r][c];
      for (let dr = 0; dr < times; dr++) {
        for (let dc = 0; dc < times; dc++) {
          tiled[r + dr * map.length][c + dc * map[r].length] =
            ((original + dr + dc - 1) % 9) + 1;
        }
      }
    }
  }

  return tiled;
}

function lowestRisk(map: number[][]): number {
  const risks = map.map((row) => row.map(() => Infinity));
  risks[0][0] = 0;
  const visited = map.map((row) => row.map(() => false));
  const toVisit: [number, number][] = [[0, 0]];

  while (toVisit.length > 0) {
    toVisit.sort(([r1, c1], [r2, c2]) => risks[r2][c2] - risks[r1][c1]);
    const [r, c] = toVisit.pop()!;
    if (visited[r][c]) continue;
    if (r === map.length - 1 && c === map[r].length - 1) {
      return risks[r][c];
    }

    const tryVisit = (vr: number, vc: number) => {
      if (
        0 <= vr &&
        vr < map.length &&
        0 <= vc &&
        vc < map[vr].length &&
        !visited[vr][vc]
      ) {
        risks[vr][vc] = Math.min(risks[vr][vc], map[vr][vc] + risks[r][c]);
        toVisit.push([vr, vc]);
      }
    };
    tryVisit(r - 1, c);
    tryVisit(r + 1, c);
    tryVisit(r, c - 1);
    tryVisit(r, c + 1);

    visited[r][c] = true;
  }

  throw new Error("impossible");
}

const map = tileMap(
  parseMap(await Deno.readTextFile(Deno.args[0] ?? "input-15.txt")),
  5
);
console.log(lowestRisk(map));
