import config from "./config.js";
import Engine from "./Core/Engine.js";
import Game from "./game.js";

const gameCanvas = document.getElementById("game");
const uiCanvas = document.getElementById("ui");
const fxCanvas = document.getElementById("fx");
const backgroundCanvas = document.getElementById("background");

const engine = new Engine(config.width, config.height);
const game = new Game({
  backgroundCanvas,
  gameCanvas,
  uiCanvas,
  fxCanvas,
  engine,
});
await game.loadResources();
game.addSystems();
game.run();

uiCanvas.addEventListener("mousemove", (evt) => {
  game.setState("mouse_x", evt.offsetX);
  game.setState("mouse_y", evt.offsetY);
});

uiCanvas.addEventListener("click", () => {
  game.setState("mouse_down", true);
});

backgroundCanvas.style.background = config.background;