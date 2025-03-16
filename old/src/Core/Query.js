import ComponentArray from "./ComponentArray.js";

export default function Query(components, archetypes) {
  this.count = archetypes.map(archetype => archetype.num_entities).reduce((acc, x) => acc + x, 0);

  components.forEach(component => {
    this[component] = new ComponentArray(archetypes.map(archetype => {
      return {
        array: archetype.components[component],
        length: archetype.num_entities
      };
    }), this.count);
  });

  this.delete_many = function(indices) {
    if (indices.length === 0) {
      return;
    }

    indices.sort((a, b) => b - a);

    indices.forEach(index => {
      if (index < 0 || index >= this.count) {
        throw new Error("Index out of bounds");
      }

      let archetype_index = archetypes.length - 1;
      let entity_index = index;
      if (archetype_index < 0 || archetype_index >= archetypes.length) {
        console.log(archetype_index, archetypes.length, index);
      }
      while (entity_index < this.count - archetypes[archetype_index].num_entities) {
        entity_index -= archetypes[archetype_index].num_entities;
        archetype_index -= 1;
        if (archetype_index < 0 || archetype_index >= archetypes.length) {
          console.log(archetype_index, archetypes.length, index);
        }
      }
      archetypes[archetype_index].delete(entity_index);
      this.count -= 1;
    });
  };

  this.insert_many = function(entities, query) {
    if (entities.length === 0) {
      return;
    }

    let archetype_index = 0;
    if (archetype_index < 0 || archetype_index >= archetypes.length) {
      console.log(archetype_index, archetypes.length);
    }
    while (archetypes[archetype_index].num_entities >= archetypes[archetype_index].capacity || !archetypes[archetype_index].match_query(query)) {
      archetype_index += 1;
      if (archetype_index < 0 || archetype_index >= archetypes.length) {
        console.log(archetype_index, archetypes.length);
      }
    }

    if (archetype_index >= archetypes.length) {
      throw new Error("Could not add entities");
    }

    archetypes[archetype_index].insert_many(entities);
    this.count += entities.length;
  };
}
