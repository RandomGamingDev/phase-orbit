let coinSound;
let hitSound;

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
let lastScore = 0;
let game = defaultGame();