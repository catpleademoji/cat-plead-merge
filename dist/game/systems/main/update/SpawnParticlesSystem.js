import { DefaultResources } from "cat-plead-engine";
import { Sprite, Position, Velocity, Rotation, Scale, Color, LifeTime, MaxLifeTime, AngularVelocity } from "../../../../game/components";
import { CatPoppedEvents, ParticleAssets, Theme as ThemeRes } from "../../../../game/resources";
export const SpawnParticlesSystem = {
    query: {
        resources: [
            ThemeRes,
            DefaultResources.Commands,
            CatPoppedEvents,
            ParticleAssets,
        ]
    },
    run(queryResult) {
        const commands = queryResult.resources.get(DefaultResources.Commands);
        const mergeEvents = queryResult.resources.get(CatPoppedEvents);
        const particles = queryResult.resources.get(ParticleAssets);
        const theme = queryResult.resources.get(ThemeRes);
        mergeEvents.foreach(mergeEvent => {
            const numParticles = Math.min(2, Math.floor(Math.log2(mergeEvent.score)));
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
                const maxScale = 1 + Math.log(mergeEvent.catIndex);
                const minScale = 0.75;
                const scaleFactor = Math.random() * (maxScale - minScale) + minScale;
                commands.spawnFromComponents({
                    [Sprite]: particle.texture,
                    [Position]: {
                        x: mergeEvent.position.x,
                        y: mergeEvent.position.y
                    },
                    [Velocity]: velocity,
                    [Rotation]: rotation,
                    [AngularVelocity]: 0,
                    [Scale]: { x: particle.size * scaleFactor, y: particle.size * scaleFactor },
                    [Color]: Object.assign({}, color),
                    [LifeTime]: 0,
                    [MaxLifeTime]: (Math.random() + 1),
                });
            }
        });
    }
};
