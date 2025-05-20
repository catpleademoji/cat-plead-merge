import { SpawnFirstCatSystem } from "./SpawnFirstCatSystem";
import { SpawnWarningSystem } from "./SpawnWarningSystem";
import { GameState as GameStateRes } from "../../../../game/resources";
export const mainInitializationGroup = {
    canRun(resources) {
        const gameState = resources.get(GameStateRes);
        return !Boolean(gameState === null || gameState === void 0 ? void 0 : gameState.isLoss);
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
