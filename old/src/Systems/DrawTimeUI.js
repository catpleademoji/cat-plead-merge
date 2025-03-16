export default function DrawTimeUI() {
  this.query = [];
  this.update = function(time, entities, state, resources) {
    const {
      deltaTime,
      totalTime,
    } = time;

    const canvasContext = resources.uiCanvasContext;
    canvasContext.save();

    const fontsize = 24 * state.scale;
    canvasContext.font = `${fontsize}px sans-serif`;
    canvasContext.fillStyle = "#FFFAAF";
    const margin = 10 * state.scale;
    const lineSpacing = 10 * state.scale;
    canvasContext.fillText(`FPS: ${deltaTime <= 0.00001 ? 0 : (1 / deltaTime).toFixed(2)}`, margin, margin + lineSpacing + fontsize * 2);
    canvasContext.fillText(`Total Time: ${totalTime.toFixed(4)} s`, margin, margin + lineSpacing * 2 + fontsize * 3);

    canvasContext.restore();
  }
}