export type matrix3x3 = [
    number, number, number,
    number, number, number,
    number, number, number,
];

function multiply(out: matrix3x3, a: matrix3x3, b: matrix3x3): matrix3x3 {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;
    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;
    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;

    return out;
}

function identity(): matrix3x3 {
    return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ]
}

function projection(width: number, height: number): matrix3x3 {
    // Note: This matrix flips the Y axis so that 0 is at the top.
    return [
        2 / width, 0, 0,
        0, -2 / height, 0,
        -1, 1, 1,
    ];
}

function translation(tx: number, ty: number): matrix3x3 {
    return [
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1,
    ];
}

function rotation(angleInRadians: number): matrix3x3 {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1,
    ];
}

function scaling(sx: number, sy: number): matrix3x3 {
    return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1,
    ];
}

function translate(out: matrix3x3, m: matrix3x3, tx: number, ty: number): matrix3x3 {
    return multiply(out, m, translation(tx, ty));
}

function rotate(out: matrix3x3, m: matrix3x3, angleInRadians: number): matrix3x3 {
    return multiply(out, m, rotation(angleInRadians));
}

function scale(out: matrix3x3, m: matrix3x3, sx: number, sy: number): matrix3x3 {
    return multiply(out, m, scaling(sx, sy));
}

export const matrix3x3 = {
    translate,
    rotate,
    scale,
    projection,
    identity,
    multiply,
}