from
async function aStar(grid, start, end) {
    disableUI();
    let openSet = [start];
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    gScore[start.row + ',' + start.col] = 0;
    fScore[start.row + ',' + start.col] = heuristic(start, end);

    while (openSet.length > 0) {
        let current = openSet.reduce(function (acc, node) {
            return fScore[acc.row + ',' + acc.col] < fScore[node.row + ',' + node.col] ? acc : node;
        });

        if (current.row === end.row && current.col === end.col) {
            let totalPath = [end];
            let currentNode = end;

            while (currentNode.row !== start.row || currentNode.col !== start.col) {
                currentNode = cameFrom[currentNode.row + ',' + currentNode.col];
                totalPath.unshift(currentNode);
            }
            return totalPath;
        }

        openSet = openSet.filter(function (node) {
            return node.row !== current.row || node.col !== current.col;
        });

        let neighbors = getNeighbors(grid, current);

        for (let i = 0; i < neighbors.length; i++) {

            let neighbor = neighbors[i];

            if ((neighbor.row !== startCell.row || neighbor.col !== startCell.col) && (neighbor.row !== endCell.row || neighbor.col !== endCell.col)) {
                ctx.fillStyle = '#562b19';
                ctx.fillRect(neighbor.col * cellSize, neighbor.row * cellSize, cellSize, cellSize);
                ctx.strokeStyle = '#7c7b7b'; // Цвет обводки
                ctx.strokeRect(neighbor.col * cellSize, neighbor.row * cellSize, cellSize, cellSize); // Добавляем обводку
                await sleep(10 / parseInt(speedValue.value) * 100);
            }

            let tentativeGScore = gScore[current.row + ',' + current.col] + 1;

            if (!gScore[neighbor.row + ',' + neighbor.col] || tentativeGScore < gScore[neighbor.row + ',' + neighbor.col]) {
                cameFrom[neighbor.row + ',' + neighbor.col] = current;
                gScore[neighbor.row + ',' + neighbor.col] = tentativeGScore;
                fScore[neighbor.row + ',' + neighbor.col] = gScore[neighbor.row + ',' + neighbor.col] + heuristic(neighbor, end);

                if (!openSet.some(function (node) {
                    return node.row === neighbor.row && node.col === neighbor.col;
                }))
                    openSet.push(neighbor);
            }
        }
    }
    enableUI();
    return [];
}

function heuristic(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function getNeighbors(grid, node) {
    let neighbors = [];
    if (node.row > 0 && grid[node.row - 1][node.col] !== 1) {
        neighbors.push({row: node.row - 1, col: node.col});
    }
    if (node.row < grid.length - 1 && grid[node.row + 1][node.col] !== 1) {
        neighbors.push({row: node.row + 1, col: node.col});
    }
    if (node.col > 0 && grid[node.row][node.col - 1] !== 1) {
        neighbors.push({row: node.row, col: node.col - 1});
    }
    if (node.col < grid[node.row].length - 1 && grid[node.row][node.col + 1] !== 1) {
        neighbors.push({row: node.row, col: node.col + 1});
    }
    return neighbors;
}