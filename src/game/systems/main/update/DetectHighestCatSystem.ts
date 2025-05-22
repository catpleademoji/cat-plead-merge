import { System, DefaultResources, QueryResult, Time } from "cat-plead-engine";
import { Position, CatIndex, Scale, LifeTime, NextCat } from "../../../components";
import { DangerLevel as DangerLevelRes, Webgl } from "../../../resources";
import { DangerLevel } from "../../../types/DangerLevel";
import { Vector2 } from "../../../types/Vector2";

export const DetectHighestCatSystem: System = {
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
    run: function (queryResult: QueryResult): void {
        const gl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;

        const screenHeight = (gl.canvas as HTMLCanvasElement).clientHeight;

        // position starts at zero at the top and
        // increases going down the screen
        let highestPosition = screenHeight;
        queryResult.entities.foreach((components) => {
            const lifetime = components[LifeTime] as number;
            if (lifetime <= 1) {
                return;
            }

            const position = components[Position] as Vector2;
            const scale = components[Scale] as Vector2;
            const radius = scale.y / 2;
            if (position.y - radius < highestPosition) {
                highestPosition = position.y - radius;
            }
        });

        const time = queryResult.resources.get<Time>(DefaultResources.Time)!;
        const dangerLevel = queryResult.resources.getRW<DangerLevel>(DangerLevelRes)!;

        const warningHeightThreshold = 0.45 * screenHeight;
        const dangerHeightThreshold = 0.15 * screenHeight;

        if (highestPosition <= warningHeightThreshold) {
            dangerLevel.level = (highestPosition - warningHeightThreshold) / (dangerHeightThreshold - warningHeightThreshold);
        } else {
            dangerLevel.level = 0;
        }

        if (highestPosition <= dangerHeightThreshold) {
            dangerLevel.time += time.delta;
        } else {
            dangerLevel.time = 0;
        }
    }
}