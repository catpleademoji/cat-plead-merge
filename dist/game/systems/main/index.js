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
import { GameState as GameStateRes } from "../../../game/resources";
import { ClearCatPoppedEventsSystem } from "./update/ClearCatPoppedEventsSystem";
import { UpdateScoreSystem } from "./update/UpdateScoreSystem";
export const mainUpdateGroup = {
    canRun(resources) {
        const gameState = resources.get(GameStateRes);
        return !Boolean(gameState === null || gameState === void 0 ? void 0 : gameState.isLoss);
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
};
