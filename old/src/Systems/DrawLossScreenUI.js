import { lerp, clamp01, clamp } from "../Utils/math.js";

export default function DrawLossScreenUI() {
  let scoreTimer = 0;

  this.query = ["radius", "type"];
  this.update = function(time, entities, state, resources) {
    const gameScore = state.score;
    if (state.currentScore !== gameScore) {
      state.previousScore = clamp(calculateScoreAtTime(state.previousScore, state.currentScore, scoreTimer), 0, gameScore);
      state.currentScore = gameScore;
      scoreTimer = 0;
    }

    scoreTimer += time.deltaTime;
    const score = clamp(calculateScoreAtTime(state.previousScore, state.currentScore, scoreTimer), 0, gameScore);

    const canvasContext = resources.uiCanvasContext;
    canvasContext.save();

    const message = "Game Over!"

    canvasContext.fillStyle = "#FFFAAF"
    canvasContext.font = `bold ${Math.floor(48 * state.scale)}px sans-serif`;
    canvasContext.textAlign = "center";

    const x = Math.round(state.width * state.scale * 0.5);
    const y = Math.round(state.height * state.scale * 0.3);
    canvasContext.fillText(message, x, y);

    const fontsize = Math.round(32 * state.scale);
    canvasContext.font = `${fontsize}px sans-serif`;
    canvasContext.fillStyle = "#FFFAAF";

    canvasContext.fillText(`Score: ${score}`, x, y + 1.5 * fontsize);

    if (entities.count > 0) {
      canvasContext.restore();
      return;
    }

    const buttonWidth = Math.round(200 * state.scale);
    const buttonHeight = Math.round(60 * state.scale);
    const buttonY = Math.round(state.height * state.scale * 0.7);
    const radius = 10 * state.scale;

    let buttonColor;
    let buttonShadowColor;
    if (
      state.mouse_x > (x - (buttonWidth / 2))
      && state.mouse_x < (x + (buttonWidth / 2))
      && state.mouse_y > (buttonY - (buttonHeight / 2))
      && state.mouse_y < (buttonY + (buttonHeight / 2))
    ) {
      buttonColor = "#F9F5D2";
      buttonShadowColor = "#CDC689"
    } else {
      buttonColor = "#DCD796";
      buttonShadowColor = "#969164";
    }
    canvasContext.fillStyle = buttonShadowColor;
    canvasContext.beginPath();
    canvasContext.roundRect(x - (buttonWidth / 2), buttonY - (buttonHeight / 2), buttonWidth, buttonHeight, radius);
    canvasContext.fill();

    const bottomBorder = Math.round(8 * state.scale);
    canvasContext.fillStyle = buttonColor;
    canvasContext.beginPath();
    canvasContext.roundRect(x - (buttonWidth / 2), buttonY - (buttonHeight / 2), buttonWidth, buttonHeight - bottomBorder, radius);
    canvasContext.fill();

    canvasContext.fillStyle = "#000000";
    canvasContext.fillText("Restart", x, buttonY + (fontsize / 4));

    canvasContext.restore();

    if (state.mouse_down) {
      state.loss = false;
      state.score = 0;
    }
  }

  function calculateScoreAtTime(score, targetScore, time) {
    const updateSpeed = targetScore - score > 0
      ? 1 / Math.log10(targetScore - score)
      : 1;
    return Math.floor(lerp(score, targetScore, updateSpeed * time));
  }
}