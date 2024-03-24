export function initializeClusters(points, k) {
    const clusters = [];
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * points.length);
        const center = points[randomIndex];
        clusters.push({ center, points: [] });
    }
    return clusters;
}