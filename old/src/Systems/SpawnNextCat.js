import weightedRandomCat from "../Utils/weightedRandomCat.js";
import { SCREEN_TO_WORLD } from "../Utils/screen.js";

export default function SpawnNextCat() {
  let num_cats = 0;

  this.query = [];
  this.update = (time, entities, state, resources) => {
    state.cooldown += time.deltaTime;

    if (!state.cat && state.cooldown >= 1) {
      let cat;
      if (num_cats === 0) {
        cat = {
          ...resources.cats[0]
        };
      } else {
        cat = weightedRandomCat(resources.cats, state.score, state.highest_cat);
      }
      cat.position_x = state.width * SCREEN_TO_WORLD / 2;
      cat.position_y = cat.radius;
      state.cat = cat;
      num_cats += 1;

      state.cooldown = 0;
    }
  };
};