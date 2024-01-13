var mouseDown = false;
document.body.onpointerdown = () => mouseDown = true;
document.body.onpointerup = () => mouseDown = false;

let keyMap = [];
const keyCodePressed = (x) => keyMap.includes(x);

function keyPressed() {
  if(!keyMap.includes(keyCode))
    keyMap.push(keyCode);

  if (keyCode != 32)
    return;
  game.started = true;
}

function keyReleased() {
  if(keyMap.includes(keyCode))
    keyMap.splice(keyMap.indexOf(keyCode), 1);

  if (mouseDown)
    return;
  if (keyCode != 32)
    return;

  game.player.speed = -game.player.speed;
  keyCode = 0;
}

function mousePressed() {
  game.started = true;
}

let last_touch = Date.now();

function mouseReleased() {
  if (keyCode == 32)
    return;

  const current_touch = Date.now();
  if (current_touch - last_touch < 100)
    return;
  last_touch = current_touch;

  game.player.speed = -game.player.speed;
}
