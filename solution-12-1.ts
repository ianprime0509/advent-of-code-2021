import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts";

class Cave {
  big: boolean;

  constructor(public name: string, public connections: Cave[]) {
    this.big = /^[A-Z]+$/.test(name);
  }
}

const file = await Deno.open(Deno.args[0] ?? "input-12.txt");
const caves = new Map<string, Cave>();
for await (const line of readLines(file)) {
  const [n1, n2] = line.split("-");
  let c1 = caves.get(n1);
  if (c1 === undefined) {
    caves.set(n1, (c1 = new Cave(n1, [])));
  }
  let c2 = caves.get(n2);
  if (c2 === undefined) {
    caves.set(n2, (c2 = new Cave(n2, [])));
  }
  c1.connections.push(c2);
  c2.connections.push(c1);
}

function pathsToEnd(start: Cave, visitedSmall: Set<string>): number {
  if (start.name === "end") return 1;

  return start.connections
    .filter((c) => c.big || !visitedSmall.has(c.name))
    .reduce(
      (paths, c) =>
        paths +
        pathsToEnd(
          c,
          start.big ? visitedSmall : new Set([...visitedSmall, start.name])
        ),
      0
    );
}

console.log(pathsToEnd(caves.get("start")!, new Set()));
