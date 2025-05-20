import { DefaultResources } from "cat-plead-engine";
import { Webgl, CatAssets, CatSpawnTimer as CatSpawnTimerRes } from "@/game/resources";
import { CatIndex, Position, Velocity, Scale, Rotation, Sprite, AngularVelocity, InverseMass, InverseInertia, ColliderRadius, LifeTime, Color, NextCat } from "@/game/components";
import { sphereVolume, sphereInvVolume } from "@/game/math";
import { Colors } from "@/game/types/Color";
export const SpawnNextCatSystem = {
    query: {
        resources: [
            DefaultResources.Commands,
            Webgl,
            CatAssets,
            CatSpawnTimerRes,
            DefaultResources.Time,
        ],
        all: [
            NextCat,
        ]
    },
    run(queryResult) {
        if (queryResult.entities.count() > 0) {
            return;
        }
        const time = queryResult.resources.get(DefaultResources.Time);
        const catSpawnTimer = queryResult.resources.getRW(CatSpawnTimerRes);
        catSpawnTimer.time += time.delta;
        if (catSpawnTimer.time < 1) {
            return;
        }
        const commands = queryResult.resources.get(DefaultResources.Commands);
        const gl = queryResult.resources.get(Webgl);
        const cats = queryResult.resources.get(CatAssets);
        const screenWidth = gl.canvas.width;
        const catIndex = Math.floor(Math.random() * (cats.length / 2));
        const size = cats[catIndex].size;
        const radius = size / 2;
        const volume = sphereVolume(radius);
        const mass = sphereInvVolume(volume);
        const moment_of_inertia = 2 / 5 * mass * Math.pow(mass, 3);
        commands.spawnFromComponents({
            [CatIndex]: catIndex,
            [NextCat]: 0,
            [Position]: {
                x: screenWidth / 2,
                y: 0 + radius,
            },
            [Velocity]: {
                x: 0,
                y: 0,
            },
            [Scale]: {
                x: size,
                y: size,
            },
            [Rotation]: Math.PI,
            [Sprite]: cats[catIndex].texture,
            [AngularVelocity]: 0,
            [InverseMass]: 1 / mass,
            [InverseInertia]: 1 / moment_of_inertia,
            [ColliderRadius]: radius,
            [LifeTime]: 0,
            [Color]: Colors.white,
        });
    }
};
