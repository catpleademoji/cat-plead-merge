import { cross, dot } from "../Utils/math.js";

export default function CollideBodies(physics_world) {
  this.query = [
    "radius",
    "velocity_x",
    "velocity_y",
    "position_x",
    "position_y",
    "inv_mass",
    "angular_velocity",
    "inv_inertia",
  ];
  const entities_by_pos_x = [];

  const dynamic_collisions = [];
  const static_collisions = [];

  this.update = function(time, entities) {
    update_sorted_entities(entities, entities_by_pos_x);

    const num_iterations = 10;
    for (let i = 0; i < num_iterations; i++) {
      dynamic_collisions.length = 0;
      static_collisions.length = 0;
      collect_collisions(entities, entities_by_pos_x, dynamic_collisions, static_collisions);
      solve_collisions(entities, dynamic_collisions, static_collisions);

      insertion_sort(entities, entities_by_pos_x);
    }
  }

  function update_sorted_entities(entities, array) {
    if (array.length !== entities.count) {
      array.length = entities.count;
      for (let i = 0; i < entities.count; i++) {
        array[i] = i;
      }
      const position_x = entities["position_x"];
      const radius = entities["radius"];
      array.sort((a, b) => {
        const min_x_a = position_x.get(a) - radius.get(a);
        const min_x_b = position_x.get(b) - radius.get(b);
        return min_x_a - min_x_b;
      });
    } else {
      insertion_sort(entities, array);
    }
  }

  /*
   * Insertion sort works well on small arrays that are mostly sorted
   */
  function insertion_sort(entities, array) {
    const position_x = entities["position_x"];
    const radius = entities["radius"];

    let a = 1;
    while (a < array.length) {
      const entity_index_a = array[a];
      const min_x = position_x.get(entity_index_a) - radius.get(entity_index_a);
      let b = a;
      while (b > 0 && position_x.get(array[b - 1]) - radius.get(array[b - 1]) > min_x) {
        array[b] = array[b - 1];
        b -= 1;
      }
      array[b] = entity_index_a;
      a += 1;
    }
  }

  const collect_collisions = function(entities, entities_by_pos_x, dynamic_collisions, static_collisions) {
    const position_x = entities["position_x"];
    const position_y = entities["position_y"];
    const radius = entities["radius"];

    const static_friction_cats = 0.2;
    const kinetic_friction_cats = 0.1;
    const static_friction_wall = 0;
    const kinetic_friction_wall = 0;
    const static_friction_floor = 0.4;
    const kinetic_friction_floor = 0.2;

    for (let i = 0; i < entities_by_pos_x.length; i++) {
      const entity_a = entities_by_pos_x[i];
      const pos_a_x = position_x.get(entity_a);
      const pos_a_y = position_y.get(entity_a);
      const radius_a = radius.get(entity_a);
      const max_x_a = position_x.get(entity_a) + radius.get(entity_a);

      for (let k = i + 1; k < entities_by_pos_x.length; k++) {
        const entity_b = entities_by_pos_x[k];

        const min_x_b = position_x.get(entity_b) - radius.get(entity_b);
        if (max_x_a < min_x_b) {
          // no collision
          break;
        }
        const pos_b_x = position_x.get(entity_b);
        const pos_b_y = position_y.get(entity_b);
        const radius_b = radius.get(entity_b);

        const dx = pos_a_x - pos_b_x;
        const dy = pos_a_y - pos_b_y;
        const distancesq = dx * dx + dy * dy;
        const radii = radius_a + radius_b;
        if (distancesq <= radii * radii) {
          const distance = Math.sqrt(distancesq);

          let normal_x;
          let normal_y;
          let depth;
          if (distance > 0) {
            normal_x = dx / distance;
            normal_y = dy / distance;
            depth = radii - distance;
          } else {
            normal_x = 0;
            normal_y = 1;
            depth = Math.max(radius_a, radius_b);
          }

          dynamic_collisions.push({
            a: entity_a,
            b: entity_b,
            contact_x: pos_a_x - normal_x * (radius_a - depth / 2),
            contact_y: pos_a_y - normal_y * (radius_a - depth / 2),
            normal_x: normal_x,
            normal_y: normal_y,
            depth: depth,
            static_friction: static_friction_cats,
            kinetic_friction: kinetic_friction_cats,
          });
        }
      }

      if (pos_a_x - radius_a <= physics_world.worldBounds.minx) {
        static_collisions.push({
          a: entity_a,
          wall: "left",
          contact_x: physics_world.worldBounds.minx,
          contact_y: pos_a_y,
          normal_x: 1,
          normal_y: 0,
          depth: physics_world.worldBounds.minx + radius_a - pos_a_x,
          static_friction: static_friction_wall,
          kinetic_friction: kinetic_friction_wall,
        });
      }

      if (pos_a_x + radius_a >= physics_world.worldBounds.maxx) {
        static_collisions.push({
          a: entity_a,
          wall: "right",
          contact_x: physics_world.worldBounds.maxx,
          contact_y: pos_a_y,
          normal_x: -1,
          normal_y: 0,
          depth: radius_a - (physics_world.worldBounds.maxx - pos_a_x),
          static_friction: static_friction_wall,
          kinetic_friction: kinetic_friction_wall,
        });
      }

      if (pos_a_y - radius_a <= physics_world.worldBounds.miny) {
        static_collisions.push({
          a: entity_a,
          wall: "top",
          contact_x: pos_a_x,
          contact_y: physics_world.worldBounds.miny,
          normal_x: 0,
          normal_y: 1,
          depth: physics_world.worldBounds.miny + radius_a - pos_a_y,
          static_friction: static_friction_floor,
          kinetic_friction: kinetic_friction_floor,
        });
      }

      if (pos_a_y + radius_a >= physics_world.worldBounds.maxy) {
        static_collisions.push({
          a: entity_a,
          wall: "bottom",
          contact_x: pos_a_x,
          contact_y: physics_world.worldBounds.maxy,
          normal_x: 0,
          normal_y: -1,
          depth: radius_a - (physics_world.worldBounds.maxy - pos_a_y),
          static_friction: static_friction_floor,
          kinetic_friction: kinetic_friction_floor,
        });
      }
    }
  };

  const solve_collisions = function(entities, dynamic_collisions, static_collisions) {
    const position_x = entities["position_x"];
    const position_y = entities["position_y"];
    const velocity_x = entities["velocity_x"];
    const velocity_y = entities["velocity_y"];
    const inv_mass = entities["inv_mass"];
    const angular_velocity = entities["angular_velocity"];
    const inv_inertia = entities["inv_inertia"];

    // separate bodies
    {
      dynamic_collisions.forEach(collision => {
        const { a, b, normal_x, normal_y, depth } = collision;

        const halfDepth = depth * 0.5;
        position_x.set(a, position_x.get(a) + normal_x * halfDepth);
        position_y.set(a, position_y.get(a) + normal_y * halfDepth);

        position_x.set(b, position_x.get(b) - normal_x * halfDepth);
        position_y.set(b, position_y.get(b) - normal_y * halfDepth);
      });
      static_collisions.forEach(collision => {
        const { a, normal_x, normal_y, depth } = collision;

        position_x.inc(a, normal_x * depth);
        position_y.inc(a, normal_y * depth);
      });
    }

    // solve collisions with friction
    {
      const restitution = 0.25;

      dynamic_collisions.forEach(collision => {
        const { a, b, contact_x, contact_y, normal_x, normal_y, static_friction, kinetic_friction } = collision;
        const ra_x = contact_x - position_x.get(a);
        const ra_y = contact_y - position_y.get(a);
        const rb_x = contact_x - position_x.get(b);
        const rb_y = contact_y - position_y.get(b);

        const vel_a_x = velocity_x.get(a);
        const vel_a_y = velocity_y.get(a);
        const vel_b_x = velocity_x.get(b);
        const vel_b_y = velocity_y.get(b);
        const ang_vel_a = angular_velocity.get(a);
        const ang_vel_b = angular_velocity.get(b);

        const tangential_velocity_a_x = -ra_y * ang_vel_a;
        const tangential_velocity_a_y = ra_x * ang_vel_a;
        const tangential_velocity_b_x = -rb_y * ang_vel_b;
        const tangential_velocity_b_y = rb_x * ang_vel_b;

        const relative_velocity_x = (vel_a_x + tangential_velocity_a_x)
          - (vel_b_x + tangential_velocity_b_x);
        const relative_velocity_y = (vel_a_y + tangential_velocity_a_y)
          - (vel_b_y + tangential_velocity_b_y);

        const velocity_projection_normal = dot(relative_velocity_x, relative_velocity_y, normal_x, normal_y);

        const inv_mass_a = inv_mass.get(a);
        const inv_mass_b = inv_mass.get(b);
        const inv_inertia_a = inv_inertia.get(a);
        const inv_inertia_b = inv_inertia.get(b);

        const inv_mass_sum = inv_mass_a + inv_mass_b;

        const rCrossNormal_a = cross(ra_x, ra_y, normal_x, normal_y);
        const rCrossNormal_b = cross(rb_x, rb_y, normal_x, normal_y);
        const inv_inertia_sum = inv_inertia_a * rCrossNormal_a * rCrossNormal_a
          + inv_inertia_b * rCrossNormal_b * rCrossNormal_b;

        const impulse_reaction = -(1 + restitution) * velocity_projection_normal
          / (inv_mass_sum + inv_inertia_sum);
        collision.impulse_reaction = impulse_reaction;

        const tangent_x = -normal_y;
        const tangent_y = normal_x;

        const velocity_projection_tangent = dot(relative_velocity_x, relative_velocity_y, tangent_x, tangent_y);
        let impulse_friction = -(velocity_projection_tangent / (inv_mass_sum + inv_inertia_sum));
        if (!(velocity_projection_tangent === 0 && Math.abs(impulse_friction) <= Math.abs(static_friction * impulse_reaction))) {
          impulse_friction = -(kinetic_friction * impulse_friction);
        }

        const impulse_x = impulse_reaction * normal_x - impulse_friction * tangent_x;
        const impulse_y = impulse_reaction * normal_y - impulse_friction * tangent_y;

        velocity_x.inc(a, +impulse_x * inv_mass_a);
        velocity_y.inc(a, +impulse_y * inv_mass_a);
        angular_velocity.inc(a, +cross(ra_x, ra_y, impulse_x, impulse_y) * inv_inertia_a);

        velocity_x.inc(b, -impulse_x * inv_mass_b);
        velocity_y.inc(b, -impulse_y * inv_mass_b);
        angular_velocity.inc(b, -cross(rb_x, rb_y, impulse_x, impulse_y) * inv_inertia_b);
      });

      static_collisions.forEach(collision => {
        const { a, wall, contact_x, contact_y, normal_x, normal_y, static_friction, kinetic_friction } = collision;
        const ra_x = contact_x - position_x.get(a);
        const ra_y = contact_y - position_y.get(a);

        const vel_a_x = velocity_x.get(a);
        const vel_a_y = velocity_y.get(a);
        const ang_vel_a = angular_velocity.get(a);

        const tangential_velocity_a_x = -ra_y * ang_vel_a;
        const tangential_velocity_a_y = +ra_x * ang_vel_a;

        const relative_velocity_x = (vel_a_x + tangential_velocity_a_x);
        const relative_velocity_y = (vel_a_y + tangential_velocity_a_y);

        const velocity_projection_normal = dot(relative_velocity_x, relative_velocity_y, normal_x, normal_y);

        const inv_mass_a = inv_mass.get(a);
        const inv_inertia_a = inv_inertia.get(a);

        const inv_mass_sum = inv_mass_a;

        const rCrossNormal_a = cross(ra_x, ra_y, normal_x, normal_y);
        const inv_inertia_sum = inv_inertia_a * rCrossNormal_a * rCrossNormal_a;

        const impulse_reaction = -(1 + restitution) * velocity_projection_normal
          / (inv_mass_sum + inv_inertia_sum);
        collision.impulse_reaction = impulse_reaction;

        const tangent_x = -normal_y;
        const tangent_y = normal_x;

        const velocity_projection_tangent = dot(relative_velocity_x, relative_velocity_y, tangent_x, tangent_y);
        let impulse_friction = -(velocity_projection_tangent / (inv_mass_sum + inv_inertia_sum));
        if (!(velocity_projection_tangent === 0 && Math.abs(impulse_friction) <= Math.abs(static_friction * impulse_reaction))) {
          impulse_friction = -(kinetic_friction * impulse_friction);
        }

        const impulse_x = impulse_reaction * normal_x - impulse_friction * tangent_x;
        const impulse_y = impulse_reaction * normal_y - impulse_friction * tangent_y;

        velocity_x.inc(a, impulse_x * inv_mass_a);
        velocity_y.inc(a, impulse_y * inv_mass_a);
        angular_velocity.inc(a, cross(ra_x, ra_y, impulse_x, impulse_y) * inv_inertia_a);
      });
    }
  };
};
