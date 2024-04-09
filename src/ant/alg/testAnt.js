import {
    creationPathMatrix,
    probabilityCalculation,
    vertexSelection,
    antsRun,
    antFunction
} from "./antFunction.js";

function logTestResult(label, input, output, result) {
    console.log(
        label,
        "\nВходные данные:\n", input,
        "\nВыходные данные:\n", output,
        "\nРезультат:", result
    );
}


function testPathMatrix() {
    const points = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224},
        {x: 139, y: 24},
        {x: 24, y: 345},
        {x: 57, y: 200}
    ]
    const result = creationPathMatrix(points);
    logTestResult(
        "Создание матрицы путей",
        points,
        result,
        (result.length === points.length)
    );
}
function testProbability() {
    const points = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224},
        {x: 139, y: 24},
        {x: 24, y: 345},
        {x: 57, y: 200}
    ]
    let test = creationPathMatrix(points);
    const result = probabilityCalculation(test[0]);
    logTestResult(
        "Подсчет вероятности",
        points,
        result,
        (result[0] === 0)
    );
}
function testVertex() {
    const points = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224},
        {x: 139, y: 24},
        {x: 24, y: 345},
        {x: 57, y: 200}
    ]
    let test = creationPathMatrix(points);
    let test1 = probabilityCalculation(test[0]);
    const result = vertexSelection(test1);
    logTestResult(
        "Выборка вершины",
        points,
        result,
        (result !== 0)
    );
}

function testAntsRun() {
    const points = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224},
        {x: 139, y: 24},
        {x: 24, y: 345},
        {x: 57, y: 200}
    ]
    let test = creationPathMatrix(points);
    const result = antsRun(points, test);
    logTestResult(
        "Пробег муравьев",
        points,
        result,
        (points.length === result.length)
    );
}

function testAntAlgorithm() {
    const points = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224}
    ]
    const result = antFunction(points);
    logTestResult(
        "Кратчайший путь",
        points,
        result,
        (result !== 0)
    );
}
export function runTestsAnt() {
    //testPathMatrix();
    //testProbability();
    //testVertex();
    //testAntsRun();
    //testAntAlgorithm();
}