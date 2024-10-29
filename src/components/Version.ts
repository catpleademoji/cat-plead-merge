import Component from "../engine/Component";

export default class Version extends Component {
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }
}
