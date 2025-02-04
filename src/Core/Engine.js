import Archetype from "./Archetype.js";
import Query from "./Query.js";

export default function Engine() {
  const system_groups = [];
  const archetypes = [];

  this.update = function(time, state, resources) {
    system_groups.forEach(system_group => {
      if (!system_group.shouldUpdate(state)) {
        return;
      }

      system_group.systems.forEach(system => {
        const entityQuery = new Query(system.query, archetypes.filter(archetype => archetype.match_query(system.query)));
        system.update(time, entityQuery, state, resources);
      });
    })
  };

  this.addSystemGroup = function(systemGroup) {
    system_groups.push(systemGroup);
  }

  this.instantiateEntity = function(entity, query) {
    let archetype = archetypes.find(archetype => archetype.match_query(query) && archetype.num_entities < archetype.capacity);
    if (!archetype) {
      archetype = new Archetype(query);
      archetypes.push(archetype);
    }
    archetype.insert(entity);
  };

  this.instantiateEntities = function(entities, query) {
    let archetype = archetypes.find(archetype => archetype.match_query(query) && archetype.num_entities < archetype.capacity);
    if (!archetype) {
      archetype = new Archetype(query);
      archetypes.push(archetype);
    }

    let num_entities = entities.length;
    while (num_entities > 0) {
      if (archetype.num_entities >= archetype.capacity) {
        archetype = new Archetype(query);
        archetypes.push(archetype);
      }
      let amount_to_insert = Math.min(num_entities, archetype.capacity - archetype.num_entities);
      archetype.insert_many(entities.slice(num_entities - amount_to_insert, num_entities));
      num_entities -= amount_to_insert;
    }
  };

  this.destroyEntity = function(entityIndex, query) {
    const matchingArchetypes = archetypes.filter(archetype => archetype.match_query(query));

    if (matchingArchetypes.length === 0) {
      throw new Error("Invalid entity index");
    }

    let entityRemappedIndex = entityIndex;
    let archetypeIndex = 0;
    if (archetypeIndex < 0 || archetypeIndex >= matchingArchetypes.length) {
      console.log(archetypeIndex, matchingArchetypes.length, entityRemappedIndex);
    }
    while (archetypeIndex < matchingArchetypes.length && matchingArchetypes[archetypeIndex].num_entities <= entityRemappedIndex) {
      entityRemappedIndex -= matchingArchetypes[archetypeIndex].num_entities;
      archetypeIndex += 1;
    }
    if (archetypeIndex >= matchingArchetypes.length) {
      throw new Error("Invalid entity index");
    }
    matchingArchetypes[archetypeIndex].delete(entityRemappedIndex);
  }

  this.destroyEntities = function(entityIndices, query) {
    const matchingArchetypes = archetypes.filter(archetype => archetype.match_query(query));

    if (matchingArchetypes.length === 0) {
      throw new Error("Invalid entity index");
    }
    entityIndices.sort((a, b) => b - a);

    entityIndices.forEach(entityIndex => {
      let entityRemappedIndex = entityIndex;
      let archetypeIndex = 0;
      while (archetypeIndex < matchingArchetypes.length && matchingArchetypes[archetypeIndex].num_entities <= entityRemappedIndex) {
        entityRemappedIndex -= matchingArchetypes[archetypeIndex].num_entities;
        archetypeIndex += 1;
      }
      if (archetypeIndex < 0) {
        throw new Error("Invalid entity index");
      }
      matchingArchetypes[archetypeIndex].delete(entityRemappedIndex);
    })
  }
}