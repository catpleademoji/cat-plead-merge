import { SystemGroup } from "cat-plead-engine";
import { ResourceManager } from "cat-plead-engine/dist/src/Resources/ResourceManager";
import { ClearMouseInputsSystem } from "./input/ClearMouseInputsSystem";
import { ChangeOpacityOnLifetimeSystem } from "./ChangeOpacityOnLifetimeSystem";
import { DestroyEntitiesAtMaxLifetimeSystem } from "./DestroyEntitiesAtMaxLifetimeSystem";
import { DetectHighestCatSystem } from "./DetectHighestCatSystem";
import { DropCatOnClickSystem } from "./DropCatOnClickSystem";
import { MoveCatToClickPositionSystem } from "./MoveCatToClickPositionSystem";
import { PlayPopSoundSystem } from "./PlayPopSoundSystem";
import { SetCatTargetPositionSystem, SetCatDropPositionSystem } from "./SetCatTargetPositionSystem";
import { SetGameLossSystem } from "./SetGameLossSystem";
import { ShowWarningSystem } from "./ShowWarningSystem";
import { SpawnNextCatSystem } from "./SpawnNextCatSystem";
import { SpawnParticlesSystem } from "./SpawnParticlesSystem";
import { UpdateLifetimeSystem } from "./UpdateLifetimeSystem";
import { GameState } from "@/game/resources";

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
        SetGameLossSystem,
    ]
}
