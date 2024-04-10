import { clearCanvas } from "../../shared/ui/clearCanvas.js";

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const clusterCountInput = document.getElementById('clusterCount');
    const clusterButton = document.getElementById('clusterButton');
    let points = [];
    let clusterCount = parseInt(document.getElementById('clusterCount').value);
    let centroids = [];

    clusterCountInput.addEventListener('change', function() {
        clusterCount = parseInt(clusterCountInput.value);
    });


    canvas.addEventListener('mousedown', function(event) {
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
        centroids.length = 0;
    });

    clusterButton.addEventListener('click', function() {
        if(clusterCount>= points.length){
            alert("K's more than points");
            return;
        }
        centroids = getRandomCentroids(points, clusterCount);
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


    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    function drawClusters(clusters) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clusters.forEach((cluster, index) => {
            const color = getRandomColor();
            cluster.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
            });

            const centroid = centroids[index];
            ctx.beginPath();
            ctx.moveTo(centroid.x, centroid.y - 7);
            ctx.lineTo(centroid.x - 5, centroid.y + 4);
            ctx.lineTo(centroid.x + 5, centroid.y + 4);
            ctx.closePath();
            ctx.fillStyle = 'black';
            ctx.fill();
        });
    }

    function kMeansClustering(points, k) {
        centroids = getRandomCentroids(points, k);
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
