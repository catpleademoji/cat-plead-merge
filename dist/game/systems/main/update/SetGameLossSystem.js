import { DangerLevel as DangerLevelRes, GameState as GameStateRes } from "@/game/resources";
export const SetGameLossSystem = {
    query: {
        resources: [
            DangerLevelRes,
            GameStateRes,
        ]
    },
    run: function (queryResult) {
        const dangerLevel = queryResult.resources.get(DangerLevelRes);
        const gameState = queryResult.resources.getRW(GameStateRes);
        if (dangerLevel.time >= 1) {
            gameState.isLoss = true;
        }
    }
};
