import Archetype from "./Archetype";
import Component from "./Component";
import { Query } from "./Query";

export default class EntityManager {
  archetypes: Archetype[];
  constructor() {
    this.archetypes = [];
  }

  createEntity(componentValues: [Component, any][]) {
    let archetype = this.archetypes
      .filter(archetype => {
        return componentValues.every(componentValue => {
          return archetype.filter(componentValue[0]);
        });
      })
      .find(archetype => {
        return archetype.length < archetype.capacity;
      });

    if (!archetype) {
      // no matching archetypes, create one
      archetype = new Archetype(componentValues.map(componentValue => componentValue[0]));
      this.archetypes.push(archetype);
    }

    archetype.addEntity(componentValues);
  }

  createEntities(componentValues: [Component, any][][]) {
    let archetype = this.archetypes
      .filter(archetype => {
        return componentValues.every(componentValue => {
          return archetype.filter(componentValue[0]);
        });
      })
      .find(archetype => {
        return archetype.length < archetype.capacity;
      });

    if (!archetype) {
      // no matching archetypes, create one
      archetype = new Archetype(componentValues.map(componentValue => componentValue[0]));
      this.archetypes.push(archetype);
    }

    let start = 0;
    while (start < componentValues.length) {
      if (archetype.length < archetype.capacity) {
        const num = archetype.capacity - archetype.length;
        archetype.addEntities(componentValues);

      }

    }
  }

  queryArchetypes(query: Query[]): Archetype[] {
    return this.archetypes.filter(archetype => {
      return query.every(query => archetype.filter(query))
    });

  }
}
