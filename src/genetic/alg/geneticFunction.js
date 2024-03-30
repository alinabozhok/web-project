//если что исправить добавление элемента в элемент(кладет ссылку или элемент???)

export function pathGeneration(points) {
    let randomPath = [...points];
    for(let i = points.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [randomPath[i], randomPath[j]] = [randomPath[j], randomPath[i]];
    }
    randomPath.push({...randomPath[0]});
    return randomPath;
}

export function populationCount(points) {
    let count = 1;
    for(let i = 2; i < points.length; i++) {
        count *= i;
    }
    return count;
}

export function pathCalculation(path) {
    let lengthPath = 0;
    for(let i = 0, j = 1; j < path.length; i++, j++) {
        let hypot = Math.round(Math.hypot(path[i].x - path[j].x, path[i].y - path[j].y));
        lengthPath += hypot;
    }
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
    let percentMutation = Math.floor(Math.random() * 100);
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

    let firstParent = (population[i]).path;
    let secondParent = (population[j]).path;

    let firstChild = [];
    let secondChild = [];

    let gensForFirstChild = new Set();
    let gensForSecondChild = new Set();

    for(let k = 0; k < 2; k++) {
        firstChild.push(firstParent[k]);
        secondChild.push(secondParent[k]);

        gensForFirstChild.add(firstParent[k]);//так можно???? или он кладет ссылку???????
        gensForSecondChild.add(secondParent[k]);
    }
    for(let d = 2; d < secondParent.length - 1; d++) {
        if(!gensForFirstChild.has(secondParent[d])) {
            firstChild.push(secondParent[d])
        }
        if(!gensForSecondChild.has(firstParent[d])) {
            secondChild.push(firstParent[d])
        }
    }
    if(firstChild.length !== firstParent.length){
        for(let d = 2; d < firstParent.length - 1; d++) {
            if(!gensForFirstChild.has(firstParent[d])) {
                firstChild.push(firstParent[d])
            }
        }
    }
    if(secondChild.length !== secondParent.length){
        for(let d = 2; d < secondParent.length - 1; d++) {
            if(!gensForSecondChild.has(secondParent[d])) {
                secondChild.push(secondParent[d])
            }
        }
    }
    firstChild = mutation(firstChild);
    secondChild = mutation(secondChild);
    population.push({path: firstChild, lengthPath: pathCalculation(firstChild)});
    population.push({path: secondChild, lengthPath: pathCalculation(secondChild)});
    return population;
}

export function populationSort(population) {
    population.sort((a, b) => a.length - b.length);
    return population;
}

export function geneticFunction(points) {
    let population = populationGeneration(populationCount(points), points);
    population = [...childrenGeneration([...population])];
    population = [...populationSort([...population]).pop().pop()];
    return population;
}

