function buildTree() {
    const trainingData = document.getElementById('trainingData').value.trim();
    const decisionTree = document.getElementById('decisionTree');


    decisionTree.innerText = 'Дерево решений построено'; // Временное сообщение
}

function makeDecision() {
    const testData = document.getElementById('testData').value.trim();
    const decisionResult = document.getElementById('decisionResult');

    
    decisionResult.innerText = 'Принято решение'; // Временное сообщение
}
