import { System, QueryResult, Commands } from "cat-plead-engine";
import { EntityCommands, Webgl, CatAssets } from "../resources";
import { Cat } from "@/types/Cat";
import { CatIndex, Position, Velocity, Scale, Rotation, Sprite, AngularVelocity, InverseMass, InverseInertia, ColliderRadius, LifeTime, Color, NextCat } from "../components";
import { sphereVolume, sphereInvVolume } from "../math";
import { Colors } from "../types/Color";

export const SpawnNextCatSystem: System = {
    query: {
        resources: [
            EntityCommands,
            Webgl,
            CatAssets,
        ],
        all: [
            NextCat,
        ]
    },
    run(queryResult: QueryResult) {
        if (queryResult.entities.count() > 0) {
            return;
        }

        const commands = queryResult.resources.get<Commands>(EntityCommands)!;
        const gl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;
        const cats = queryResult.resources.get<Cat[]>(CatAssets)!;

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
            [Rotation]: 0,
            [Sprite]: cats[catIndex].texture,
            [AngularVelocity]: 0,
            [InverseMass]: 1 / mass,
            [InverseInertia]: 1 / moment_of_inertia,
            [ColliderRadius]: radius,
            [LifeTime]: 0,
            [Color]: Colors.white,
        });
    }
}