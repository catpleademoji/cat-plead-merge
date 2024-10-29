import Component from "../engine/Component";

export class Rotation extends Component {
    angle: number;
    constructor(radians: number = 0) {
        super();
        this.angle = radians;
    }

    fromDegrees(degrees: number) {
        this.angle = degrees / 180 * Math.PI;
    }
}
