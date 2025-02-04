export default function ComponentArray(arrays, length) {
  this.component_arrays = arrays;
  this.length = length;

  this.get = function(i) {
    if (i < 0 || i >= this.length) {
      throw new Error("Index out of bounds");
    }
    let current_array_index = 0;
    let entity_index = i;

    while (entity_index >= this.component_arrays[current_array_index].length) {
      entity_index -= this.component_arrays[current_array_index].length;
      current_array_index += 1;
    }
    return this.component_arrays[current_array_index].array[entity_index];
  };
  this.set = function(i, value) {
    if (i < 0 || i >= this.length) {
      throw new Error("Index out of bounds");
    }

    let current_array_index = 0;
    let entity_index = i;
    while (entity_index >= this.component_arrays[current_array_index].length) {
      entity_index -= this.component_arrays[current_array_index].length;
      current_array_index += 1;
    }
    this.component_arrays[current_array_index].array[entity_index] = value;
  };
  this.inc = function(i, value) {
    if (i < 0 || i >= this.length) {
      throw new Error("Index out of bounds");
    }

    let current_array_index = 0;
    let entity_index = i;
    while (entity_index >= this.component_arrays[current_array_index].length) {
      entity_index -= this.component_arrays[current_array_index].length;
      current_array_index += 1;
    }
    this.component_arrays[current_array_index].array[entity_index] += value;
  };
}
