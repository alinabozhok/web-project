import { clearCanvas } from "../../shared/ui/clearCanvas.js";
import { kMeansClustering, getRandomCentroids,calculateCentroid } from "./k-means.js";
import {euclideanDistance,manhattanDistance,chebyshevDistance} from "./distances.js";
import {hierarchicalClusterization} from "./hierarchial.js";
import {dbscan} from "./dbscan.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clusterCountInput = document.getElementById('clusterCount');
const clusterButton = document.getElementById('clusterButton');
const distanceSelect = document.getElementById('distanceMeasure');
const epsSlider = document.getElementById('eps');
const epsValue = document.getElementById('epsValue');
const minPtsSlider = document.getElementById('minPts');
const minPtsValue = document.getElementById('minPtsValue');

let points = [];
let clusterCount = parseInt(document.getElementById('clusterCount').value);
let centroids = [];
let isDrawing = false;
document.addEventListener("DOMContentLoaded", function() {
    const distanceSelect = document.getElementById('distanceMeasure');
    distanceSelect.addEventListener('change', function() {
        const selectedDistance = distanceSelect.value;
        const distanceFunction = getDistanceFunction(selectedDistance);

    });
});

epsSlider.addEventListener('input',function (){
    epsValue.textContent=this.value;
});
minPtsSlider.addEventListener('input',function (){
    minPtsValue.textContent=this.value;
});


clusterCountInput.addEventListener('change', function() {
    clusterCount = parseInt(clusterCountInput.value);
});

canvas.addEventListener('mousedown', function(event) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({ x, y });
    drawPoints();
});

canvas.addEventListener('mousemove', function(event) {
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        points.push({ x, y });
        drawPoints();
    }
});

canvas.addEventListener('mouseup', function() {
    isDrawing = false;
});

canvas.addEventListener('mouseleave', function() {
    isDrawing = false;
});

const clearButton = document.querySelector("#clearButton");
clearButton.addEventListener("click", function (){
    clearCanvas(canvas,ctx);
    points.length = 0;
    centroids.length = 0;
});

clusterButton.addEventListener('click', function() {

    if(clusterCount >= points.length) {
        alert("K's more than points");
        return;
    }

    const selectedDistance = distanceSelect.value;
    const distanceFunction = getDistanceFunction(selectedDistance);


    /*const hierarchicalClusters = hierarchicalClusterization(points, distanceFunction);
    const hierarchicalCentroids = hierarchicalClusters.map(cluster => calculateCentroid(cluster));
    drawClusters(hierarchicalClusters, hierarchicalCentroids);


    const kMeansClusters = kMeansClustering(points, clusterCount, distanceFunction);
    const kMeansCentroids = kMeansClusters.map(cluster => calculateCentroid(cluster));
    drawClusters(kMeansClusters, kMeansCentroids);*/


    let visitedPoints = new Set();

    const dbscanClusters = dbscan(points, parseFloat(epsSlider.value), parseInt(minPtsSlider.value), distanceFunction, visitedPoints);
    console.log(dbscanClusters);
    drawDBSCANClusters(dbscanClusters);


});

export function getDistanceFunction(selectedDistance) {
    switch (selectedDistance) {
        case 'euclidean':
            return euclideanDistance;
        case 'manhattan':
            return manhattanDistance;
        case 'chebyshev':
            return chebyshevDistance;
        default:
            return euclideanDistance;
    }
}

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
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

function drawClusters(clusters, centroids) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    clusters.forEach((cluster, index) => {
        const color = getRandomColor();
        cluster.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        });

        const centroid = centroids[index];

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.moveTo(centroid.x - 10, centroid.y - 10);
        ctx.lineTo(centroid.x + 10, centroid.y + 10);
        ctx.moveTo(centroid.x + 10, centroid.y - 10);
        ctx.lineTo(centroid.x - 10, centroid.y + 10);
        ctx.stroke();
        ctx.closePath();
    });
}
function drawDBSCANClusters(clusters) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create an array to store all points, including noise points
    let allPoints = [];

    // Collect all points from clusters
    clusters.forEach(cluster => {
        allPoints = allPoints.concat(cluster);
    });

    // Draw all points
    allPoints.forEach(point => {
        if (point.cluster === -1) {
            // Draw cross for noise points
            ctx.beginPath();
            ctx.moveTo(point.x - 10, point.y - 10);
            ctx.lineTo(point.x + 10, point.y + 10);
            ctx.moveTo(point.x + 10, point.y - 10);
            ctx.lineTo(point.x - 10, point.y + 10);
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.closePath();
        } else {
            // Draw circle for normal points
            const color = getRandomColor();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    });
}





