document.addEventListener('DOMContentLoaded', function () {
    // Инициализация переменных
    let sizeInput = document.getElementById('grid-size');
    let speedValue = document.getElementById('animation-speed')
    let canvas = document.getElementById('grid-canvas');
    let ctx = canvas.getContext('2d');

    let startCell = null;
    let endCell = null;

    let cellSize = null;

    let grid = [];

    let isShiftPressed = false;

    // Функция для генерации сетки
    function generateGrid() {
        let size = parseInt(sizeInput.value);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        startCell = null;
        endCell = null;

        canvas.width = 800;
        canvas.height = 800;

        cellSize = 800 / size;

        ctx.beginPath();
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                ctx.lineWidth = 25 / parseInt(sizeInput.value);
                ctx.strokeStyle = '#7c7b7b';
                ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }

        // Представление grid как двумерный массив, заполненный нулями
        grid = Array(size).fill(null).map(() => Array(size).fill(0));
    }

    // При загрузке страницы сразу будет отрисовываться сетка
    generateGrid();

    // При изменении размеров сетки она будет сразу перерисовываться
    sizeInput.addEventListener('input', function () {
        generateGrid();
    });

    // Вспомогательные функции для отслеживания зажатия SHIFT
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Shift') {
            isShiftPressed = true;
        }
    });

    window.addEventListener('keyup', function (event) {
        if (event.key === 'Shift') {
            isShiftPressed = false;
        }
    });


    // При нажатии на левую кнопку мыши - ставится стена, при зажатии на SHIFT - ставится старт и финиш
    canvas.addEventListener('click', function (event) {
        updateGrid(event);
    });

    // Вспомогательная функция для обновления только измененных ячеек
    function updateCell(row, col) {
        if (grid[row][col] === 1) {
            ctx.fillStyle = '#262626';
        } else if (grid[row][col] === 2) {
            ctx.fillStyle = '#05c905';
        } else if (grid[row][col] === 3) {
            ctx.fillStyle = '#f62424';
        } else {
            ctx.fillStyle = '#e7e9e9';
        }
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        ctx.lineWidth = 25 / parseInt(sizeInput.value);
        ctx.strokeStyle = '#7c7b7b';
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }

    // Обновление состояния сетки при клике
    function updateGrid(event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let row = Math.floor(y / cellSize);
        let col = Math.floor(x / cellSize);

        if (isShiftPressed) {
            if (!startCell) {
                startCell = {row: row, col: col};
                grid[row][col] = 2;
                updateCell(row, col);
            }
            else if (!endCell && !((row === startCell.row && col === startCell.col))) {
                endCell = {row: row, col: col};
                grid[row][col] = 3;
                updateCell(row, col);
            }
        }
        else {
            if (!startCell || !endCell) {
                alert("Выберите старт/финиш перед тем, как расставлять стены.")
            }
            else if (startCell && endCell) {
                if (!((row === startCell.row && col === startCell.col) || (row === endCell.row && col === endCell.col))) {
                    if (grid[row][col] === 1) {
                        grid[row][col] = 0;
                    } else {
                        grid[row][col] = 1;
                    }
                    updateCell(row, col);
                }
            }
        }
    }

    // Запуск алгоритма
    document.getElementById('run-button').addEventListener('click', async function () {
        for (let i = 0; i < parseInt(sizeInput.value); i++) {
            for (let j = 0; j < parseInt(sizeInput.value); j++) {
                if (grid[i][j] !== 1 && grid[i][j] !== 2 && grid[i][j] !== 3) {
                    updateCell(i,j);
                }
            }
        }
        if (startCell && endCell) {
            let totalPath = await aStar(grid, startCell, endCell);
            if (totalPath.length === 0) {
                alert("Путь не найден.");
            }

            else {
                drawPath(totalPath);
            }
        }
        else {
            alert("Выберите старт и финиш.")
        }
    });


    // A* алгоритм
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

    // Функция для отрисовки найденного пути
    function drawPath(path) {
        let i = 1;
        let interval = setInterval(function () {
            if (i >= path.length - 1) {
                clearInterval(interval);
                enableUI();
                return;
            }
            let cell = path[i];
            ctx.fillStyle = '#c98345';
            ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
            i++;
        }, 20 / parseInt(speedValue.value) * 100);
    }

    function sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }


    // Выбор нового старта/финиша
    document.getElementById('set-new-cells').addEventListener('click', function () {
        setNewCells();
    });

    function setNewCells() {
        if (startCell) {
            grid[startCell.row][startCell.col] = 0;
            updateCell(startCell.row, startCell.col);
        }
        if (endCell) {
            grid[endCell.row][endCell.col] = 0;
            updateCell(endCell.row, endCell.col);
        }
        startCell = null;
        endCell = null;

        for (let i = 0; i < parseInt(sizeInput.value); i++) {
            for (let j = 0; j < parseInt(sizeInput.value); j++) {
                if (grid[i][j] !== 1) {
                    updateCell(i, j);
                }
            }
        }
    }

    document.getElementById('clear-board').addEventListener('click', function () {
        clearBoard();
    });

    function clearBoard() {

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                grid[i][j] = 0
                updateCell(i, j);
            }
        }
        startCell = null;
        endCell = null;
    }


    document.getElementById('generate-maze-button').addEventListener('click', async function () {
        generateMaze();
    });


    class Coordinates {
        x = null;
        y = null;

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    // Очистить клетку
    function clearCell(x, y) {
        grid[x][y] = 0;
        updateCell(x,y);
    }

    // Проверка на пустоту
    function isEmpty(x, y) {
        return grid[x][y] === 0;
    }

    // Генерация лабиринта
    async function generateMaze() {
        disableUI();

        let size = parseInt(sizeInput.value);


        // Инициализация массива лабиринта
        let map = new Array(size);
        for (let i = 0; i < size; i++) {
            map[i] = new Array(size);
        }


        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                grid[i][j] = 1;
                updateCell(i,j);
            }
        }

            // Выбор случайной ячейки для начала генерации
            let cell = new Coordinates(Math.floor((Math.random() * (size / 2))) * 2, Math.floor((Math.random() * (size / 2))) * 2);
            clearCell(cell.x, cell.y);

            // Массив задействованных ячеек
            let isUsed = new Array(size);
            for (let i = 0; i < size; i++) {
                isUsed[i] = new Array(size);
                for (let j = 0; j < size; j++) {
                    isUsed[i][j] = false;
                }
            }
            isUsed[cell.x][cell.y] = true;

            // Создание массива и добавление туда точек лабиринта находящиеся в двух клетках от выбранных координат
            let nextCells = new Array;
            if (cell.y - 2 >= 0) {
                nextCells.push(new Coordinates(cell.x, cell.y - 2));
                isUsed[cell.x][cell.y - 2] = true;
            }
            if (cell.y + 2 < size) {
                nextCells.push(new Coordinates(cell.x, cell.y + 2));
                isUsed[cell.x][cell.y + 2] = true;
            }
            if (cell.x - 2 >= 0) {
                nextCells.push(new Coordinates(cell.x - 2, cell.y));
                isUsed[cell.x - 2][cell.y] = true;
            }
            if (cell.x + 2 < size) {
                nextCells.push(new Coordinates(cell.x + 2, cell.y));
                isUsed[cell.x + 2][cell.y] = true;
            }

            let count = 0;

            // Пока есть элементы в массиве, выбрать случайный индекс и убрать стену
            while (nextCells.length > 0) {
                let index = Math.floor(Math.random() * nextCells.length);
                let x = nextCells[index].x;
                let y = nextCells[index].y;
                clearCell(x, y);


                nextCells.splice(index, 1);


                // Убрать случайную стену, которая находится между клеткой и ее родителем
                let directions = ["NORTH", "SOUTH", "EAST", "WEST"];
                let flag = false;
                
                while (directions.length > 0 && !flag) {

                    let directionIndex = Math.floor(Math.random() * directions.length);
                    
                    switch (directions[directionIndex]) {
                        
                        case "NORTH":
                            if (y - 2 >= 0 && isEmpty(x, y - 2)) {
                                clearCell(x, y - 1);
                                flag = true;
                            }
                            break;
                            
                        case "SOUTH":
                            if (y + 2 < size && isEmpty(x, y + 2)) {
                                clearCell(x, y + 1);
                                flag = true;
                            }
                            break;
                            
                        case "EAST":
                            if (x - 2 >= 0 && isEmpty(x - 2, y)) {
                                clearCell(x - 1, y);
                                flag = true;
                            }
                            break;
                            
                        case "WEST":
                            if (x + 2 < size && isEmpty(x + 2, y)) {
                                clearCell(x + 1, y);
                                flag = true;
                            }
                            break;
                    }

                    directions.splice(directionIndex, 1);
                }
                
                if (y - 2 >= 0 && !isEmpty(x, y - 2) && !isUsed[x][y - 2]) {
                    nextCells.push(new Coordinates(x, y - 2));
                    isUsed[x][y - 2] = true;
                }
                if (y + 2 < size && !isEmpty(x, y + 2) && !isUsed[x][y + 2]) {
                    nextCells.push(new Coordinates(x, y + 2));
                    isUsed[x][y + 2] = true;
                }
                if (x - 2 >= 0 && !isEmpty(x - 2, y) && !isUsed[x - 2][y]) {
                    nextCells.push(new Coordinates(x - 2, y));
                    isUsed[x - 2][y] = true;
                }
                if (x + 2 < size && !isEmpty(x + 2, y) && !isUsed[x + 2][y]) {
                    nextCells.push(new Coordinates(x + 2, y));
                    isUsed[x + 2][y] = true;
                }

                if (count >= Math.floor(size / 10)) {
                    await sleep(50 / parseInt(speedValue.value) * 100);
                    count = 0;
                }
                count++;
            }

            // Для четных лабиринтов
            if (parseInt(sizeInput.value) % 2 === 0) {
                for (let i = 0; i < parseInt(sizeInput.value); i++) {
                    if (i === 0) {
                        grid[i][parseInt(sizeInput.value) - 1] = 0;
                        updateCell(i, parseInt(sizeInput.value) - 1);
                    }
                    else if (i === parseInt(sizeInput.value) - 1) {
                        grid[i][parseInt(sizeInput.value) - 1] = 0;
                        grid[i - 1][parseInt(sizeInput.value) - 1] = 0;
                        updateCell(i-1, parseInt(sizeInput.value) - 1);
                    }
                    else {
                        if (grid[i][parseInt(sizeInput.value) - 2] === 0 && (grid[i - 1][parseInt(sizeInput.value) - 2] === 1 || grid[i + 1][parseInt(sizeInput.value) - 2] === 1)) {
                            grid[i][parseInt(sizeInput.value) - 1] = 0;
                            updateCell(i, parseInt(sizeInput.value) - 1);
                        }
                    }

                    await sleep(5);

                }

                for (let i = 0; i < parseInt(sizeInput.value); i++) {
                    if (i === 0) {
                        grid[parseInt(sizeInput.value) - 1][i] = 0;
                        updateCell(parseInt(sizeInput.value) - 1, i);
                    }
                    else {
                        if (i < parseInt(sizeInput.value) - 3 && grid[parseInt(sizeInput.value) - 2][i] === 0 && (grid[parseInt(sizeInput.value) - 2][i - 1] === 1 || grid[parseInt(sizeInput.value) - 2][i + 1] === 1)) {
                            grid[parseInt(sizeInput.value) - 1][i] = 0;
                            updateCell(parseInt(sizeInput.value) - 1, i);
                        }
                    }

                    await sleep(5);
                }
            }

            // Обнулить значение старта и финиша
            startCell = null;
            endCell = null;
            enableUI();
        }

    // Функция для выключения UI
    function disableUI() {
        let interactiveElements = document.querySelectorAll('button, #grid-size');

        interactiveElements.forEach(function(element) {
            element.disabled = true;
            element.classList.add('disabled');
        });
    }

// Функция для включения UI
    function enableUI() {
        let interactiveElements = document.querySelectorAll('button, #grid-size');

        interactiveElements.forEach(function(element) {
            element.disabled = false;
            element.classList.remove('disabled');
        });
    }
});

