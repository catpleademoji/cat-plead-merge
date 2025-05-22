import { Body } from "./Body";
import { Vector2 } from "./Vector2";

export type CollisionEvent = {
    bodyA: Body;
    bodyB: Body;
    contact: Vector2;
    normal: Vector2;
}
