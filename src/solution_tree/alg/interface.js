import {startTreeBuilding,clearVisualizations,makeDecision, TreeNode, root} from "./decision_tree.js";
import{getData} from "./data.js";
import{receiveData} from "./receiveData.js";

const buttonHandlers = {
    start_button: start,
    reset_button: reset,
    getData1: chooseSample0,
    getData2: chooseSample1,
    getData: buildTreeFromFile
};

Object.keys(buttonHandlers).forEach(buttonId => {
    document.getElementById(buttonId).addEventListener('click', buttonHandlers[buttonId]);
});

const FILE = document.getElementById('file_input');
let flag = true;


document.getElementById('input_data').value = "Выше,     Нет,    На месте";
let index = 0;

function chooseSample0() {
    document.getElementById('input_data').value = "Выше,     Нет,    На месте";
        index = 0;
        createTree();
}

function chooseSample1() {
    document.getElementById('input_data').value = "Hair, Legs, Toothed, Breathes";
    index = 1;
    createTree();
}

startTreeBuilding(getData(index));

let treeRoot = document.getElementById("root");

function createTree() {
    rerenderTree();
    startTreeBuilding(getData(index));
    drawTree(root, treeRoot);

    flag = true;
}
function clearSolution() {

    clearVisualizations(root);

    if (root.a) {
        root.a.style.backgroundColor = '';
    }
    if (root.finalA) {
        root.finalA.style.backgroundColor = '';
    }
}



function buildTreeFromFile() {
    if(FILE.value === ''){
        alert("Upload file please")
    }else {
        rerenderTree();
        let dataBase = FILE.files[0];
        let reader = new FileReader();
        reader.readAsText(dataBase);
        reader.onload = function () {
            dataBase = receiveData(reader.result);
            startTreeBuilding(dataBase);
            drawTree(root, treeRoot);
        }
    }
}
function start() {
    if (flag) {
        clearSolution();
        makeDecision();
    }
}

function reset() {
    rerenderTree();
    root = document.createElement("ul");
    root.setAttribute('id', 'root');
    treeRoot.appendChild(root);
    FILE.value = '';
    FILE.files = null;
}

function drawTree(currentNode, treeElement) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    currentNode.a = a;
    a.href = "#";
    let nodeName = currentNode.name;
    if (nodeName === "root") {
        a.textContent = nodeName;
    } else {
        let category = currentNode.parent.decisionMaker;
        a.textContent = category + " : " + nodeName;
    }

    li.appendChild(a);
    treeElement.appendChild(li);
    if (currentNode.isleaf || currentNode.isLeaf()) {
        let finalUl = document.createElement("ul");
        let finalLi = document.createElement("li");
        let finalA = document.createElement("a");
        finalA.href = "#";
        finalA.textContent = currentNode.value;
        finalLi.appendChild(finalA);
        finalUl.appendChild(finalLi);
        li.appendChild(finalUl);

        return;
    }
    let ul = document.createElement("ul");
    li.appendChild(ul);
    for (let i = 0; i < currentNode.children.length; i++) {
        drawTree(currentNode.children[i], ul);
    }
}


function scrollEvent(event) {
    // блок стандартного скролла
    event.preventDefault();

    const delta = Math.sign(event.deltaY);
    const zoomValue = parseFloat(window.getComputedStyle(treeRoot).zoom) || 1;

    if (zoomValue - delta > 0.1 && zoomValue - delta < 5) {
        treeRoot.style.zoom = zoomValue - delta;
    }
}


document.addEventListener("DOMContentLoaded", function() {

    const treeDiv = document.getElementById("tree");

    let root = document.createElement("ul");
    root.setAttribute('id', 'root');

    root.addEventListener("wheel", scrollEvent);

    treeDiv.appendChild(root);
});

function rerenderTree() {
    let divTree = document.getElementById("tree");
    treeRoot.removeEventListener("wheel", scrollEvent);
    treeRoot.remove();
    let root = document.createElement("ul");
    root.setAttribute('id', 'root');
    root.addEventListener("wheel", scrollEvent);
    divTree.appendChild(root);
    treeRoot = root;
}

drawTree(root, treeRoot);

window.addEventListener('unload', function(event) {

    FILE.value = '';
    FILE.files = null;

    event.preventDefault();
    event.returnValue = '';
});
