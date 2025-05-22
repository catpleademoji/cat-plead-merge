import { CatPoppedEvents, GameState as GameStateRes } from "../../../resources";
export const UpdateScoreSystem = {
    query: {
        resources: [
            GameStateRes,
            CatPoppedEvents,
        ]
    },
    run: function (queryResult) {
        const gameState = queryResult.resources.getRW(GameStateRes);
        const catPoppedEvents = queryResult.resources.get(CatPoppedEvents);
        catPoppedEvents.foreach(catPoppedEvt => {
            gameState.score += catPoppedEvt.score;
        });
    }
};
