function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function preload() {
  coinSound = new Audio("assets/audio/effects/coin.ogg");
  hitSound = new Audio("assets/audio/effects/hit.wav");
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  smooth();
  angleMode(RADIANS);
  colorMode(RGB, 1);
}

let first_time = true;

function draw() {
  translate(width / 2, height / 2);
  
  background(0);

  const rad = (windowWidth < windowHeight ? windowWidth : windowHeight) * 0.8 / 2;
  const diam = rad * 2;
  
  const inTan = (mouseDown || keyCodePressed(32));
  if (inTan) {
    if (game.stamina > 0)
      game.stamina += game.staminaL * toDeltaTime();
    else
      game.stamina = 0;
  }
  else {
    if (game.stamina < game.maxStamina)
      game.stamina += game.staminaG * toDeltaTime();
  }
  game.stamina = clamp(game.stamina, 0, 1);
  
  game.player.col = (inTan && game.stamina > 0 ? "#ffffff7f" : "#ffffff");
  
  push(); // background circle
  {
    fill(0, 0, 0, 0);
    stroke(color(1));
    
    circle(0, 0, diam);
  }
  pop();
  
  push();
  {
    noStroke();
    
    // Stamina bar
    if (game.stamina > 0.5)
      fill(1 - (game.stamina - 0.5) * 2, 1, 0);
    else
      fill(1, game.stamina * 2, 0);
    const stamDiam = diam * 0.8;
    arc(0, 0, stamDiam, stamDiam, 0, 2 * PI * game.stamina);
    
    // Notification area
    fill(0);
    const notifDiam = diam * 0.6;
    circle(0, 0, notifDiam);
    
    fill(1);
    textAlign(CENTER, CENTER);
    
    // Number of points
    textSize(rad * 0.4);
    text(String(game.score), 0, 0);
    
    textSize(rad * 0.2);

    // Highscore
    text(String(highscore), 0, rad * -0.35);

    // Lastscore
    text(String(lastScore), 0, rad * 0.35);
  }
  pop();
  
  game.player.draw(rad);
  game.goal.draw(rad);
  
  for (const enemy of game.enemies)
    enemy.draw(rad);
    
  if (inTan && game.stamina > 0)
    return;
  
  // If the player collides with the coin
  if (touching(rad, game.player, game.goal)) {
    game.score++;
    if (game.started) {
      coinSound.play();
      if (game.score > highscore) {
        highscore = game.score;
        setCookie("highscore", highscore, 365);
      }
    }
    if (game.score % 10 == 0)
      game.enemies.push(
        new GameObject(game.enemies[game.enemies.length - 1].rot, 0.1, ((Math.random() < 0.5) ? -1 : 1) * 0.02, "#ff0000")
      );
    game.staminaG += game.staminaG * 0.01;
    game.player.speed += game.player.speed * 0.05;
    for (const enemy of game.enemies)
      enemy.speed += enemy.speed * 0.05;
    game.goal.rot = Math.random() * PI * 2;
  }
  
  // If the player collides with an enemy
  for (const enemy of game.enemies)
    if (touching(rad, game.player, enemy)) {
      if (game.started) {
        hitSound.play();
        lastScore = game.score;
      }
      game = defaultGame();
    }
  
  if (first_time) {
    push();
    {
      fill(0, 0, 0, 0.75);
      rect(-width / 2, -height / 2, width, height);
    }
    pop();
    push();
    {
      textSize(30);
      textAlign(CENTER, CENTER);
      fill(255);
      text("Tap to Start & Hold to Phase\nand prepare for a surprise at level 10\nYou won't survive for very long :)", 0, 0);
    }
    pop();
  }
}