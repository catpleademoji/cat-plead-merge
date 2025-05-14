import { QueryResult, System } from "cat-plead-engine";
import { Color, LifeTime, MaxLifeTime } from "../../components";
import { ColorRgba } from "../../types/Color";

export const ChangeOpacityOnLifetimeSystem: System = {
    query: {
        all: [
            LifeTime,
            MaxLifeTime,
            Color,
        ]
    },
    run(queryResult: QueryResult) {
        queryResult.entities.foreach((components) => {
            const lifetime = components[LifeTime] as number;
            const maxLifetime = components[MaxLifeTime] as number;
            const color = components[Color] as ColorRgba;

            const opacity = Math.sqrt(Math.max(0, 1 - lifetime / maxLifetime));
            components[Color] = {
                r: color.r,
                g: color.g,
                b: color.b,
                a: opacity
            }
        });
    }
}