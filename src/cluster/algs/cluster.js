import { clearCanvas } from "../../shared/ui/clearCanvas.js";
import { kMeansClustering, getRandomCentroids } from "./k-means.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clusterCountInput = document.getElementById('clusterCount');
const clusterButton = document.getElementById('clusterButton');
let points = [];
let clusterCount = parseInt(document.getElementById('clusterCount').value);
let centroids = [];
let isDrawing = false;

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

