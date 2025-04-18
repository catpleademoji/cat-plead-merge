import { Cat } from "@/types/Cat";
import { System, QueryResult, Commands } from "cat-plead-engine";
import { Position, Rotation, Scale, Velocity, Sprite, AngularVelocity, InverseMass, InverseInertia, ColliderRadius, CatIndex, LifeTime, Color } from "../components";
import { Webgl, EntityCommands, CatAssets } from "../resources";
import { sphereInvVolume, sphereVolume } from "../math";
import { Colors } from "../types/Color";

export const SpawnEntitiesSystem: System = {
  query: {
    resources: [
      Webgl,
      EntityCommands,
      CatAssets,
    ]
  },
  run: function (queryResult: QueryResult): void {
    const gl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;
    const commands = queryResult.resources.get<Commands>(EntityCommands)!;
    const cats = queryResult.resources.get<Cat[]>(CatAssets)!;

    const screenWidth = gl.canvas.width;
    const screenHeight = gl.canvas.height;


    for (let i = 0; i < 50; i++) {
      const catIndex = Math.floor(Math.random() * (cats.length / 2));

      const size = cats[catIndex].size;
      const radius = size / 2;
      const volume = sphereVolume(radius);
      const mass = sphereInvVolume(volume);
      const moment_of_inertia = 2 / 5 * mass * Math.pow(mass, 3);

      const angle = Math.random() * 2 * Math.PI;
      commands.spawnFromComponents({
        [CatIndex]: catIndex,
        [Position]: {
          x: Math.random() * screenWidth,
          y: Math.random() * screenHeight,
        },
        [Rotation]: Math.random() * 2 * Math.PI,
        [Scale]: {
          x: size,
          y: size,
        },
        [Velocity]: {
          x: Math.cos(angle),
          y: Math.sin(angle),
        },
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
};
