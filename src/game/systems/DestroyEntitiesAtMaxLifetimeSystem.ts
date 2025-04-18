import { Commands, QueryResult, System } from "cat-plead-engine";
import { LifeTime, MaxLifeTime } from "../components";
import { EntityCommands } from "../resources";

export const DestroyEntitiesAtMaxLifetimeSystem: System = {
    query: {
        resources: [EntityCommands],
        all: [LifeTime, MaxLifeTime]
    },
    run(queryResult: QueryResult): void {
        const commands = queryResult.resources.get<Commands>(EntityCommands)!;

        queryResult.entities.foreach((components, entity) => {
            const lifetime = components[LifeTime] as number;
            const maxLifetime = components[MaxLifeTime] as number;

            if (lifetime >= maxLifetime) {
                commands.destroyEntity(entity);
            }
        });

    }
}