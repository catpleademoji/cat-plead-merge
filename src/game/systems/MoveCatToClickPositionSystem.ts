import { QueryResult, System, Time } from "cat-plead-engine";
import { NextCat, Position, TargetPosition } from "../components";
import { Time as TimeRes } from "../resources";
import { Vector2 } from "../types/Vector2";

export const MoveCatToClickPositionSystem: System = {
    query: {
        resources: [TimeRes],
        all: [NextCat, TargetPosition, Position],
    },
    run: function (queryResult: QueryResult): void {
        const time = queryResult.resources.get<Time>(TimeRes)!;

        queryResult.entities.foreach((components) => {
            const position = components[Position] as Vector2;
            const targetPosition = components[TargetPosition] as Vector2;

            const targetX = targetPosition.x + (position.x - targetPosition.x) * Math.exp(-50 * time.delta);

            components[Position] = {
                x: targetX,
                y: position.y,
            }
        });
    }
}
