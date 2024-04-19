function drawPoint(x, y, params, ctx) {
    const { innerRadius = 0, outerRadius = 7, text = "" } = params;

    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#7F5939";
    ctx.fillStyle = "#8A715D";
    ctx.fill();

    ctx.stroke();
    ctx.closePath();
}
export default drawPoint;