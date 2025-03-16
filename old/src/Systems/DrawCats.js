import { WORLD_TO_SCREEN } from "../Utils/screen.js";

export default function DrawCats() {
  this.query = [
    "image",
    "radius",
    "position_x",
    "position_y",
    "rotation",
  ];
  this.update = function(time, entities, state, resources) {
    const position_x = entities["position_x"];
    const position_y = entities["position_y"];
    const rotation = entities["rotation"];
    const radius = entities["radius"];
    const image = entities["image"];

    const canvasContext = resources.gameCanvasContext;
    for (let i = 0; i < entities.count; i++) {
      canvasContext.save();

      const x = position_x.get(i) * WORLD_TO_SCREEN * state.scale;
      const y = position_y.get(i) * WORLD_TO_SCREEN * state.scale;
      const r = radius.get(i) * WORLD_TO_SCREEN * state.scale;
      canvasContext.translate(x, y);
      canvasContext.rotate(rotation.get(i));
      canvasContext.drawImage(image.get(i), -r, -r, r * 2, r * 2);

      canvasContext.restore();
    }
  }
}