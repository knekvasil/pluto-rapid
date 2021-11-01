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
    }

    // thanks Javascript
    generate2DArray(n){
        return Array(n).fill(Array(0).fill())
    }
}