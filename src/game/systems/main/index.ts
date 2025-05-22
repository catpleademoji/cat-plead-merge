import { SystemGroup, ResourceManager } from "cat-plead-engine";
import { GameState } from "../../types/GameState";
import { ClearMouseInputsSystem } from "./input/ClearMouseInputsSystem";
import { ChangeOpacityOnLifetimeSystem } from "./update/ChangeOpacityOnLifetimeSystem";
import { ClearCatPoppedEventsSystem } from "./update/ClearCatPoppedEventsSystem";
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
import { UpdateScoreSystem } from "./update/UpdateScoreSystem";
import { GameState as GameStateRes } from "../../resources";

export const mainUpdateGroup: SystemGroup = {
    canRun(resources: ResourceManager) {
        const gameState = resources.get<GameState>(GameStateRes);
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
        UpdateScoreSystem,
        ChangeOpacityOnLifetimeSystem,
        DetectHighestCatSystem,
        ShowWarningSystem,
        DestroyEntitiesAtMaxLifetimeSystem,
        ClearMouseInputsSystem,
        ClearCatPoppedEventsSystem,
        SetGameLossSystem,
    ]
}
