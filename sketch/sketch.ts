const screenSize = { width: 800, height: 400 };
const cellSize = 10;
const gridSize = {
  width: screenSize.width / cellSize,
  height: screenSize.height / cellSize,
};

let grid: number[][];
let nextGrid: number[][];

function setup(): void {
  grid = create2DArray<number>(gridSize.width, gridSize.height, 0);
  createCanvas(screenSize.width, screenSize.height);
}

function create2DArray<T>(rows: number, cols: number, initialValue: T): T[][] {
  let arr = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push(initialValue);
    }
    arr.push(row);
  }
  return arr;
}

function mouseDragged(): void {
  let i = floor(mouseX / cellSize);
  let j = floor(mouseY / cellSize);

  if (i >= 0 && j >= 0 && j < gridSize.height && i < gridSize.width) {
    grid[i + 1][j] = 1;
    let rand = random(1);
    if (i + 1 >= 0 && i + 1 < gridSize.height) {
      if (rand > 0.36) {
        grid[i + 1][j] = 1;
      }
    }
  }
}

function draw(): void {
  background(0);
  nextGrid = create2DArray<number>(gridSize.width, gridSize.height, 0);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      stroke(255);
      fill(grid[i][j] * 255);
      let x = i * cellSize;
      let y = j * cellSize;
      square(x, y, cellSize);
      step(i, j);
    }
  }

  grid = nextGrid;
}

function step(i: number, j: number): void {
  const state = grid[i][j];
  const isSand = state === 1;
  if (isSand) {
    processSand(i, j);
  }
}

function processSand(i: number, j: number): void {
  const airBelow = grid[i][j + 1] === 0;
  const airBottomLeft = grid[i - 1] ? grid[i - 1][j + 1] === 0 : false;
  const airBottomRight = grid[i + 1] ? grid[i + 1][j + 1] === 0 : false;
  const isOnFloor = j === gridSize.width - 1;
  if (airBelow && !isOnFloor) {
    // fall directly down.
    nextGrid[i][j + 1] = 1;
  } else if (airBottomRight || airBottomLeft) {
    // slide on side of hill.
    handleSliding(i, j, airBottomRight, airBottomLeft);
  } else {
    // on ground, so stay as sand at current position.
    nextGrid[i][j] = 1;
  }
}

function handleSliding(i: number, j: number, airBottomRight: boolean, airBottomLeft: boolean): void {
  if (airBottomRight && !airBottomLeft) {
    nextGrid[i + 1][j + 1] = 1;
  } else if (airBottomLeft && !airBottomRight) {
    nextGrid[i - 1][j + 1] = 1;
  } else {
    const dir = random(1) > 0.5 ? 1 : -1;
    nextGrid[i + dir][j + 1] = 1;
  }
}