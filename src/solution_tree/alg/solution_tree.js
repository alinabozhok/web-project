class TreeNode{
    constructor(data,name) {
        this.value;
        this.valuePercentage = undefined;
        this.children = [];
        this.decisionMaker;
        this.data=data;
        this.name = name;
        this.a;
        this.parent;
        this.visited= false;
        this.isleaf = false;
    };

    isLeaf(){
        if(this.children === undefined){return true;}
        if(this.children.length === 0){return true;}
        return false;
    }
}

let celSet = new Set();

function startTreeBuilding(matrix){
    root = new TreeNode(matrix,"root");
    buildTree(root);
}

function  buildTree(node){
    let splittingParameter = chooseSplittingParameter(node.data);
    node.value= splittingParameter["data"]["value"]["maxValue"];

    node.valuePercentage = splittingParameter["data"]["value"]["sure"];
    node.decisionMaker = splittingParameter["feature"];

    for(featureVal in splittingParameter["data"]["arrays"]){
        let treeNode = new TreeNode(splittingParameter["data"]["arrays"][featureVal]["array"],featureVal);
        treeNode.parent = node;
        if(treeNode.data[0].length>2 && splittingParameter["data"]['entropy'] !== 999){
            buildTree(treeNode);
        } else{
            treeNode.isleaf =true;
            treeNode.valuePercentage = 1;
            treeNode.value = treeNode.data[1][treeNode.data[1].length - 1];
        }
        node.children.push(treeNode);
    }
}

async function makeDecision() {
    // Clear previous visualizations
    clearVisualizations(root);

    let string = document.getElementById('input_data').value;
    let array = string.split(",");
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i].trim();
    }
    let currentNode = root;
    let counter = root.data[0].length;
    while (currentNode !== undefined) {
        if (!currentNode.visited) {
            currentNode.visited = true;
            await gradient('rgb(0, 128, 0)', currentNode);
            await sleep(100);
            if (currentNode.finalA !== undefined) {
                await gradientForFinal('rgb(0, 128, 0)', currentNode.finalA);
                await sleep(100);
            }
        }
        if (doubleDecision(currentNode, array) !== -1) {
            currentNode = currentNode.children[doubleDecision(currentNode, array)];
        } else if (currentNode !== undefined) {
            for (let j = 0; j < currentNode.children.length; j++) {
                if (array.includes(currentNode.children[j].name) || currentNode.decisionMaker === root.data[0][root.data[0].length - 1] || currentNode.decisionMaker === root.data[0][root.data]) {
                    currentNode = currentNode.children[j];
                    break;
                }
            }
        }
        if (currentNode !== undefined && currentNode.name !== "root" && currentNode.parent.decisionMaker === root.data[0][root.data[0].length - 1] && !currentNode.visited) {
            currentNode.visited = true;
            await gradient('rgb(0, 128, 0)', currentNode);
            break;
        }
        counter--;
        if (counter < 0) {
            alert("Запрос не может быть распознан")
            break;
        }
    }
}

function clearVisualizations(node) {

    if (node !== root) {
        if (node.a) {
            node.a.style.backgroundColor = '';
        }
        if (node.finalA) {
            node.finalA.style.backgroundColor = '';
        }
    }

    for (let i = 0; i < node.children.length; i++) {
        clearVisualizations(node.children[i]);
    }
}



async  function gradientForFinal(RGB, finalAnswer){
    finalAnswer.style.backgroundColor = RGB;
    await sleep(100);
}

async function gradient(RGB, node) {
    node.a.style.backgroundColor = RGB;
    await sleep(100);
}

function  sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

function doubleDecision(currentNode, array) {
    if (currentNode !== undefined && currentNode.children[0] !== undefined) {
        if (currentNode.children[0].name[0] === "<") {
            let num = currentNode.children[0].name;
            num = num.replace('<', '');
            for (let j = 0; j < array.length; j++) {
                if (!isNaN(parseFloat(array[j]))) {
                    if (parseFloat(array[j]) < parseFloat(num))  {
                        return 0;
                    } else {
                        return 1;
                    }
                }
            }
        } else {
            return -1;
        }
    }
    return;
}

function chooseSplittingParameter(matrix) {
    let featuresList = {};

    for (let i = 1; i < matrix.length; i++) {
        celSet.add(matrix[i][matrix[i].length - 1]);
    }

    let currValue = decisionValue();

    for (let j = 0; j < matrix[0].length - 1; j++) {
        let featureDict = {};

        featureDict["isDouble"] = (isDouble(j));
        featureDict["entropy"] = undefined;
        featureDict["value"] = currValue;
        if (featureDict["isDouble"] === true) {
            let doubleResult = doubleData(j);

            featureDict["entropy"] = doubleResult["entropy"];
            if (featureDict["entropy"] !== 999) {
                let leftName = "<" + doubleResult["splittingParameter"],
                    rightName = ">=" + doubleResult["splittingParameter"];
                featureDict["arrays"] = [];
                featureDict["arrays"][leftName] = {"array": []};
                featureDict["arrays"][rightName] = {"array": []};

                let il = 0, ir = 0;
                for (let i = 1; i < matrix.length; i++) {
                    if (i === doubleResult["indexes"]["leftIndexes"][il] + 1) {
                        featureDict["arrays"][leftName]["array"].push(matrix[i]);
                        il++;
                    } else {
                        featureDict["arrays"][rightName]["array"].push(matrix[i]);
                        ir++;
                    }
                }
                if (featureDict["arrays"][leftName]["array"].length < 2) {
                    featureDict["arrays"].splice(leftName, 1);
                }
                if (featureDict["arrays"][rightName]["array"].length < 2) {
                    featureDict["arrays"].splice(rightName, 1);
                }
                featureDict["arrays"][leftName]["array"].splice(0, 0, matrix[0]);
                featureDict["arrays"][rightName]["array"].splice(0, 0, matrix[0]);
            }

        } else {
            featureDict["entropy"] = 0;
            featureDict["arrays"] = [];
            for (let i = 1; i < matrix.length; i++) {

                let featureVal = matrix[i][j];
                let celVal = matrix[i][matrix[0].length - 1];
                if (featureDict["arrays"][featureVal] === undefined) {
                    let celDict = {};
                    for (let val of celSet) {
                        celDict[val] = 0;
                    }
                    celDict["array"] = [];
                    featureDict["arrays"][featureVal] = celDict;
                }
                featureDict["arrays"][featureVal][celVal] += 1;
                let neededArray = new Array(matrix[i].length);
                for (let k = 0; k < matrix[i].length; k++) {
                    neededArray[k] = matrix[i][k];
                }
                neededArray.splice(j, 1);

                featureDict["arrays"][featureVal]["array"].push(neededArray);
            }
            let neededArray = new Array(matrix[0].length);
            for (let k = 0; k < matrix[0].length; k++) {
                neededArray[k] = matrix[0][k];
            }
            neededArray.splice(j, 1);
            for (let featureVal in featureDict["arrays"]) {
                featureDict["arrays"][featureVal]["array"].splice(0, 0, neededArray);
            }
            featureDict["entropy"] += stringEntropy(j, featureDict);
        }
        featuresList[matrix[0][j]] = {"data": featureDict, "feature": matrix[0][j]};
    }


    let finalEntropy = 1000;
    let finalDecisionMaker = undefined;
    for (let feature in featuresList) {
        if (featuresList[feature]["data"]["entropy"] < finalEntropy) {
            finalEntropy = featuresList[feature]["data"]["entropy"];
            finalDecisionMaker = featuresList[feature];
        }

    }
    return finalDecisionMaker;



    function getBaseLog(base,num){
        if(num === 0 || base === 0) return 0;
        return  Math.log(num) / Math.log(base);

    }


    function doubleData(columnIndex){
        class NumElement {
            constructor(value, celElement) {
                this.value = parseFloat(value);
                this.celElement = celElement;
            }
        };

        let numsSorted = [];
        let nums = [];

        for (let i =1 ; i<matrix.length; i++){
            nums.push(new NumElement(matrix[i][columnIndex], matrix[i][matrix[0].length-1]));
            numsSorted.push(new NumElement(matrix[i][columnIndex], matrix[i][matrix[0].length-1]));
        }

        numsSorted.sort((a,b) =>a.value - b.value);

        deleteCopies(numsSorted);

        let part1=[],part2=[];

        for(let i = 1; i < numsSorted.length;i++){
            part2.push(numsSorted[i]);
        }

        part1.push(numsSorted[0]);
        let finalEntropy = 999;
        let borderIndex = undefined;

        for(let i =1 ; i<numsSorted.length; i++){

            if (numsSorted[i].celElement !== numsSorted[i-1].celElement){
                let currEntropy =  part1.length / numsSorted.length * doubleEntropy(part1)+part2.length/numsSorted.length*doubleEntropy(part2);
                if(currEntropy<finalEntropy){
                    finalEntropy=currEntropy;
                    borderIndex = i;
                }
            }
            part2.splice(0,1);
            part1.push(numsSorted[i]);
        }
        let result = {};

        result["entropy"] = finalEntropy;
        result["indexes"] = {"rightIndexes" : [], "leftIndexes" : []};
        if(borderIndex === undefined){
            borderIndex = 1;
        }
        if(numsSorted.length<2){
            return result;
        }
        result["splittingParameter"] = (numsSorted[borderIndex].value + numsSorted[borderIndex-1].value) / 2;
        for(let i = 0 ; i<nums.length; i++){
            if(nums[i].value < result["splittingParameter"]){
                result["indexes"]["leftIndexes"].push(i);
            }else {
                result["indexes"]["rightIndexes"].push(i);
            }
        }
        return (result);
    }


    function doubleEntropy (nums) {
        let cels = {};
        for(let val of celSet){
            cels[val] = 0;
        }
        for(let i =0; i< nums.length; i++){
            cels[nums[i].celElement] += 1;
        }
        let localEntropy = 0;

        for(let val of celSet){
            localEntropy -= (cels[val]/nums.length) * getBaseLog(2, cels[val] / nums.length);
        }

        return localEntropy;
    }


    function  deleteCopies(numsSorted){

        for (let i =1 ; i<numsSorted.length; i++){
            if(numsSorted[i-1].value === numsSorted[i].value){
                if (numsSorted[i-1].celValue === numsSorted[i].celValue){
                    numsSorted.splice(i,1);
                    i--;
                }
            }
        }
    }


    function  stringEntropy(featureNum, featureDictionary){

        let finalEntropy = 0;
        let size=0;

        for(let val in featureDictionary["arrays"]){
            size += featureDictionary["arrays"][val]["array"].length;
        }

        for(let val in featureDictionary["arrays"]){
            for(let celVal of celSet){
                finalEntropy -= (featureDictionary["arrays"][val][celVal]/size) *  getBaseLog(2, featureDictionary["arrays"][val][celVal] / size) * featureDictionary["arrays"][val]["array"].length / size;
            }
        }
        return finalEntropy;
    }

    function  decisionValue(){
        let celDictionary = {};
        let maxCount = -1;
        let maxVal = undefined;

        for (let val of celSet){
            celDictionary[val] = 0;
        }

        for (let i = 1; i< matrix.length; i++){
            celDictionary[matrix[i][matrix[0].length-1]] ++;
        }

        let sure = 0;

        for(let val of celSet){
            if(celDictionary[val] > maxCount){
                maxVal = val;
                maxCount = celDictionary[val];
                sure = celDictionary[val] / (matrix.length - 1);
            }
        }
        let value = {"maxValue": maxVal, "sure": sure};
        return value;
    }
    function  isDouble (columnIndex){
        for (let i = 1; i < matrix.length; i++){
            if (isNaN(parseFloat(matrix[i][columnIndex]))){
                return false;
            }
        }
        return true;
    }
}
