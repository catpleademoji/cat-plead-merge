import { System, QueryResult } from "cat-plead-engine";
import { EventQueue } from "../../../EventQueue";
import { CatPoppedEvents } from "../../../resources";
import { CatPopEvent } from "../../../types/CatPopEvent";

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