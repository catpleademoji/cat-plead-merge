import Version from "../components/Version";
import Component from "./Component";
import { Query, With, Without } from "./Query";

export default class Archetype {
    components: Map<Component, Component[]>;
    length: number;
    capacity: number;

    constructor(components: Component[], capacity: number = 100) {
        this.capacity = capacity;
        this.length = 0;

        this.components = new Map();
        for (let i = 0; i < [...components, Version].length; i++) {
            if (!this.components.has(components[i])) {
                continue;
            }
            this.components.set(components[i], Array.from({ length: capacity }));
        }
    }

    filter(query: Query): boolean {
        if (query instanceof Component) {
            return this.components.has(query);
        } else if (query instanceof With) {
            return this.components.has(query.component);
        } else if (query instanceof Without) {
            return !this.components.has(query.component);
        }

        return false;
    }

    addEntity(componentValues: [Component, any][]) {
        if (this.length === this.capacity) {
            throw new Error("Cannot add entities to archetype reached capacity.");
        }
        componentValues.forEach(([component, value]) => {
            const items = this.components.get(component)!;
            items[this.length] = value;
        });
        this.length++;
    }

    addEntities(componentValues: [Component, any][][]) {
        if (this.length === this.capacity) {
            throw new Error("Cannot add entities to archetype reached capacity.");
        }
        
        const remainingCapacity = this.capacity - this.length;
    }
}