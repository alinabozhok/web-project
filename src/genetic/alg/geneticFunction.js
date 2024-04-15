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
        let breakPoint = Math.floor(Math.random() * (firstParent.length - 2)) + 1;

        for(let k = 0; k < breakPoint; k++) {
            newChild.push(firstParent[k]);
            usedGens.push(firstParent[k].id);
        }
        for(let d = breakPoint; d < secondParent.length; d++) {
            if (!usedGens.includes(secondParent[d].id)) {
                newChild.push(secondParent[d]);
                usedGens.push(secondParent[d].id);
            }
        }
        if(newChild.length !== firstParent.length) {
            for(let f = breakPoint; f < firstParent.length; f++) {
                if (!usedGens.includes(firstParent[f].id)) {
                    newChild.push(firstParent[f]);
                    usedGens.push(firstParent[f].id);
                }
            }
        }
        newChild = mutation(newChild);
        population.push({path: newChild, lengthPath: pathCalculation(newChild)});
    }

    return population;
}

export function populationSort(population) {
    population.sort((a, b) => a.lengthPath - b.lengthPath);
    return population;
}

export async function geneticFunction(points, callback) {
    const populationSize = inputPopulation.value;
    let population = populationGeneration(points);
    for(let i = 0; i < 2000; i++) {
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

