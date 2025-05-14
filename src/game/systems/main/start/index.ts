import { SystemGroup } from "cat-plead-engine";
import { ResourceManager } from "cat-plead-engine/dist/src/Resources/ResourceManager";
import { SpawnEntitiesSystem } from "../../SpawnEntitiesSystem";
import { SpawnWarningSystem } from "../../SpawnWarningSystem";

export const mainInitializationGroup: SystemGroup = {
    canRun(resources: ResourceManager) {
        const gameState = resources.get<{ isLoss: boolean }>("game_state");
        return !Boolean(gameState?.isLoss);
    },
    systems: [
        SpawnEntitiesSystem,
        SpawnWarningSystem,
    ]
};