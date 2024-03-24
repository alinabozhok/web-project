import drawMashIntoCanvas from "../../shared/ui/drawMashIntoCanvas.js";
import {BackStack} from "../../shared/actionBackStack.js";

const pointRadius = 10;
const mashSize = 50;

const canvas = document.querySelector("#myCanvas");
const canvasBounds = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d');

const backStackApi = new BackStack();
let points = [];

function render() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMashIntoCanvas(ctx, canvas.width, canvas.height, mashSize);
    points.forEach((first, firstIndex) => {
        ctx.moveTo(first.x, first.y);
        ctx.arc(first.x, first.y, pointRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.font = "45px serif";
        ctx.fillText(firstIndex.toString(), first.x + 20, first.y + 20)

        points.forEach((second, secondIndex) => {
            if (firstIndex !== secondIndex) {
                ctx.moveTo(first.x, first.y);
                ctx.lineTo(second.x, second.y);
                ctx.stroke();
            }
        })

    })
    ctx.closePath();
}

document.addEventListener('keyup', (e) => {
    if(e.ctrlKey && e.key === "z") {
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





