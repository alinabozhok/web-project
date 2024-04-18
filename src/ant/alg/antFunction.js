const alpha = 2;
const beta = 25;
const constForPath = 2000;
const constForPheromones = 700;
const evaporation = 0.8;
const inputCountAnts = document.querySelector('#countAnts');

export function creationPathMatrix(points) {
    let pathMatrix = [];
    for(let i = 0; i < points.length; i++) {
        pathMatrix[i] = [];
        for(let j = 0; j < points.length; j++) {
            let lengthPath = Math.round(Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y));
            if(lengthPath !== 0){
                let closeness = constForPath/lengthPath;
                pathMatrix[i][j] = {lengthPath: lengthPath, pheromones: 0.4, closeness: closeness};
            }
            else pathMatrix[i][j] = 0;
        }
    }
    return pathMatrix;
}


export function probabilityCalculation(path, visited) {
    let wishArray = [];
    let probability = [];
    for(let i = 0; i < path.length; i++) {
        if(path[i] !== 0 && !visited.includes(i)) {
            wishArray[i] = Math.pow(path[i].pheromones, alpha) * Math.pow(path[i].closeness, beta);
        }
        else wishArray[i] = 0;
    }
    let sumWish = wishArray.reduce(function (currentSum, currentNumber) {
        return currentSum + currentNumber}, 0);
    for(let i = 0; i < wishArray.length; i++) {
        if(sumWish !== 0) {
            probability[i] = wishArray[i]/sumWish;
        }
        else probability[i] = 0;
    }
    return probability;
}

export function vertexSelection(probability, visited) {
    let range = [];
    let count = 0;
    for(let i = 0; i < probability.length; i++) {
        if(!visited.includes(i)){
            count = Math.round(probability[i]*1000);
            for(let j = 0; j < count; j++) {
                range.push(i);
            }
        }
    }
    let randomNumber = Math.round((Math.floor(Math.random() * range.length)));
    return range[randomNumber];
}
export function antsRun(points, pathMatrix) {
    let pathAnts = [];
    for(let i = 0; i < points.length; i++) {
        let visited = [];
        visited.push(i);
        let currentPath = probabilityCalculation(pathMatrix[i], visited);
        while(visited.length < points.length) {
            let vertex = vertexSelection(currentPath, visited);
            if(!visited.includes(vertex)){
                visited.push(vertex);
                if(visited.length < points.length) {
                    currentPath = probabilityCalculation(pathMatrix[vertex], visited);
                }
            }
        }
        visited.push(i);
        redistributionOfPheromones(visited, pathMatrix); // сделать обновление после одной итерации
        pathAnts.push({visited: visited, visitedLength: pathCalculation(visited, points)});

    }
    return pathAnts;
}

function redistributionOfPheromones(visited, pathMatrix) {
    for(let i = 0; i < visited.length - 1; i++) {
        pathMatrix[visited[i]][visited[i+1]].pheromones
            = pathMatrix[visited[i]][visited[i+1]].pheromones * evaporation + constForPheromones
                /pathMatrix[visited[i]][visited[i+1]].lengthPath;
    }
}

function pathSort(pathAnts) {
    pathAnts.sort((a, b) => a.visitedLength - b.visitedLength);
    return pathAnts;
}
function pathCalculation(path, points) {
    let length = 0;
    for(let i = 0; i < path.length - 1; i++) {
        length += Math.round(Math.hypot(points[path[i]].x - points[path[i + 1]].x, points[path[i]].y - points[path[i + 1]].y));
    }
    return length;
}
export function antFunction(points) {
    const countAnts = inputCountAnts.value;
    let k = 0;
    let shortPath = 100000000000;
    let answerPath = [];
    let pathMatrix = creationPathMatrix(points);
    for(let i = 0; i < countAnts; i++) {
        let pathAnts = antsRun(points, pathMatrix);
        pathAnts = pathSort([...pathAnts]);
        if(pathAnts[0].visitedLength < shortPath || pathAnts[0].visitedLength === shortPath) {
            shortPath = pathAnts[0].visitedLength;
            answerPath = pathAnts[0].visited;
        }
    }
    return answerPath;
}