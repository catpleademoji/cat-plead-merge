import { WORLD_TO_SCREEN } from "../Utils/screen.js";

export default function DrawParticles() {
  this.query = [
    "position_x",
    "position_y",
    "width",
    "height",
    "rotation",
    "spritesheet",
    "source_x",
    "source_y",
    "lifetime"
  ];
  this.update = function(time, entities, state, resources) {
    const position_x = entities["position_x"];
    const position_y = entities["position_y"];
    const width = entities["width"];
    const height = entities["height"];
    const rotation = entities["rotation"];
    const spritesheet = entities["spritesheet"];
    const source_x = entities["source_x"];
    const source_y = entities["source_y"];
    const lifetime = entities["lifetime"];

    const canvasContext = resources.fxCanvasContext;
    canvasContext.save();
    for (let i = 0; i < entities.count; i++) {
      const pos_x = position_x.get(i) * WORLD_TO_SCREEN * state.scale;
      const pos_y = position_y.get(i) * WORLD_TO_SCREEN * state.scale;

      const t = lifetime.get(i);
      const scale = Math.sin(Math.PI * t);
      canvasContext.globalAlpha = scale;

      const w = width.get(i) * scale * WORLD_TO_SCREEN * state.scale;
      const h = height.get(i) * scale * WORLD_TO_SCREEN * state.scale;

      const s = spritesheet.get(i);
      const sx = source_x.get(i);
      const sy = source_y.get(i);

      const rot = rotation.get(i);
      const x = pos_x - w / 2;
      const y = pos_y - h / 2;
      canvasContext.translate(x, y);
      canvasContext.rotate(rot);
      canvasContext.drawImage(s.source, sx, sy, s.sprite_width, s.sprite_height, 0, 0, w, h);
      canvasContext.rotate(-rot);
      canvasContext.translate(-x, -y);
    }
    canvasContext.restore();
  }
}