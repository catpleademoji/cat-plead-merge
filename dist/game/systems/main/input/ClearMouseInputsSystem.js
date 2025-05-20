import { MouseDownEvents, MouseUpEvents } from "@/game/resources";
export const ClearMouseInputsSystem = {
    query: {
        resources: [
            MouseUpEvents,
            MouseDownEvents,
        ]
    },
    run(queryResult) {
        const mousedownEvents = queryResult.resources.get(MouseDownEvents);
        const mouseupEvents = queryResult.resources.get(MouseUpEvents);
        mousedownEvents.clear();
        mouseupEvents.clear();
    },
};
