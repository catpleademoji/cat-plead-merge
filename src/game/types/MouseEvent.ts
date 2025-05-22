import { EventQueue } from "../EventQueue";

export type MouseDownEvent = {
    x: number;
    y: number;
}

export type MouseUpEvent = {
    x: number;
    y: number;
}

export type MouseDownEventQueue = EventQueue<MouseDownEvent>;
export type MouseUpEventQueue = EventQueue<MouseUpEvent>;