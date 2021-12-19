type Target = { x: [number, number]; y: [number, number] };

function parseTarget(target: string): Target {
  const match = target
    .trim()
    .match(
      /^target area: x=(-?[0-9]+)\.\.(-?[0-9]+), y=(-?[0-9]+)\.\.(-?[0-9]+)$/
    );
  if (match === null) {
    throw new Error(`Invalid target: ${target}`);
  }
  return {
    x: [parseInt(match[1], 10), parseInt(match[2], 10)],
    y: [parseInt(match[3], 10), parseInt(match[4], 10)],
  };
}

function simulatePath(
  vx: number,
  vy: number,
  { x: [x0, x1], y: [y0, y1] }: Target
): boolean {
  let [x, y] = [0, 0];
  while (x <= x1 && y >= y0) {
    if (x >= x0 && y <= y1) {
      return true;
    }
    x += vx;
    y += vy;
    vx -= Math.sign(vx);
    vy--;
  }
  return false;
}

const target = parseTarget(
  await Deno.readTextFile(Deno.args[0] ?? "input-17.txt")
);

let totalPaths = 0;
for (let vx = 0; vx <= target.x[1]; vx++) {
  for (let vy = target.y[0]; vy <= -target.y[0]; vy++) {
    if (simulatePath(vx, vy, target)) {
      totalPaths++;
    }
  }
}
console.log(totalPaths);
