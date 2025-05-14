import { SystemGroup } from "cat-plead-engine";
import { ResourceManager } from "cat-plead-engine/dist/src/Resources/ResourceManager";
import { PopCatsSystem } from "./PopCatsSystem";
import { PlayPopSoundSystem } from "../main/PlayPopSoundSystem";
import { SpawnParticlesSystem } from "../main/SpawnParticlesSystem";
import { ShowWarningSystem } from "../main/ShowWarningSystem";
import { DetectHighestCatSystem } from "../main/DetectHighestCatSystem";

export const gamelossUpdateGroup: SystemGroup = {
    canRun(resources: ResourceManager): boolean {
        const gameState = resources.get<{ isLoss: boolean }>("game_state");
        return Boolean(gameState?.isLoss);
    },
    systems: [
        PopCatsSystem,
        PlayPopSoundSystem,
        DetectHighestCatSystem,
        SpawnParticlesSystem,
        ShowWarningSystem,
    ]
}
