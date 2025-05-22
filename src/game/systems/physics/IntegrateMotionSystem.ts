import { System, DefaultResources, QueryResult, Time } from "cat-plead-engine";
import { Position, Velocity, Rotation, AngularVelocity, NextCat } from "../../components";
import { PhysicsSettings as PhysicsSettingsRes } from "../../resources";
import { PhysicsSettings } from "../../types/PhysicsSettings";
import { Vector2 } from "../../types/Vector2";

export const IntegrateMotion: System = {
    query: {
        resources: [
            DefaultResources.Time,
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
        const time = queryResult.resources.get<Time>(DefaultResources.Time)!;
        const physicsSettings = queryResult.resources.get<PhysicsSettings>(PhysicsSettingsRes)!;

        const velFromGravity = {
            x: physicsSettings.gravity.x * time.fixedDelta,
            y: physicsSettings.gravity.y * time.fixedDelta,
        };
        queryResult.entities.foreach((components) => {
            const velocity = components[Velocity] as Vector2;
            const position = components[Position] as Vector2;

            velocity.x += velFromGravity.x;
            velocity.y += velFromGravity.y;

            position.x += velocity.x * time.fixedDelta;
            position.y += velocity.y * time.fixedDelta;

            const angularVelocity = components[AngularVelocity] as number;
            const rotation = components[Rotation] as number;
            components[Rotation] = rotation + angularVelocity * time.fixedDelta
        });
    }
}
