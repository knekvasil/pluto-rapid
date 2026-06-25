class Vekt {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.size = 4;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.trail = [];
    this.trailLength = 8;

    let neon = [
      [100, 255, 200],
      [255, 100, 200],
      [200, 100, 255],
      [255, 200, 100],
      [100, 200, 255],
      [200, 255, 100]
    ];
    this.color = random(neon);
  }

  run(dt) {
    this.updateVektLocation(dt);
    this.updateTrail();
    this.fieldWrap();
    this.display();
  }

  follow(flowField) {
    let desired = flowField.lookup(this.position);
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  updateVektLocation(dt) {
    this.velocity.add(p5.Vector.mult(this.acceleration, dt));
    this.velocity.limit(this.maxSpeed);
    this.position.add(p5.Vector.mult(this.velocity, dt));
    this.acceleration.mult(0);
  }

  updateTrail() {
    this.trail.push({ x: this.position.x, y: this.position.y });
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }
  }

  fieldWrap() {
    let wrapped = false;
    if (this.position.x < -this.size) {
      this.position.x = width + this.size;
      wrapped = true;
    }
    if (this.position.y < -this.size) {
      this.position.y = height + this.size;
      wrapped = true;
    }
    if (this.position.x > width + this.size) {
      this.position.x = -this.size;
      wrapped = true;
    }
    if (this.position.y > height + this.size) {
      this.position.y = -this.size;
      wrapped = true;
    }
    if (wrapped) {
      this.trail = [];
    }
  }

  display() {
    for (let i = 0; i < this.trail.length; i++) {
      let a = map(i, 0, this.trail.length, 10, 60);
      let s = map(i, 0, this.trail.length, 1, this.size);
      fill(this.color[0], this.color[1], this.color[2], a);
      noStroke();
      ellipse(this.trail[i].x, this.trail[i].y, s, s);
    }

    let theta = this.velocity.heading() + PI / 2;
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    noStroke();
    fill(this.color[0], this.color[1], this.color[2]);
    beginShape();
    vertex(0, -this.size * 2);
    vertex(-this.size, this.size * 2);
    vertex(0, this.size);
    vertex(this.size, this.size * 2);
    endShape(CLOSE);
    pop();
  }
}
