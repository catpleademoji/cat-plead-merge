import { System, DefaultResources, QueryResult, Commands } from "cat-plead-engine";
import { NextCat, Position, TargetPosition, DropPosition, LifeTime } from "../../../components";
import { Timer } from "../../../types/Timer";
import { Vector2 } from "../../../types/Vector2";
import { CatSpawnTimer } from "../../../resources";

export const DropCatOnClickSystem: System = {
    query: {
        resources: [
            DefaultResources.Commands,
            CatSpawnTimer,
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
        const commands = queryResult.resources.get<Commands>(DefaultResources.Commands)!;
        queryResult.entities.foreach((components, entity) => {
            const position = components[Position] as Vector2;
            const targetPosition = components[TargetPosition] as Vector2;

            if (Math.abs(targetPosition.x - position.x) <= 0.1) {
                components[LifeTime] = 0;
                commands.removeComponent(entity, NextCat);
                commands.removeComponent(entity, TargetPosition);
                commands.removeComponent(entity, DropPosition);
            }

            const catSpawnTimer = queryResult.resources.getRW<Timer>(CatSpawnTimer)!;
            catSpawnTimer.time = 0;
        });
    },
}