import { Engine, Schedule } from "cat-plead-engine";
import { RenderSystem } from "./RenderSystem";
import { IntegrateMotion } from "./physics/IntegrateMotionSystem";
import { CollideBodiesSystem } from "./physics/CollideBodiesSystem";
import { SpawnEntitiesSystem } from "./SpawnEntitiesSystem";
import { MergeCatsSystem } from "./MergeCatsSystem";
import { UpdateLifetimeSystem } from "./UpdateLifetimeSystem";
import { EventQueue } from "../EventQueue";
import { CatMergeEvent } from "../types/CatMergeEvent";
import { PlayPopSoundOnMergeSystem } from "./PlayPopSoundOnMergeSystem";
import { CatMergedEvents } from "../resources";
import { SpawnParticlesOnMergeSystem } from "./SpawnParticlesOnMergeSystem";
import { DestroyEntitiesAtMaxLifetimeSystem } from "./DestroyEntitiesAtMaxLifetimeSystem";
import { ChangeOpacityOnLifetimeSystem } from "./ChangeOpacityOnLifetimeSystem";

export function addSystems(engine: Engine) {
  engine
    .addSystem(Schedule.Start, SpawnEntitiesSystem)
    .addSystem(Schedule.Update, UpdateLifetimeSystem)
    .addSystem(Schedule.Update, RenderSystem)
    .addSystem(Schedule.Update, IntegrateMotion)
    .addSystem(Schedule.Update, CollideBodiesSystem)
    .addSystem(Schedule.Update, MergeCatsSystem)
    .addSystem(Schedule.Update, PlayPopSoundOnMergeSystem)
    .addSystem(Schedule.Update, SpawnParticlesOnMergeSystem)
    .addSystem(Schedule.Update, ChangeOpacityOnLifetimeSystem)
    .addSystem(Schedule.Update, DestroyEntitiesAtMaxLifetimeSystem)
    .addResource(CatMergedEvents, new EventQueue<CatMergeEvent>())
    ;
}