import { MouseUpEventQueue } from "@/types/MouseEvent";
import { QueryResult, System } from "cat-plead-engine";

export const ClearMouseInputsSystem : System = {
    query: {
        resources: [
            "mouseupevents",
            "mousedownevents",
        ]
    },
    run(queryResult: QueryResult) {
        const mousedownEvents = queryResult.resources.get<MouseUpEventQueue>("mousedownevents")!;
        const mouseupEvents = queryResult.resources.get<MouseUpEventQueue>("mouseupevents")!;

        mousedownEvents.clear();
        mouseupEvents.clear();
    },
}