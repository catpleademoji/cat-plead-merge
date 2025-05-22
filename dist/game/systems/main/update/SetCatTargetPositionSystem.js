import { DefaultResources } from "cat-plead-engine";
import { NextCat, Scale, DropPosition, TargetPosition } from "../../../components";
import { clamp } from "../../../math";
import { Webgl, MouseUpEvents, MouseDownEvents } from "../../../resources";
export const SetCatDropPositionSystem = {
    query: {
        resources: [
            Webgl,
            MouseUpEvents,
            DefaultResources.Commands,
        ],
        all: [NextCat, Scale],
        none: [DropPosition],
    },
    run: function (queryResult) {
        const gl = queryResult.resources.get(Webgl);
        const mouseupEvents = queryResult.resources.get(MouseUpEvents);
        const min = 0;
        const max = gl.canvas.width;
        const mouseup = mouseupEvents.peek();
        if (mouseup) {
            const commands = queryResult.resources.get(DefaultResources.Commands);
            queryResult.entities.foreach((components, entity) => {
                const scale = components[Scale];
                commands.setComponent(entity, TargetPosition, {
                    x: clamp(mouseup.x, min + (scale.x / 2), max - (scale.x / 2)),
                    y: mouseup.y
                });
                commands.setComponent(entity, DropPosition, 1);
            });
        }
    }
};
export const SetCatTargetPositionSystem = {
    query: {
        resources: [
            Webgl,
            MouseDownEvents,
            DefaultResources.Commands,
        ],
        all: [NextCat, Scale],
        none: [DropPosition],
    },
    run: function (queryResult) {
        const gl = queryResult.resources.get(Webgl);
        const mousedownEvents = queryResult.resources.get(MouseDownEvents);
        const min = 0;
        const max = gl.canvas.width;
        const mousedown = mousedownEvents.peek();
        if (mousedown) {
            const commands = queryResult.resources.get(DefaultResources.Commands);
            queryResult.entities.foreach((components, entity) => {
                const scale = components[Scale];
                commands.setComponent(entity, TargetPosition, {
                    x: clamp(mousedown.x, min + (scale.x / 2), max - (scale.x / 2)),
                    y: mousedown.y
                });
            });
        }
    }
};
