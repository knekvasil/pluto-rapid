// sketch.js

let x = 0;
let y = 0;


function setup(){
    createCanvas(windowWidth-(windowWidth*.03),windowHeight-(windowHeight*.13));
    stroke(255);
}

function draw() {
    displayText();
    keyPressed();
    
}

function keyPressed() {
    if (keyCode === RETURN) {
      wipe();
      beginGame();
    }
}

function wipe() {
    background(0);
}

function displayText() {
    textFont('Chelsea Market')
    textSize(20);
    textAlign(CENTER);
    const beginningText = "Press [ENTER] to begin";
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