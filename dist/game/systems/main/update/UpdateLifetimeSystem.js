import { DefaultResources } from "cat-plead-engine";
import { LifeTime } from "../../../../game/components";
export const UpdateLifetimeSystem = {
    query: {
        resources: [DefaultResources.Time],
        all: [LifeTime],
    },
    run: function (queryResult) {
        const time = queryResult.resources.get(DefaultResources.Time);
        queryResult.entities.foreach((components) => {
            const lifetime = components[LifeTime];
            components[LifeTime] = lifetime + time.delta;
        });
    }
};
