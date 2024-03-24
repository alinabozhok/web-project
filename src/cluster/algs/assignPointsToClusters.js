import {calculateDistance} from "./calculateDistance.js";

export function assignPointsToClusters(points, clusters) {
    for (const point of points) {
        let minDistance = Infinity;
        let closestCluster = null;
        for (const cluster of clusters) {
            const distance = calculateDistance(point, cluster.center);
            if (distance < minDistance) {
                minDistance = distance;
                closestCluster = cluster;
            }
        }
        closestCluster.points.push(point);
    }
}

