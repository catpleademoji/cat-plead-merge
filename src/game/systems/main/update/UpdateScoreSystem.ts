import { System, QueryResult } from "cat-plead-engine";
import { EventQueue } from "../../../EventQueue";
import { CatPoppedEvents, GameState as GameStateRes } from "../../../resources";
import { CatPopEvent } from "../../../types/CatPopEvent";
import { GameState } from "../../../types/GameState";

export const UpdateScoreSystem : System = {
    query: {
        resources: [
            GameStateRes,
            CatPoppedEvents,
        ]
    },
    run: function (queryResult: QueryResult): void {
        const gameState = queryResult.resources.getRW<GameState>(GameStateRes)!;
        const catPoppedEvents = queryResult.resources.get<EventQueue<CatPopEvent>>(CatPoppedEvents)!;

        catPoppedEvents.foreach(catPoppedEvt => {
            gameState.score += catPoppedEvt.score;
        });
    }
}
