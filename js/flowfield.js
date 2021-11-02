// flowfield.js

class FlowField{
    constructor(density){
        // calculate density of FlowField (smaller # = more dense)
        this.density = density;
        // calculate row + column count based on density 
        this.rows = height / this.density;
        this.columns = width / this.density;
        // create 2d array of rows x columns
        this.field = this.generate2DArray(this.columns);
        this.initializeField();
    }

    initializeField(){
        let xOff = 0;
        // Give me legions of fields. 100000 to be precise.
        noiseSeed(Math.floor(random(10000)));

        for(let i = 0; i < this.columns; i++) {
            let yOff = 0;
            for(let j = 0; j< this.rows; j++) {
                // Polar --> Cartesian
                let theta = map(noise(xOff,yOff), 0, 1, 0, TWO_PI);
                this.field[i][j] = createVector(cos(theta), sin(theta));
            }
            yOff += 0.1;
        }
        xOff += 0.1;
    }

    // Thanks JavaScript! Very cool.
    generate2DArray(n){
        let arr = [];

        for(let i = 0; i < n; i++){
            arr[i] = [];
        }
        return arr;
        // return Array(n).fill(Array(n).fill());
    }

    lookup(position) {
        let column = Math.floor(constrain(position.x / this.density, 0, this.columns - 1));
        let row = Math.floor(constrain(position.y / this.density, 0, this.rows - 1));
        return this.field[column][row].copy();
    }
    
    displayField(){
        for(let i = 0; i < this.columns; i++) {
            for(let j = 0; j < this.rows; j++) {
                this.drawFieldVector(this.field[i][j], i * this.density, j * this.density, this.density - 2);
            }
        }
    }

    drawFieldVector(x, y, vect, fieldDensity){
        // Start new drawing state for fieldVector
        push();
        let arrowSize = 4;
        translate(x,y);
        stroke(200,100);
        rotate(vect.heading());
        let length = vect.mag() * fieldDensity;
        line(0, 0, length, 0);
        line(len,0,length - arrowsize, + arrowsize / 2);
        line(len,0,length - arrowsize, - arrowsize / 2);
        pop();
    }

}