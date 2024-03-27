import drawMashIntoCanvas from "../../shared/ui/drawMashIntoCanvas.js";
import {BackStack} from "../../shared/actionBackStack.js";

const pointRadius = 10;
const mashSize = 60;

const canvas = document.querySelector("#myCanvas");
const canvas1 = document.querySelector("#myCanvas1");
const canvasBounds = canvas.getBoundingClientRect();

const ctx = canvas.getContext('2d');
const ctx1 = canvas1.getContext('2d');

const backStackApi = new BackStack();
let points = [];
let distance = [];

function render() {
    ctx.beginPath();
    ctx1.beginPath();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

    let i = 20;
    drawMashIntoCanvas(ctx, canvas.width, canvas.height, mashSize);
    for (let k = 0; k < points.length; k++) {
        ctx.moveTo(points[k].x, points[k].y);
        ctx.arc(points[k].x, points[k].y, pointRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.font = "45px serif";
        ctx.fillText(k.toString(), points[k].x + 20, points[k].y + 20)

        for (let j = k + 1; j < points.length; j++) {
            if (i < canvas1.height) {
                ctx.moveTo(points[k].x, points[k].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();

                let hypot = Math.round(Math.hypot(points[j].x - points[k].x, points[j].y - points[k].y));
                distance.push({firstPoint: k, secondPoint: j, dist: hypot});
                let text = `dot ${k.toString()} dot ${j.toString()}  ${hypot.toString()}`;
                ctx1.font = "25px serif";
                ctx1.fillText(text, 50, i);
                i += 30;

            }
        }

    }
    ctx.closePath();
    ctx1.closePath();
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

render();







