// const alpha = 5;
// const beta = 5;
// const constForPath = 700;
// const constForPheromones = 700;
// const evaporation = 0.9;
// let shortPath = 100000000000;
// let answerPath = [];
// let k = 0;
//
// export function creationPathMatrix(points) {
//     let pathMatrix = [];
//     for(let i = 0; i < points.length; i++) {
//         pathMatrix[i] = [];
//         for(let j = 0; j < points.length; j++) {
//             let lengthPath = Math.round(Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y));
//             if(lengthPath !== 0){
//                 let closeness = constForPath/lengthPath;
//                 pathMatrix[i][j] = {lengthPath: lengthPath, pheromones: 0.2, closeness: closeness};
//             }
//             else pathMatrix[i][j] = 0;
//         }
//     }
//     return pathMatrix;
// }
//
//
// export function probabilityCalculation(path) {
//     let wishArray = [];
//     let probability = [];
//     for(let i = 0; i < path.length; i++) {
//         if(path[i] !== 0) {
//             wishArray[i] = Math.pow(path[i].pheromones, alpha) * Math.pow(path[i].closeness, beta);
//         }
//         else wishArray[i] = 0;
//     }
//     let sumWish = wishArray.reduce(function (currentSum, currentNumber) {
//         return currentSum + currentNumber}, 0);
//     for(let i = 0; i < wishArray.length; i++) {
//         if(sumWish !== 0) {
//             probability[i] = wishArray[i]/sumWish;
//         }
//         else probability[i] = 0;
//     }
//     return probability;
// }
//
// export function vertexSelection(probability, visited) {
//     let range = [];
//     let count = 0;
//     for(let i = 0; i < probability.length; i++) {
//         if(!visited.includes(i)){
//             count = Math.round(probability[i]*10000000)
//             for(let j = 0; j < count; j++) {
//                 range.push(i);
//             }
//         }
//     }
//     let randomNumber = Math.round(range.length*(Math.floor(Math.random() * (1))));
//     return range[randomNumber];
// }
// export function antsRun(points, pathMatrix) {
//     let pathAnts = [];
//     for(let i = 0; i < points.length; i++) {
//         let visited = [];
//         let currentPath = probabilityCalculation(pathMatrix[i]);
//         visited.push(i);
//         while(visited.length < points.length) {
//             let vertex = vertexSelection(currentPath, visited);
//             if(!visited.includes(vertex)){
//                 pathMatrix[i][vertex].pheromones = redistributionOfPheromones(pathMatrix[i][vertex]);
//                 currentPath = probabilityCalculation(pathMatrix[vertex]);
//                 visited.push(vertex);
//             }
//         }
//         pathAnts.push({visited: visited, visitedLength: pathCalculation(visited, points)});
//
//     }
//     return pathAnts;
// }
//
// function redistributionOfPheromones(element) {
//     if(element.lengthPath !== 0) {
//         return element.pheromones * evaporation + constForPheromones/element.lengthPath;
//     }
//     return 0;
// }
//
// function pathSort(pathAnts) {
//     pathAnts.sort((a, b) => a.lengthPath - b.lengthPath);
//     return pathAnts;
// }
// function pathCalculation(path, points) {
//     let length = 0;
//     for(let i = 0; i < path.length; i++) {
//         for(let j = i + 1; j < path.length; j++) {
//             length += Math.round(Math.hypot(points[path[i]].x - points[path[j]].x, points[i].y - points[j].y));
//         }
//     }
//     return length;
// }
// export function antFunction(points) {
//     let pathMatrix = creationPathMatrix(points);
//     while (k < 10) {
//         let pathAnts = antsRun(points, pathMatrix);
//         pathAnts = pathSort([...pathAnts]);
//         if(shortPath > pathAnts[0].visitedLength) {
//             shortPath = pathAnts[0].visitedLength;
//             k = 0;
//         }
//         if(shortPath === pathAnts[0].visitedLength) {
//             k+=1;
//         }
//     }
//     return answerPath;
// }