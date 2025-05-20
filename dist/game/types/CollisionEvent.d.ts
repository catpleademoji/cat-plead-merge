import { Vector2 } from "../../game/types/Vector2";
import { Body } from "./Body";
export type CollisionEvent = {
    bodyA: Body;
    bodyB: Body;
    contact: Vector2;
    normal: Vector2;
};
