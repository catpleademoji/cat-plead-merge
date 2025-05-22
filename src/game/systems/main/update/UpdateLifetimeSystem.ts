import { DefaultResources, QueryResult, System, Time } from "cat-plead-engine";
import { LifeTime } from "../../../components";

export const UpdateLifetimeSystem: System = {
    query: {
        resources: [DefaultResources.Time],
        all: [LifeTime],
    },
    run: function (queryResult: QueryResult): void {
        const time = queryResult.resources.get<Time>(DefaultResources.Time)!;

        queryResult.entities.foreach((components) => {
            const lifetime = components[LifeTime] as number;
            components[LifeTime] = lifetime + time.delta;
        });
    }
}