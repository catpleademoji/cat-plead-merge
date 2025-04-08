import { Engine, Schedule } from "cat-plead-engine";
import { RenderSystem } from "./RenderSystem";
import { IntegrateMotion } from "./physics/IntegrateMotionSystem";
import { CollideBodiesSystem } from "./physics/CollideBodiesSystem";
import { SpawnEntitiesSystem } from "./SpawnEntitiesSystem";
import { MergeCatsSystem } from "./MergeCatsSystem";
import { UpdateLifetimeSystem } from "./UpdateLifetimeSystem";


export function addSystems(engine: Engine) {
  engine
    .addSystem(Schedule.Start, SpawnEntitiesSystem)
    .addSystem(Schedule.Update, UpdateLifetimeSystem)
    .addSystem(Schedule.Update, RenderSystem)
    .addSystem(Schedule.Update, IntegrateMotion)
    .addSystem(Schedule.Update, CollideBodiesSystem)
    .addSystem(Schedule.Update, MergeCatsSystem)
    ;
}