import { Cat } from "@/types/Cat";
import { Commands, Engine, QueryResult, Schedule, System } from "cat-plead-engine";
import { RenderSystem } from "./RenderSystem";
import { IntegrateMotion } from "./physics/IntegrateMotionSystem";
import { AngularVelocity, Position, Rotation, Sprite, Velocity } from "../components";

const logSystem = {
  run() {
    console.log("update");
  }
};

const SpawnEntitiesSystem: System = {
  query: {
    resources: [
      "webgl",
      "commands",
      "cats",
    ]
  },
  run: function (queryResult: QueryResult): void {
    const gl = queryResult.resources.get<WebGL2RenderingContext>("webgl")!;
    const commands = queryResult.resources.get<Commands>("commands")!;
    const cats = queryResult.resources.get<Cat[]>("cats")!;

    const width = gl.canvas.width;
    const height = gl.canvas.height;

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * 2 * Math.PI;
      commands.spawnFromComponents({
        [Position]: {
          x: Math.random() * width,
          y: Math.random() * height,
        },
        [Velocity]: {
          x: Math.cos(angle),
          y: Math.sin(angle),
        },
        [Sprite]: cats[Math.floor(Math.random() * cats.length)].texture,
        [Rotation]: Math.random() * 2 * Math.PI,
        [AngularVelocity]: 0
      });
    }
  }
}

export function addSystems(engine: Engine) {
  engine
    // .addSystem(Schedule.Update, logSystem)
    .addSystem(Schedule.Start, SpawnEntitiesSystem)
    .addSystem(Schedule.Update, RenderSystem)
    .addSystem(Schedule.Update, IntegrateMotion);
}