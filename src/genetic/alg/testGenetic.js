import {
    childrenGeneration,
    mutation,
    pathCalculation,
    pathGeneration,
    populationCount,
    populationGeneration
} from "./geneticFunction.js";

function logTestResult(label, input, output, result) {
    console.log(
        label,
        "\nВходные данные:\n", input,
        "\nВыходные данные:\n", output,
        "\nРезультат:", result
    );
}

function testPathGeneration() {
    const points = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224},
        {x: 139, y: 24},
        {x: 24, y: 345},
        {x: 57, y: 200}
    ]
    const result = pathGeneration(points);
    logTestResult(
        "Тестирование генерации рандомного пути",
        points,
        result,
        (result.length === points.length + 1 &&
            result[0].x === result[result.length - 1].x &&
            result[0].y === result[result.length - 1].y)
    );
}

function testPopulationCount() {
    const points = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224},
        {x: 139, y: 24},
        {x: 24, y: 345},
        {x: 57, y: 200}
    ]
    const result = populationCount(points);
    logTestResult(
        "Тестирование генерации размера популяции",
        points,
        result,
        (result === 120)
    );
}

function testPathCalculation() {
    const path = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224}
    ]
    const result = pathCalculation(path);
    logTestResult(
        "Тестирование подсета длины",
        path,
        result,
        (result === 456)
    );
}

function testPopulationGeneration(){
    const points = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224},
        {x: 139, y: 24},
        {x: 24, y: 345},
        {x: 57, y: 200}
    ]
    const result = populationGeneration(4, points);
    logTestResult(
        "Тестирование генерации размера популяции",
        points,
        result,
        (result.length === 4)
    );
}

function testMutation() {
    const points = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224},
        {x: 139, y: 24},
        {x: 24, y: 345},
        {x: 57, y: 200}
    ]
    const result = mutation(points);
    logTestResult(
        "Тестирование мутации",
        points,
        result,
        (result.length === points.length)
    );
}

function testChildrenGeneration() {
    const points = [
        {x: 136, y: 524},
        {x: 245, y: 456},
        {x: 13, y: 224},
        {x: 139, y: 24},
        {x: 24, y: 345},
        {x: 57, y: 200}
    ]
    const result = mutation(points);
    logTestResult(
        "Тестирование мутации",
        points,
        result,
        (result.length === points.length)
    );
}




export function runTests() {
    testPathGeneration();
    testPopulationCount();
    testPathCalculation();
    testPopulationGeneration();
    testMutation();
}