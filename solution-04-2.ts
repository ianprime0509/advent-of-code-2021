import { BufReader } from "https://deno.land/std@0.117.0/io/mod.ts";

const file = await Deno.open(Deno.args[0] ?? "input-04.txt");
const reader = BufReader.create(file);

const drawsLine = await reader.readString("\n");
if (drawsLine === null) {
  throw new Error("No input");
}
const draws = drawsLine.split(",").map((draw) => parseInt(draw, 10));

class Board {
  marks: boolean[][];

  constructor(public positions: number[][]) {
    this.marks = positions.map((row) => row.map(() => false));
  }

  get won(): boolean {
    const rowWon = (i: number): boolean => this.marks[i].indexOf(false) === -1;
    const columnWon = (j: number): boolean =>
      this.marks.findIndex((row) => row[j] === false) === -1;

    const anyRowWon = [...this.marks.keys()].findIndex(rowWon) !== -1;
    const anyColumnWon = [...this.marks[0].keys()].findIndex(columnWon) !== -1;

    return anyRowWon || anyColumnWon;
  }

  get unmarkedSum(): number {
    let sum = 0;
    for (let i = 0; i < this.marks.length; i++) {
      for (let j = 0; j < this.marks[i].length; j++) {
        if (!this.marks[i][j]) {
          sum += this.positions[i][j];
        }
      }
    }
    return sum;
  }

  mark(draw: number) {
    for (let i = 0; i < this.positions.length; i++) {
      const row = this.positions[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] === draw) {
          this.marks[i][j] = true;
          return;
        }
      }
    }
  }
}

async function readBoard(reader: BufReader): Promise<Board | null> {
  const positions: number[][] = [];
  while (positions.length < 5) {
    const line = await reader.readString("\n");
    if (line === null) {
      if (positions.length === 0) {
        return null;
      } else {
        throw new Error("Incomplete board");
      }
    }
    if (line.trim() === "") continue;

    positions.push(
      line
        .trim()
        .split(/\s+/)
        .map((position) => parseInt(position, 10))
    );
  }
  return new Board(positions);
}

const boards: Board[] = [];
let board: Board | null;
while ((board = await readBoard(reader)) !== null) {
  boards.push(board);
}

for (const draw of draws) {
  for (let i = boards.length - 1; i >= 0; i--) {
    const board = boards[i];
    board.mark(draw);
    if (board.won) {
      if (boards.length === 1) {
        console.log(board.unmarkedSum * draw);
        Deno.exit(0);
      }
      boards.splice(i, 1);
    }
  }
}
