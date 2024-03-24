import {assignPointsToClusters} from "./assignPointsToClusters.js";
import {updateClusterCenters} from "./updateClusterCentres.js";

export function updateClusters(points, clusters, maxIterations) {
    let iteration = 0;
    while (iteration < maxIterations) {
        assignPointsToClusters(points, clusters);
        updateClusterCenters(clusters);
        iteration++;
    }
    return clusters;
}

