import { useEffect } from "react"
import config from "./config";
import Engine from "./Core/Engine";
import Game from "./game";
import "./App.css"

function CatPleadMerge() {
  useEffect(() => {
    const gameCanvas = document.getElementById("game") as HTMLCanvasElement;
    const uiCanvas = document.getElementById("ui") as HTMLCanvasElement;
    const fxCanvas = document.getElementById("fx") as HTMLCanvasElement;
    const backgroundCanvas = document.getElementById("background") as HTMLCanvasElement;

    const engine = new Engine();
    const game = new Game({
      backgroundCanvas,
      gameCanvas,
      uiCanvas,
      fxCanvas,
      engine,
    });
    game.loadResources()
      .then(() => {
        game.addSystems();
        game.run();
      })
      .catch(err => {
        console.error(err);
      });

    const onMouseMove = (evt: MouseEvent): void => {
      game.setState("mouse_x", evt.offsetX);
      game.setState("mouse_y", evt.offsetY);
    };
    uiCanvas.addEventListener("mousemove", onMouseMove);

    const onClick = () => {
      game.setState("mouse_down", true);
    };
    uiCanvas.addEventListener("click", onClick);

    backgroundCanvas.style.background = config.background;

    return () => {
      uiCanvas.removeEventListener("mousemove", onMouseMove);
      uiCanvas.removeEventListener("click", onClick);
    }
  }, []);
  return (
    <>
      <div>
        <canvas id="background"></canvas>
        <canvas id="game"></canvas>
        <canvas id="fx"></canvas>
        <canvas id="ui"></canvas>
      </div>
    </>
  )
}

export default CatPleadMerge;
