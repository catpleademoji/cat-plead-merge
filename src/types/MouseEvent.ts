import { EventQueue } from "@/game/EventQueue";

export type MouseDownEvent = {
    x: number;
    y: number;
}

export type MouseUpEvent = {
    x: number;
    y: number;
}

export type MouseDownEvents = EventQueue<MouseDownEvent>;
export type MouseUpEvents = EventQueue<MouseUpEvent>;