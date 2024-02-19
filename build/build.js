var screenSize = { width: 800, height: 400 };
var cellSize = 10;
var gridSize = {
    width: screenSize.width / cellSize,
    height: screenSize.height / cellSize,
};
var grid;
var nextGrid;
function setup() {
    grid = create2DArray(gridSize.width, gridSize.height, 0);
    createCanvas(screenSize.width, screenSize.height);
}
function create2DArray(rows, cols, initialValue) {
    var arr = [];
    for (var i = 0; i < rows; i++) {
        var row = [];
        for (var j = 0; j < cols; j++) {
            row.push(initialValue);
        }
        arr.push(row);
    }
    return arr;
}
function mouseDragged() {
    var i = floor(mouseX / cellSize);
    var j = floor(mouseY / cellSize);
    if (i >= 0 && j >= 0 && j < gridSize.height && i < gridSize.width) {
        grid[i + 1][j] = 1;
        var rand = random(1);
        if (i + 1 >= 0 && i + 1 < gridSize.height) {
            if (rand > 0.36) {
                grid[i + 1][j] = 1;
            }
        }
    }
}
function draw() {
    background(0);
    nextGrid = create2DArray(gridSize.width, gridSize.height, 0);
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            stroke(255);
            fill(grid[i][j] * 255);
            var x = i * cellSize;
            var y = j * cellSize;
            square(x, y, cellSize);
            step(i, j);
        }
    }
    grid = nextGrid;
}
function step(i, j) {
    var state = grid[i][j];
    var isSand = state === 1;
    if (isSand) {
        processSand(i, j);
    }
}
function processSand(i, j) {
    var airBelow = grid[i][j + 1] === 0;
    var airBottomLeft = grid[i - 1] ? grid[i - 1][j + 1] === 0 : false;
    var airBottomRight = grid[i + 1] ? grid[i + 1][j + 1] === 0 : false;
    var isOnFloor = j === gridSize.width - 1;
    if (airBelow && !isOnFloor) {
        nextGrid[i][j + 1] = 1;
    }
    else if (airBottomRight || airBottomLeft) {
        handleSliding(i, j, airBottomRight, airBottomLeft);
    }
    else {
        nextGrid[i][j] = 1;
    }
}
function handleSliding(i, j, airBottomRight, airBottomLeft) {
    if (airBottomRight && !airBottomLeft) {
        nextGrid[i + 1][j + 1] = 1;
    }
    else if (airBottomLeft && !airBottomRight) {
        nextGrid[i - 1][j + 1] = 1;
    }
    else {
        var dir = random(1) > 0.5 ? 1 : -1;
        nextGrid[i + dir][j + 1] = 1;
    }
}
//# sourceMappingURL=build.js.map