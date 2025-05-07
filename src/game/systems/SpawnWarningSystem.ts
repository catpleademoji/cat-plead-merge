import { Commands, QueryResult, System } from "cat-plead-engine";
import { Webgl, EntityCommands } from "../resources";
import { Position, Rotation, Scale, Color, Sprite } from "../components";
import { Colors } from "../types/Color";

export const SpawnWarningSystem: System = {
    query: {
        resources: [
            Webgl,
            EntityCommands,
            "warning_sprite",
        ]
    },
    run: function (queryResult: QueryResult): void {
        const gl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;
        const commands = queryResult.resources.get<Commands>(EntityCommands)!;

        const warningSprite = queryResult.resources.get("warning_sprite");
        const screenWidth = gl.canvas.width;
        const screenHeight = gl.canvas.height;
        commands.spawnFromComponents({
            ["warning_level"]: 0,
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