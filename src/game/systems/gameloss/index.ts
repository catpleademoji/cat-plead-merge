import { SystemGroup } from "cat-plead-engine";
import { ResourceManager } from "cat-plead-engine/dist/src/Resources/ResourceManager";
import { PopCatsSystem } from "./PopCatsSystem";
import { PlayPopSoundSystem } from "../main/update/PlayPopSoundSystem";
import { SpawnParticlesSystem } from "../main/update/SpawnParticlesSystem";
import { ShowWarningSystem } from "../main/update/ShowWarningSystem";
import { DetectHighestCatSystem } from "../main/update/DetectHighestCatSystem";
import { ClearCatPoppedEventsSystem } from "../main/update/ClearCatPoppedEventsSystem";
import { GameState as GameStateRes } from "@/game/resources";
import { GameState } from "@/game/types/GameState";
import { UpdateScoreSystem } from "../main/update/UpdateScoreSystem";
import { ClearMouseInputsSystem } from "../main/input/ClearMouseInputsSystem";

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
