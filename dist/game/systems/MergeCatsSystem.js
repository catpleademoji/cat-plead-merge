import { DefaultResources } from "cat-plead-engine";
import { CatAssets, CatPoppedEvents } from "../resources";
import { AngularVelocity, CatIndex, ColliderRadius, Color, InverseInertia, InverseMass, LifeTime, NextCat, Position, Rotation, Scale, Sprite, Velocity } from "../components";
import { sphereInvVolume, sphereVolume } from "../math";
import { Colors } from "../types/Color";
export const MergeCatsSystem = {
    query: {
        resources: [
            DefaultResources.Commands,
            CatAssets,
            CatPoppedEvents,
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
    run: function (queryResult) {
        const lifeTimeThreshold = 0.25;
        const mergeDistanceAllowance = 10;
        const bodies = [];
        queryResult.entities.foreach((components, entity) => {
            const lifeTime = components[LifeTime];
            if (lifeTime < lifeTimeThreshold) {
                return;
            }
            const catIndex = components[CatIndex];
            const position = components[Position];
            const colliderRadius = components[ColliderRadius];
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
        const collisions = [];
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
        const commands = queryResult.resources.get(DefaultResources.Commands);
        const catAssets = queryResult.resources.get(CatAssets);
        const catPoppedEvents = queryResult.resources.get(CatPoppedEvents);
        const groupSizes = new Map();
        const entitiesToCreate = [];
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
            }
            else {
                // merge two cats
                const prev_type = pair.bodyA.catIndex;
                const cat_index = (prev_type + 1) % catAssets.length;
                const score = catAssets[prev_type].score * 2;
                const parents = new Map();
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
                const position = queryResult.entities.getComponent(parent, Position);
                const rotation = queryResult.entities.getComponent(parent, Rotation);
                return {
                    position: {
                        x: components.position.x + position.x,
                        y: components.position.y + position.y,
                    },
                    rotation: components.rotation + rotation,
                };
            }, {
                position: {
                    x: 0,
                    y: 0,
                },
                rotation: 0,
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
                    x: 0,
                    y: 0,
                },
                [AngularVelocity]: 0,
                [InverseMass]: 1 / mass,
                [InverseInertia]: 1 / momentOfInertia,
                [LifeTime]: 0,
                [Color]: Colors.white,
            };
            entity.parents.values().forEach(parent => commands.destroyEntity(parent));
            commands.spawnFromComponents(entityComponents);
            catPoppedEvents.enqueue({
                catIndex: entity.catIndex,
                score: entity.score,
                position: entityComponents[Position],
                radius: entityComponents[ColliderRadius],
            });
        });
    }
};
