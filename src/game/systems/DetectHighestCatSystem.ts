import { QueryResult, System, Time } from "cat-plead-engine";
import { CatIndex, LifeTime, NextCat, Position, Scale } from "../components";
import { Time as TimeRes, WarningLevel as WarningLevelRes, Webgl } from "../resources";
import { Vector2 } from "../types/Vector2";
import { WarningLevel } from "@/types/WarningLevel";

export const DetectHighestCatSystem: System = {
    query: {
        resources: [
            Webgl,
            WarningLevelRes,
            TimeRes,
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
            if (position.y - scale.y < highestPosition) {
                highestPosition = position.y;
            }
        });

        const time = queryResult.resources.get<Time>(TimeRes)!;
        const warningLevel = queryResult.resources.getRW<WarningLevel>(WarningLevelRes)!;

        const warningHeightThreshold = 0.45 * screenHeight;
        const dangerHeightThreshold = 0.15 * screenHeight;
        if (highestPosition <= warningHeightThreshold) {
            warningLevel.level = (highestPosition - warningHeightThreshold) / (dangerHeightThreshold - warningHeightThreshold);
        } else {
            warningLevel.level = 0;
        }

        if (highestPosition <= dangerHeightThreshold) {
            warningLevel.time += time.delta;
            if (warningLevel.time > 1) {
                console.log("Game Over!");
            }
        } else {
            warningLevel.time = 0;
        }
    }
}