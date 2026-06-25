class FlowField {
  constructor(resolution) {
    this.resolution = resolution;
    this.init();
  }

  init() {
    noiseSeed(Math.floor(random(10000)));
    this.zOff = 0;
  }

  update() {
    this.zOff += 0.003;
  }

  lookup(position) {
    let theta = noise(position.x * 0.005, position.y * 0.005, this.zOff) * TWO_PI;
    return createVector(cos(theta), sin(theta));
  }

  display() {
    for (let x = 0; x < width; x += this.resolution) {
      for (let y = 0; y < height; y += this.resolution) {
        let v = this.lookup(createVector(x, y));
        this.drawFieldVector(v, x, y, this.resolution - 2);
      }
    }
  }

  drawFieldVector(fieldVector, x, y, scale) {
    push();
    let arrowSize = 4;
    translate(x, y);
    stroke(200, 100);
    rotate(fieldVector.heading());
    let length = fieldVector.mag() * scale;
    line(0, 0, length, 0);
    line(length, 0, length - arrowSize, +arrowSize / 2);
    line(length, 0, length - arrowSize, -arrowSize / 2);
    pop();
  }
}
