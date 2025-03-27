import { Cat } from "@/types/Cat";
import { Commands, Engine, QueryResult, Schedule, System } from "cat-plead-engine";
import { RenderSystem } from "./RenderSystem";

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
        "position": {
          x: Math.random() * width,
          y: Math.random() * height,
        },
        "velocity": {
          x: Math.cos(angle),
          y: Math.sin(angle),
        },
        "sprite": cats[Math.floor(Math.random() * cats.length)].texture,
      });
    }
  }
}

export function addSystems(engine: Engine) {
  engine.addSystem(Schedule.Update, logSystem)
    .addSystem(Schedule.Start, SpawnEntitiesSystem)
    .addSystem(Schedule.Update, RenderSystem);
}