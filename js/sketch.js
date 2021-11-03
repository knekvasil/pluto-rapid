// sketch.js

let debug = false;
let flowfield;
let vekts = [];

function setup() {
  // create canvas with adjusted window size
  createCanvas(windowWidth-(windowWidth*.03), windowHeight-(windowHeight*.13));
  // parameter represents density of FlowField
  flowfield = new FlowField(20);
  // Generate random vects with random speed/force
  for (let i = 0; i < 120; i++) {
    vekts.push(new Vekt(random(width), random(height), random(2, 5), random(0.1, 0.5)));
  }
}

function draw() {
  background(0);
  // debug mode shows FlowField vectors
  if (debug){
    flowfield.display();
  }

  // order all vekts to follow the field
  for (let i = 0; i < vekts.length; i++) {
    vekts[i].follow(flowfield);
    vekts[i].run();
  }
}

// toggle debug state
function keyPressed() {
  if (key == ' ') {
    debug = !debug;
  }
}

// generate new FlowField
function mousePressed() {
  flowfield.init();
}