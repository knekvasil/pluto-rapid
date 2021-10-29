function setup(){
    createCanvas(windowWidth-(windowWidth*.03),windowHeight-(windowHeight*.13));
    stroke(255);
    frameRate(30);
}

function draw() {
    background(0);
    // textAlign(CENTER);
    textFont('Chelsea Market')
    textSize(20);
    textAlign(RIGHT)
    const beginningText = "Hello, World!"
    fill(255)
    text(beginningText,windowWidth * .5,windowHeight * .25);
    
    
    // textAlign(RIGHT);
    text('ABCD', 50, 30);
    textAlign(CENTER);
    text('EFGH', 50, 50);
    // textAlign(LEFT);
    text('IJKL', 50, 70);
    // clear background
    // background(0)
}
function drawText(){
    return "hello"
}