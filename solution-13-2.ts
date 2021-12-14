type Point = [number, number];
type Fold = { axis: "x" | "y"; position: number };

function parseInstructions(data: string): { points: Point[]; folds: Fold[] } {
  const [points, folds] = data.trim().split("\n\n");
  return {
    points: points.split("\n").map((p) => {
      const [x, y] = p.split(",");
      return [parseInt(x, 10), parseInt(y, 10)];
    }),
    folds: folds.split("\n").map((f) => {
      const match = f.match(/^fold along (x|y)=([0-9]+)$/)!;
      return { axis: match[1] as "x" | "y", position: parseInt(match[2]) };
    }),
  };
}

function fold(points: Point[], fold: Fold): Point[] {
  const folded: Point[] = [];
  // It's a shame there's no primitive tuple type we can use here
  const foldedStrings: Set<`${number},${number}`> = new Set();

  points.forEach(([x, y]) => {
    const flip = (v: number) =>
      v > fold.position ? v - 2 * (v - fold.position) : v;
    const foldedX = fold.axis === "x" ? flip(x) : x;
    const foldedY = fold.axis === "y" ? flip(y) : y;
    if (!foldedStrings.has(`${foldedX},${foldedY}`)) {
      folded.push([foldedX, foldedY]);
    }
    foldedStrings.add(`${foldedX},${foldedY}`);
  });

  return folded;
}

function print(points: Point[]) {
  const width = Math.max(...points.map((p) => p[0])) + 1;
  const height = Math.max(...points.map((p) => p[1])) + 1;
  const dots = [...Array(height)].map(() => [...Array(width)].map(() => false));
  points.forEach(([x, y]) => (dots[y][x] = true));
  dots.forEach((row) => {
    console.log(row.map((visible) => (visible ? "#" : " ")).join(""));
  });
}

let { points, folds } = parseInstructions(
  await Deno.readTextFile(Deno.args[0] ?? "input-13.txt")
);

folds.forEach((f) => (points = fold(points, f)));

print(points);
