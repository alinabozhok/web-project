import {BackStack} from "../../shared/actionBackStack.js";
import drawPoint from "../../shared/ui/drawPoint.js";
import {antFunction} from "./antFunction.js";

const pointRadius = 10;

const canvas = document.querySelector("#myCanvas");
const canvasBounds = canvas.getBoundingClientRect();

const ctx = canvas.getContext('2d');

const backStackApi = new BackStack();
let points = [];
let currentPathStack = [];
let result = {visited: []};
let isPending = false;

function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        }
    }
    if(result.visited && result.visited.length > 0) {
        for(let d = 0; d < result.visited.length - 1; d++) {
            ctx.beginPath();
            ctx.moveTo(points[result.visited[d]].x, points[result.visited[d]].y);
            ctx.lineTo(points[result.visited[d + 1]].x, points[result.visited[d + 1]].y);
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
document.getElementById("start").addEventListener("click", () => {
    console.log("Before ant alg");
    result = antFunction(points);
    console.log("Answer:", result);
    render()
});

render()
isPending = false;