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
let nebulae = [];
let bgVekts = [];

let deathParticles = [];
let deathTimer = 0;
const DEATH_DURATION = 90;
let deathScore = 0;
let flashAlpha = 0;
let paused = false;
let closeCallAlpha = 0;
let milestoneEffects = [];
let plutoTrail = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  flowfield = new FlowField(20);
  px = mouseX;
  py = mouseY;
  initStars();
  initNebulae();
}

function draw() {
  background(0);
  drawNebulae();
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
      drawCloseCall();
      drawMilestoneEffects();
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

function initNebulae() {
  nebulae = [];
  let palette = [
    [30, 10, 60],
    [60, 10, 40],
    [10, 30, 60],
    [50, 20, 10],
    [10, 50, 40]
  ];
  for (let i = 0; i < 5; i++) {
    let c = random(palette);
    nebulae.push({
      x: random(width),
      y: random(height),
      size: random(300, 600),
      color: c,
      alpha: random(6, 14),
      vx: random(-0.08, 0.08),
      vy: random(-0.08, 0.08)
    });
  }
}

function drawNebulae() {
  noStroke();
  for (let n of nebulae) {
    n.x += n.vx;
    n.y += n.vy;
    let half = n.size / 2;
    if (n.x < -half) n.x = width + half;
    if (n.x > width + half) n.x = -half;
    if (n.y < -half) n.y = height + half;
    if (n.y > height + half) n.y = -half;
    fill(n.color[0], n.color[1], n.color[2], n.alpha);
    ellipse(n.x, n.y, n.size, n.size);
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
  for (let i = 0; i < plutoTrail.length; i++) {
    let a = map(i, 0, plutoTrail.length, 15, 80);
    let s = map(i, 0, plutoTrail.length, 6, 40);
    fill(150, 130, 200, a);
    noStroke();
    ellipse(plutoTrail[i].x, plutoTrail[i].y, s, s);
  }

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

function drawCloseCall() {
  if (closeCallAlpha > 1) {
    noStroke();
    let thickness = 6;
    fill(255, 60, 60, closeCallAlpha * 0.4);
    rect(0, 0, width, thickness);
    rect(0, height - thickness, width, thickness);
    rect(0, 0, thickness, height);
    rect(width - thickness, 0, thickness, height);
  }
}

function mousePressed() {
  if (gameState === TITLE) {
    if (mouseY > height * 0.82 && mouseY < height * 0.92) {
      window.location.href = './html/howto.html';
    }
  }
}

function drawMilestoneEffects() {
  for (let i = milestoneEffects.length - 1; i >= 0; i--) {
    let e = milestoneEffects[i];
    e.radius += 4;
    e.alpha -= 1.5;
    noFill();
    stroke(e.color[0], e.color[1], e.color[2], e.alpha);
    strokeWeight(3);
    ellipse(width / 2, height / 2, e.radius);
    if (e.alpha <= 0) {
      milestoneEffects.splice(i, 1);
    }
  }
}

function resetGame() {
  score = 0;
  lastMilestone = 0;
  highScoreUpdated = false;
  px = mouseX;
  py = mouseY;
  plutoTrail = [];
  flowfield.init();
  clearVekts();
  drawVekts();
}

function updateGame() {
  px = lerp(px, mouseX, 0.05);
  py = lerp(py, mouseY, 0.05);

  plutoTrail.push({ x: px, y: py });
  if (plutoTrail.length > 20) {
    plutoTrail.shift();
  }

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
  let closestDist = Infinity;
  for (let v of vekts) {
    let d = p5.Vector.dist(v.position, plutoPos);
    if (d <= 30) {
      startDeath();
      return;
    }
    if (d < closestDist) closestDist = d;
  }

  if (closestDist < 20) {
    closeCallAlpha = map(closestDist, 0, 20, 180, 0);
  } else {
    closeCallAlpha *= 0.85;
  }

  score = floor((millis() - gameStartMillis) / 1000);

  let milestone = floor(score / 100);
  if (milestone > lastMilestone) {
    flowfield.init();
    lastMilestone = milestone;
    let neon = [
      [100, 255, 200],
      [255, 100, 200],
      [200, 100, 255],
      [100, 200, 255],
      [200, 255, 100]
    ];
    milestoneEffects.push({
      radius: 0,
      maxRadius: max(width, height) * 0.6,
      alpha: 200,
      color: random(neon)
    });
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
