import { DefaultResources } from "cat-plead-engine";
import { CatSpawnTimer as CatSpawnTimerRes } from "../../../../game/resources";
import { DropPosition, LifeTime, NextCat, Position, TargetPosition } from "../../../../game/components";
export const DropCatOnClickSystem = {
    query: {
        resources: [
            DefaultResources.Commands,
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
            const catSpawnTimer = queryResult.resources.getRW(CatSpawnTimerRes);
            catSpawnTimer.time = 0;
        });
    },
};
