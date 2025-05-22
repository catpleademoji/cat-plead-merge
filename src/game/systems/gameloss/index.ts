import { SystemGroup, ResourceManager } from "cat-plead-engine";
import { GameState } from "../../types/GameState";
import { ClearMouseInputsSystem } from "../main/input/ClearMouseInputsSystem";
import { ClearCatPoppedEventsSystem } from "../main/update/ClearCatPoppedEventsSystem";
import { DetectHighestCatSystem } from "../main/update/DetectHighestCatSystem";
import { PlayPopSoundSystem } from "../main/update/PlayPopSoundSystem";
import { ShowWarningSystem } from "../main/update/ShowWarningSystem";
import { SpawnParticlesSystem } from "../main/update/SpawnParticlesSystem";
import { UpdateScoreSystem } from "../main/update/UpdateScoreSystem";
import { PopCatsSystem } from "./PopCatsSystem";
import { GameState as GameStateRes } from "../../resources";

export const gamelossUpdateGroup: SystemGroup = {
    canRun(resources: ResourceManager): boolean {
        const gameState = resources.get<GameState>(GameStateRes);
        return Boolean(gameState?.isLoss);
    },
    systems: [
        ClearCatPoppedEventsSystem,
        PopCatsSystem,
        PlayPopSoundSystem,
        DetectHighestCatSystem,
        SpawnParticlesSystem,
        ShowWarningSystem,
        UpdateScoreSystem,
        ClearMouseInputsSystem,
    ]
}
