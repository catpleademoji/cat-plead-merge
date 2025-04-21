import { MouseUpEvents } from "@/types/MouseEvent";
import { QueryResult, System } from "cat-plead-engine";

export const ClearMouseInputsSystem : System = {
    query: {
        resources: [
            "mouseupevents",
            "mousedownevents",
        ]
    },
    run(queryResult: QueryResult) {
        const mousedownEvents = queryResult.resources.get<MouseUpEvents>("mousedownevents")!;
        const mouseupEvents = queryResult.resources.get<MouseUpEvents>("mouseupevents")!;

        mousedownEvents.clear();
        mouseupEvents.clear();
    },
}