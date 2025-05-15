import { SystemGroup } from "cat-plead-engine";
import { ResourceManager } from "cat-plead-engine/dist/src/Resources/ResourceManager";
import { PopCatsSystem } from "./PopCatsSystem";
import { PlayPopSoundSystem } from "../main/update/PlayPopSoundSystem";
import { SpawnParticlesSystem } from "../main/update/SpawnParticlesSystem";
import { ShowWarningSystem } from "../main/update/ShowWarningSystem";
import { DetectHighestCatSystem } from "../main/update/DetectHighestCatSystem";

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
