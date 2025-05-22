import { DefaultResources } from "cat-plead-engine";
import { Position, CatIndex, Scale, LifeTime, NextCat } from "../../../components";
import { DangerLevel as DangerLevelRes, Webgl } from "../../../resources";
export const DetectHighestCatSystem = {
    query: {
        resources: [
            Webgl,
            DangerLevelRes,
            DefaultResources.Time,
        ],
        all: [
            Position,
            CatIndex,
            Scale,
            LifeTime,
        ],
        none: [
            NextCat,
        ]
    },
    run: function (queryResult) {
        const gl = queryResult.resources.get(Webgl);
        const screenHeight = gl.canvas.clientHeight;
        // position starts at zero at the top and
        // increases going down the screen
        let highestPosition = screenHeight;
        queryResult.entities.foreach((components) => {
            const lifetime = components[LifeTime];
            if (lifetime <= 1) {
                return;
            }
            const position = components[Position];
            const scale = components[Scale];
            const radius = scale.y / 2;
            if (position.y - radius < highestPosition) {
                highestPosition = position.y - radius;
            }
        });
        const time = queryResult.resources.get(DefaultResources.Time);
        const dangerLevel = queryResult.resources.getRW(DangerLevelRes);
        const warningHeightThreshold = 0.45 * screenHeight;
        const dangerHeightThreshold = 0.15 * screenHeight;
        if (highestPosition <= warningHeightThreshold) {
            dangerLevel.level = (highestPosition - warningHeightThreshold) / (dangerHeightThreshold - warningHeightThreshold);
        }
        else {
            dangerLevel.level = 0;
        }
        if (highestPosition <= dangerHeightThreshold) {
            dangerLevel.time += time.delta;
        }
        else {
            dangerLevel.time = 0;
        }
    }
};
