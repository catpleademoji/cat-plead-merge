import { Engine, Schedules, SystemGroup } from "cat-plead-engine";
import { ResourceManager } from "cat-plead-engine/dist/src/Resources/ResourceManager";
import { mainUpdateGroup } from "./main";
import { mainInitializationGroup } from "./main/start";
import { mainFixedUpdateGroup } from "./physics";
import { RenderSystem } from "./render/RenderSystem";
import { MergeCatsSystem } from "./MergeCatsSystem";
import { gamelossUpdateGroup } from "./gameloss";

export function addSystems(engine: Engine) {

  engine
    .addSystemGroup(Schedules.Start, mainInitializationGroup)
    .addSystemGroup(Schedules.Update, mainUpdateGroup)
    .addSystemGroup(Schedules.FixedUpdate, mainFixedUpdateGroup)
    .addSystem(Schedules.FixedUpdate, MergeCatsSystem)
    .addSystem(Schedules.Render, RenderSystem)
    .addSystemGroup(Schedules.Update, gamelossUpdateGroup)
    ;
}