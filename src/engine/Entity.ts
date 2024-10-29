import Component from "./Component";

export default interface Entity {
    index: number;
    version: number;
}

export interface EntityInQuery extends Entity {
    getComponent(component: Component): Component;
} 
