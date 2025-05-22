import { System, QueryResult, Entity } from "cat-plead-engine";
import { Position, Velocity, AngularVelocity, InverseMass, InverseInertia, ColliderRadius, NextCat } from "../../components";
import { dot, cross } from "../../math";
import { Webgl } from "../../resources";
import { Collision } from "../../types/Collision";
import { Vector2 } from "../../types/Vector2";
import { Body } from "../../types/Body";

const staticFrictionCats = 0.15;
const kineticFrictionCats = 0.15;

const staticFrictionFloor = 0.4;
const kineticFrictionFloor = 0.2;

const restitution = 0.25;

export const CollideBodiesSystem: System = {
    query: {
        resources: [
            Webgl,
        ],
        all: [
            Position,
            Velocity,
            AngularVelocity,
            InverseMass,
            InverseInertia,
            ColliderRadius,
        ],
        none: [
            NextCat
        ]
    },
    run(queryResult: QueryResult) {
        const webgl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;
        const screen = {
            minX: 0,
            minY: 0,
            maxX: webgl.canvas.width,
            maxY: webgl.canvas.height,
        };

        const bodies: Body[] = [];

        queryResult.entities.foreach((components, entity: Entity) => {
            const position = components[Position] as Vector2;
            const velocity = components[Velocity] as Vector2;
            const angularVelocity = components[AngularVelocity] as number;
            const inverseMass = components[InverseMass] as number
            const inverseInertia = components[InverseInertia] as number;
            const colliderRadius = components[ColliderRadius] as number;

            bodies.push({
                position,
                velocity,
                angularVelocity,
                inverseMass,
                inverseInertia,
                colliderRadius,
                entity
            });
        });
        
        let dynamicCollisions: Collision[] = [];
        let staticCollisions: Collision[] = [];

        for (let k = 0; k < 20; k++) {
            dynamicCollisions = [];
            staticCollisions = [];

            bodies.sort((a, b) => {
                const minXA = a.position.x - a.colliderRadius;
                const minXB = b.position.x - b.colliderRadius;
                return minXA - minXB;
            });
    
            for (let i = 0; i < bodies.length; i++) {
                const bodyA = bodies[i];
                const maxXA = bodyA.position.x + bodyA.colliderRadius;

                for (let k = i + 1; k < bodies.length; k++) {
                    const bodyB = bodies[k];
                    const minXB = bodyB.position.x - bodyB.colliderRadius;
                    if (maxXA < minXB) {
                        break;
                    }

                    const dx = bodyA.position.x - bodyB.position.x;
                    const dy = bodyA.position.y - bodyB.position.y;
                    const distancesq = dx * dx + dy * dy;
                    const radii = bodyA.colliderRadius + bodyB.colliderRadius;
                    if (distancesq <= radii * radii) {
                        const distance = Math.sqrt(distancesq);

                        let normal_x;
                        let normal_y;
                        let depth;
                        if (distance > 0) {
                            normal_x = dx / distance;
                            normal_y = dy / distance;
                            depth = radii - distance;
                        } else {
                            normal_x = 0;
                            normal_y = 1;
                            depth = Math.max(bodyA.colliderRadius, bodyB.colliderRadius);
                        }

                        dynamicCollisions.push({
                            bodyA,
                            bodyB,
                            contact: {
                                x: bodyA.position.x - normal_x * (bodyA.colliderRadius - depth / 2),
                                y: bodyA.position.y - normal_y * (bodyA.colliderRadius - depth / 2),
                            },
                            normal: {
                                x: normal_x,
                                y: normal_y,
                            },
                            depth,
                            staticFriction: staticFrictionCats,
                            kineticFriction: kineticFrictionCats,
                        });
                    }
                }

                if (bodyA.position.x - bodyA.colliderRadius <= screen.minX) {
                    staticCollisions.push({
                        bodyA,
                        contact: {
                            x: screen.minX,
                            y: bodyA.position.y,
                        },
                        normal: {
                            x: 1,
                            y: 0,
                        },
                        depth: screen.minX + bodyA.colliderRadius - bodyA.position.x,
                        staticFriction: 0,
                        kineticFriction: 0,
                    });
                }

                if (bodyA.position.x + bodyA.colliderRadius >= screen.maxX) {
                    staticCollisions.push({
                        bodyA,
                        contact: {
                            x: screen.maxX,
                            y: bodyA.position.y,
                        },
                        normal: {
                            x: -1,
                            y: 0,
                        },
                        depth: bodyA.colliderRadius - (screen.maxX - bodyA.position.x),
                        staticFriction: 0,
                        kineticFriction: 0,
                    });
                }

                if (bodyA.position.y - bodyA.colliderRadius <= screen.minY) {
                    staticCollisions.push({
                        bodyA,
                        contact: {
                            x: bodyA.position.x,
                            y: screen.minY,
                        },
                        normal: {
                            x: 0,
                            y: 1,
                        },
                        depth: screen.minY + bodyA.colliderRadius - bodyA.position.y,
                        staticFriction: staticFrictionFloor,
                        kineticFriction: kineticFrictionFloor,
                    });
                }

                if (bodyA.position.y + bodyA.colliderRadius >= screen.maxY) {
                    staticCollisions.push({
                        bodyA,
                        contact: {
                            x: bodyA.position.x,
                            y: screen.maxY,
                        },
                        normal: {
                            x: 0,
                            y: -1,
                        },
                        depth: bodyA.colliderRadius - (screen.maxY - bodyA.position.y),
                        staticFriction: staticFrictionFloor,
                        kineticFriction: kineticFrictionFloor,
                    });
                }
            }

            for (let i = 0; i < dynamicCollisions.length; i++) {
                const { bodyA, bodyB, normal, depth } = dynamicCollisions[i];
                const halfDepth = depth * 0.5;

                bodyA.position.x += normal.x * halfDepth;
                bodyA.position.y += normal.y * halfDepth;

                bodyB!.position.x -= normal.x * halfDepth;
                bodyB!.position.y -= normal.y * halfDepth;
            }

            for (let i = 0; i < dynamicCollisions.length; i++) {
                const { bodyA, bodyB, contact, normal, kineticFriction, staticFriction } = dynamicCollisions[i];
                const armA = {
                    x: contact.x - bodyA.position.x,
                    y: contact.y - bodyA.position.y,
                };
                const armB = {
                    x: contact.x - bodyB!.position.x,
                    y: contact.y - bodyB!.position.y,
                }
                const velocityA = bodyA.velocity;
                const velocityB = bodyB!.velocity;
                const angularVelocityA = bodyA.angularVelocity;
                const angularVelocityB = bodyB!.angularVelocity;

                const tangentialVelocityA = {
                    x: -armA.y * angularVelocityA,
                    y: +armA.x * angularVelocityA,
                };
                const tangentialVelocityB = {
                    x: -armB.y * angularVelocityB,
                    y: +armB.x * angularVelocityB,
                };

                const relativeVelocity = {
                    x: (velocityA.x + tangentialVelocityA.x) - (velocityB.x + tangentialVelocityB.x),
                    y: (velocityA.y + tangentialVelocityA.y) - (velocityB.y + tangentialVelocityB.y),
                };

                const velocityProjectionNormal = dot(relativeVelocity, normal);

                const invMassA = bodyA.inverseMass;
                const invMassB = bodyB!.inverseMass;
                const invInertiaA = bodyA.inverseInertia;
                const invInertiaB = bodyB!.inverseInertia;

                const invMassSum = invMassA + invMassB;

                const armCrossNormalA = cross(armA, normal);
                const armCrossNormalB = cross(armB, normal);
                const invInertiaSum = (invInertiaA * armCrossNormalA * armCrossNormalA)
                    + (invInertiaB * armCrossNormalB * armCrossNormalB);

                const impulseReaction = -(1 + restitution) * velocityProjectionNormal
                    / (invMassSum + invInertiaSum);

                const tangent = {
                    x: -normal.y,
                    y: normal.x,
                };

                const velocityProjectionTangent = dot(relativeVelocity, tangent);
                let impulseFriction = -(velocityProjectionTangent / (invMassSum + invInertiaSum));
                if (!(velocityProjectionTangent === 0 && Math.abs(impulseFriction) <= Math.abs(staticFriction * impulseReaction))) {
                    impulseFriction = -(kineticFriction * impulseFriction);
                }

                const impulse = {
                    x: impulseReaction * normal.x - impulseFriction * tangent.x,
                    y: impulseReaction * normal.y - impulseFriction * tangent.y,
                };

                bodyA.velocity.x += impulse.x * invMassA;
                bodyA.velocity.y += impulse.y * invMassA;
                queryResult.entities.setComponent(bodyA.entity, Velocity, bodyA.velocity);
                bodyA.angularVelocity += cross(armA, impulse) * invInertiaA;
                queryResult.entities.setComponent(bodyA.entity, AngularVelocity, bodyA.angularVelocity);

                bodyB!.velocity.x -= impulse.x * invMassB;
                bodyB!.velocity.y -= impulse.y * invMassB;
                queryResult.entities.setComponent(bodyB!.entity, Velocity, bodyB!.velocity);
                bodyB!.angularVelocity -= cross(armB, impulse) * invInertiaB;
                queryResult.entities.setComponent(bodyB!.entity, AngularVelocity, bodyB!.angularVelocity);
            }

            for (let i = 0; i < staticCollisions.length; i++) {
                const { bodyA, normal, depth } = staticCollisions[i];

                bodyA.position.x += normal.x * depth;
                bodyA.position.y += normal.y * depth;
            }

            for (let i = 0; i < staticCollisions.length; i++) {
                const { bodyA, contact, normal, kineticFriction, staticFriction } = staticCollisions[i];
                const armA = {
                    x: contact.x - bodyA.position.x,
                    y: contact.y - bodyA.position.y,
                };

                const velocityA = bodyA.velocity;
                const angularVelocityA = bodyA.angularVelocity;

                const tangentialVelocityA = {
                    x: -armA.y * angularVelocityA,
                    y: +armA.x * angularVelocityA,
                };

                const relativeVelocity = {
                    x: (velocityA.x + tangentialVelocityA.x),
                    y: (velocityA.y + tangentialVelocityA.y),
                };

                const velocityProjectionNormal = dot(relativeVelocity, normal);

                const invMassA = bodyA.inverseMass;
                const invInertiaA = bodyA.inverseInertia;

                const invMassSum = invMassA;

                const armCrossNormalA = cross(armA, normal);
                const invInertiaSum = (invInertiaA * armCrossNormalA * armCrossNormalA);

                const impulseReaction = -(1 + restitution) * velocityProjectionNormal
                    / (invMassSum + invInertiaSum);

                const tangent = {
                    x: -normal.y,
                    y: normal.x,
                };

                const velocityProjectionTangent = dot(relativeVelocity, tangent);
                let impulseFriction = -(velocityProjectionTangent / (invMassSum + invInertiaSum));
                if (!(velocityProjectionTangent === 0 && Math.abs(impulseFriction) <= Math.abs(staticFriction * impulseReaction))) {
                    impulseFriction = -(kineticFriction * impulseFriction);
                }

                const impulse = {
                    x: impulseReaction * normal.x - impulseFriction * tangent.x,
                    y: impulseReaction * normal.y - impulseFriction * tangent.y,
                };

                bodyA.velocity.x += impulse.x * invMassA;
                bodyA.velocity.y += impulse.y * invMassA;
                bodyA.angularVelocity += cross(armA, impulse) * invInertiaA;
                queryResult.entities.setComponent(bodyA.entity, AngularVelocity, bodyA.angularVelocity);
            }
        }
    }
}
