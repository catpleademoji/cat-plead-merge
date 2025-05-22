import { System, QueryResult } from "cat-plead-engine";
import { MouseUpEvents, MouseDownEvents } from "../../../resources";
import { MouseDownEventQueue, MouseUpEventQueue } from "../../../types/MouseEvent";

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