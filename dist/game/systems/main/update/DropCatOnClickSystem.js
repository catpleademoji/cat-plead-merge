import { DefaultResources } from "cat-plead-engine";
import { NextCat, Position, TargetPosition, DropPosition, LifeTime } from "../../../components";
import { CatSpawnTimer } from "../../../resources";
export const DropCatOnClickSystem = {
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
    run(queryResult) {
        const commands = queryResult.resources.get(DefaultResources.Commands);
        queryResult.entities.foreach((components, entity) => {
            const position = components[Position];
            const targetPosition = components[TargetPosition];
            if (Math.abs(targetPosition.x - position.x) <= 0.1) {
                components[LifeTime] = 0;
                commands.removeComponent(entity, NextCat);
                commands.removeComponent(entity, TargetPosition);
                commands.removeComponent(entity, DropPosition);
            }
            const catSpawnTimer = queryResult.resources.getRW(CatSpawnTimer);
            catSpawnTimer.time = 0;
        });
    },
};
