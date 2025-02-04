export const random = {
  int: function(val) {
    return Math.floor(Math.random() * val);
  },
  intRange: function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  float: function(val) {
    return Math.random() * val;
  },
  range: function(min, max) {
    return Math.random() * (max - min) + min;
  },
  sign: function() {
    return Math.sign(Math.random() - 0.5);
  },
  angle: function() {
    return Math.random() * Math.PI * 2;
  }
}

export function approximately(a, b, epsilon = 0.00001) {
  return Math.abs(a - b) <= epsilon;
}

export function clamp01(value) {
  return Math.max(Math.min(value, 1), 0);
}

export function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

export function dot(ax, ay, bx, by) {
  return ax * bx + ay * by;
}

export function cross(ax, ay, bx, by) {
  return ax * by - ay * bx;
}

export function magnitudesq(x, y) {
  return x * x + y * y;
}

export function magnitude(x, y) {
  return Math.sqrt(x * x + y * y);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function decay(a, b, dt, decay) {
  return b + (a - b) * Math.exp(-decay * dt);
}

export function inv_lerp(a, b, x) {
  return (x - a) / (b - a);
}

export function remap(a, b, c, d, x) {
  return lerp(c, d, inv_lerp(a, b, x));
}

export function sphere_volume(radius) {
  const K = Math.PI * 4 / 3;
  return K * Math.pow(radius, 3);
}

export function sphere_inv_volume(volume) {
  const K = 3 / (4 * Math.PI);
  return Math.cbrt(K * volume);
}
