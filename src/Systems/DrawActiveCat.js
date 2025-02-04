import { WORLD_TO_SCREEN } from "../Utils/screen.js";

export default function DrawActiveCat() {
  this.query = [];
  this.update = (time, entities, state, resources) => {
    const cat = state.cat;
    if (!cat) {
      return;
    }

    const uiCanvasContext = resources.uiCanvasContext;
    uiCanvasContext.save();

    const x = cat.position_x * WORLD_TO_SCREEN * state.scale;
    const y = cat.position_y * WORLD_TO_SCREEN * state.scale;
    const r = cat.radius * WORLD_TO_SCREEN * state.scale;

    uiCanvasContext.translate(x, y);
    uiCanvasContext.rotate(cat.rotation);
    uiCanvasContext.drawImage(cat.image, -r, -r, r * 2, r * 2);

    uiCanvasContext.restore();
  };
}