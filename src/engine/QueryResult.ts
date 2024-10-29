import Version from "../components/Version";
import Archetype from "./Archetype";
import Component from "./Component";
import Entity, { EntityInQuery } from "./Entity";
import Resource from "./Resource";

class EntityIterator {
    archetypes: Archetype[];
    length: number;

    constructor(archetypes: Archetype[]) {
        this.archetypes = archetypes;
        this.length = archetypes
            .map(archetype => archetype.length)
            .reduce((sum, length) => sum + length, 0);
    }

    forEach(func: (entity: EntityInQuery) => void) {
        let archetypeIndex = 0;
        let index = 0;
        let entityIndex = 0;

        const versions = this.archetypes[0].components.get(Version);
        while (index < this.archetypes[archetypeIndex].length) {
            // func({
            //     index: entityIndex,
            //     version: versions?.getInt32(),
            //     getComponent: function<T extends Component>(component: T): T {
            //         return 
            //     }
            // });
            index++;
            entityIndex++;
        }
    }
}

export default class QueryResult {
    private resources: Map<string, any>;
    entities: EntityIterator;

    constructor(archetypes: Archetype[], resources: Resource[]) {
        this.resources = resources.reduce((map, resource) => {
            map.set(resource.name, resource.value);
            return map;
        }, new Map());

        this.entities = new EntityIterator(archetypes);
    }

    getResource(name: string): any {
        return this.resources.get(name);
    }

    hasResource(name: string): boolean {
        return this.resources.has(name);
    }
}
