import { QueryResult, System, Time } from "cat-plead-engine";
import { LifeTime } from "../components";
import { Time as TimeRes } from "../resources";

export const UpdateLifetimeSystem: System = {
    query: {
        resources: [TimeRes],
        all: [LifeTime],
    },
    run: function (queryResult: QueryResult): void {
        const time = queryResult.resources.get<Time>(TimeRes)!;

        queryResult.entities.foreach((components) => {
            const lifetime = components[LifeTime] as number;
            components[LifeTime] = lifetime + time.delta;
        });
    }
}