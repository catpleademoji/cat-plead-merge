import { Vector2 } from "../types/Vector2";

export function dot(a: Vector2, b: Vector2): number {
    return a.x * b.x + a.y * b.y;
}

export function cross(a: Vector2, b: Vector2): number {
    return a.x * b.y - a.y * b.x;
}

export function clamp(a: number, min: number, max: number): number {
    return Math.min(max, Math.max(a, min));
}

export function remap(a: number, b: number, c: number, d: number, x: number) {
    return lerp(c, d, invLerp(a, b, x));
}

export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

export function invLerp(a: number, b: number, x: number) {
    return (x - a) / (b - a);
}

export function expDecay(a: number, b: number, decay: number, dt: number) {
    return b + (a - b) * Math.exp(-decay * dt);
}

export function sphereVolume(radius: number) {
    const K = Math.PI * 4 / 3;
    return K * Math.pow(radius, 3);
}

export function sphereInvVolume(volume: number) {
    const K = 3 / (4 * Math.PI);
    return Math.cbrt(K * volume);
}
