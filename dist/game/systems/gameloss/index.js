import { ClearMouseInputsSystem } from "../main/input/ClearMouseInputsSystem";
import { ClearCatPoppedEventsSystem } from "../main/update/ClearCatPoppedEventsSystem";
import { DetectHighestCatSystem } from "../main/update/DetectHighestCatSystem";
import { PlayPopSoundSystem } from "../main/update/PlayPopSoundSystem";
import { ShowWarningSystem } from "../main/update/ShowWarningSystem";
import { SpawnParticlesSystem } from "../main/update/SpawnParticlesSystem";
import { UpdateScoreSystem } from "../main/update/UpdateScoreSystem";
import { PopCatsSystem } from "./PopCatsSystem";
import { GameState as GameStateRes } from "../../resources";
export const gamelossUpdateGroup = {
    canRun(resources) {
        const gameState = resources.get(GameStateRes);
        return Boolean(gameState === null || gameState === void 0 ? void 0 : gameState.isLoss);
    },
    systems: [
        ClearCatPoppedEventsSystem,
        PopCatsSystem,
        PlayPopSoundSystem,
        DetectHighestCatSystem,
        SpawnParticlesSystem,
        ShowWarningSystem,
        UpdateScoreSystem,
        ClearMouseInputsSystem,
    ]
};
