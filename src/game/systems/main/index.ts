import { SystemGroup } from "cat-plead-engine";
import { ResourceManager } from "cat-plead-engine/dist/src/Resources/ResourceManager";
import { ClearMouseInputsSystem } from "./input/ClearMouseInputsSystem";
import { ChangeOpacityOnLifetimeSystem } from "./update/ChangeOpacityOnLifetimeSystem";
import { DestroyEntitiesAtMaxLifetimeSystem } from "./update/DestroyEntitiesAtMaxLifetimeSystem";
import { DetectHighestCatSystem } from "./update/DetectHighestCatSystem";
import { DropCatOnClickSystem } from "./update/DropCatOnClickSystem";
import { MoveCatToClickPositionSystem } from "./update/MoveCatToClickPositionSystem";
import { PlayPopSoundSystem } from "./update/PlayPopSoundSystem";
import { SetCatTargetPositionSystem, SetCatDropPositionSystem } from "./update/SetCatTargetPositionSystem";
import { SetGameLossSystem } from "./update/SetGameLossSystem";
import { ShowWarningSystem } from "./update/ShowWarningSystem";
import { SpawnNextCatSystem } from "./update/SpawnNextCatSystem";
import { SpawnParticlesSystem } from "./update/SpawnParticlesSystem";
import { UpdateLifetimeSystem } from "./update/UpdateLifetimeSystem";
import { GameState } from "@/game/resources";
import { ClearCatPoppedEventsSystem } from "./update/ClearCatPoppedEventsSystem";

export const mainUpdateGroup: SystemGroup = {
    canRun(resources: ResourceManager) {
        const gameState = resources.get<{ isLoss: boolean }>(GameState);
        return !Boolean(gameState?.isLoss);
    },
    systems: [
        SetCatTargetPositionSystem,
        SetCatDropPositionSystem,
        MoveCatToClickPositionSystem,
        DropCatOnClickSystem,
        UpdateLifetimeSystem,
        SpawnNextCatSystem,
        PlayPopSoundSystem,
        SpawnParticlesSystem,
        ChangeOpacityOnLifetimeSystem,
        DetectHighestCatSystem,
        ShowWarningSystem,
        DestroyEntitiesAtMaxLifetimeSystem,
        ClearMouseInputsSystem,
        ClearCatPoppedEventsSystem,
        SetGameLossSystem,
    ]
}
