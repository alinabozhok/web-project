//import * as equal from "fast-deep-equal"

const inputPopulation = document.querySelector('#countPopulation');
const inputPercentageMutation = document.querySelector('#mutationPercentage');


export function pathGeneration(points) {
    let randomPath = [...points];
    for(let i = 0; i < points.length; i++) {
        let j = Math.floor(Math.random() * (points.length - 1));
        [randomPath[i], randomPath[j]] = [randomPath[j], randomPath[i]];
    }
    return randomPath;
}

export function pathCalculation(path) {
    let lengthPath = 0;
    for(let i = 0, j = 1; j < path.length; i++, j++) {
        let hypot = Math.round(Math.hypot(path[i].x - path[j].x, path[i].y - path[j].y));
        lengthPath += hypot;
    }
    lengthPath += Math.round(Math.hypot(path[0].x - path[path.length - 1].x, path[0].y - path[path.length - 1].y));
    return lengthPath;
}

export function populationGeneration(points) {
    const populationSize = inputPopulation.value;
    let population = [];
    for(let i = 0; i < populationSize; i++) {
        let path = pathGeneration(points);
        let lengthPath = pathCalculation(path);
        population.push({path: path, lengthPath: lengthPath});
    }
    return population;
}

export function mutation(child){
    let newChild = [...child];
    const percentageMutation = inputPercentageMutation.value;
    let mutationChild = Math.floor(Math.random() * 100);
    if(mutationChild < percentageMutation) {
        let i = Math.floor(Math.random() * newChild.length);
        let j = i;
        while (i === j) {
            j = Math.floor(Math.random() * newChild.length);
        }
        [newChild[i],newChild[j]] = [newChild[j],newChild[i]];
    }
    return newChild;
}

export function childrenGeneration2(population) {
    const populationSize = inputPopulation.value;
    for(let i = 0; i < populationSize - 1; i++) {
        let firstParent = [...(population[i]).path];
        let secondParent = [...(population[i + 1]).path];

        let usedGens = [];
        let newChild = [];
        let breakPoint = Math.floor(Math.random() * (firstParent.length - 3)) + 1;

        for(let k = 0; k < breakPoint; k++) {
            let copy = {x: firstParent[k].x, y: firstParent[k].y};
            newChild.push(copy);
            usedGens.push(firstParent[k].x);
            usedGens.push(firstParent[k].y);
        }
        for(let d = 2; d < secondParent.length; d++) {
            if (!usedGens.includes(secondParent[d].x) && !usedGens.includes(secondParent[d].y)) {
                let copy = {x: secondParent[d].x, y: secondParent[d].y};
                newChild.push(copy);
                usedGens.push(secondParent[d].x);
                usedGens.push(secondParent[d].y);
            }
        }
        for(let f = breakPoint; f < firstParent.length; f++) {
            if (newChild.length !== firstParent.length) {
                if (!usedGens.includes(firstParent[f].x) && !usedGens.includes(firstParent[f].y)) {
                    let copy = {x: firstParent[f].x, y: firstParent[f].y};
                    newChild.push(copy);
                    usedGens.push(firstParent[f].x);
                    usedGens.push(firstParent[f].y);
                }
            }
        }
        newChild = mutation(newChild);
        population.push({path: newChild, lengthPath: pathCalculation(newChild)});
    }
    return population;
}

// export function childrenGeneration(population) {
//     let i = Math.floor(Math.random() * population.length);
//     let j = i;
//     while (i === j) {
//         j = Math.floor(Math.random() * population.length);
//     }
//
//     let firstParent = [...(population[i]).path];
//     let secondParent = [...(population[j]).path];
//
//     let firstChild = [];
//
//     for(let k = 0; k < 2; k++) {
//         let copy = {x: firstParent[k].x, y: firstParent[k].y};
//         firstChild.push(copy);
//         for(let s  = 0; s < secondParent.length; s++) {
//             if(equal.default(secondParent[s], firstParent[k])) {
//                 secondParent[s] = -1;
//                 firstParent[k] = -1;
//             }
//         }
//     }
//     for(let d = 2; d < secondParent.length; d++) {
//         if (secondParent[d] !== -1) {
//             let copy = {x: secondParent[d].x, y: secondParent[d].y};
//             firstChild.push(copy);
//             for(let s  = 0; s < firstParent.length; s++) {
//                 if(equal.default(secondParent[d], firstParent[s])) {
//                     secondParent[d] = -1;
//                     firstParent[s] = -1;
//                 }
//             }
//         }
//     }
//
//     for(let f = 2; f < firstParent.length; f++) {
//         if (firstChild.length !== firstParent.length) {
//             if (firstParent[f] !== -1) {
//                 let copy = {x: firstParent[f].x, y: firstParent[f].y};
//                 firstChild.push(copy);
//                 firstParent[f] = -1;
//                 for(let s  = 0; s < secondParent.length; s++) {
//                     if(equal.default(secondParent[s], firstParent[f])) {
//                         secondParent[s] = -1;
//                         firstParent[f] = -1;
//                     }
//                 }
//             }
//         }
//     }
//     firstChild = mutation(firstChild);
//
//     population.push({path: firstChild, lengthPath: pathCalculation(firstChild)});
//
//     return population;
// }

export function populationSort(population) {
    population.sort((a, b) => a.lengthPath - b.lengthPath);
    return population;
}

export async function geneticFunction(points, callback) {
    const populationSize = inputPopulation.value;
    let population = populationGeneration(points);
    for(let i = 0; i < 700; i++) {
        population = [...childrenGeneration2([...population])];
        population = populationSort([...population]);
        while(population.length > populationSize) {
            population.pop();
        }
        if(i === populationSize - 1) callback(population[0])
        else callback(population[population.length - 1]);
    }
    return population;
}

