const TITLE = 0;
const PLAYING = 1;
const DEATH = 2;

let gameState = TITLE;
let debug = false;
let flowfield;
let vekts = [];
let score = 0;

let highScore = 0;
try {
  highScore = parseInt(localStorage.getItem('pluto-high-score')) || 0;
} catch (e) {
  highScore = 0;
}
let highScoreUpdated = false;

let px, py;
let gameStartMillis = 0;
let lastMilestone = 0;

let stars = [];
let bgVekts = [];

let deathParticles = [];
let deathTimer = 0;
const DEATH_DURATION = 90;
let deathScore = 0;
let flashAlpha = 0;
let paused = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  flowfield = new FlowField(20);
  px = mouseX;
  py = mouseY;
  initStars();
}

function draw() {
  background(0);
  drawStars();

  switch (gameState) {
    case TITLE:
      updateBgVekts();
      drawTitleScreen();
      break;
    case PLAYING:
      if (!paused) {
        updateGame();
      }
      drawGame();
      if (paused) {
        drawPauseOverlay();
      }
      break;
    case DEATH:
      updateDeath();
      drawDeath();
      break;
  }
}

function initStars() {
  stars = [];
  for (let i = 0; i < 300; i++) {
    let depth = random(0.3, 1);
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2.5) * depth,
      baseBrightness: random(100, 255),
      twinkleSpeed: random(0.02, 0.08),
      twinkleOffset: random(TWO_PI),
      depth: depth,
      driftY: depth * random(0.1, 0.3)
    });
  }
}

function drawStars() {
  noStroke();
  for (let s of stars) {
    s.y += s.driftY;
    if (s.y > height + 2) {
      s.y = -2;
      s.x = random(width);
    }

    let twinkle = sin(frameCount * s.twinkleSpeed + s.twinkleOffset);
    let b = s.baseBrightness * map(twinkle, -1, 1, 0.4, 1);
    fill(b);
    ellipse(s.x, s.y, s.size, s.size);
  }
}

function updateBgVekts() {
  if (bgVekts.length < 20 && frameCount % 6 === 0) {
    let neon = [
      [100, 255, 200],
      [255, 100, 200],
      [200, 100, 255],
      [100, 200, 255],
      [200, 255, 100]
    ];
    let c = random(neon);
    bgVekts.push({
      x: random(width),
      y: random(height),
      vx: random(-0.6, 0.6),
      vy: random(-0.6, 0.6),
      size: random(2, 5),
      alpha: random(60, 150),
      color: c
    });
  }
  for (let i = bgVekts.length - 1; i >= 0; i--) {
    let v = bgVekts[i];
    v.x += v.vx;
    v.y += v.vy;
    v.alpha -= 0.4;
    if (v.alpha <= 0 || v.x < -50 || v.x > width + 50 || v.y < -50 || v.y > height + 50) {
      bgVekts.splice(i, 1);
    }
  }
}

function drawTitleScreen() {
  noStroke();
  for (let v of bgVekts) {
    fill(v.color[0], v.color[1], v.color[2], v.alpha);
    ellipse(v.x, v.y, v.size, v.size);
  }

  textAlign(CENTER, CENTER);
  textFont('Chelsea Market');

  let ctx = drawingContext;
  ctx.shadowBlur = 40;
  ctx.shadowColor = 'rgba(150, 200, 255, 0.6)';
  fill(180, 220, 255);
  textSize(80);
  text('PLUTO RAPID', width / 2, height * 0.28);
  ctx.shadowBlur = 0;

  ctx.shadowBlur = 20;
  ctx.shadowColor = 'rgba(200, 100, 255, 0.4)';
  fill(200, 150, 255);
  textSize(20);
  text('PRESS [ENTER] TO BEGIN', width / 2, height * 0.48);
  ctx.shadowBlur = 0;

  if (highScore > 0) {
    fill(255, 200, 100);
    textSize(18);
    text('BEST: ' + highScore, width / 2, height * 0.56);
  }

  fill(120);
  textSize(14);
  text('Guide Pluto with your mouse. Dodge the vekts.', width / 2, height * 0.7);
  text('[SPACE] toggles debug view', width / 2, height * 0.75);

  fill(100);
  textSize(14);
  text('HOW TO PLAY', width / 2, height * 0.86);
}

function drawPluto() {
  push();
  let ctx = drawingContext;
  ctx.shadowBlur = 40;
  ctx.shadowColor = 'rgba(180, 160, 220, 0.5)';

  fill(170, 150, 210);
  noStroke();
  ellipse(px, py, 50, 50);

  fill(130, 110, 170);
  ellipse(px - 7, py - 4, 16, 12);
  ellipse(px + 10, py + 8, 14, 16);
  ellipse(px + 3, py - 11, 9, 7);

  fill(200, 185, 225);
  ellipse(px - 5, py + 1, 14, 10);
  ellipse(px + 5, py + 1, 10, 8);

  ctx.shadowBlur = 0;
  pop();
}

function drawScore() {
  textAlign(LEFT, TOP);
  textFont('Chelsea Market');
  let ctx = drawingContext;

  ctx.shadowBlur = 15;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  fill(255);
  textSize(24);
  text('SCORE: ' + score, 20, 20);
  ctx.shadowBlur = 0;

  if (highScore > 0) {
    fill(200);
    textSize(14);
    text('BEST: ' + highScore, 20, 50);
  }
}

function mousePressed() {
  if (gameState === TITLE) {
    if (mouseY > height * 0.82 && mouseY < height * 0.92) {
      window.location.href = './html/howto.html';
    }
  }
}

function resetGame() {
  score = 0;
  lastMilestone = 0;
  highScoreUpdated = false;
  px = mouseX;
  py = mouseY;
  flowfield.init();
  clearVekts();
  drawVekts();
}

function updateGame() {
  px = lerp(px, mouseX, 0.05);
  py = lerp(py, mouseY, 0.05);

  flowfield.update();

  if (debug) {
    flowfield.display();
  }

  let dt = deltaTime / 16.67;
  for (let v of vekts) {
    v.follow(flowfield);
    v.run(dt);
  }

  let plutoPos = createVector(px, py);
  for (let v of vekts) {
    if (p5.Vector.dist(v.position, plutoPos) <= 30) {
      startDeath();
      return;
    }
  }

  score = floor((millis() - gameStartMillis) / 1000);

  let milestone = floor(score / 100);
  if (milestone > lastMilestone) {
    flowfield.init();
    lastMilestone = milestone;
  }
}

function drawGame() {
  drawPluto();
  drawScore();
}

function startDeath() {
  gameState = DEATH;
  deathTimer = DEATH_DURATION;
  deathScore = score;
  flashAlpha = 200;

  if (deathScore > highScore) {
    highScore = deathScore;
    highScoreUpdated = true;
    try {
      localStorage.setItem('pluto-high-score', highScore);
    } catch (e) {}
  }

  deathParticles = [];
  for (let i = 0; i < 80; i++) {
    let angle = random(TWO_PI);
    let speed = random(1, 6);
    let neon = [
      [100, 255, 200],
      [255, 100, 200],
      [200, 100, 255],
      [255, 200, 100],
      [100, 200, 255]
    ];
    deathParticles.push({
      x: px,
      y: py,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(2, 6),
      life: random(20, 50),
      color: random(neon)
    });
  }
}

function updateDeath() {
  deathTimer--;

  for (let i = deathParticles.length - 1; i >= 0; i--) {
    let p = deathParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.life--;
    if (p.life <= 0) {
      deathParticles.splice(i, 1);
    }
  }

  flashAlpha *= 0.92;

  if (deathTimer <= 0) {
    gameState = TITLE;
    bgVekts = [];
    clearVekts();
  }
}

function drawDeath() {
  drawPluto();
  drawScore();

  noStroke();
  fill(255, flashAlpha);
  rect(0, 0, width, height);

  for (let p of deathParticles) {
    let alpha = map(p.life, 0, 50, 0, 255);
    fill(p.color[0], p.color[1], p.color[2], alpha);
    ellipse(p.x, p.y, p.size, p.size);
  }

  if (deathTimer < DEATH_DURATION - 30) {
    textAlign(CENTER, CENTER);
    textFont('Chelsea Market');
    let ctx = drawingContext;

    ctx.shadowBlur = 25;
    ctx.shadowColor = 'rgba(255, 200, 100, 0.5)';
    fill(255, 200, 100);
    textSize(40);
    text('SCORE: ' + deathScore, width / 2, height / 2);
    ctx.shadowBlur = 0;

    if (highScoreUpdated) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255, 100, 100, 0.5)';
      fill(255, 100, 100);
      textSize(18);
      text('NEW HIGH SCORE!', width / 2, height / 2 + 40);
      ctx.shadowBlur = 0;
    }
  }
}

function drawVekts() {
  let maxAttempts = 1000;
  let pos = createVector(px, py);
  for (let i = 0; i < 240; i++) {
    let randX = random(width);
    let randY = random(height);
    let attempts = 0;
    while (p5.Vector.dist(createVector(randX, randY), pos) < 80 && attempts < maxAttempts) {
      randX = random(width);
      randY = random(height);
      attempts++;
    }
    vekts.push(new Vekt(randX, randY, random(2, 5), random(0.1, 0.5)));
  }
}

function clearVekts() {
  vekts = [];
}

function keyPressed() {
  if (key == ' ') {
    debug = !debug;
  }
  if (keyCode == RETURN) {
    if (gameState === TITLE) {
      gameState = PLAYING;
      gameStartMillis = millis();
      resetGame();
    }
  }
  if (keyCode == ESCAPE) {
    if (gameState === PLAYING) {
      paused = !paused;
      return false;
    }
  }
}

function drawPauseOverlay() {
  fill(0, 160);
  noStroke();
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  textFont('Chelsea Market');
  let ctx = drawingContext;
  ctx.shadowBlur = 30;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  fill(255);
  textSize(50);
  text('PAUSED', width / 2, height / 2);
  ctx.shadowBlur = 0;
  fill(180);
  textSize(18);
  text('Press ESC to resume', width / 2, height / 2 + 40);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initStars();
}
