import { MouseUpEventQueue } from "@/types/MouseEvent";
import { Commands, QueryResult, System } from "cat-plead-engine";
import { EntityCommands, MouseUpEvents } from "../resources";
import { DropPosition, NextCat, Position, TargetPosition } from "../components";
import { Vector2 } from "../types/Vector2";

export const DropCatOnClickSystem: System = {
    query: {
        resources: [
            EntityCommands,
        ],
        all: [
            NextCat,
            Position,
            TargetPosition,
            DropPosition,
        ]
    },
    run(queryResult: QueryResult) {
        const commands = queryResult.resources.get<Commands>(EntityCommands)!;
        queryResult.entities.foreach((components, entity) => {
            const position = components[Position] as Vector2;
            const targetPosition = components[TargetPosition] as Vector2;

            if (Math.abs(targetPosition.x - position.x) <= 0.001) {
                commands.removeComponent(entity, NextCat);
                commands.removeComponent(entity, TargetPosition);
                commands.removeComponent(entity, DropPosition);
            }
        });
    },
}