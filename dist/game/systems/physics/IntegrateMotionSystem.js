import { DefaultResources } from "cat-plead-engine";
import { Position, Velocity, Rotation, AngularVelocity, NextCat } from "../../components";
import { PhysicsSettings as PhysicsSettingsRes } from "../../resources";
export const IntegrateMotion = {
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
    run(queryResult) {
        const time = queryResult.resources.get(DefaultResources.Time);
        const physicsSettings = queryResult.resources.get(PhysicsSettingsRes);
        const velFromGravity = {
            x: physicsSettings.gravity.x * time.fixedDelta,
            y: physicsSettings.gravity.y * time.fixedDelta,
        };
        queryResult.entities.foreach((components) => {
            const velocity = components[Velocity];
            const position = components[Position];
            velocity.x += velFromGravity.x;
            velocity.y += velFromGravity.y;
            position.x += velocity.x * time.fixedDelta;
            position.y += velocity.y * time.fixedDelta;
            const angularVelocity = components[AngularVelocity];
            const rotation = components[Rotation];
            components[Rotation] = rotation + angularVelocity * time.fixedDelta;
        });
    }
};
