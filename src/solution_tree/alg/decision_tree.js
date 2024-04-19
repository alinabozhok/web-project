import {selectSplitParam} from "./selectSplitParam.js";

export class TreeNode{
    constructor(data,name) {
        this.value;
        this.valuePercentage = undefined;
        this.children = [];
        this.decider;
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

export let root;
export function startTreeBuilding(matrix){
    root = new TreeNode(matrix,"root");
    buildTree(root);
}

function buildTree(node) {
    const splittingParameter = selectSplitParam(node.data);
    updateNodeAttributes(node, splittingParameter);

    for (const splitValue in splittingParameter["data"]["arrays"]) {
        const treeNode = createTreeNode(splittingParameter["data"]["arrays"][splitValue]["array"], splitValue);
        treeNode.parent = node;

        if (shouldBuildSubtree(treeNode, splittingParameter)) {
            buildTree(treeNode);
        } else {
            finalizeLeafNode(treeNode);
        }
        node.children.push(treeNode);
    }
}

function updateNodeAttributes(node, splittingParameter) {
    node.value = splittingParameter["data"]["value"]["maxValue"];
    node.valuePercentage = splittingParameter["data"]["value"]["sure"];
    node.decisionMaker = splittingParameter["feature"];
}

function createTreeNode(array, name) {
    return new TreeNode(array, name);
}

function shouldBuildSubtree(treeNode, splittingParameter) {
    return treeNode.data[0].length > 2 && splittingParameter["data"]['entropy'] !== 999;
}

function finalizeLeafNode(treeNode) {
    treeNode.isleaf = true;
    treeNode.valuePercentage = 1;
    treeNode.value = treeNode.data[1][treeNode.data[1].length - 1];
}

export async function makeDecision() {
    //подготавливаем входящие данные для обработки

    let string = document.getElementById('input_data').value;
    let array = string.split(",").map(item => item.trim());
    let currentNode = root;
    let counter = root.data[0].length;

    // визуализируем решение

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

        let decisionChildIndex = doubleDecision(currentNode, array);
        if (decisionChildIndex !== -1) {
            currentNode = currentNode.children[decisionChildIndex];
        } else {
            let foundChildIndex = -1;
            for (let j = 0; j < currentNode.children.length; j++) {
                if (array.includes(currentNode.children[j].name) || currentNode.decisionMaker === root.data[0][root.data[0].length - 1]
                    || currentNode.decisionMaker === root.data[0][root.data]) {
                    foundChildIndex = j;
                    break;
                }
            }
            if (foundChildIndex !== -1) {
                currentNode = currentNode.children[foundChildIndex];
            }
        }

        if (currentNode !== undefined && currentNode.name !== "root" && currentNode.parent.decisionMaker === root.data[0][root.data[0].length - 1] && !currentNode.visited) {
            currentNode.visited = true;
            await gradient('rgb(0, 128, 0)', currentNode);
            break;
        }
        console.log(currentNode);
        counter--;
        if (counter < 0) {
            alert("Запрос не может быть распознан");
            break;
        }
    }
}


export function clearVisualizations(node) {
    if (node !== root) {
        if (node.a) {
            node.a.style.backgroundColor = '';
        }
        if (node.finalA) {
            node.finalA.style.backgroundColor = '';
        }
    }

    node.visited = false;

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
            let num = parseFloat(currentNode.children[0].name.replace('<', ''));
            for (let j = 0; j < array.length; j++) {
                if (!isNaN(parseFloat(array[j]))) {
                    if (parseFloat(array[j]) < num)  {
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
    return undefined;
}

