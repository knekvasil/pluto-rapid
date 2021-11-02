// sketch.js

let x = 0;
let y = 0;

let debug = false;

let flowField;

let vects = [];


function setup(){
    createCanvas(windowWidth-(windowWidth*.03),windowHeight-(windowHeight*.13));
    stroke(255);
    frameRate(30);
    flowField = new FlowField(20)
    for(let i = 0; i < 100; i++) {
        vects.push(new Vect(random(width), random(height), random(2,5), random(0.1,0.5)));
    }
}

function draw() {
    displayText();
    keyPressed();

    if (debug) {
        flowField.displayField();
    } 

    for(let i = 0; i < vects.length; i++) {
        vects[i].follow(flowField)
        vects[i].initializeVect()
    }
}

function keyPressed() {
    if (keyCode === RETURN) {
      wipe();
      beginGame();
    } else if(key === " "){
        debug = !debug
    }
}

function wipe() {
    background(0);
}

function displayText() {
    const beginningText = "Press [ENTER] to begin";
    textFont('Chelsea Market')
    textSize(20);
    textAlign(CENTER);
    fill(255);
    text(beginningText,windowWidth * .5,windowHeight * .25);
}
  
function drawPluto() {
    wipe();
    x = lerp(x,mouseX, 0.05);
    y = lerp(y,mouseY, 0.05);
    ellipse(x, y, 50, 50);
}

function beginGame() {
    drawPluto();
}