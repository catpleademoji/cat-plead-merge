import { EventQueue } from "@/game/EventQueue";
import { CatPoppedEvents } from "@/game/resources";
import { CatPopEvent } from "@/game/types/CatPopEvent";
import { QueryResult, System } from "cat-plead-engine";

export const ClearCatPoppedEventsSystem: System = {
    query: {
        resources: [
            CatPoppedEvents,
        ],
    },
    run: function (queryResult: QueryResult): void {
        const catPoppedEvents = queryResult.resources.get<EventQueue<CatPopEvent>>(CatPoppedEvents)!;
        catPoppedEvents.clear();
    }
}