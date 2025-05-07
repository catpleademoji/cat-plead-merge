import { QueryResult, System } from "cat-plead-engine";
import { Color } from "../components";
import { remap } from "../math";
import { WarningLevel as WarningLevelRes } from "../resources";
import { WarningLevel } from "@/types/WarningLevel";

export const ShowWarningSystem: System = {
    query: {
        resources: [
            WarningLevelRes,
        ],
        all: [
            "warning_level",
            Color
        ]
    },
    run: function (queryResult: QueryResult): void {
        const warningLevel = queryResult.resources.get<WarningLevel>(WarningLevelRes)!;
        queryResult.entities.foreach((components) => {
            if (warningLevel.level > 0.5) {
                let warningIntensity = Math.exp(warningLevel.level);
                warningIntensity = remap(0, Math.E, 0, 0.75, warningIntensity);
                components[Color] = { r: 1, g: 0, b: 0, a: warningIntensity }
            } else {
                components[Color] = { r: 1, g: 0, b: 0, a: 0 }
            }
        });
    }
}