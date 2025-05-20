import { SystemGroup } from "cat-plead-engine";
import { ResourceManager } from "cat-plead-engine/dist/src/Resources/ResourceManager";
import { SpawnFirstCatSystem } from "./SpawnFirstCatSystem";
import { SpawnWarningSystem } from "./SpawnWarningSystem";
import { GameState } from "@/game/types/GameState";
import { GameState as GameStateRes } from "@/game/resources";

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