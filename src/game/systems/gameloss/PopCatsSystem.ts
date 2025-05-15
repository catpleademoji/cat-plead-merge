import { CatIndex, Position } from "@/game/components";
import { EventQueue } from "@/game/EventQueue";
import { CatAssets, CatPoppedEvents, PopTimer } from "@/game/resources";
import { CatPopEvent } from "@/game/types/CatPopEvent";
import { Timer } from "@/game/types/Timer";
import { Vector2 } from "@/game/types/Vector2";
import { Cat } from "@/types/Cat";
import { Commands, DefaultResources, Entity, QueryResult, System, Time } from "cat-plead-engine";

export const PopCatsSystem: System = {
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
    run(queryResult: QueryResult) {
        const time = queryResult.resources.get<Time>(DefaultResources.Time)!;
        const popTimer = queryResult.resources.getRW<Timer>(PopTimer)!;
        const popFrequency = 1 / 10;

        popTimer.time += time.delta;
        if (popTimer.time < popFrequency && queryResult.entities.count() > 0) {
            return;
        }

        const catPoppedEvents = queryResult.resources.get<EventQueue<CatPopEvent>>(CatPoppedEvents)!;
        const commands = queryResult.resources.get<Commands>(DefaultResources.Commands)!;
        const cats = queryResult.resources.get<Cat[]>(CatAssets)!;

        popTimer.time -= popFrequency;

        let highestCat: Entity | undefined;
        let highestPosition: Vector2 | undefined;
        queryResult.entities.foreach((components, entity) => {
            const position = components[Position] as Vector2;
            if (highestPosition && highestPosition.y < position.y) {
                return;
            }
            highestPosition = position;
            highestCat = entity;
        });

        if (!highestCat || !highestPosition) {
            return;
        }

        const catIndex = queryResult.entities.getComponent<number>(highestCat, CatIndex);
        commands.destroyEntity(highestCat);
        catPoppedEvents.enqueue({
            catIndex: catIndex,
            position: highestPosition,
            radius: cats[catIndex].size,
            score: cats[catIndex].score,
        });
    },
}