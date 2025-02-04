export default function ClearCanvas(context) {
  this.query = [];
  this.update = function(time, entities, state, resources) {
    const gameCanvasContext = resources.gameCanvasContext;
    gameCanvasContext.clearRect(0, 0, gameCanvasContext.canvas.width, gameCanvasContext.canvas.height);

    const uiCanvasContext = resources.uiCanvasContext;
    uiCanvasContext.clearRect(0, 0, uiCanvasContext.canvas.width, uiCanvasContext.canvas.height);

    const fxCanvasContext = resources.fxCanvasContext;
    fxCanvasContext.clearRect(0, 0, fxCanvasContext.canvas.width, fxCanvasContext.canvas.height);
  }
}