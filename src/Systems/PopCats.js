import CatArchetype from "../Archetypes/cat.js";
import playPopSfx from "../Utils/playPopSfx.js";
import spawnParticles from "../Utils/spawnParticles.js";

export default function PopCats(engine) {
  let timer = 0;
  let popFrequency = 1 / 10;
  this.query = [
    "position_x",
    "position_y",
    "radius",
    "type",
  ];

  this.update = function(time, entities, state, resources) {
    timer += time.deltaTime;
    
    if (timer >= popFrequency && entities.count > 0) {
      const position_x = entities["position_x"];
      const position_y = entities["position_y"];
      const radius = entities["radius"];
      const type = entities["type"];

      let highest_cat_index = 0;
      for (let i = 0; i < entities.count; i++) {
        let current_y = position_y.get(i) - radius.get(i);
        let best_y = position_y.get(highest_cat_index) - radius.get(highest_cat_index);
        if (current_y < best_y) {
          highest_cat_index = i;
        }
      }

      const cat_type = type.get(highest_cat_index);
      const score = resources.cats[cat_type].score;

      const cat = {
        score: score,
        position_x: position_x.get(highest_cat_index),
        position_y: position_y.get(highest_cat_index),
        radius: radius.get(highest_cat_index),
      };

      spawnParticles(cat, resources.particles, engine);
      playPopSfx(resources.soundEffects, resources.audioContext);
      engine.destroyEntity(highest_cat_index, CatArchetype);
      state.score += score;
      timer = 0;
    }
  }
}