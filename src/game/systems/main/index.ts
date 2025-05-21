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
import { GameState as GameStateRes } from "@/game/resources";
import { ClearCatPoppedEventsSystem } from "./update/ClearCatPoppedEventsSystem";
import { GameState } from "@/game/types/GameState";
import { UpdateScoreSystem } from "./update/UpdateScoreSystem";

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
