// Try tweaking these. 
const MAX_ITERATIONS = 51; // Arbit
// const Colors = [[255,0,0,255], [0,0,0,255], [0,255,0,255],[0,0,255,255],[255,255,0,255]];
const Colors = [[255,255,255,255], [0,0,0,255], [255,255,255,255],[255,255,255,255],[255,255,255,255]]

const c = document.getElementById("mandlebrotSetWrap")
const canvasHeight = c.height;
const canvasWidth = c.width;
let ctx = c.getContext('2d');
let canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
let currentColorIndex = 0;
let iter = 1;

function madlebrotFunction(z, c){
    let res = [z[0] * z[0] - z[1]*z[1] + c[0], 2*z[0]*z[1] + c[1]]
    return res;
}

function isInsideSet(point, numIterations){
    let z = [0,0];
    for(let i = 0; i < numIterations; i++){
        z = madlebrotFunction(z, point);
        if(Math.sqrt(z[0]*z[0] + z[1]*z[1]) > 2){
            return false;
        }
    }
    return true;
}
// 
function drawOneIteration(){
    let k = 0;
    const N = canvasWidth;
    color = currentColor();
    for(let i = 0; i < N; i++){
        for (let j = 0; j < N; j++){
            let point = [((i - N/2)*4)/N,((j - N/2)*4)/N]
            if(isInsideSet(point, iter)){
                pointInSpace = [i, j];
                makeAPoint(pointInSpace, color);
            }
        }
    }
    iter++;   
    updateCanvas();
}

// MAX_ITERATIONS Iterations is a random choice. You can go ahead with more. 
async function DrawMandleBrotSet(){
    for(let i = 0 ; i < MAX_ITERATIONS; i++){
        requestAnimationFrame(drawOneIteration)
        await delay(100);
    }
}

function DwonloadAsImage(){
    download(c, 'Mandelbrotset.png')
}

// Keeping track of color
function currentColor(){
    if (++currentColorIndex >= Colors.length) currentColorIndex = 0
    return Colors[currentColorIndex]
}

// Drawing Helpers

function makeAPoint(pos, color){
    let index = (pos[0] + pos[1] * canvasWidth) * 4;
    canvasData.data[index + 0] = color[0];
    canvasData.data[index + 1] = color[1];
    canvasData.data[index + 2] = color[2];
    canvasData.data[index + 3] = color[3];
}

function updateCanvas(){
    console.log("Updating Canvas");
    ctx.putImageData(canvasData, 0,0);
}

/* Canvas Download : refrence : https://codepen.io/joseluisq/pen/mnkLu*/
function download(canvas, filename) {
    /// create an "off-screen" anchor tag
    var lnk = document.createElement('a'), e;
  
    /// the key here is to set the download attribute of the a tag
    lnk.download = filename;
  
    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    lnk.href = canvas.toDataURL("image/png;base64");
  
    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {
      e = document.createEvent("MouseEvents");
      e.initMouseEvent("click", true, true, window,
                       0, 0, 0, 0, 0, false, false, false,
                       false, 0, null);
  
      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent("onclick");
    }
  }


// Utility
async function delay(t) {
    return new Promise(res=> setTimeout(res, t));
}

function Main(){
    document.getElementById("playButton").addEventListener('click', ()=>{
        DrawMandleBrotSet();
    });
    document.getElementById("downloadButton").addEventListener('click', ()=>{
        DwonloadAsImage();
    });
}

window.onload = Main;