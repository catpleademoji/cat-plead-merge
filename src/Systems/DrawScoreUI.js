import { clamp, lerp } from "../Utils/math.js";

export default function DrawScoreUI() {
  let timer = 0;
  this.query = [];
  this.update = function(time, entities, state, resources) {
    const gameScore = state.score;
    if (state.currentScore !== gameScore) {
      state.previousScore = clamp(calculateScoreAtTime(state.previousScore || 0, state.currentScore || 0, timer), 0, gameScore);
      state.currentScore = gameScore;
      timer = 0;
    }

    timer += time.deltaTime;
    const score = clamp(calculateScoreAtTime(state.previousScore, state.currentScore, timer), 0, gameScore);

    const canvasContext = resources.uiCanvasContext;
    canvasContext.save();

    const fontsize = 24 * state.scale;
    canvasContext.font = `${fontsize}px sans-serif`;
    canvasContext.fillStyle = "#FFFAAF";
    const margin = 10 * state.scale;
    canvasContext.fillText(`Score: ${score}`, margin, margin + fontsize);

    canvasContext.restore();
  }

  function calculateScoreAtTime(score, targetScore, time) {
    const updateSpeed = targetScore - score > 0
      ? 1 / Math.log10(targetScore - score)
      : 1;
    return Math.floor(lerp(score, targetScore, updateSpeed * time));
  }
}