export function updateClusterCenters(clusters) {
    for (const cluster of clusters) {
        if (cluster.points.length === 0) {
            continue;
        }
        let sumX = 0;
        let sumY = 0;
        for (const point of cluster.points) {
            sumX += point.x;
            sumY += point.y;
        }
        const centerX = sumX / cluster.points.length;
        const centerY = sumY / cluster.points.length;
        cluster.center = { x: centerX, y: centerY };
        cluster.points = [];
    }
}