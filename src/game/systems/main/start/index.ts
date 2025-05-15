import { SystemGroup } from "cat-plead-engine";
import { ResourceManager } from "cat-plead-engine/dist/src/Resources/ResourceManager";
import { SpawnCatsSystem } from "./SpawnCatsSystem";
import { SpawnWarningSystem } from "./SpawnWarningSystem";

export const mainInitializationGroup: SystemGroup = {
    canRun(resources: ResourceManager) {
        const gameState = resources.get<{ isLoss: boolean }>("game_state");
        return !Boolean(gameState?.isLoss);
    },
    systems: [
        SpawnCatsSystem,
        SpawnWarningSystem,
    ]
};