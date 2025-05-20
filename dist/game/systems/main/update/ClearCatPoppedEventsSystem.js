import { CatPoppedEvents } from "../../../../game/resources";
export const ClearCatPoppedEventsSystem = {
    query: {
        resources: [
            CatPoppedEvents,
        ],
    },
    run: function (queryResult) {
        const catPoppedEvents = queryResult.resources.get(CatPoppedEvents);
        catPoppedEvents.clear();
    }
};
