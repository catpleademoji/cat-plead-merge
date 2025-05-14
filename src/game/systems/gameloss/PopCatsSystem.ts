import { AngularVelocity, CatIndex, Color, LifeTime, MaxLifeTime, Position, Rotation, Scale, Sprite, Velocity } from "@/game/components";
import { CatAssets, ParticleAssets, PopTimer, Theme as ThemeRes } from "@/game/resources";
import { Timer } from "@/game/types/Timer";
import { Vector2 } from "@/game/types/Vector2";
import { Cat } from "@/types/Cat";
import { Particle } from "@/types/Particle";
import { Theme } from "@/types/Theme";
import { Commands, DefaultResources, Entity, QueryResult, System, Time } from "cat-plead-engine";

export const PopCatsSystem: System = {
    query: {
        resources: [
            DefaultResources.Time,
            DefaultResources.Commands,
            ParticleAssets,
            CatAssets,
            ThemeRes,
            PopTimer,
        ],
        all: [
            CatIndex,
            Position,
        ],
    },
    run(queryResult: QueryResult) {
        const time = queryResult.resources.get<Time>(DefaultResources.Time)!;
        const popTimer = queryResult.resources.getRW<Timer>(PopTimer)!;
        const popFrequency = 1 / 10;

        popTimer.time += time.delta;
        if (popTimer.time < popFrequency && queryResult.entities.count() > 0) {
            return;
        }

        const commands = queryResult.resources.get<Commands>(DefaultResources.Commands)!;
        const cats = queryResult.resources.get<Cat[]>(CatAssets)!;
        const particles = queryResult.resources.get<Particle[]>(ParticleAssets)!;
        const theme = queryResult.resources.get<Theme>(ThemeRes)!;

        popTimer.time -= popFrequency;

        let highestCat: Entity | undefined;
        let highestPosition: Vector2 | undefined;
        queryResult.entities.foreach((components, entity) => {
            const position = components[Position] as Vector2;
            if (highestPosition && highestPosition.y < position.y) {
                return;
            }
            highestPosition = position;
            highestCat = entity;
        });

        if (!highestCat || !highestPosition) {
            return;
        }

        const catIndex = queryResult.entities.getComponent<number>(highestCat, CatIndex);
        const score = cats[catIndex].score;
        const numParticles = Math.min(2, Math.floor(Math.log2(score)));
        
        commands.destroyEntity(highestCat);

        for (let i = 0; i < numParticles; i++) {
            const randomIndex = Math.floor(Math.random() * particles.length);
            const particle = particles[randomIndex];

            const velocityAngle = Math.random() * (Math.PI / 2) - (3 * Math.PI / 4);
            const speed = Math.random() * (500 - 50) + 50;
            const velocity = {
                x: Math.cos(velocityAngle) * speed,
                y: Math.sin(velocityAngle) * speed,
            };

            const rotation = Math.atan2(velocity.y, velocity.x);

            const colorIndex = Math.floor(Math.random() * theme.values.length);
            const color = theme.values[colorIndex];

            const maxScale = 1 + Math.log(catIndex);
            const minScale = 0.75;
            const scaleFactor = Math.random() * (maxScale - minScale) + minScale;

            commands.spawnFromComponents({
                [Sprite]: particle.texture,
                [Position]: {
                    x: highestPosition.x,
                    y: highestPosition.y
                },
                [Velocity]: velocity,
                [Rotation]: rotation,
                [AngularVelocity]: 0,
                [Scale]: { x: particle.size * scaleFactor, y: particle.size * scaleFactor },
                [Color]: { ...color },
                [LifeTime]: 0,
                [MaxLifeTime]: (Math.random() + 1),
            });
        }
    },
}