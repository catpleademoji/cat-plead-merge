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

export function sphereVolume(radius: number) {
    const K = Math.PI * 4 / 3;
    return K * Math.pow(radius, 3);
}

export function sphereInvVolume(volume: number) {
    const K = 3 / (4 * Math.PI);
    return Math.cbrt(K * volume);
}
