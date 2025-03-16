export default function IntegrateMotion(physics_world) {
  this.query = [
    "force_x",
    "force_y",
    "velocity_x",
    "velocity_y",
    "position_x",
    "position_y",
    "inv_mass",
    "torque",
    "angular_velocity",
    "rotation",
    "inv_inertia",
  ];
  this.update = function(time, entities) {
    const force_x = entities["force_x"];
    const force_y = entities["force_y"];
    const velocity_x = entities["velocity_x"];
    const velocity_y = entities["velocity_y"];
    const position_x = entities["position_x"];
    const position_y = entities["position_y"];
    const inv_mass = entities["inv_mass"];
    const torque = entities["torque"];
    const angular_velocity = entities["angular_velocity"];
    const rotation = entities["rotation"];
    const inv_inertia = entities["inv_inertia"];

    const deltaTime = time.deltaTime;
    const gravity_x = physics_world.gravity.x * physics_world.gravity.scale;
    const gravity_y = physics_world.gravity.y * physics_world.gravity.scale
    for (let i = 0; i < entities.count; i++) {
      const acceleration_x = force_x.get(i) * inv_mass.get(i) + gravity_x;
      const acceleration_y = force_y.get(i) * inv_mass.get(i) + gravity_y;
      const vel_x = velocity_x.get(i) + acceleration_x * deltaTime;
      const vel_y = velocity_y.get(i) + acceleration_y * deltaTime;
      velocity_x.set(i, vel_x);
      velocity_y.set(i, vel_y);

      position_x.inc(i, vel_x * deltaTime);
      position_y.inc(i, vel_y * deltaTime);

      const angular_acceleration = torque.get(i) * inv_inertia.get(i);
      const ang_vel = angular_velocity.get(i) + angular_acceleration * deltaTime;
      angular_velocity.inc(i, angular_acceleration * deltaTime);

      rotation.inc(i, ang_vel * deltaTime);

      force_x.set(i, 0);
      force_y.set(i, 0);
      torque.set(i, 0);
    }
  };
};