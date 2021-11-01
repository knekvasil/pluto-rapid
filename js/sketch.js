function setup(){
    createCanvas(windowWidth-(windowWidth*.03),windowHeight-(windowHeight*.13));
    stroke(255);
    // frameRate(30);
}

let x = 0;
let y = 0;

function draw() {
    background(0);
    x = lerp(x,mouseX, 0.05)
    y = lerp(y,mouseY, 0.05)
    // textAlign(CENTER);
    textFont('Chelsea Market')
    textSize(20);
    textAlign(CENTER)
    const beginningText = "Press any key to begin"
    fill(255)
    text(beginningText,windowWidth * .5,windowHeight * .25);
    
    ellipse(x, y, 66, 66);
    
    // textAlign(RIGHT);
    // text('ABCD', 50, 30);
    // textAlign(CENTER);
    // text('EFGH', 50, 50);
    // textAlign(LEFT);
    // text('IJKL', 50, 70);
    // clear background
    // background(0)
    
}

