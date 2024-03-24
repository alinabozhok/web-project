export function drawClusters(clusters, ctx) {
    for (const cluster of clusters) {
        const { x, y } = cluster.center;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red'; // Цвет кластера
        ctx.fill();
    }
}
