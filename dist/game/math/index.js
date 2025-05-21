export function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}
export function cross(a, b) {
    return a.x * b.y - a.y * b.x;
}
export function clamp(a, min, max) {
    return Math.min(max, Math.max(a, min));
}
export function remap(a, b, c, d, x) {
    return lerp(c, d, invLerp(a, b, x));
}
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
export function invLerp(a, b, x) {
    return (x - a) / (b - a);
}
export function expDecay(a, b, decay, dt) {
    return b + (a - b) * Math.exp(-decay * dt);
}
export function sphereVolume(radius) {
    const K = Math.PI * 4 / 3;
    return K * Math.pow(radius, 3);
}
export function sphereInvVolume(volume) {
    const K = 3 / (4 * Math.PI);
    return Math.cbrt(K * volume);
}
