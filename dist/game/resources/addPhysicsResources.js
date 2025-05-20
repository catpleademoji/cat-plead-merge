import { PhysicsSettings } from ".";
export function addPhysicsResources(engine) {
    engine.addResource(PhysicsSettings, {
        gravity: {
            x: 0,
            y: 9.81 * 64,
        }
    });
}
