// vect.js

class Vekt {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    // adjust vekt size
    this.size = 4;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
  }

  run() {
    this.updateVektLocation();
    this.fieldWrap();
    this.display();
  }

  // Craig W. Reynolds' secret sauce
  follow(flowField) {
    // grab FieldFlow vector at current vekt position
    let desired = flowField.lookup(this.position);
    // desired *= vekt maxSpeed
    desired.mult(this.maxSpeed);
    // desired - velocity = steering
    let steer = p5.Vector.sub(desired, this.velocity);
    // bound turning radius for smooth turns
    steer.limit(this.maxForce); 
    // vekt gasoline
    this.applyForce(steer);
  }

  // vekt go
  applyForce(force) {
    this.acceleration.add(force);
  }

  updateVektLocation() {
    // update/limit velocity at position
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);

    // reset acceleration
    this.acceleration.mult(0);
  }

  // telport vekt to opposite edge if travels off canvas
  fieldWrap() {
    if (this.position.x < -this.size) {
      this.position.x = width + this.size;
    }
    if (this.position.y < -this.size) {
      this.position.y = height + this.size;
    }
    if (this.position.x > width + this.size) {
      this.position.x = -this.size;
    }
    if (this.position.y > height + this.size) {
      this.position.y = -this.size;
    }
  }

  display() {
    // vekt must rotate in the direction of velocity
    let theta = this.velocity.heading() + PI / 2;
    
    // vekt coloring
    fill(127);
    stroke(200);
    strokeWeight(1);

    // start new drawing state for vekt
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.size * 2);
    vertex(-this.size, this.size * 2);
    vertex(0, this.size);
    vertex(this.size, this.size * 2);
    endShape(CLOSE);
    pop();
  }
}
