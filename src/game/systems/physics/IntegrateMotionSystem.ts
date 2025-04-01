import { AngularVelocity, Position, Rotation, Velocity } from "@/game/components";
import { Vector2 } from "@/types/Vector2";
import { QueryResult, System, Time } from "cat-plead-engine";

type Gravity = {
    x: number;
    y: number;
}

export const IntegrateMotion: System = {
    query: {
        resources: [
            "time",
            "gravity",
        ],
        all: [
            Position,
            Velocity,
            Rotation,
            AngularVelocity,
        ]
    },
    run(queryResult: QueryResult) {
        const time = queryResult.resources.get<Time>("time")!;
        const gravity = queryResult.resources.get<Gravity>("gravity")!;

        const velFromGravity = {
            x: gravity.x * time.delta,
            y: gravity.y * time.delta,
        };
        queryResult.entities.foreach((components) => {
            const velocity = components["velocity"] as Vector2;
            const position = components["position"] as Vector2;

            velocity.x += velFromGravity.x;
            velocity.y += velFromGravity.y;

            position.x += velocity.x * time.delta;
            position.y += velocity.y * time.delta;

            const angularVelocity = components["angular_velocity"] as number;
            const rotation = components["rotation"] as number;
            components["rotation"] = rotation + angularVelocity * time.delta
        });
    }
}
