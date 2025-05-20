import { CollideBodiesSystem } from "./CollideBodiesSystem";
import { IntegrateMotion } from "./IntegrateMotionSystem";
export const mainFixedUpdateGroup = {
    canRun() {
        return true;
    },
    systems: [
        IntegrateMotion,
        CollideBodiesSystem,
    ]
};
