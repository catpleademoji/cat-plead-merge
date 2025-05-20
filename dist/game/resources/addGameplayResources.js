import { MouseDownEvents, MouseUpEvents, CatSpawnTimer, DangerLevel, GameState, CatPoppedEvents, Theme as ThemeRes, PopTimer } from ".";
import { EventQueue } from "../EventQueue";
export function addGameplayResources(engine, theme) {
    engine.addResource(ThemeRes, theme)
        .addResource(MouseDownEvents, new EventQueue())
        .addResource(MouseUpEvents, new EventQueue())
        .addResource(CatSpawnTimer, { time: 1 })
        .addResource(DangerLevel, { time: 0, level: 0 })
        .addResource(CatPoppedEvents, new EventQueue())
        .addResource(GameState, { isLoss: false, score: 0 })
        .addResource(PopTimer, { time: 0 });
}
