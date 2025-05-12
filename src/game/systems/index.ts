import { Engine, Schedules, SystemGroup } from "cat-plead-engine";
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
import { ClearMouseInputsSystem } from "./input/ClearMouseInputsSystem";
import { DropCatOnClickSystem } from "./DropCatOnClickSystem";
import { SpawnNextCatSystem } from "./SpawnNextCatSystem";
import { SetCatDropPositionSystem, SetCatTargetPositionSystem } from "./SetCatTargetPositionSystem";
import { MoveCatToClickPositionSystem } from "./MoveCatToClickPositionSystem";
import { DetectHighestCatSystem } from "./DetectHighestCatSystem";
import { SpawnWarningSystem } from "./SpawnWarningSystem";
import { ShowWarningSystem } from "./ShowWarningSystem";
import { ResourceManager } from "cat-plead-engine/dist/src/Resources/ResourceManager";

export function addSystems(engine: Engine) {
  const mainInitializationGroup: SystemGroup = {
    canRun() {
      return true;
    },
    systems: [
      SpawnEntitiesSystem,
      SpawnWarningSystem,
    ]
  };

  const mainUpdateGroup: SystemGroup = {
    canRun(resources: ResourceManager) {
      return true;
    },
    systems: [
      SetCatTargetPositionSystem,
      SetCatDropPositionSystem,
      MoveCatToClickPositionSystem,
      DropCatOnClickSystem,
      UpdateLifetimeSystem,
      SpawnNextCatSystem,
      PlayPopSoundOnMergeSystem,
      SpawnParticlesOnMergeSystem,
      ChangeOpacityOnLifetimeSystem,
      DetectHighestCatSystem,
      ShowWarningSystem,
      DestroyEntitiesAtMaxLifetimeSystem,
      ClearMouseInputsSystem,
    ]
  }

  const mainFixedUpdateGroup: SystemGroup = {
    canRun() {
      return true;
    },
    systems: [
      IntegrateMotion,
      CollideBodiesSystem,
    ]
  };

  const gameOverUpdateGroup: SystemGroup = {
    canRun(resources: ResourceManager): boolean {
      const gameState = resources.get<{ isLoss: boolean }>("game_state");
      return Boolean(gameState?.isLoss);
    },
    systems: []
  }

  engine
    .addSystemGroup(Schedules.Start, mainInitializationGroup)
    .addSystemGroup(Schedules.Update, mainUpdateGroup)
    .addSystemGroup(Schedules.FixedUpdate, mainFixedUpdateGroup)
    .addSystem(Schedules.FixedUpdate, MergeCatsSystem)
    .addSystem(Schedules.Render, RenderSystem)
    .addResource(CatMergedEvents, new EventQueue<CatMergeEvent>())
    .addResource("game_state", { isLoss: false });
    ;
}