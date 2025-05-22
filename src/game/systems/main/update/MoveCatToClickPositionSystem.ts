import { System, DefaultResources, QueryResult, Time } from "cat-plead-engine";
import { NextCat, TargetPosition, Position } from "../../../components";
import { expDecay } from "../../../math";
import { Vector2 } from "../../../types/Vector2";

export const MoveCatToClickPositionSystem: System = {
    query: {
        resources: [DefaultResources.Time],
        all: [NextCat, TargetPosition, Position],
    },
    run: function (queryResult: QueryResult): void {
        const time = queryResult.resources.get<Time>(DefaultResources.Time)!;

        queryResult.entities.foreach((components) => {
            const position = components[Position] as Vector2;
            const targetPosition = components[TargetPosition] as Vector2;

            const targetX = expDecay(position.x, targetPosition.x, 50, time.delta);

            components[Position] = {
                x: targetX,
                y: position.y,
            }
        });
    }
}
