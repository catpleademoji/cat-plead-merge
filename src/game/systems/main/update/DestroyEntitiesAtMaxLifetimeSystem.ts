import { Commands, DefaultResources, QueryResult, System } from "cat-plead-engine";
import { LifeTime, MaxLifeTime } from "@/game/components";

export const DestroyEntitiesAtMaxLifetimeSystem: System = {
    query: {
        resources: [DefaultResources.Commands],
        all: [LifeTime, MaxLifeTime]
    },
    run(queryResult: QueryResult): void {
        const commands = queryResult.resources.get<Commands>(DefaultResources.Commands)!;

        queryResult.entities.foreach((components, entity) => {
            const lifetime = components[LifeTime] as number;
            const maxLifetime = components[MaxLifeTime] as number;

            if (lifetime >= maxLifetime) {
                commands.destroyEntity(entity);
            }
        });

    }
}