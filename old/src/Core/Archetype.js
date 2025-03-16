export default function Archetype(components, options = { capacity: 64 }) {
  this.num_entities = 0;
  this.capacity = options.capacity;
  this.component_keys = Array.from(new Set(components)).sort();
  this.components = this.component_keys.reduce((table, key) => {
    table[key] = Array(this.capacity);
    return table;
  }, {});

  this.insert = function(entity) {
    if (this.num_entities >= this.capacity) {
      throw new Error("Capacity is full");
    }

    this.component_keys.forEach(key => {
      this.components[key][this.num_entities] = entity[key] || 0;
    });

    this.num_entities++;
  };

  this.insert_many = function(entities) {
    if (entities.length + this.num_entities > this.capacity) {
      throw new Error("Number of entities to add is greater than capacity");
    }
    this.component_keys.forEach(key => {
      for (let i = 0; i < entities.length; i++) {
        this.components[key][i + this.num_entities] = entities[i][key] || 0;
      }
    });
    this.num_entities += entities.length;
  };

  this.delete = function(column_index) {
    if (column_index < 0 || column_index > this.num_entities) {
      return false;
    }

    if (this.num_entities === 0) {
      return false;
    }

    if (column_index === this.num_entities - 1) {
      this.num_entities--;
      return true;
    }

    // swap with last entity
    this.component_keys.forEach(key => {
      this.components[key][column_index] = this.components[key][this.num_entities - 1];
    });

    this.num_entities -= 1;
    return true;
  };

  this.delete_many = function(column_indices) {
    return column_indices.map(column_index => {
      if (column_index < 0 || column_index > this.num_entities) {
        return false;
      }

      if (this.num_entities === 0) {
        return false;
      }

      if (column_index === this.num_entities) {
        this.num_entities--;
        return true;
      }

      // swap with last entity
      this.component_keys.forEach(key => {
        this.components[key][column_index] = this.components[key][this.num_entities - 1];
      });

      this.num_entities -= 1;
      return true;
    });
  };

  this.clear = function() {
    this.num_entities = 0;
  }
  
  this.set_components = function(column_index, entity) {
    this.component_keys.forEach(key => {
      this.components[key][column_index] = entity[key] || this.components[key][column_index];
    });
  };

  this.match_query = function(query) {
    return query.every(component => {
      return Boolean(this.components[component])
    });
  }
}
