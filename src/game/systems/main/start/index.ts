import { SystemGroup, ResourceManager } from "cat-plead-engine";
import { GameState } from "../../../types/GameState";
import { SpawnFirstCatSystem } from "./SpawnFirstCatSystem";
import { SpawnWarningSystem } from "./SpawnWarningSystem";
import { GameState as GameStateRes } from "../../../resources";

export const mainInitializationGroup: SystemGroup = {
    canRun(resources: ResourceManager) {
        const gameState = resources.get<GameState>(GameStateRes);
        return !Boolean(gameState?.isLoss);
    },
    systems: [
        SpawnFirstCatSystem,
        SpawnWarningSystem,
    ],
    resetSystems() {
        this.systems = [
            SpawnFirstCatSystem,
            SpawnWarningSystem
        ];
    }
};