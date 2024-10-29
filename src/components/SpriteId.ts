import Component from "../engine/Component";

export class SpriteId extends Component {
    id: number;
    constructor(id: number) {
        super();
        this.id = id;
    }
}
