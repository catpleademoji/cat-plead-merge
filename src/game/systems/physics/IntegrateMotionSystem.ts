import { AngularVelocity, NextCat, Position, Rotation, Velocity } from "@/game/components";
import { PhysicsSettings as PhysicsSettingsRes, Time as TimeRes } from "@/game/resources";
import { PhysicsSettings } from "@/game/types/PhysicsSettings";
import { Vector2 } from "@/game/types/Vector2";
import { QueryResult, System, Time } from "cat-plead-engine";

export const IntegrateMotion: System = {
    query: {
        resources: [
            TimeRes,
            PhysicsSettingsRes,
        ],
        all: [
            Position,
            Velocity,
            Rotation,
            AngularVelocity,
        ],
        none: [
            NextCat
        ]
    },
    run(queryResult: QueryResult) {
        const time = queryResult.resources.get<Time>(TimeRes)!;
        const physicsSettings = queryResult.resources.get<PhysicsSettings>(PhysicsSettingsRes)!;

        const velFromGravity = {
            x: physicsSettings.gravity.x * time.delta,
            y: physicsSettings.gravity.y * time.delta,
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
