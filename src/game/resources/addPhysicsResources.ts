import { Engine } from "cat-plead-engine";
import { PhysicsSettings, CollisionEvents } from ".";
import { EventQueue } from "../EventQueue";
import { CollisionEvent } from "../types/CollisionEvent";


export function addPhysicsResources(engine: Engine) {
    engine.addResource(PhysicsSettings, {
        gravity: {
            x: 0,
            y: 9.81 * 32,
        }
    });
    engine.addResource(CollisionEvents, new EventQueue<CollisionEvent>());
}
