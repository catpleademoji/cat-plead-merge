import CatArchetype from "../Archetypes/cat.js";
import { approximately, clamp, decay } from "../Utils/math.js";
import { SCREEN_TO_WORLD } from "../Utils/screen.js";

export default function DropActiveCat(engine) {
  this.query = [];
  this.update = (time, entities, state, resources) => {
    const cat = state.cat;
    if (!cat) {
      return;
    }
    
    if (state.mouse_down) {
      state.drop_position = clamp(state.mouse_x * SCREEN_TO_WORLD, cat.radius, state.width * SCREEN_TO_WORLD - cat.radius);
    }

    if (!state.drop_position) {
      return;
    }

    cat.position_x = decay(cat.position_x, state.drop_position, time.deltaTime, 50);

    if (approximately(state.drop_position, cat.position_x, 0.0001)) {
      engine.instantiateEntity(cat, CatArchetype);
      state.highest_cat = Math.max(state.highest_cat, cat.type);
      state.cat = null;
      state.cooldown = 0;
      state.drop_position = undefined;
    }
  };
}