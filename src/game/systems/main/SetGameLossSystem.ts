import { QueryResult, System } from "cat-plead-engine";
import { DangerLevel as DangerLevelRes, GameState } from "../../resources";
import { DangerLevel } from "../../types/DangerLevel";

export const SetGameLossSystem: System = {
    query: {
        resources: [
            DangerLevelRes,
            GameState,
        ]
    },
    run: function (queryResult: QueryResult): void {
        const dangerLevel = queryResult.resources.get<DangerLevel>(DangerLevelRes)!;
        const gameState = queryResult.resources.getRW<{isLoss: boolean}>(GameState)!;

        if (dangerLevel.time >= 1) {
            gameState.isLoss = true;
        }
    }
}
