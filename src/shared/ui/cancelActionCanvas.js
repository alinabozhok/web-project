export function cancelActionCanvas(canvas, ctx) {
    canvas.addEventListener("click", function(event) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}