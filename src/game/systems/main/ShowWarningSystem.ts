import { QueryResult, System } from "cat-plead-engine";
import { Color, DangerIndicator, Scale } from "@/game/components";
import { remap } from "@/game/math";
import { Vector2 } from "@/game/types/Vector2";
import { DangerLevel } from "@/game/types/DangerLevel";
import { DangerLevel as DangerLevelRes } from "../../resources";

export const ShowWarningSystem: System = {
    query: {
        resources: [
            DangerLevelRes,
        ],
        all: [
            DangerIndicator,
            Scale,
            Color
        ]
    },
    run: function (queryResult: QueryResult): void {
        const warningLevel = queryResult.resources.get<DangerLevel>(DangerLevelRes)!;
        queryResult.entities.foreach((components) => {
            if (warningLevel.level > 0) {
                let warningIntensity = Math.exp(warningLevel.level);
                warningIntensity = remap(0, Math.E, 0, 0.75, warningIntensity);
                components[Color] = { r: 1, g: 0, b: 0, a: warningIntensity };
                const scale = components[Scale] as Vector2;
                scale.y = 25 * warningIntensity;
            } else {
                components[Color] = { r: 1, g: 0, b: 0, a: 0 };
                const scale = components[Scale] as Vector2;
                scale.y = 0;
            }
        });
    }
}