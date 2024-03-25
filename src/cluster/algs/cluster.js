import {clearCanvas} from "../../shared/ui/clearCanvas.js";

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const clusterCountInput = document.getElementById('clusterCount');
    const clusterButton = document.getElementById('clusterButton');
    let points = [];
    let clusterCount = parseInt(document.getElementById('clusterCount').value);

    clusterCountInput.addEventListener('change', function() {
        clusterCount = parseInt(clusterCountInput.value);
    });


    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        points.push({ x, y });
        drawPoints();
    });

    const clearButton = document.querySelector("#clearButton");
    clearButton.addEventListener("click", function (){
        clearCanvas(canvas,ctx);
        points.length = 0;
    });

    clusterButton.addEventListener('click', function() {
        if(clusterCount>= points.length){
            alert("K's more than points");
            return;
        }
        const clusters = kMeansClustering(points, clusterCount);
        drawClusters(clusters);
    });

    function drawPoints() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();
            ctx.closePath();
        });
    }


    function drawClusters(clusters) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clusters.forEach((cluster, index) => {
            cluster.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${360 * index / clusters.length}, 100%, 50%)`;
                ctx.fill();
                ctx.closePath();
            });
        });
    }

    function kMeansClustering(points, k) {
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

    function getRandomCentroids(points, k) {
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

    function findClosestCentroidIndex(point, centroids) {
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

    function calculateCentroid(points) {
        const centroid = { x: 0, y: 0 };
        points.forEach(point => {
            centroid.x += point.x;
            centroid.y += point.y;
        });

        centroid.x /= points.length;
        centroid.y /= points.length;

        return centroid;
    }
});
