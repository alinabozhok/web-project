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
}

document.addEventListener('keyup', (e) => {
    if((e.ctrlKey && e.key === "z") || (e.ctrlKey && e.key === "я")) {
        points = [...backStackApi.popAction().snapshot];
        render();
    }
})

canvas.addEventListener('click',(e) => {
    const x = e.x - canvasBounds.x - pointRadius/2;
    const y = e.y - canvasBounds.y - pointRadius/2;
    backStackApi.pushAction("add_point", [...points]);
    points.push({ x: x, y: y });
    render();
});

document.querySelector("#bsbtn").addEventListener("click", () => {

})
render();
runTests();

