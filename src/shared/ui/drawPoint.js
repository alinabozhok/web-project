function drawPoint(x, y, params, ctx) {
    const { innerRadius = 0, outerRadius = 15, text = "" } = params;

    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";

    ctx.stroke();
    ctx.closePath();
}
export default drawPoint;