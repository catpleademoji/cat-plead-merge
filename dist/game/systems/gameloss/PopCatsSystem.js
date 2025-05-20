import { CatIndex, Position } from "@/game/components";
import { CatAssets, CatPoppedEvents, PopTimer } from "@/game/resources";
import { DefaultResources } from "cat-plead-engine";
export const PopCatsSystem = {
    query: {
        resources: [
            DefaultResources.Time,
            DefaultResources.Commands,
            CatPoppedEvents,
            CatAssets,
            PopTimer,
        ],
        all: [
            CatIndex,
            Position,
        ],
    },
    run(queryResult) {
        const time = queryResult.resources.get(DefaultResources.Time);
        const popTimer = queryResult.resources.getRW(PopTimer);
        const popFrequency = 1 / 10;
        popTimer.time += time.delta;
        if (popTimer.time < popFrequency && queryResult.entities.count() > 0) {
            return;
        }
        const catPoppedEvents = queryResult.resources.get(CatPoppedEvents);
        const commands = queryResult.resources.get(DefaultResources.Commands);
        const cats = queryResult.resources.get(CatAssets);
        popTimer.time -= popFrequency;
        let highestCat;
        let highestPosition;
        queryResult.entities.foreach((components, entity) => {
            const position = components[Position];
            if (highestPosition && highestPosition.y < position.y) {
                return;
            }
            highestPosition = position;
            highestCat = entity;
        });
        if (!highestCat || !highestPosition) {
            return;
        }
        const catIndex = queryResult.entities.getComponent(highestCat, CatIndex);
        commands.destroyEntity(highestCat);
        catPoppedEvents.enqueue({
            catIndex: catIndex,
            position: highestPosition,
            radius: cats[catIndex].size,
            score: cats[catIndex].score,
        });
    },
};
