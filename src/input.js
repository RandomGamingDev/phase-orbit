var mouseDown = false;
document.body.onpointerdown = () => mouseDown = true;
document.body.onpointerup = () => mouseDown = false;

/*
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
*/

let keyMap = [];

const keyCodePressed = (x) => keyMap.includes(x);

function mousePressed() {
  game.started = true;
}

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
}

function mouseReleased() {
  if (keyCode == 32)
    return;
  game.player.speed = -game.player.speed;
}

function keyReleased() {
  if (mouseDown)
    return;
  if (keyCode != 32)
    return;

  game.player.speed = -game.player.speed;
  keyCode = 0;
}