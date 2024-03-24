import drawMashIntoCanvas from "../../shared/ui/drawMashIntoCanvas.js";

const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext('2d');

drawMashIntoCanvas(ctx, canvas.width, canvas.height, 50);