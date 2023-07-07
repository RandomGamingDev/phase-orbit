function setCookie(name,value,exp_days) {
    var d = new Date();
    d.setTime(d.getTime() + (exp_days*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(name) {
    var cname = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++){
        var c = ca[i];
        while(c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if(c.indexOf(cname) == 0){
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function touching(rad, circ1, circ2) {
  let distance = Math.sqrt(
    Math.abs(Math.cos(circ1.rot) - Math.cos(circ2.rot)) ** 2 +
    Math.abs(Math.sin(circ1.rot) - Math.sin(circ2.rot)) ** 2
  )
  return distance <= (circ1.siz + circ2.siz) / 2;
}

var mouseDown = false;
document.body.onpointerdown = () => mouseDown = true;
document.body.onpointerup = () => mouseDown = false;

var keyMap = [];

function keyCodePressed(x){
    return keyMap.includes(x);
}

window.addEventListener('keydown', (x)=>{
  if(!keyMap.includes(x.keyCode))
    keyMap.push(x.keyCode);
});

window.addEventListener('keyup', (x)=>{
  if(keyMap.includes(x.keyCode))
    keyMap.splice(keyMap.indexOf(x.keyCode), 1);
});

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  smooth();
  pixelDensity(1);
  angleMode(RADIANS);
  colorMode(RGB, 1);
}

class GameObject {
  constructor(rot, siz, speed, col, elem = (o, r) => circle(0, 0, r * o.siz)) {
    this.rot = rot;
    this.siz = siz;
    this.speed = speed;
    this.col = col;
    this.elem = elem;
  }
  
  draw(rad) {
    push();
    {
      noStroke();
      fill(this.col);

      rotate(this.rot + this.speed);
      this.rot += this.speed;
      this.rot %= PI * 2;

      translate(rad, 0);

      this.elem(this, rad);
    }
    pop();
  }
}

const defaultGame = () => {
  return ({
	started: false,
    score: 0,
    maxStamina: 1,
    stamina: 1,
    staminaL: -0.01,
    staminaG: 0.01,
    player: new GameObject(0, 0.15, 0.01, "#ffffff"),
    goal: new GameObject(0, 0.1, 0, "#ffff00"), // each goal gives a different effect and have circular health bar in center and notifs in center of that
    enemies: [ new GameObject(0, 0.1, 0.02, "#ff0000") ]
  });
};

let highscore = 0;
let highRes = getCookie("highscore");
if (highRes != undefined)
  highscore = Number(highRes);
let game = defaultGame();

function draw() {
  translate(width / 2, height / 2);
  
  background(0);
  
  const rad = (windowWidth < windowHeight ? windowWidth : windowHeight) * 0.8 / 2;
  const diam = rad * 2;
  
  const inTan = (mouseDown || keyCodePressed(32));
  if (inTan) {
    if (game.stamina > 0)
      game.stamina += game.staminaL;
    else
      game.stamina = 0;
  }
  else {
    if (game.stamina < game.maxStamina)
      game.stamina += game.staminaG;
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
    textSize(60);
    text(String(game.score), 0, 0);
    
    // Highscore
    textSize(30);
    text(String(highscore), 0, -50);
  }
  pop();
  
  game.player.draw(rad);
  game.goal.draw(rad);
  
  for (const enemy of game.enemies)
    enemy.draw(rad);
    
  if (inTan && game.stamina > 0)
    return;
  
  if (touching(rad, game.player, game.goal)) {
    game.score++;
    if (game.score > highscore) {
      highscore = game.score;
      setCookie("highscore", highscore, 365);
    }
    
    if (game.score % 10 == 0)
      game.enemies.push(
        new GameObject(game.enemies[game.enemies.length - 1].rot, 0.1, ((Math.random() < 0.5) ? -1 : 1) * 0.02, "#ff0000")
      );
    game.player.speed += game.player.speed * 0.05;
    for (const enemy of game.enemies)
      enemy.speed += enemy.speed * 0.05;
    game.goal.rot = Math.random() * PI * 2;
  }
  
  for (const enemy of game.enemies)
    if (touching(rad, game.player, enemy)) {
	  if (game.started)
		alert(`You got ${game.score} points!`); 
      game = defaultGame();
    }
}

function mouseReleased() {
  game.started = true;
  game.player.speed = -game.player.speed;
}