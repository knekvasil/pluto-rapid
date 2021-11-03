// flowfield.js

class FlowField {
  constructor(resolution) {
    // calculate density of FlowField (smaller # = more dense)
    this.resolution = resolution;
    // calculate row + column count based on width/height 
    this.columns = width / this.resolution;
    this.rows = height / this.resolution;
    // fill 2d array of rows x columns
    this.field = this.generate2DArray(this.columns);
    this.init();
  }

  generate2DArray(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
      arr[i] = [];
    }
    return arr;
  }

  init() {
    // generate random seed
    noiseSeed(Math.floor(random(10000)));
    let xOffset = 0;
    for (let i = 0; i < this.columns; i++) {
      let yOffset = 0;
      for (let j = 0; j < this.rows; j++) {
        // map Polar --> Cartesian 
        let theta = map(noise(xOffset, yOffset), 0, 1, 0, TWO_PI);
        this.field[i][j] = createVector(cos(theta), sin(theta));
        yOffset += 0.1;
      }
      xOffset += 0.1;
    }
  }

  // draw all fieldVectors
  display() {
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.drawFieldVector(this.field[i][j], i * this.resolution, j * this.resolution, this.resolution - 2);
      }
    }
  }
  
  // GET fieldVector info at position
  lookup(position) {
    let column = Math.floor(constrain(position.x / this.resolution, 0, this.columns - 1));
    let row = Math.floor(constrain(position.y / this.resolution, 0, this.rows - 1));
    
    return this.field[column][row].copy();
  }

  // initializes fieldVector object at (x,y)
  drawFieldVector(fieldVector, x, y, scale) {
    // start new drawing state for fieldVector
    push();
    let arrowSize = 4;
    // translate to location to init vector
    translate(x, y);
    stroke(200, 100);
    // rotate fieldVector heading to correct direction
    rotate(fieldVector.heading());
    // scale fieldVector (visually) based on FlowField density
    let length = fieldVector.mag() * scale;
    // draw fieldVector
    line(0, 0, length, 0);
    line(length,0,length-arrowSize,+arrowSize/2);
    line(length,0,length-arrowSize,-arrowSize/2);
    pop();
  }
}
