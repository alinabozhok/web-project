import {getDistanceFunction} from "./cluster.js";
export function dbscan(points, eps, minPts, selectedDistance, visitedPoints){
    const distanceFunction = getDistanceFunction(selectedDistance);
    let clusters = [];
    let visited = new Set();
    let isNoise = false;

    for (let point of points){
        if (visited.has(point) || visitedPoints.has(point)) continue;
        visited.add(point);
        visitedPoints.add(point);

        let neighbors = regionQuery(points, point, eps, distanceFunction);

        if(neighbors.length >= minPts){
            let cluster = [];
            expandCluster(points, point, neighbors, cluster, eps, minPts, visited, distanceFunction);
            clusters.push(cluster);
        } else {
            point.isNoise = true;
        }
    }
    return clusters;
}
export function expandCluster(points, point, neighbors, cluster, eps, minPts, visited,distanceFunction) {
    point.cluster = cluster;
    cluster.push(point);

    for (let neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            visited.add(neighbor);
            let neighborNeighbors = regionQuery(points, neighbor, eps,distanceFunction);

            if (neighborNeighbors.length >= minPts) {
                neighbors = neighbors.concat(neighborNeighbors);
            }
        }

        if (neighbor.cluster === undefined) {
            neighbor.cluster = cluster;
            cluster.push(neighbor);
        }
    }
}

export function regionQuery(points,point,eps,distanceFunction){
    return points.filter(p=>distanceFunction(point, p)<eps);
}
