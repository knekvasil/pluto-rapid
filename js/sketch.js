// sketch.js

// toggle on/off FlowField vectors
let debug = false;
// bool: if in ongoing game
let gameOngoing = false;
// declare flowfield
let flowfield;
// declare vekt array
let vekts = [];
// init Pluto starting position
let x = 0;
let y = 0;
// init score
let score = 0;
// init final score
let finalScore = 0;

function setup() {
  // create canvas with adjusted window size
  createCanvas(windowWidth-(windowWidth*.03), windowHeight-(windowHeight*.13));
  // parameter represents density of FlowField
  flowfield = new FlowField(20);
  drawVekts();
}

function draw() {
  if(gameOngoing){
    // init background
    background(0);
    // draw Pluto + bottom right score
    drawPluto();
    drawScore();

    // live-track Pluto's position
    let plutoPosition = createVector(x,y)

    // debug mode shows FlowField vectors
    if (debug){
      flowfield.display();
    }

    // order all vekts to follow the field
    for (let i = 0; i < vekts.length; i++) {
      vekts[i].follow(flowfield);
      vekts[i].run();
    }
    // kill game if any vekt makes contact with Pluto's event horizon
    for(let i = 0; i < vekts.length; i++){
      if (p5.Vector.dist(vekts[i].position, plutoPosition) <= 30) {
        gameOngoing = false;
        finalScore = score;
      }
    } 

    // continuously increase score
    score += round(frameCount / 60);

    // load new FlowField randomly
    if(score % 100 === 0){
      flowfield.init();
    }
  } else {
    // reset game
    initGame();
  }
}

// toggle debug state
function keyPressed() {
  if (key == ' ') {
    debug = !debug;
  }
  if (keyCode == RETURN) {
    if (!gameOngoing) {
      gameOngoing = !gameOngoing;
    } 
  }
}

function drawPluto() {
  x = lerp(x, mouseX, 0.05);
  y = lerp(y, mouseY, 0.05);
  ellipse(x, y, 50, 50);
  
}

function drawScore() {
  textFont('Chelsea Market');
  textSize(20);
  fill(255);
  text(score, width-100, height-10);
}

// draw starting text
function drawMenu() {
  textFont('Chelsea Market');
  textSize(20);
  textAlign(CENTER);
  const beginningText = "Press [ENTER] to begin";
  fill(255);
  text(beginningText, width * .5, height * .25);
}

// draw final score
function drawFinalScore(){
  textFont('Chelsea Market');
  textSize(20);
  fill(255);
  text(finalScore, width * .5, height* .25 + 30);
}

// Generate random vekts with random speed/force
function drawVekts() {
  for (let i = 0; i < 240; i++) {
    vekts.push(new Vekt(random(100,width-100), random(100,height-100), random(2, 5), random(0.1, 0.5)));
  }
}

// wipe vekt array
function clearVekts(){
  vekts = [];
}

// generate new game
function initGame() {
  // reset Pluto's starting location back to the upper-left corner
  x = 0;
  y = 0;
  // reset score
  score = 0;
  // empty vekt array
  clearVekts();
  // wipe board
  clear();
  // redraw menu
  drawMenu();
  // initFlowField
  flowfield.init();
  // init vekt array
  drawVekts();
  // draw final score
  drawFinalScore();
}
