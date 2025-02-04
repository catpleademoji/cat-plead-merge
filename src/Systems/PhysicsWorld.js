export default function PhysicsWorld(options = {
  gravity: {
    x: 0,
    y: 9.81,
    scale: 1
  },
  worldBounds: {
    minx: 0,
    miny: 0,
    maxx: 0,
    maxy: 0,
  }
}) {
  this.gravity = options.gravity;
  this.worldBounds = options.worldBounds;
};
