export default function DestroyAtEndOfDuration(game) {
  this.query = [
    "lifetime",
    "duration",
  ];
  this.update = function(time, entities) {
    const lifetime = entities["lifetime"];
    const duration = entities["duration"];
    for (let i = entities.count - 1; i >= 0; i--) {
      if (lifetime.get(i) > duration.get(i)) {
        game.destroyEntity(i, ["lifetime", "duration"]);
      }
    }
  };
}