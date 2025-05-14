import { Commands, DefaultResources, Entity, QueryResult, System } from "cat-plead-engine";
import { CatAssets, CatMergedEvents } from "../resources";
import { Cat } from "@/types/Cat";
import { AngularVelocity, CatIndex, ColliderRadius, Color, InverseInertia, InverseMass, LifeTime, NextCat, Position, Rotation, Scale, Sprite, Velocity } from "../components";
import { sphereInvVolume, sphereVolume } from "../math";
import { Vector2 } from "../types/Vector2";
import { EventQueue } from "../EventQueue";
import { CatMergeEvent } from "../types/CatMergeEvent";
import { Colors } from "../types/Color";

export const MergeCatsSystem: System = {
    query: {
        resources: [
            DefaultResources.Commands,
            CatAssets,
            CatMergedEvents,
        ],
        all: [
            CatIndex,
            Position,
            ColliderRadius,
            LifeTime,
        ],
        none: [
            NextCat
        ]
    },
    run: function (queryResult: QueryResult): void {
        const lifeTimeThreshold = 0.25;
        const mergeDistanceAllowance = 5;

        type Body = {
            entity: Entity;
            catIndex: number;
            position: Vector2;
            colliderRadius: number;
        };

        const bodies: Body[] = [];

        queryResult.entities.foreach((components, entity: Entity) => {
            const lifeTime = components[LifeTime] as number;
            if (lifeTime < lifeTimeThreshold) {
                return;
            }

            const catIndex = components[CatIndex] as number;
            const position = components[Position] as Vector2;
            const colliderRadius = components[ColliderRadius] as number;
            bodies.push({
                entity,
                catIndex,
                position,
                colliderRadius,
            });
        });

        bodies.sort((a, b) => {
            const minXA = a.position.x - a.colliderRadius;
            const minXB = b.position.x - b.colliderRadius;
            return minXA - minXB;
        });

        const collisions: {
            bodyA: Body,
            bodyB: Body,
        }[] = [];
        for (let i = 0; i < bodies.length; i++) {
            const bodyA = bodies[i];
            const maxXA = bodyA.position.x + bodyA.colliderRadius;

            for (let k = i + 1; k < bodies.length; k++) {
                const bodyB = bodies[k];
                if (bodyA.catIndex !== bodyB.catIndex) {
                    continue;
                }

                const minXB = bodyB.position.x - bodyB.colliderRadius;
                if (maxXA + mergeDistanceAllowance < minXB) {
                    break;
                }

                const dx = bodyA.position.x - bodyB.position.x;
                const dy = bodyA.position.y - bodyB.position.y;
                const distancesq = dx * dx + dy * dy;
                const radii = bodyA.colliderRadius + bodyB.colliderRadius;
                if (distancesq - mergeDistanceAllowance <= radii * radii) {
                    collisions.push({
                        bodyA,
                        bodyB
                    });
                }
            }
        }

        const commands = queryResult.resources.get<Commands>(DefaultResources.Commands)!;
        const catAssets = queryResult.resources.get<Cat[]>(CatAssets)!;
        const mergedEvents = queryResult.resources.get<EventQueue<CatMergeEvent>>(CatMergedEvents)!;
        mergedEvents.clear();

        const groupSizes = new Map<number, number>();
        const entitiesToCreate: {
            parents: Map<number, Entity>;
            catIndex: number;
            score: number;
        }[] = [];
        collisions.forEach(pair => {
            const countA = groupSizes.get(pair.bodyA.entity.index);
            groupSizes.set(pair.bodyA.entity.index, countA ? countA + 1 : 1);

            const countB = groupSizes.get(pair.bodyB.entity.index);
            groupSizes.set(pair.bodyB.entity.index, countB ? countB + 1 : 1);

            const dupeIndex = entitiesToCreate.findIndex(entity => {
                return entity.parents.has(pair.bodyA.entity.index) || entity.parents.has(pair.bodyB.entity.index);
            });
            if (dupeIndex !== -1) {
                // more than two cats are merging with each other
                const mergedCat = entitiesToCreate[dupeIndex];
                const catIndex = (mergedCat.catIndex + 1) % catAssets.length;

                const parents = mergedCat.parents;
                if (!parents.has(pair.bodyA.entity.index)) {
                    parents.set(pair.bodyA.entity.index, pair.bodyA.entity);
                }
                if (!parents.has(pair.bodyB.entity.index)) {
                    parents.set(pair.bodyB.entity.index, pair.bodyB.entity);
                }

                entitiesToCreate[dupeIndex] = {
                    parents: parents,
                    catIndex: catIndex,
                    score: mergedCat.score * 2
                };
            } else {
                // merge two cats
                const prev_type = pair.bodyA.catIndex;
                const cat_index = (prev_type + 1) % catAssets.length;
                const score = catAssets[prev_type].score * 2;
                const parents = new Map<number, Entity>();
                parents.set(pair.bodyA.entity.index, pair.bodyA.entity);
                parents.set(pair.bodyB.entity.index, pair.bodyB.entity);
                entitiesToCreate.push({
                    parents: parents,
                    catIndex: cat_index,
                    score: score
                });
            }
        });

        entitiesToCreate.forEach(entity => {
            const components = entity.parents.values()
                .reduce((components, parent) => {
                    const position = queryResult.entities.getComponent(parent, Position) as Vector2;
                    const velocity = queryResult.entities.getComponent(parent, Velocity) as Vector2;
                    const rotation = queryResult.entities.getComponent(parent, Rotation) as number;
                    const angularVelocity = queryResult.entities.getComponent(parent, AngularVelocity) as number;
                    return {
                        position: {
                            x: components.position.x + position.x,
                            y: components.position.y + position.y,
                        },
                        velocity: {
                            x: components.velocity.x + velocity.x,
                            y: components.velocity.y + velocity.y,
                        },
                        rotation: components.rotation + rotation,
                        angularVelocity: components.angularVelocity + angularVelocity,
                    };
                }, {
                    position: {
                        x: 0,
                        y: 0,
                    },
                    velocity: {
                        x: 0,
                        y: 0,
                    },
                    rotation: 0,
                    angularVelocity: 0
                });

            const cat = catAssets[entity.catIndex];

            const radius = cat.size / 2;
            const volume = sphereVolume(radius);
            const mass = sphereInvVolume(volume);
            const momentOfInertia = 2 / 5 * mass * Math.pow(mass, 3);

            const entityComponents = {
                [CatIndex]: entity.catIndex,
                [Sprite]: cat.texture,
                [ColliderRadius]: cat.size / 2,
                [Position]: {
                    x: components.position.x / entity.parents.size,
                    y: components.position.y / entity.parents.size,
                },
                [Rotation]: components.rotation / entity.parents.size,
                [Scale]: {
                    x: cat.size,
                    y: cat.size,
                },
                [Velocity]: {
                    x: components.velocity.x / entity.parents.size,
                    y: components.velocity.y / entity.parents.size,
                },
                [AngularVelocity]: components.angularVelocity / entity.parents.size,
                [InverseMass]: 1 / mass,
                [InverseInertia]: 1 / momentOfInertia,
                [LifeTime]: 0,
                [Color]: Colors.white,
            };

            entity.parents.values().forEach(parent => commands.destroyEntity(parent))
            commands.spawnFromComponents(entityComponents);
            mergedEvents.enqueue({
                cat: {
                    catIndex: entity.catIndex,
                    score: entity.score,
                    position: entityComponents[Position],
                    colliderRadius: entityComponents[ColliderRadius],
                },
            });
        });
    }
}