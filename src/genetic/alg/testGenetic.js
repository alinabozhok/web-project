import {

} from "./geneticFunction.js";

function logTestResult(label, input, output, result) {
    console.log(
        label,
        "\nВходные данные:\n", input,
        "\nВыходные данные:\n", output,
        "\nРезультат:", result
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

}