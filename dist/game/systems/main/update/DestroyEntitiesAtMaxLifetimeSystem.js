import { DefaultResources } from "cat-plead-engine";
import { LifeTime, MaxLifeTime } from "../../../../game/components";
export const DestroyEntitiesAtMaxLifetimeSystem = {
    query: {
        resources: [DefaultResources.Commands],
        all: [LifeTime, MaxLifeTime]
    },
    run(queryResult) {
        const commands = queryResult.resources.get(DefaultResources.Commands);
        queryResult.entities.foreach((components, entity) => {
            const lifetime = components[LifeTime];
            const maxLifetime = components[MaxLifeTime];
            if (lifetime >= maxLifetime) {
                commands.destroyEntity(entity);
            }
        });
    }
};
