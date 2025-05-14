import { MouseDownEventQueue, MouseUpEventQueue } from "@/game/types/MouseEvent";
import { System, QueryResult, Commands, DefaultResources } from "cat-plead-engine";
import { DropPosition, NextCat, Scale, TargetPosition } from "../../components";
import { MouseDownEvents, MouseUpEvents, Webgl } from "../../resources";
import { Vector2 } from "../../types/Vector2";
import { clamp } from "../../math";

export const SetCatDropPositionSystem: System = {
    query: {
        resources: [
            Webgl,
            MouseUpEvents,
            DefaultResources.Commands,
        ],
        all: [NextCat, Scale],
        none: [DropPosition],
    },
    run: function (queryResult: QueryResult): void {
        const gl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;
        const mouseupEvents = queryResult.resources.get<MouseUpEventQueue>(MouseUpEvents)!;

        const min = 0;
        const max = gl.canvas.width;

        const mouseup = mouseupEvents.peek();
        if (mouseup) {
            const commands = queryResult.resources.get<Commands>(DefaultResources.Commands)!;
            queryResult.entities.foreach((components, entity) => {
                const scale = components[Scale] as Vector2;
                commands.setComponent(entity, TargetPosition, {
                    x: clamp(mouseup.x, min + (scale.x / 2), max - (scale.x / 2)),
                    y: mouseup.y
                });
                commands.setComponent(entity, DropPosition, 1);
            });
        }
    }
}

export const SetCatTargetPositionSystem: System = {
    query: {
        resources: [
            Webgl,
            MouseDownEvents,
            DefaultResources.Commands,
        ],
        all: [NextCat, Scale],
        none: [DropPosition],
    },
    run: function (queryResult: QueryResult): void {
        const gl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;
        const mousedownEvents = queryResult.resources.get<MouseDownEventQueue>(MouseDownEvents)!;

        const min = 0;
        const max = gl.canvas.width;

        const mousedown = mousedownEvents.peek();
        if (mousedown) {
            const commands = queryResult.resources.get<Commands>(DefaultResources.Commands)!;
            queryResult.entities.foreach((components, entity) => {
                const scale = components[Scale] as Vector2;
                commands.setComponent(entity, TargetPosition, {
                    x: clamp(mousedown.x, min + (scale.x / 2), max - (scale.x / 2)),
                    y: mousedown.y
                });
            });
        }
    }
};
