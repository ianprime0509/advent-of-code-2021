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
): { highestY: number; hitsTarget: boolean } {
  let [x, y] = [0, 0];
  let highestY = 0;
  while (x <= x1 && y >= y0) {
    if (y > highestY) {
      highestY = y;
    }
    if (x >= x0 && y <= y1) {
      return { highestY, hitsTarget: true };
    }
    x += vx;
    y += vy;
    vx -= Math.sign(vx);
    vy--;
  }
  return { highestY, hitsTarget: false };
}

const target = parseTarget(
  await Deno.readTextFile(Deno.args[0] ?? "input-17.txt")
);

let totalHighestY = 0;
for (let vx = 0; vx <= target.x[1]; vx++) {
  for (let vy = 0; vy <= -target.y[0]; vy++) {
    const { highestY, hitsTarget } = simulatePath(vx, vy, target);
    if (hitsTarget && highestY > totalHighestY) {
      totalHighestY = highestY;
    }
  }
}
console.log(totalHighestY);
