import drawMashIntoCanvas from "../../shared/ui/drawMashIntoCanvas.js";
import {BackStack} from "../../shared/actionBackStack.js";
import drawPoint from "../../shared/ui/drawPoint.js";
import {geneticFunction} from "./geneticFunction.js";
import {runTests} from "./testGenetic.js";


const pointRadius = 10;
const mashSize = 60;

const canvas = document.querySelector("#myCanvas");
const canvasBounds = canvas.getBoundingClientRect();

const containerLengths = document.querySelector("#lengthEdges")


const ctx = canvas.getContext('2d');

const backStackApi = new BackStack();
let points = [];
let currentPathStack = [];
let isPending = false;

function render() {

    while(containerLengths.lastChild) containerLengths.removeChild(containerLengths.lastChild);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMashIntoCanvas(ctx, canvas.width, canvas.height, mashSize);
    for (let k = 0; k < points.length; k++) {
        drawPoint(points[k].x, points[k].y, { text: k.toString() }, ctx)
        ctx.font = "45px serif";
        ctx.fillText(k.toString(), points[k].x + 20, points[k].y + 20)

        for (let j = k + 1; j < points.length; j++) {
            ctx.beginPath();
            ctx.moveTo(points[k].x, points[k].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = "#90989B";
            ctx.stroke();
            ctx.closePath();

            let hypot = Math.round(Math.hypot(points[j].x - points[k].x, points[j].y - points[k].y));
            let text = `dot ${k.toString()} dot ${j.toString()}  ${hypot.toString()}`;

            let para = document.createElement("p");
            let node = document.createTextNode(text);
            para.appendChild(node);
            containerLengths.appendChild(para);
        }
    }
    if(currentPathStack.length > 0) {
        for(let d = 0; d < currentPathStack[0].length - 1; d++) {
            ctx.beginPath();
            ctx.moveTo(currentPathStack[0][d].x, currentPathStack[0][d].y);
            ctx.lineTo(currentPathStack[0][d + 1].x, currentPathStack[0][d + 1].y);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.closePath();
            ctx.lineWidth = 1;
        }
    }
}

document.addEventListener('keyup', (e) => {
    if((e.ctrlKey && e.key === "z") || (e.ctrlKey && e.key === "я")) {
        points = [...backStackApi.popAction().snapshot];
        currentPathStack = [];
        isPending = true
        render()
        isPending = false;
    }
})

canvas.addEventListener('click',(e) => {
    if(isPending) return;
    const x = e.x - canvasBounds.x - pointRadius/2;
    const y = e.y - canvasBounds.y - pointRadius/2;
    backStackApi.pushAction("add_point", [...points]);
    points.push({ x: x, y: y });
    render()
    isPending = false;
});

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};

document.querySelector("#start").addEventListener("click", () => {
    runTests();
    if(isPending) return;
    geneticFunction(points, (path)=> {
        currentPathStack.push([...path.path.map(it => ({...it})), {...path.path[0]}])
    }).then(async () => {
        isPending = true;
        while(currentPathStack.length > 0) {
            render()
            currentPathStack.splice(0, 1)
            await delay(0);
        }
        console.log("end");
        isPending = false;
    });
})
render()
isPending = false;

