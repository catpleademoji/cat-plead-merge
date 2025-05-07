import { MouseDownEvent, MouseUpEvent } from "@/types/MouseEvent";
import { Engine } from "cat-plead-engine";
import { MouseDownEvents, MouseUpEvents, CatSpawnTimer, WarningLevel } from ".";
import { EventQueue } from "../EventQueue";
import { Theme } from "@/types/Theme";

export function addGameplayResources(engine: Engine, theme: Theme) {
    engine.addResource("theme", theme)
        .addResource(MouseDownEvents, new EventQueue<MouseDownEvent>())
        .addResource(MouseUpEvents, new EventQueue<MouseUpEvent>())
        .addResource(CatSpawnTimer, { time: 1 })
        .addResource(WarningLevel, { time: 0, level: 0 });
}