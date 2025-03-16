import CatArchetype from "../Archetypes/cat.js";

export default function MergeCats(game, onMerge) {
  this.query = [
    "type",
    "position_x",
    "position_y",
    "rotation",
    "radius",
    "inv_mass",
    "inv_inertia",
    "lifetime",
  ];
  const collisions = [];
  this.update = function(time, entities, state, resources) {
    collisions.length = 0;
    collect_collisions(entities, collisions);
    merge_cats(entities, collisions, resources.cats);
  };

  const lifetime_threshold = 0.2;
  const merge_distance_threshold = 0.01;

  const collect_collisions = function(entities, collisions) {
    const position_x = entities["position_x"];
    const position_y = entities["position_y"];
    const radius = entities["radius"];
    const type = entities["type"];
    const lifetime = entities["lifetime"];
    const entities_by_pos_x = [];

    for (let i = 0; i < entities.count; i++) {
      entities_by_pos_x.push(i);
    }

    entities_by_pos_x.sort((a, b) => {
      const min_x_a = position_x.get(a) - radius.get(a);
      const min_x_b = position_x.get(b) - radius.get(b);
      return min_x_a - min_x_b;
    });

    for (let i = 0; i < entities_by_pos_x.length; i++) {
      const entity_a = entities_by_pos_x[i];

      const lifetime_a = lifetime.get(entity_a);
      if (lifetime_a < lifetime_threshold) {
        continue;
      }

      const type_a = type.get(entity_a);
      const pos_a_x = position_x.get(entity_a);
      const pos_a_y = position_y.get(entity_a);
      const radius_a = radius.get(entity_a);
      const max_x_a = position_x.get(entity_a) + radius.get(entity_a);

      for (let k = i + 1; k < entities_by_pos_x.length; k++) {
        const entity_b = entities_by_pos_x[k];

        const min_x_b = position_x.get(entity_b) - radius.get(entity_b);
        if (max_x_a + merge_distance_threshold < min_x_b) {
          // no collision
          break;
        }

        const lifetime_b = lifetime.get(entity_b);
        if (lifetime_b < lifetime_threshold) {
          continue;
        }

        const type_b = type.get(entity_b);
        if (type_a !== type_b) {
          continue;
        }

        const pos_b_x = position_x.get(entity_b);
        const pos_b_y = position_y.get(entity_b);
        const radius_b = radius.get(entity_b);

        const dx = pos_a_x - pos_b_x;
        const dy = pos_a_y - pos_b_y;
        const distancesq = dx * dx + dy * dy;
        const radii = radius_a + radius_b + merge_distance_threshold;
        if (distancesq <= radii * radii) {
          collisions.push({
            a: entity_a,
            b: entity_b
          });
        }
      }
    }
  };

  const merge_cats = function(entities, collisions, cats) {
    const entities_to_delete = {};
    const entities_to_create = [];

    const type = entities["type"];
    const position_x = entities["position_x"];
    const position_y = entities["position_y"];
    const rotation = entities["rotation"];
    collisions.forEach(pair => {
      entities_to_delete[pair.a] = entities_to_delete[pair.a]
        ? entities_to_delete[pair.a] + 1
        : 1;
      entities_to_delete[pair.b] = entities_to_delete[pair.b]
        ? entities_to_delete[pair.b] + 1
        : 1;

      const dupe_index = entities_to_create.findIndex(entity => {
        return entity.parents[pair.a] || entity.parents[parent.b];
      });
      if (dupe_index !== -1) {
        // more than two cats are merging with each other
        const mergedCat = entities_to_create[dupe_index];
        const cat_index = (mergedCat.type + 1) % cats.length;

        const parents = mergedCat.parents;
        let num_parents = mergedCat.num_parents;
        if (!parents[pair.a]) {
          parents[pair.a] = pair.a;
          num_parents += 1;
        }
        if (!parents[pair.b]) {
          parents[pair.b] = pair.b;
          num_parents += 1;
        }

        entities_to_create[dupe_index] = {
          parents: parents,
          num_parents,
          type: cat_index,
          score: mergedCat.score * 2
        };
      } else {
        // merge two cats
        const prev_type = type.get(pair.a);
        const cat_index = (prev_type + 1) % cats.length;
        const score = cats[prev_type].score * 2;
        const parents = {};
        parents[pair.a] = pair.a;
        parents[pair.b] = pair.b;
        entities_to_create.push({
          parents: parents,
          num_parents: 2,
          type: cat_index,
          score: score
        });
      }
    });

    const cats_to_create = entities_to_create.map(entity => {
      const cat = cats[entity.type];

      let _position_x = 0;
      let _position_y = 0;
      let _rotation = 0;

      Object.keys(entity.parents)
        .forEach(key => {
          const parent = entity.parents[key];
          _position_x += position_x.get(parent);
          _position_y += position_y.get(parent);
          _rotation += rotation.get(parent);
        });

      _position_x /= entity.num_parents;
      _position_y /= entity.num_parents;
      _rotation /= entity.num_parents;

      return {
        score: entity.score,
        type: entity.type,
        image: cat.image,
        radius: cat.radius,
        position_x: _position_x,
        position_y: _position_y,
        rotation: _rotation,
        inv_mass: cat.inv_mass,
        inv_inertia: cat.inv_inertia,
      };
    });

    const entities_to_delete_indices = Object.keys(entities_to_delete);
    if (entities_to_delete_indices.length > 0) {
      game.destroyEntities(entities_to_delete_indices, CatArchetype);
    }

    if (cats_to_create.length > 0) {
      game.instantiateEntities(cats_to_create, CatArchetype);

      if (Array.isArray(onMerge)) {
        onMerge.forEach(onMerge => { onMerge(cats_to_create); });
      } else {
        onMerge(cats_to_create);
      }
    }
  };
}
