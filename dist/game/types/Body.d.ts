import { Entity } from "cat-plead-engine";
import { Vector2 } from "./Vector2";
export type Body = {
    position: Vector2;
    velocity: Vector2;
    angularVelocity: number;
    inverseMass: number;
    inverseInertia: number;
    colliderRadius: number;
    entity: Entity;
};
