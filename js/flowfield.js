// flowfield.js

class FlowField{
    constructor(vectorSize){
        // calculate density of FlowField (smaller # = more dense)
        this.vectorSize = vectorSize
        // calculate row + column count based on vectorSize 
        this.rows = height / this.vectorSize
        this.columns = width / this.vectorSize
        // create 2d array of rows x columns
        this.field = this.generate2DArray(this.columns)
        this.initializeField();
    }

    // Thanks JavaScript! Very cool.
    generate2DArray(n){
        return Array(n).fill(Array(0).fill());
    }

    initializeField(){
        let xOff = 0
        // Give me legions of fields. 100000 to be precise.
        NoiseSeed(Math.floor(random(10000)))

        for(let i = 0; i < this.columns; i++) {
            let yOff = 0
            for(let j = 0; j< this.rows; j++) {
                // Polar --> Cartesian
                let theta = map(noise(xOff,yOff), 0, 1, 0, TWO_PI)
                this.field[i][j] = createVector(cos(theta), sin(theta))
            }
            yOff += 0.1
        }
        xOff += 0.1
    }

    drawVect(x, y, vect, fieldDensity){
        // Start new drawing state for vector
        push();

        pop();
    }

}