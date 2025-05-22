import { DefaultResources } from "cat-plead-engine";
import { Color, DangerIndicator } from "../../../components";
import { remap } from "../../../math";
import { DangerLevel as DangerLevelRes } from "../../../resources";
export const ShowWarningSystem = {
    query: {
        resources: [
            DangerLevelRes,
            DefaultResources.Time,
        ],
        all: [
            DangerIndicator,
            // Scale,
            Color
        ]
    },
    run: function (queryResult) {
        const warningLevel = queryResult.resources.get(DangerLevelRes);
        const time = queryResult.resources.get(DefaultResources.Time);
        queryResult.entities.foreach((components) => {
            if (warningLevel.level > 0) {
                let warningIntensity = Math.exp(warningLevel.level);
                warningIntensity = remap(1, Math.E, 0, 0.75, warningIntensity);
                components[Color] = { r: 1, g: 0, b: 0, a: warningIntensity * remap(-1, 1, 0, 1, Math.sin(3 * time.current)) };
            }
            else {
                components[Color] = { r: 1, g: 0, b: 0, a: 0 };
            }
        });
    }
};
