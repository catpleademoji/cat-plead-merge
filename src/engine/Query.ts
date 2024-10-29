import Component from "./Component";

export type Query = (Component | With | Without | Resource);

export class With {
    component: Component;
    constructor(component: Component) {
        this.component = component;
    }
}

export class Without {
    component: Component;
    constructor(component: Component) {
        this.component = component;
    }
}

export class Resource {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

export default Query;
