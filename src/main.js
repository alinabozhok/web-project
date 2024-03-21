import './style.css'
import {drawIntoCanvas} from "./shared/ui/drawIntoCanvas.js";

document.querySelector('#app').innerHTML = `
  <div>
    <canvas id="canvas" width="500" height="500" style="background-color: #535bf2;"/>
  </div>
`

const canvas = document.querySelector('#canvas');

drawIntoCanvas(100, 300, 50, 75, canvas.getContext('2d'));

