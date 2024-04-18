import {makeDecision} from "./decision_tree.js";
import{TreeNode} from "./decision_tree.js";

export function selectSplitParam(matrix) {
    let categoryList = {};

    // Определение уникальных значений для целевого столбца
    const uniqueDataSet = new Set();
    for (let i = 1; i < matrix.length; i++) {
        uniqueDataSet.add(matrix[i][matrix[i].length - 1]);
    }

    let currentDecisionValue = calculateDecisionValue();

    // Обработка каждого признака
    for (let j = 0; j < matrix[0].length - 1; j++) {
        let categoricalData = {};
        categoricalData["hasNumericDataInColumn"] = hasNumericDataInColumn(j);
        categoricalData["entropy"] = undefined;
        categoricalData["value"] = currentDecisionValue;

        if (categoricalData["hasNumericDataInColumn"]) {
            // Обработка числовых данных
            const doubleResult = findNumericSplitParameter(j);

            categoricalData["entropy"] = doubleResult["entropy"];
            if (categoricalData["entropy"] !== 999) {
                const leftName = "<" + doubleResult["splittingParameter"];
                const rightName = ">=" + doubleResult["splittingParameter"];
                categoricalData["arrays"] = {
                    [leftName]: {"array": []},
                    [rightName]: {"array": []}
                };

                let isLeft = 0;
                for (let i = 1; i < matrix.length; i++) {
                    const index = doubleResult["indexes"]["leftIndexes"].includes(i - 1) ? isLeft++ : isLeft;
                    const key = index === 0 ? leftName : rightName;
                    categoricalData["arrays"][key]["array"].push(matrix[i]);
                }

                // Удаление недостаточных значений
                if (categoricalData["arrays"][leftName]["array"].length < 2) {
                    delete categoricalData["arrays"][leftName];
                }
                if (categoricalData["arrays"][rightName]["array"].length < 2) {
                    delete categoricalData["arrays"][rightName];
                }

                // Добавление заголовков
                Object.values(categoricalData["arrays"]).forEach(branch => {
                    branch["array"].splice(0, 0, matrix[0]);
                });
            }
        } else {
            // Обработка категориальных данных
            categoricalData["entropy"] = 0;
            categoricalData["arrays"] = {};

            for (let i = 1; i < matrix.length; i++) {
                const splitValue = matrix[i][j];
                const categoryValue = matrix[i][matrix[0].length - 1];

                if (!categoricalData["arrays"][splitValue]) {
                    categoricalData["arrays"][splitValue] = {};
                    for (let val of uniqueDataSet) {
                        categoricalData["arrays"][splitValue][val] = 0;
                    }
                    categoricalData["arrays"][splitValue]["array"] = [];
                }

                categoricalData["arrays"][splitValue][categoryValue] += 1;

                // Создание нового массива без текущего столбца
                const neededArray = matrix[i].filter((_, index) => index !== j);
                categoricalData["arrays"][splitValue]["array"].push(neededArray);
            }

            // Удаление текущего столбца из заголовков
            const neededArray = matrix[0].filter((_, index) => index !== j);
            Object.values(categoricalData["arrays"]).forEach(branch => {
                branch["array"].splice(0, 0, neededArray);
            });

            categoricalData["entropy"] += calculateStringEntropy(j, categoricalData);
        }

        categoryList[matrix[0][j]] = {"data": categoricalData, "feature": matrix[0][j]};
    }

    // Выбор наилучшего разделителя
    let finalEntropy = Infinity;
    let finalDecisionMaker = undefined;
    for (let category in categoryList) {
        if (categoryList[category]["data"]["entropy"] < finalEntropy) {
            finalEntropy = categoryList[category]["data"]["entropy"];
            finalDecisionMaker = categoryList[category];
        }
    }
    return finalDecisionMaker;

    function findNumericSplitParameter(columnIndex) {
        class NumericElement {
            constructor(value, categoryValue) {
                this.value = parseFloat(value);
                this.categoryValue = categoryValue;
            }
        }
        //сортируем массив по столбцу
        const numsSorted = matrix.slice(1)
            .map(row => new NumericElement(row[columnIndex], row[matrix[0].length - 1]))
            .sort((a, b) => a.value - b.value);

        const nums = [...new Set(numsSorted)];// -дубликаты

        const part1 = [numsSorted[0]];
        const part2 = numsSorted.slice(1);

        let finalEntropy = 999;
        let borderIndex;


        for (let i = 1; i < numsSorted.length; i++) {
            if (numsSorted[i].categoryValue !== numsSorted[i - 1].categoryValue) {
                const currEntropy = part1.length / numsSorted.length
                    * calculateNumericalEntropy(part1) + part2.length / numsSorted.length * calculateNumericalEntropy(part2);
                if (currEntropy < finalEntropy) {
                    finalEntropy = currEntropy;
                    borderIndex = i;
                }
            }
            part2.shift();
            part1.push(numsSorted[i]);
        }

        const result = {
            entropy: finalEntropy,
            indexes: { rightIndexes: [], leftIndexes: [] }
        };

        if (borderIndex === undefined || numsSorted.length<2) {
            borderIndex = 1;
        }

        if (numsSorted.length < 2) {
            return result;
        }

        result.splittingParameter = (numsSorted[borderIndex].value + numsSorted[borderIndex - 1].value) / 2;

        for (let i = 0; i < nums.length; i++) {
            result.indexes[nums[i].value < result.splittingParameter ? 'leftIndexes' : 'rightIndexes'].push(i);
        }

        return result;
    }

    function calculateNumericalEntropy(nums) {
        const categoryCounts = {};
        let localEntropy = 0;
        const size = nums.length;


        uniqueDataSet.forEach(val => {
            categoryCounts[val] = 0;
        });

        nums.forEach(num => {
            categoryCounts[num.celElement] += 1;
        });

        uniqueDataSet.forEach(val => {
            localEntropy -= (categoryCounts[val] / size) * calculateLogWithBase(2, categoryCounts[val] / size);
        });

        return localEntropy;
    }

    function calculateLogWithBase(base, num) {
        if (num === 0 || base === 0) return 0;
        return Math.log(num) / Math.log(base);
    }

    function calculateStringEntropy(featureNum, categoricalData) {
        let finalEntropy = 0;
        let size = 0;

        for (let value in categoricalData["arrays"]) {
            size += categoricalData["arrays"][value]["array"].length;
        }

        for (let value in categoricalData["arrays"]) {
            for (let categoryValue of uniqueDataSet) {
                finalEntropy -= (categoricalData["arrays"][value][categoryValue] / size) *
                    calculateLogWithBase(2, categoricalData["arrays"][value][categoryValue] / size) *
                    categoricalData["arrays"][value]["array"].length / size;
            }
        }
        return finalEntropy;
    }

    function calculateDecisionValue() {
        const dataDict = {};
        let maxCount = -1;
        let maxVal;

        for (let val of uniqueDataSet) {
            dataDict[val] = 0;
        }

        for (let i = 1; i < matrix.length; i++) {
            dataDict[matrix[i][matrix[0].length - 1]]++;
        }

        let sure = 0;

        for (let val of uniqueDataSet) {
            if (dataDict[val] > maxCount) {
                maxVal = val;
                maxCount = dataDict[val];
                sure = dataDict[val] / (matrix.length - 1);
            }
        }

        return {"maxValue": maxVal, "sure": sure};
    }

    function hasNumericDataInColumn(columnIndex) {
        for (let i = 1; i < matrix.length; i++) {
            if (isNaN(parseFloat(matrix[i][columnIndex]))) {
                return false;
            }
        }
        return true;
    }
}
