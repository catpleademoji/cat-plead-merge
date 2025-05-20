import { Body } from "./Body";
import { Vector2 } from "./Vector2";
export type Collision = {
    bodyA: Body;
    bodyB?: Body;
    contact: Vector2;
    normal: Vector2;
    depth: number;
    staticFriction: number;
    kineticFriction: number;
};
