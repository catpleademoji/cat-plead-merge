import { Commands, QueryResult, System } from "cat-plead-engine";
import { CatAssets, CollisionEvents, EntityCommands } from "../resources";
import { EventQueue } from "../EventQueue";
import { CollisionEvent } from "../types/CollisionEvent";
import { Cat } from "@/types/Cat";
import { AngularVelocity, CatIndex, ColliderRadius, InverseInertia, InverseMass, LifeTime, Position, Rotation, Scale, Sprite, Velocity } from "../components";
import { sphereInvVolume, sphereVolume } from "../math/math";

export const MergeCatsSystem: System = {
    query: {
        resources: [
            CollisionEvents,
            EntityCommands,
            CatAssets,
        ],
    },
    run: function (queryResult: QueryResult): void {
        const collisionEvents = queryResult.resources.get<EventQueue<CollisionEvent>>(CollisionEvents)!;
        const commands = queryResult.resources.get<Commands>(EntityCommands)!;
        const catAssets = queryResult.resources.get<Cat[]>(CatAssets)!;
        
        const lifeTimeThreshold = 0.25;

        collisionEvents.foreach(({ bodyA, bodyB }) => {
            const catIndexA = queryResult.entities.getComponent<number>(bodyA.entity, CatIndex);
            const catIndexB = queryResult.entities.getComponent<number>(bodyB.entity, CatIndex);

            const lifeTimeA = queryResult.entities.getComponent<number>(bodyA.entity, LifeTime);
            const lifeTimeB = queryResult.entities.getComponent<number>(bodyB.entity, LifeTime);
            if (catIndexA === catIndexB && lifeTimeA > lifeTimeThreshold && lifeTimeB > lifeTimeThreshold) {
                const rotationA = queryResult.entities.getComponent<number>(bodyA.entity, Rotation);
                const rotationB = queryResult.entities.getComponent<number>(bodyB.entity, Rotation);

                const nextCatIndex = (catIndexA + 1) % catAssets.length;
                const nextCat = catAssets[nextCatIndex];

                const radius = nextCat.size / 2;
                const volume = sphereVolume(radius);
                const mass = sphereInvVolume(volume);
                const moment_of_inertia = 2 / 5 * mass * Math.pow(mass, 3);
                
                const entity = {
                    [CatIndex]: nextCatIndex,
                    [Position]: {
                        x: (bodyA.position.x + bodyB.position.x) / 2,
                        y: (bodyA.position.y + bodyB.position.y) / 2,
                    },
                    [Rotation]: (rotationA + rotationB) / 2,
                    [Scale]: { x: nextCat.size, y: nextCat.size },
                    [Velocity]: {
                        x: (bodyA.velocity.x + bodyB.velocity.x) / 2,
                        y: (bodyA.velocity.y + bodyB.velocity.y) / 2,
                    },
                    [AngularVelocity]: (bodyA.angularVelocity + bodyB.angularVelocity) / 2,
                    [Sprite]: nextCat.texture,
                    [ColliderRadius]: radius,
                    [InverseMass]: 1 / mass,
                    [InverseInertia]: 1 / moment_of_inertia,
                    [LifeTime]: 0,
                };

                commands.spawnFromComponents(entity);

                commands.destroyEntity(bodyA.entity);
                commands.destroyEntity(bodyB.entity);
            }
        });
    }
}