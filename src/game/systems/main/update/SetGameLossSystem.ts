import { QueryResult, System } from "cat-plead-engine";
import { DangerLevel as DangerLevelRes, GameState as GameStateRes } from "@/game/resources";
import { DangerLevel } from "@/game/types/DangerLevel";
import { GameState } from "@/game/types/GameState";

export const SetGameLossSystem: System = {
    query: {
        resources: [
            DangerLevelRes,
            GameStateRes,
        ]
    },
    run: function (queryResult: QueryResult): void {
        const dangerLevel = queryResult.resources.get<DangerLevel>(DangerLevelRes)!;
        const gameState = queryResult.resources.getRW<GameState>(GameStateRes)!;

        if (dangerLevel.time >= 1) {
            gameState.isLoss = true;
        }
    }
}
