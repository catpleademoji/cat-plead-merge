import { Engine } from "cat-plead-engine";
import { PhysicsSettings } from ".";

export function addPhysicsResources(engine: Engine) {
    engine.addResource(PhysicsSettings, {
        gravity: {
            x: 0,
            y: 9.81 * 64,
        }
    });
}
