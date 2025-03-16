import { SCREEN_TO_WORLD } from "../Utils/screen.js";

export default function GetHighestCat() {
  this.query = [
    "position_y",
    "radius",
    "lifetime",
  ];
  this.update = (time, entities, state) => {
    if (entities.count === 0) {
      // height starts from zero at the top 
      // and increases going down the screen
      state.highest_cat_y = state.height * SCREEN_TO_WORLD;
      return;
    }

    const position_y = entities["position_y"];
    const radius = entities["radius"];
    const lifetime = entities["lifetime"];

    let highest_cat = 0;
    for (let i = 1; i < entities.count; i++) {
      const highest_y = position_y.get(highest_cat) - radius.get(highest_cat);
      const y = position_y.get(i) - radius.get(i);
      if (highest_y > y && lifetime.get(i) > 1) {
        highest_cat = i;
      }
    }

    state.highest_cat_y = position_y.get(highest_cat) - radius.get(highest_cat);
  }
} 