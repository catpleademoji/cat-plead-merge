import { QueryResult, System } from "cat-plead-engine";
import { Color, Scale } from "../components";
import { remap } from "../math";
import { WarningLevel as WarningLevelRes } from "../resources";
import { WarningLevel } from "@/game/types/WarningLevel";
import { Vector2 } from "../types/Vector2";

export const ShowWarningSystem: System = {
    query: {
        resources: [
            WarningLevelRes,
        ],
        all: [
            "warning_level",
            Scale,
            Color
        ]
    },
    run: function (queryResult: QueryResult): void {
        const warningLevel = queryResult.resources.get<WarningLevel>(WarningLevelRes)!;
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