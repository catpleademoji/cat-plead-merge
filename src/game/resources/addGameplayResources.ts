import { MouseDownEvent, MouseUpEvent } from "@/game/types/MouseEvent";
import { Engine } from "cat-plead-engine";
import { MouseDownEvents, MouseUpEvents, CatSpawnTimer, DangerLevel, GameState, CatMergedEvents, Theme as ThemeRes, PopTimer } from ".";
import { EventQueue } from "../EventQueue";
import { Theme } from "@/types/Theme";
import { CatMergeEvent } from "../types/CatMergeEvent";

export function addGameplayResources(engine: Engine, theme: Theme) {
    engine.addResource(ThemeRes, theme)
        .addResource(MouseDownEvents, new EventQueue<MouseDownEvent>())
        .addResource(MouseUpEvents, new EventQueue<MouseUpEvent>())
        .addResource(CatSpawnTimer, { time: 1 })
        .addResource(DangerLevel, { time: 0, level: 0 })
        .addResource(CatMergedEvents, new EventQueue<CatMergeEvent>())
        .addResource(GameState, { isLoss: false })
        .addResource(PopTimer, { time: 0 })
        ;
}