export type matrix3x3 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
declare function multiply(out: matrix3x3, a: matrix3x3, b: matrix3x3): matrix3x3;
declare function identity(): matrix3x3;
declare function projection(width: number, height: number): matrix3x3;
declare function translate(out: matrix3x3, m: matrix3x3, tx: number, ty: number): matrix3x3;
declare function rotate(out: matrix3x3, m: matrix3x3, angleInRadians: number): matrix3x3;
declare function scale(out: matrix3x3, m: matrix3x3, sx: number, sy: number): matrix3x3;
export declare const matrix3x3: {
    translate: typeof translate;
    rotate: typeof rotate;
    scale: typeof scale;
    projection: typeof projection;
    identity: typeof identity;
    multiply: typeof multiply;
};
export {};
