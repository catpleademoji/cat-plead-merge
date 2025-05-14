import { Commands, DefaultResources, QueryResult, System } from "cat-plead-engine";
import { WarningSprite, Webgl } from "../resources";
import { Position, Rotation, Scale, Color, Sprite, DangerIndicator } from "../components";
import { Colors } from "../types/Color";

export const SpawnWarningSystem: System = {
    query: {
        resources: [
            Webgl,
            DefaultResources.Commands,
            WarningSprite
        ]
    },
    run: function (queryResult: QueryResult): void {
        const gl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;
        const commands = queryResult.resources.get<Commands>(DefaultResources.Commands)!;

        const warningSprite = queryResult.resources.get(WarningSprite);
        const screenWidth = gl.canvas.width;
        const screenHeight = gl.canvas.height;
        commands.spawnFromComponents({
            [DangerIndicator]: 0,
            [Position]: {
                x: screenWidth / 2,
                y: 0.15 * screenHeight,
            },
            [Rotation]: 0,
            [Scale]: {
                x: screenWidth,
                y: 20,
            },
            [Sprite]: warningSprite,
            [Color]: Colors.red,
        });
    }
}