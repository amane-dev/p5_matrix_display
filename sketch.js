// import data from './data.js'

var messages = []

var selectedMessage = null

var zoom = 200
const centerZoom = 200;
// const maxZoom = 230;
const maxZoom = 530;
// const minZoom = 80;
const minZoom = 100;
var grid = []

// var gridCols = 10
// var gridRows = 10
var gridCols = 5
var gridRows = 5

var mouseDragging = false
var offsetX = 0
var offsetY = 0

var translationX
var translationY

var speedX = 0
var speedY = 0

var newZoom = 0


var deceleration = .5
var mouseBlob;
var mouseBlobContent;
var mouseBlobSize = 100


var mouseSize


var texts = ["Devs", "Don't", "Sleep", "At night", "because"]


var greenStrokeWeight = zoom * 0.05;
var blackStrokeWeight = 0.035 * zoom;

var mouseAnimationNoise = .1
var blobRadii = [
    70,
    30,
    30,
    70,
    60,
    40,
    60,
    40,
]

function setup(){
    var canvas = createCanvas(window.innerWidth, window.innerHeight)
    
    // canvas.parent("canvas-container")
    console.log(">> canvas")

    // for(var c = 0; c < 5; c++){
    //     var message = {
    //         id: c,
    //         word: words[Math.floor(random(0, words.length))],
    //         country: countries[Math.floor(random(0, countries.length))],
    //         date: new Date().toISOString(),
    //         image: artworks[Math.floor(random(0, artworks.length))]
    //     }

    //     messages.push(message)
    // }

    for(var x = 0; x < gridCols; x++){
        for(var y = 0; y < gridRows; y++){
            grid.push(new Cell(x, y, loadImage("/images/thnos.jpg"), texts[x%texts.length]));
        }
    }
    console.log(">> grid", grid);

    // 
    translationX = offsetX + (width-(zoom*gridCols))/2;
    translationY = offsetY + (height -(zoom*gridRows))/2;


    // mouseBlob = new MouseBlob()
    // ? mouseBlob DOM Object
    mouseBlob = createDiv()
    mouseBlob.id("mouseBlob");
    
    // mouseBlob.style('border', '5px solid red')
    mouseBlob.style('background', 'green')
    mouseBlob.style("border-radius", "70% 30% 30% 70% / 60% 40% 60% 40%");
    mouseBlob.style("display", "flex");
    mouseBlob.style("justify-content", "center");
    mouseBlob.style("text", "center");
    mouseBlob.style("font-size", "25px");
    mouseBlob.style("font-weight", "bold");
    mouseBlob.style("color", "black");
    mouseBlob.style("align-items", "center");
    mouseBlob.style("animation", "morph 3s linear infinite");
    
    // mouseBlob.position(mouseX+200, mouseY+200)
    // mouseBlob
    // border-radius: 70% 30% 30% 70% / 60% 40% 60% 40%;

    var style = createElement("style");
    style.type = "text/css";
    var keyFrames =
        `
            @keyframes morph{
            0%, 100% {
            border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%;
            }
            34% {
                border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%;
            }
            67% {
                border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%;
            }
        }`;
        style.html(keyFrames)
        selectAll("head")[0].child(style);
        select("body").style("cursor", "none")
        
}

function mouseBlobAnimation(){
    var radiiValue = ""
    for(var i = 0; i < blobRadii.length/2; i++){
        radiiValue += mapNoise(mouseAnimationNoise + .01) + "% ";
    }
    radiiValue += "/ "
    for(var i = blobRadii.length/2; i < blobRadii.length; i++){
        radiiValue += mapNoise(mouseAnimationNoise + .01) + "% ";
    }
    return radiiValue

    function mapNoise(value){
        return map(noise(value), 0, 1, 30, 70);
    }
}


function resetTranslation(){
    translationX = offsetX + (width-(zoom*gridCols))/2;
    translationY = offsetY + (height -(zoom*gridRows))/2;
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1;
    }
    return i + j * cols;
}

var mouseBlobAngles = [20, 20, 20, 20]
var mouseBlobAngleNoiseValues = [.0, .0, .0, .0]
var noiseValue = 0.0;


function mouseBlobby(){
    noiseValue += 0.01
    push()
    // mouse blob
    fill(23, 200, 240)
    for(var a = 0; a < mouseBlobAngleNoiseValues.length; a++){
        mouseBlobAngleNoiseValues[a] += random(0.1, 1)
    }
    for(var a = 0; a < mouseBlobAngles.length; a++){
        mouseBlobAngles[a] = map(noise(mouseBlobAngleNoiseValues[a]), 0, 1, 20, 40)
    }
    pop()

}
function draw(){
    background(230)
    // mouseBlobby()
    mouseBlobSize = min(.5 *zoom + 10, 130)
    
    mouseBlob.style("width", mouseBlobSize + "px");
    mouseBlob.style("height", mouseBlobSize + "px");
    mouseBlob.position(mouseX -mouseBlobSize/2, mouseY-mouseBlobSize/2)
    mouseBlob.child()

    noFill()
    if(mouseDragging){
        offsetX += mouseX
        // offsetY += mouseY
    }
    resetTranslation()

    push();
    translate(translationX, translationY)
    // make grid
        for(var i = 0; i < grid.length; i++){
            grid[i].draw()
        }
    pop()
    // drag slide animation
    if(Math.abs(speedX) > 0 || Math.abs(speedY) > 0){
        offsetX += speedX
        offsetY += speedY
        // TODO implement
        // if(offsetX > window.innerHeight || offsetX < 0){
        //     offsetX -= speedX;
        // }
        // if(offsetY > window.innerHeight || offsetY < 0){
        //     offsetY -= speedY;
        // }
        // console.log(">> sliddde >>", offsetX, offsetY);
    }

    if(newZoom > 0){
        if(zoom > newZoom){
            zoom -= deceleration
        } else if(zoom < newZoom) {
            zoom += deceleration
        }else {
            newZoom = 0
        }
    }

    // x deceleration
    if(speedX > 0){
        speedX -= deceleration
    }else if(speedX < 0) {
        speedX += deceleration
    }

    // y deceleration
    if(speedY > 0){
        speedY -= deceleration
    }else if(speedY < 0) {
        speedY += deceleration
    }
}


// Zoom on scrool
function mouseWheel(event) {
  //move the square according to the vertical scroll amount
    var value = zoom + event.delta;
    if(value < minZoom || value > maxZoom){
        return false
    }

    console.log(">> scroll", event.delta, value, zoom);
    resetTranslation()
    zoom = value
}

function resetToCenter(){
    offsetX = 0
    offsetY = 0
    newZoom = centerZoom
    resetTranslation()
}

// drag

function mouseDragged(evt){
    console.log(">> dragged", evt);

    if(evt.offsetX > translationX && evt.offsetX < (translationX+gridCols*zoom)){
        // console.log(">> inside", evt.movementX, evt.offsetX, gridCols*zoom);
        speedX =  evt.movementX
        speedY =  evt.movementY
        console.log(">> slide", speedX, speedY);
        // 
    }else {
        // ! // TODO implement spring physics to bounce back
        console.log(">> slide bounce", speedX, speedY);
        speedX =  evt.movementX
        speedY =  evt.movementY
    }
}
function mousePressed(){
    // mouseDragging = true
    console.log(">> pressed", offsetX, offsetY);



}
function mouseClicked(){
    for (var i = 0; i < grid.length; i++) {
        grid[i].mouseClicked();
    }
}
function mouseReleased(){
    // mouseDragging = false
    console.log(">> released");
}


// function MessageNode(message, x, y){

//     draw = ()=>{
//         // if(mouseX >)
//         rect(this.x*zoom, this.y*zoom, zoom)
//     }
// }

function Cell(x, y, img, word) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.word = word;
    // this.elem = createDiv()
    this.hovering = false;

    // stroke weights
    // when the zoom is 200 greenStrokeWeight => 10
    // const greenStrokeWeight = 10;
    // const greenStrokeWeight = .05 * zoom;

    
    
    // when the zoom is 200 blackStrokeWeight => 7
    // const blackStrokeWeight = 10 - 3;


    // this.elem.style('background','red')
    // this.elem.style('border','2px solid black')
    this.size = zoom;
    this.draw = () => {
        greenStrokeWeight = zoom * 0.05;
        blackStrokeWeight = 0.035 * zoom;
        this.size = zoom;
        // this.elem.position(translationX + this.x * zoom, translationY* this.y + zoom);
        // this.elem.style('width', zoom + 'pt')
        // this.elem.style('height', zoom + 'pt')
        rect(this.x * this.size, this.y * this.size, this.size);
        var imgSize = this.size;
        var imgX = this.x * this.size;
        var imgY = this.y * this.size;
        // on HOVER Scale down image
        if (this.mouseEnter()) {
            imgSize = this.size - greenStrokeWeight - blackStrokeWeight * 4;
            imgX += (greenStrokeWeight + blackStrokeWeight * 4) / 2;
            imgY += (greenStrokeWeight + blackStrokeWeight * 4) / 2;
        }
        image(this.img, imgX, imgY, imgSize, imgSize);

        // on HOVER draw contour
        if (this.mouseEnter()) {
            this.drawContour()
        }


    };
    // ?? Draws 3 contours : 7px black 10px green 7px black
    this.drawContour = () => {
        push();
        noFill();
        strokeWeight(blackStrokeWeight);
        stroke(0);
        // ! // TODO refractor & document
        rect(this.x * zoom + blackStrokeWeight / 2, this.y * zoom + blackStrokeWeight / 2, zoom - blackStrokeWeight);
        stroke(0, 230, 0);
        strokeWeight(greenStrokeWeight);
        rect(
            this.x * zoom + blackStrokeWeight + greenStrokeWeight / 2,
            this.y * zoom + blackStrokeWeight + greenStrokeWeight / 2,
            zoom - greenStrokeWeight - blackStrokeWeight * 2
        );
        stroke(0);
        strokeWeight(blackStrokeWeight);
        rect(
            this.x * zoom + blackStrokeWeight * 2 + greenStrokeWeight / 2,
            this.y * zoom + blackStrokeWeight * 2 + greenStrokeWeight / 2,
            zoom - greenStrokeWeight - blackStrokeWeight * 4
        );
        /// ! // To my future self or whoever finds this repo
        /// ? If you wish to add another contour layer
        /// ? just do :
        /// ? x= x*zoom +...previousLayersStrokeWeights+  layerStrokeWeight/2
        /// ? y= y*zoom +...previousLayersStrokeWeights+  layerStrokeWeight/2
        /// ? size = zoom - ...previousLayersStrokeWeights - layerStrokeWeight
        pop();

        textSize(0.2 * zoom);
        // TODO center text on image

        // mouseBlob.html(this.word)
        mouseBlob.html(this.x + this.y * gridCols);
        // this.htmlContent.parent("mouseBlob")
        // fill(230)
        // text(this.word, this.x * zoom + (0.2 * zoom) / 2, this.y * zoom + zoom / 2);
        // console.log(">> text", this.word);
    }; 

    this.mouseClicked = () => {
        console.log(">>> mouse clicked", mouseX, mouseY);
    }
    // mouse is hovering
    this.mouseEnter = () => {
        return (mouseX > translationX + this.x * zoom && mouseX < translationX + this.x * zoom + zoom)
            && (mouseY > translationY + this.y * zoom && mouseY < translationY + this.y * zoom + zoom)
    }
}

var yoff = 0

function MouseBlob(){
    this.draw = ()=>{

        push()
            // angleMode(DEGREES)
            
            // strokeWeight(3)
            // stroke(230, 220, 140)
            // stroke(0, 20, 255)
            fill(5, 250, 2)
            translate(mouseX  - 50/2, mouseY - 50/2)
            beginShape()
            var xoff = 0
                for(var angle = 0; angle < TWO_PI; angle += .1){
                    var offset = map(noise(xoff, yoff), 0, 1, 0, 25)
                    var r = 50 + offset
                    var x = r * cos(angle)
                    var y = r * sin(angle)
                    
                    vertex(x, y)
                    xoff += .1
                }
            endShape(CLOSE) 
        pop()
        yoff += .01
    }
}
