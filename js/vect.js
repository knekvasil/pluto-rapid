// vect.js

class Vect {
    constructor(x, y, maxSpeed, maxForce) {
        // x, y position
        this.x = x;
        this.y = y;
        // speed, force will be randomly generated when initialized
        self.maxSpeed = maxSpeed;
        self.maxForce = maxForce;
        // position vector
        this.position = createVector(x,y);
        // acceleration, velocity will be determined by vect + FlowField position vectors
        this.acceleration = createVector(0,0);
        this.velocity = createVector(0,0);
        // size of vect (subject to change)
        this.r = 3;
    }

    initializeVect(){
        this.updateVectLocation();
        this.fieldWrap();
        this.drawVect();
    }

    updateVectForce(force){
        this.acceleration.add(force);
    }

    updateVectLocation(){
        // update + limit velocity
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        // update position
        this.position.add(this.velocity);

        // reset acceleration
        this.acceleration.mult(0);
    }

    // Magic method
    follow(flow) {
        let desired = flow.lookup(this.position);
        desired.multi(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        this.updateVectForce.steer();
    }

    // telport vector to opposite edge if travels off canvas
    fieldWrap(){
        if(this.position.x < - this.r){
            this.position.x = width + this.r;
        } else if(this.position.y < -this.r) {
            this.position.y = height + this.r;
        } else if(this.position.x > this.r) {
            this.position.x = -this.r;
        } else if(this.position.y > this.r) {
            this.position.y = -this.r;
        }
    }

    drawVect(){
        // Start new drawing state for vector
        push();
        let theta = this.velocity.heading() + PI / 2;
        fill(127);
        stroke(200);
        strokeWeight(1);
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.r);
        vertex(-this.r, this.r * 2);
        vertex(0, this.r * 1.5);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }
}