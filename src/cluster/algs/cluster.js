import {drawPointIntoCanvas} from "../../shared/ui/drawPointIntoCanvas.js";
import {clearCanvas} from "../../shared/ui/clearCanvas.js";
import {calculateDistance} from "./calculateDistance.js";
import {updateClusterCenters} from "./updateClusterCentres.js";
import {assignPointsToClusters} from "./assignPointsToClusters.js";
import {initializeClusters} from "./clusterInit.js"
import {updateClusters} from "./clusterUpdate.js";
import {drawClusters} from "./drawClusters.js";


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const radius = 2.0;

const points = [];
let clusters = [];

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const color = colorPicker.value;
    const params = { radius, color };

    points.push({x,y});
    drawPointIntoCanvas(x, y, params, ctx);
});

const clearButton = document.querySelector("#clearButton");
const clusterButton = document.querySelector("#clusterButton");

clusterButton.addEventListener("click", cluster);
clearButton.addEventListener("click", function (){
    clearCanvas(canvas,ctx);
    points.length = 0;
    clusters.length=0;
});

const clusterCountInput = document.getElementById("clusterCount");




function cluster() {
    const k = parseInt(document.getElementById("clusterCount").value);
    if (points.length < k) {
        alert("Not enough points for clustering. Please add more points.");
        return;
    }

    clusters = initializeClusters(points, k);
    clusters = updateClusters(points, clusters, 10);

    drawClusters(clusters,ctx);
}
