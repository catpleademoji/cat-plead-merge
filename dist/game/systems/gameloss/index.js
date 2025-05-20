import { PopCatsSystem } from "./PopCatsSystem";
import { PlayPopSoundSystem } from "../main/update/PlayPopSoundSystem";
import { SpawnParticlesSystem } from "../main/update/SpawnParticlesSystem";
import { ShowWarningSystem } from "../main/update/ShowWarningSystem";
import { DetectHighestCatSystem } from "../main/update/DetectHighestCatSystem";
import { ClearCatPoppedEventsSystem } from "../main/update/ClearCatPoppedEventsSystem";
import { GameState as GameStateRes } from "../../../game/resources";
import { UpdateScoreSystem } from "../main/update/UpdateScoreSystem";
import { ClearMouseInputsSystem } from "../main/input/ClearMouseInputsSystem";
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
