export default function StepLifetime() {
  this.query = ["lifetime"];
  this.update = function(time, entities) {
    const lifetime = entities["lifetime"];
    for (let i = 0; i < entities.count; i++) {
      lifetime.inc(i, time.deltaTime);
    }
  };
};