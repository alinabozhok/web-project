import {drawPointIntoCanvas} from "../../shared/ui/drawPointIntoCanvas.js";
import {clearCanvas} from "../../shared/ui/clearCanvas.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const radius = 2.0;

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const color = colorPicker.value;
    const params = { radius, color };
    drawPointIntoCanvas(x, y, params, ctx);
});

const clearButton = document.querySelector("#clearButton")

clearButton.addEventListener("click", function (){
    clearCanvas(canvas,ctx);

});

function cluster () {


}
