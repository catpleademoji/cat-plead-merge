import { DefaultResources } from "cat-plead-engine";
import { NextCat, TargetPosition, Position } from "../../../components";
import { expDecay } from "../../../math";
export const MoveCatToClickPositionSystem = {
    query: {
        resources: [DefaultResources.Time],
        all: [NextCat, TargetPosition, Position],
    },
    run: function (queryResult) {
        const time = queryResult.resources.get(DefaultResources.Time);
        queryResult.entities.foreach((components) => {
            const position = components[Position];
            const targetPosition = components[TargetPosition];
            const targetX = expDecay(position.x, targetPosition.x, 50, time.delta);
            components[Position] = {
                x: targetX,
                y: position.y,
            };
        });
    }
};
