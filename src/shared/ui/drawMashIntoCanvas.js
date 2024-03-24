
function drawMashIntoCanvas(ctx, width, height, mashSize) {
    const verticalLineCount = Math.round(width/mashSize);
    const horizontalLineCount = Math.round(height/mashSize);

    for(let i = 0; i < verticalLineCount; i++) {
        ctx.fillRect(i * mashSize, 0, 1, height);
    }
    for(let j = 0; j < horizontalLineCount; j++) {
        ctx.fillRect(0, j * mashSize, width, 1);
    }
}

export default drawMashIntoCanvas;