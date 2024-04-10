import * as equal from "fast-deep-equal"

const inputPopulation = document.getElementsByClassName('countPopulation');
const populationSize = inputPopulation.value;

const inputPercentageMutation = document.getElementsByClassName('mutationPercentage');
const percentageMutation = inputPercentageMutation.value;

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

    if(pathCalculation(newChild) < percentageMutation) {
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
    console.log(population);
    for(let i = 0; i < population.length - 1; i++) {
        let firstParent = [...(population[i]).path];
        let secondParent = [...(population[i + 1]).path];

        let usedGens = [];
        let newChild = [];
        let breakPoint = Math.floor(Math.random() * (firstParent.length - 3)) + 1;

        for(let k = 0; k < breakPoint; k++) {
            let copy = {x: firstParent[k].x, y: firstParent[k].y};
            newChild.push(firstParent[k]);
            usedGens.push(firstParent[k]);
        }
        for(let d = 2; d < secondParent.length; d++) {
            if (!usedGens.includes(secondParent[d])) {
                newChild.push(secondParent[d]);
                usedGens.push(secondParent[d]);
            }
        }
        for(let f = breakPoint; f < firstParent.length; f++) {
            if (newChild.length !== firstParent.length) {
                if (!usedGens.includes(firstParent[f])) {
                    newChild.push(firstParent[f]);
                    usedGens.push(firstParent[f]);
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
    let population = populationGeneration(points);
    for(let i = 0; i < 2000; i++) {
        population = [...childrenGeneration2([...population])];
        population = populationSort([...population]);
        while(population.length > populationSize) {
            population.pop();
        }
        if(i === populationSize - 1) callback(population[0])
        else callback(population[points.length - 2]);
    }
    return population;
}

