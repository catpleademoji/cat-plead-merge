export default function SystemGroup(shouldUpdateFunc = true) {
  this.systems = [];

  this.shouldUpdate = function(state) {
    if (typeof (shouldUpdateFunc) === "function") {
      return shouldUpdateFunc(state);
    }

    return Boolean(shouldUpdateFunc);
  };

  this.addSystem = function(system) {
    this.systems.push(system);
  };
}