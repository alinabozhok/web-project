const radius = 5.0;
export function drawPointIntoCanvas(x,y,params, ctx){

    if(params.radius !== undefined){
        ctx.beginPath();
        ctx.arc(x,y,params.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();

    }else{
        ctx.beginPath();
        ctx.arc(x,y,radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }

}