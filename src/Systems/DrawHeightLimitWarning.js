import { clamp01, inv_lerp, remap } from "../Utils/math.js";
import { WORLD_TO_SCREEN } from "../Utils/screen.js";

export default function DrawHeightLimitWarning() {
  let warning_timer = 0;
  this.query = [];
  this.update = function(time, entities, state, resources) {
    // height starts from zero at the top 
    // and increases going down the screen
    const height_limit = (state.height - (state.height * 0.85));
    const warning_limit = (state.height - (state.height * 0.65));

    const highest_y = state.highest_cat_y * WORLD_TO_SCREEN;
    if (highest_y > warning_limit) {
      warning_timer = 0;
      return;
    }
    
    warning_timer += time.deltaTime;
    if (warning_timer < 1) {
      return;
    }

    const canvasContext = resources.fxCanvasContext;
    canvasContext.save();

    // draw warning bar
    const thickness = 12;

    const intensity = remap(0, 1, 0, 0.5, clamp01(inv_lerp(warning_limit, height_limit, highest_y)));
    canvasContext.fillStyle = "#FF0000";
    canvasContext.globalAlpha = intensity;
    canvasContext.fillRect(
      0,
      (height_limit - (thickness / 2)) * state.scale,
      state.width * state.scale,
      thickness * state.scale
    );

    canvasContext.restore();
  }
}