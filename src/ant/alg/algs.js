import {BackStack} from "../../shared/actionBackStack.js";
import drawPoint from "../../shared/ui/drawPoint.js";
import {antFunction} from "./antFunction.js";
import {clearCanvas} from "../../shared/ui/clearCanvas.js";

const pointRadius = 2;

const canvas = document.querySelector("#myCanvas");
const speed = document.querySelector('#secondOutPut');
const canvasBounds = canvas.getBoundingClientRect();

const ctx = canvas.getContext('2d');

const backStackApi = new BackStack();
let points = [];
let currentPathStack = [];
let result = {visited: []};
let isPending = false;

async function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let k = 0; k < points.length; k++) {
        drawPoint(points[k].x, points[k].y, { text: k.toString() }, ctx)
        ctx.font = "40px serif";
        ctx.fillText(k.toString(), points[k].x + 20, points[k].y + 20)
    }
    if(currentPathStack.length > 0) {
        for(let d = 0; d < currentPathStack[0].length - 1; d++) {
            ctx.beginPath();
            ctx.moveTo(points[currentPathStack[0][d]].x, points[currentPathStack[0][d]].y);
            ctx.lineTo(points[currentPathStack[0][d + 1]].x, points[currentPathStack[0][d + 1]].y);
            ctx.strokeStyle = "#7F5939";
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.closePath();
            ctx.lineWidth = 1;
        }
    }
}

document.addEventListener('keyup', (e) => {
    if((e.ctrlKey && e.key === "z") || (e.ctrlKey && e.key === "я")) {
        points = [...backStackApi.popAction().snapshot];
        result = {visited: []}
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

document.getElementById("start").addEventListener("click", () => {
    if(isPending) return;
    isPending = true;
    antFunction(points, (path) => { console.log(path); currentPathStack.push([
        ...path.map(it => (it))
    ]) } ).then(async () => {
        while(currentPathStack.length > 0) {
            render()
            currentPathStack.splice(0, 1)
            const speedValue = speed.value;
            await delay(-speedValue + 300);
        }}
    );
    isPending = false;
});
document.getElementById("clearAll").addEventListener("click", () => {
    clearCanvas(canvas, ctx);
    points = [];
    currentPathStack = [];
});

render()
isPending = false;