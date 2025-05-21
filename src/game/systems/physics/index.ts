import { SystemGroup } from "cat-plead-engine";
import { CollideBodiesSystem } from "./CollideBodiesSystem";
import { IntegrateMotion } from "./IntegrateMotionSystem";

export const mainFixedUpdateGroup: SystemGroup = {
    canRun() {
        return true;
    },
    systems: [
        IntegrateMotion,
        CollideBodiesSystem,
    ]
};
