import { Commands, QueryResult, System } from "cat-plead-engine";
import { CatSpawnTimer as CatSpawnTimerRes, EntityCommands, MouseUpEvents } from "../resources";
import { DropPosition, LifeTime, NextCat, Position, TargetPosition } from "../components";
import { Vector2 } from "../types/Vector2";
import { Timer } from "@/types/Timer";

export const DropCatOnClickSystem: System = {
    query: {
        resources: [
            EntityCommands,
            CatSpawnTimerRes,
        ],
        all: [
            NextCat,
            Position,
            TargetPosition,
            DropPosition,
            LifeTime,
        ]
    },
    run(queryResult: QueryResult) {
        const commands = queryResult.resources.get<Commands>(EntityCommands)!;
        queryResult.entities.foreach((components, entity) => {
            const position = components[Position] as Vector2;
            const targetPosition = components[TargetPosition] as Vector2;

            if (Math.abs(targetPosition.x - position.x) <= 0.1) {
                components[LifeTime] = 0;
                commands.removeComponent(entity, NextCat);
                commands.removeComponent(entity, TargetPosition);
                commands.removeComponent(entity, DropPosition);
            }

            const catSpawnTimer = queryResult.resources.getRW<Timer>(CatSpawnTimerRes)!;
            catSpawnTimer.time = 0;
        });
    },
}