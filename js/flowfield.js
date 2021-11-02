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

    // Thanks JavaScript! Very cool.
    generate2DArray(n){
        let arr = [];

        for(let i = 0; i < n; i++){
            arr[i] = [];
        }
        return arr;
    }

    initializeField(){
        // Give me legions of fields. 100000 to be precise.
        noiseSeed(Math.floor(random(10000)));
        let xOffset = 0;
        
        for(let i = 0; i < this.columns; i++) {
            let yOffset = 0;
            for(let j = 0; j< this.rows; j++) {
                // Polar --> Cartesian
                let theta = map(noise(xOffset,yOffset), 0, 1, 0, TWO_PI);
                this.field[i][j] = createVector(cos(theta), sin(theta));
                yOffset += 0.1;
            }
            xOffset += 0.1;
        }
        
    }

    displayField(){
        for(let i = 0; i < this.columns; i++) {
            for(let j = 0; j < this.rows; j++) {
                this.drawFieldVector(this.field[i][j], i * this.density, j * this.density, this.density - 2);
            }
        }
    }

    lookup(position) {
        let column = Math.floor(constrain(position.x / this.density, 0, this.columns - 1));
        let row = Math.floor(constrain(position.y / this.density, 0, this.rows - 1));
        return this.field[column][row].copy();
    }
    
    drawFieldVector(vect, x, y, fieldDensity){
        // Start new drawing state for fieldVector
        push();
        let arrowSize = 4;
        translate(x,y);
        stroke(200,100);
        rotate(vect.heading());
        let length = vect.mag() * fieldDensity;
        line(0, 0, length, 0);
        line(length, 0 ,length - arrowSize, arrowSize / 2);
        line(length, 0 ,length - arrowSize, -arrowSize / 2);
        pop();
    }

}