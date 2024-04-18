export function hierarchicalClusterization(dataPoints, distanceFunction){

    function clusterDistance(cluster1, cluster2){
        let minDistance = Infinity;
        for (let i = 0; i < cluster1.length; i++) {
            for(let j = 0; j < cluster2.length; j++) {
                const dist = distanceFunction(cluster1[i], cluster2[j]);
                if(dist < minDistance){
                    minDistance = dist;
                }
            }
        }
        return minDistance;
    }

    let clusters = dataPoints.map(point => [point]);

    while (clusters.length > 1){
        let minDistance = Infinity;
        let closestClusters = [];
        for (let i = 0; i < clusters.length; i++) {
            for(let j = i + 1; j < clusters.length; j++) {
                const dist = clusterDistance(clusters[i], clusters[j]);
                if(dist < minDistance){
                    minDistance = dist;
                    closestClusters = [i, j];
                }
            }
        }
        const mergedCluster = clusters[closestClusters[0]].concat(clusters[closestClusters[1]]);
        clusters.splice(closestClusters[1], 1);
        clusters.splice(closestClusters[0], 1, mergedCluster);
    }
    return clusters;
}
