import { SCREEN_TO_WORLD } from "../Utils/screen.js";

export default function SetLoss() {
  let timer = 0;
  this.query = [];
  this.update = (time, entities, state, resources) => {
    const height_limit = (state.height - (state.height * 0.85)) * SCREEN_TO_WORLD;

    if (state.highest_cat_y > height_limit) {
      timer = 0;
      return;
    }

    timer += time.deltaTime;
    if (timer > 1) {
      state.loss = true;
    }
  };
} 