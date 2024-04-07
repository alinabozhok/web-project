import {BackStack} from "../../shared/actionBackStack.js";
import drawPoint from "../../shared/ui/drawPoint.js";

const pointRadius = 10;

const canvas = document.querySelector("#myCanvas");
const canvasBounds = canvas.getBoundingClientRect();

const ctx = canvas.getContext('2d');

const backStackApi = new BackStack();
let points = [];
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
            ctx.stroke();
            ctx.closePath();
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