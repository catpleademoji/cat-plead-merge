import { MouseUpEvents } from "@/types/MouseEvent";
import { Commands, QueryResult, System } from "cat-plead-engine";
import { CatAssets, EntityCommands, Webgl } from "../resources";
import { AngularVelocity, CatIndex, ColliderRadius, Color, InverseInertia, InverseMass, LifeTime, Position, Rotation, Scale, Sprite, Velocity } from "../components";
import { Cat } from "@/types/Cat";
import { sphereInvVolume, sphereVolume } from "../math";
import { Colors } from "../types/Color";

export const SpawnCatOnClickSystem: System = {
    query: {
        resources: [
            "mouseupevents",
            EntityCommands,
            Webgl,
            CatAssets,
        ],
    },
    run(queryResult: QueryResult) {
        const mouseupEvents = queryResult.resources.get<MouseUpEvents>("mouseupevents")!;

        const mouseup = mouseupEvents.peek();
        if (mouseup) {
            const commands = queryResult.resources.get<Commands>(EntityCommands)!;
            const gl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;
            const cats = queryResult.resources.get<Cat[]>(CatAssets)!;

            const screenWidth = gl.canvas.width;
            const screenHeight = gl.canvas.height;

            const catIndex = Math.floor(Math.random() * (cats.length / 2));
            const size = cats[catIndex].size;
            const radius = size / 2;
            const volume = sphereVolume(radius);
            const mass = sphereInvVolume(volume);
            const moment_of_inertia = 2 / 5 * mass * Math.pow(mass, 3);

            commands.spawnFromComponents({
                [CatIndex]: catIndex,
                [Position]: {
                    x: mouseup.x,
                    y: 0,
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
},
}