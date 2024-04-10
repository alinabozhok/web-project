export function kMeansClustering(points, k) {
    let centroids = getRandomCentroids(points, k);
    let clusters = Array.from({ length: k }, () => []);

    while (true) {

        clusters = Array.from({ length: k }, () => []);
        points.forEach(point => {
            const closestCentroidIndex = findClosestCentroidIndex(point, centroids);
            clusters[closestCentroidIndex].push(point);
        });

        const newCentroids = [];
        clusters.forEach(cluster => {
            const centroid = calculateCentroid(cluster);
            newCentroids.push(centroid);
        });


        if (JSON.stringify(newCentroids) === JSON.stringify(centroids)) {
            break;
        }

        centroids = newCentroids;
    }

    return clusters;
}

export function getRandomCentroids(points, k) {
    const centroids = [];
    const indices = new Set();

    while (indices.size < k) {
        const index = Math.floor(Math.random() * points.length);
        indices.add(index);
    }

    indices.forEach(index => {
        centroids.push(points[index]);
    });

    return centroids;
}

export function findClosestCentroidIndex(point, centroids) {
    let minDistance = Number.MAX_VALUE;
    let closestIndex = -1;

    centroids.forEach((centroid, index) => {
        const distance = Math.sqrt(Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2));
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });

    return closestIndex;
}

export function calculateCentroid(points) {
    const centroid = { x: 0, y: 0 };
    points.forEach(point => {
        centroid.x += point.x;
        centroid.y += point.y;
    });

    centroid.x /= points.length;
    centroid.y /= points.length;

    return centroid;
}
