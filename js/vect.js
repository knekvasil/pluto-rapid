// vect.js

class Vect {
    constructor(x, y, maxSpeed, maxForce) {
        // x, y position
        this.x = x
        this.y = y
        // speed, force will be randomly generated when initialized
        self.maxSpeed = maxSpeed
        self.maxForce = maxForce
        // position vector
        this.position = createVector(x,y)
        // acceleration, velocity will be determined by vect + FlowField position vectors
        this.acceleration = createVector(0,0)
        this.velocity = createVector(0,0)
        // size of vect (subject to change)
        this.r = 3
    }

    display(){
        // SHAPE TINKERING TBD
        // beginShape();
        // vertex(0, -this.r );
        // vertex(-this.r, this.r*2);
        // vertex(0,this.r*1.5)
        // vertex(this.r, this.r*2);
        // endShape(CLOSE);
    }

}