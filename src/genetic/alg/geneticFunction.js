import * as equal from "fast-deep-equal"
export function pathGeneration(points) {
    // debugger;
    let randomPath = [...points];
    for(let i = 0; i < points.length; i++) {
        let j = Math.floor(Math.random() * (points.length - 1));
        [randomPath[i], randomPath[j]] = [randomPath[j], randomPath[i]];
    }
    return randomPath;
}

export function populationCount(points) {
    //return Math.pow(points.length, Math.round(Math.sqrt(points.length)));
    return points.length*points.length*points.length;
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

export function populationGeneration(count, points) {
    let population = [];
    for(let i = 0; i < count; i++) {
        let path = pathGeneration(points);
        let lengthPath = pathCalculation(path);
        population.push({path: path, lengthPath: lengthPath});
    }
    return population;
}

export function mutation(child){
    let newChild = [...child];
    let percentMutation = Math.floor(Math.random() * 5000);
    if(pathCalculation(newChild) < percentMutation){
        let i = Math.floor(Math.random() * newChild.length);
        let j = i;
        while (i === j) {
            j = Math.floor(Math.random() * newChild.length);
        }
        [newChild[i],newChild[j]] = [newChild[j],newChild[i]];
    }
    return newChild;
}

export function childrenGeneration(population) {
    let i = Math.floor(Math.random() * population.length);
    let j = i;
    while (i === j) {
        j = Math.floor(Math.random() * population.length);
    }

    let firstParent = [...(population[i]).path];
    let secondParent = [...(population[j]).path];

    let firstChild = [];

    for(let k = 0; k < 2; k++) {
        let copy = {x: firstParent[k].x, y: firstParent[k].y};
        firstChild.push(copy);
        for(let s  = 0; s < secondParent.length; s++) {
            if(equal.default(secondParent[s], firstParent[k])) {
                secondParent[s] = -1;
                firstParent[k] = -1;
            }
        }
    }
    for(let d = 2; d < secondParent.length; d++) {
        if (secondParent[d] !== -1) {
            let copy = {x: secondParent[d].x, y: secondParent[d].y};
            firstChild.push(copy);
            for(let s  = 0; s < firstParent.length; s++) {
                if(equal.default(secondParent[d], firstParent[s])) {
                    secondParent[d] = -1;
                    firstParent[s] = -1;
                }
            }
        }
    }

    for(let f = 2; f < firstParent.length; f++) {
        if (firstChild.length !== firstParent.length) {
            if (firstParent[f] !== -1) {
                let copy = {x: firstParent[f].x, y: firstParent[f].y};
                firstChild.push(copy);
                firstParent[f] = -1;
                for(let s  = 0; s < secondParent.length; s++) {
                    if(equal.default(secondParent[s], firstParent[f])) {
                        secondParent[s] = -1;
                        firstParent[f] = -1;
                    }
                }
            }
        }
    }
    firstChild = mutation(firstChild);

    population.push({path: firstChild, lengthPath: pathCalculation(firstChild)});

    return population;
}

export function populationSort(population) {
    population.sort((a, b) => a.lengthPath - b.lengthPath);
    return population;
}

export async function geneticFunction(points, callback) {
    let population = populationGeneration(populationCount(points), points);
    for(let i = 0; i < populationCount(points); i++) {
        population = [...childrenGeneration([...population])];
        population = populationSort([...population]);
        population.pop();
        if(i === populationCount(points) - 1) callback(population[0])
        else callback(population[points.length - 2]);
    }
    return population;
}

