import { MouseDownEvent, MouseUpEvent } from "../types/MouseEvent";
import { Engine } from "cat-plead-engine";
import { MouseDownEvents, MouseUpEvents, CatSpawnTimer, DangerLevel, GameState, CatPoppedEvents, Theme as ThemeRes, PopTimer } from ".";
import { EventQueue } from "../EventQueue";
import { Theme } from "../../types/Theme";
import { CatPopEvent } from "../types/CatPopEvent";

export function addGameplayResources(engine: Engine, theme: Theme) {
    engine.addResource(ThemeRes, theme)
        .addResource(MouseDownEvents, new EventQueue<MouseDownEvent>())
        .addResource(MouseUpEvents, new EventQueue<MouseUpEvent>())
        .addResource(CatSpawnTimer, { time: 1 })
        .addResource(DangerLevel, { time: 0, level: 0 })
        .addResource(CatPoppedEvents, new EventQueue<CatPopEvent>())
        .addResource(GameState, { isLoss: false, score: 0 })
        .addResource(PopTimer, { time: 0 })
        ;
}