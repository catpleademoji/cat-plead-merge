import { EventQueue } from "@/game/EventQueue";
import { CatPoppedEvents, GameState as GameStateRes } from "@/game/resources";
import { CatPopEvent } from "@/game/types/CatPopEvent";
import { GameState } from "@/game/types/GameState";
import { QueryResult, System } from "cat-plead-engine";

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
