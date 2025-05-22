import { LifeTime, MaxLifeTime, Color } from "../../../components";
export const ChangeOpacityOnLifetimeSystem = {
    query: {
        all: [
            LifeTime,
            MaxLifeTime,
            Color,
        ]
    },
    run(queryResult) {
        queryResult.entities.foreach((components) => {
            const lifetime = components[LifeTime];
            const maxLifetime = components[MaxLifeTime];
            const color = components[Color];
            const opacity = Math.sqrt(Math.max(0, 1 - lifetime / maxLifetime));
            components[Color] = {
                r: color.r,
                g: color.g,
                b: color.b,
                a: opacity
            };
        });
    }
};
