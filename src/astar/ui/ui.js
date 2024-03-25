document.addEventListener('DOMContentLoaded', function() {
    let sizeInput = document.getElementById('grid-size');
    let canvas = document.getElementById('grid-canvas');
    let ctx = canvas.getContext('2d');
    let startCell = null;
    let endCell = null;
    let isShiftPressed = false;
    let cellSize = null;
    let grid = [];

    function generateGrid() {
        let size = parseInt(sizeInput.value);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        startCell = null;
        endCell = null;

        canvas.width = 600;
        canvas.height = 600;

        cellSize = 600 / size;

        ctx.beginPath();
        ctx.lineWidth = 2;
        for (let i = 0; i <= size; i++) {
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, 600);
            ctx.stroke();
            ctx.strokeStyle = 'white';

            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(600, i * cellSize);
            ctx.stroke();
            ctx.strokeStyle = 'white';
        }

        grid = Array(size).fill(null).map(() => Array(size).fill(0));
    }

    generateGrid();

    sizeInput.addEventListener('input', function() {
        generateGrid();
    });

    window.addEventListener('keydown', function(event) {
        if (event.key === 'Shift') {
            isShiftPressed = true;
        }
    });

    window.addEventListener('keyup', function(event) {
        if (event.key === 'Shift') {
            isShiftPressed = false;
        }
    });

    let isMouseDown = false;
    let isMouseHold = false;
    let wallPlacementDelay = 100;
    let lastWallPlacementTime = 0;

    canvas.addEventListener('mousedown', function(event) {
        isMouseDown = true;
        handleMouseDown(event);
    });

    canvas.addEventListener('mouseup', function(event) {
        isMouseDown = false;
        isMouseHold = false;
    });

    canvas.addEventListener('mousemove', function(event) {
        if (isMouseDown) {
            if (!isMouseHold) {
                let currentTime = new Date().getTime();
                if (currentTime - lastWallPlacementTime > wallPlacementDelay) {
                    handleMouseDown(event);
                    lastWallPlacementTime = currentTime;
                    isMouseHold = true;
                }
            }
            else {
                handleMouseDown(event);
            }
        }
    });

    function handleMouseDown(event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let row = Math.floor(y / cellSize);
        let col = Math.floor(x / cellSize);

        if (isShiftPressed) {
            if (!startCell) {
                startCell = { row: row, col: col };
                grid[row][col] = 2;
                drawGrid();
            }
            else if (!endCell && !((row === startCell.row && col === startCell.col))) {
                endCell = { row: row, col: col };
                grid[row][col] = 3;
                drawGrid();
            }
        }
        else {
            if (!((row === startCell.row && col === startCell.col) || (row === endCell.row && col === endCell.col))) {
                if (grid[row][col] === 1) {
                    grid[row][col] = 0;
                }
                else {
                    grid[row][col] = 1;
                }
                drawGrid();
            }
        }
    }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === 1) {
                    ctx.fillStyle = 'black';
                }
                else if (grid[i][j] === 2) {
                    ctx.fillStyle = 'green';
                }
                else if (grid[i][j] === 3) {
                    ctx.fillStyle = 'red';
                }
                else {
                    ctx.fillStyle = '#f0f0f0';
                }
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                ctx.strokeStyle = 'white';
                ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }

    document.getElementById('run-button').addEventListener('click', function() {
        if (startCell && endCell) {
            if (!aStar(grid, startCell, endCell)) {
                alert("Путь не найден.");
            }
        }
    });


    function aStar(grid, start, end) {
        let openSet = [start];
        let cameFrom = {};
        let gScore = {};
        let fScore = {};

        gScore[start.row + ',' + start.col] = 0;
        fScore[start.row + ',' + start.col] = heuristic(start, end);

        while (openSet.length > 0) {
            let current = openSet.reduce(function(acc, node) {
                return fScore[acc.row + ',' + acc.col] < fScore[node.row + ',' + node.col] ? acc : node;
            });

            if (current.row === end.row && current.col === end.col) {
                let totalPath = [end];
                let currentNode = end;
                while (currentNode.row !== start.row || currentNode.col !== start.col) {
                    currentNode = cameFrom[currentNode.row + ',' + currentNode.col];
                    totalPath.unshift(currentNode);
                }
                drawPath(totalPath);
                return true;
            }

            openSet = openSet.filter(function(node) {
                return node.row !== current.row || node.col !== current.col;
            });

            let neighbors = getNeighbors(grid, current);
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                let tentativeGScore = gScore[current.row + ',' + current.col] + 1;
                if (!gScore[neighbor.row + ',' + neighbor.col] || tentativeGScore < gScore[neighbor.row + ',' + neighbor.col]) {
                    cameFrom[neighbor.row + ',' + neighbor.col] = current;
                    gScore[neighbor.row + ',' + neighbor.col] = tentativeGScore;
                    fScore[neighbor.row + ',' + neighbor.col] = gScore[neighbor.row + ',' + neighbor.col] + heuristic(neighbor, end);
                    if (!openSet.some(function(node) {
                        return node.row === neighbor.row && node.col === neighbor.col;
                    })) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        return false;
    }


    function heuristic(a, b) {
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }

    function getNeighbors(grid, node) {
        let neighbors = [];
        if (node.row > 0 && grid[node.row - 1][node.col] !== 1) {
            neighbors.push({ row: node.row - 1, col: node.col });
        }
        if (node.row < grid.length - 1 && grid[node.row + 1][node.col] !== 1) {
            neighbors.push({ row: node.row + 1, col: node.col });
        }
        if (node.col > 0 && grid[node.row][node.col - 1] !== 1) {
            neighbors.push({ row: node.row, col: node.col - 1 });
        }
        if (node.col < grid[node.row].length - 1 && grid[node.row][node.col + 1] !== 1) {
            neighbors.push({ row: node.row, col: node.col + 1 });
        }
        return neighbors;
    }

    function drawPath(path) {
        let i = 1;
        let interval = setInterval(function() {
            if (i >= path.length - 1) {
                clearInterval(interval);
                return;
            }
            let cell = path[i];
            ctx.fillStyle = 'blue';
            ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
            i++;
        }, 50);
    }


    document.getElementById('set-new-cells').addEventListener('click', function() {
        setNewCells();
    });

    function setNewCells() {
        if (startCell) {
            grid[startCell.row][startCell.col] = 0;
        }
        if (endCell) {
            grid[endCell.row][endCell.col] = 0;
        }
        startCell = null;
        endCell = null;
        drawGrid();
    }

    document.getElementById('clear-board').addEventListener('click', function() {
        clearBoard();
    });

    function clearBoard() {

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                grid[i][j] = 0
            }
        }
        startCell = null;
        endCell = null;
        drawGrid();
    }



    document.getElementById('generate-maze-button').addEventListener('click', function() {
        generateMaze();
    });

    function generateMaze() {
        startCell = null;
        endCell = null;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] !== 2 && grid[i][j] !== 3) {
                    grid[i][j] = 1;
                }
            }
        }

        animateRecursiveDivision(0, 0, grid.length - 1, grid[0].length - 1, drawGrid, 100);
    }

    function animateRecursiveDivision(startRow, startCol, endRow, endCol, drawFunction, delay) {
        if (endRow - startRow < 2 || endCol - startCol < 2) {
            drawFunction();
            return;
        }

        let vertical = Math.random() < 0.5;

        let passageRow = Math.floor(Math.random() * (endRow - startRow - 1)) + startRow + 1;
        let passageCol = Math.floor(Math.random() * (endCol - startCol - 1)) + startCol + 1;

        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                if ((vertical && j === passageCol) || (!vertical && i === passageRow)) {
                    grid[i][j] = 0;
                }
                else {
                    grid[i][j] = 1;
                }
            }
        }

        drawFunction();

        if (vertical) {
            setTimeout(() => {
                animateRecursiveDivision(startRow, startCol, endRow, passageCol - 1, drawFunction, delay);
                animateRecursiveDivision(startRow, passageCol + 1, endRow, endCol, drawFunction, delay);
            }, delay);
        }
        else {
            setTimeout(() => {
                animateRecursiveDivision(startRow, startCol, passageRow - 1, endCol, drawFunction, delay);
                animateRecursiveDivision(passageRow + 1, startCol, endRow, endCol, drawFunction, delay);
            }, delay);
        }
    }

});