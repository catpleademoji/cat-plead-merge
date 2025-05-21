import { MouseDownEvents, MouseUpEvents } from "@/game/resources";
import { MouseDownEventQueue, MouseUpEventQueue } from "@/game/types/MouseEvent";
import { QueryResult, System } from "cat-plead-engine";

export const ClearMouseInputsSystem : System = {
    query: {
        resources: [
            MouseUpEvents,
            MouseDownEvents,
        ]
    },
    run(queryResult: QueryResult) {
        const mousedownEvents = queryResult.resources.get<MouseDownEventQueue>(MouseDownEvents)!;
        const mouseupEvents = queryResult.resources.get<MouseUpEventQueue>(MouseUpEvents)!;

        mousedownEvents.clear();
        mouseupEvents.clear();
    },
}