import { WORLD_TO_SCREEN } from "../Utils/screen.js";

export default function DebugPhysics(canvasContext, game) {
  this.query = [
    "radius",
    "position_x",
    "position_y",
    "rotation",
    "velocity_x",
    "velocity_y",
    "angular_velocity",
  ];
  this.update = function(time, entities) {
    const radius = entities["radius"];
    const position_x = entities["position_x"];
    const position_y = entities["position_y"];
    const rotation = entities["rotation"];
    const velocity_x = entities["velocity_x"];
    const velocity_y = entities["velocity_y"];
    const angular_velocity = entities["angular_velocity"];

    canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    for (let i = 0; i < entities.count; i++) {
      canvasContext.save();

      const pos_x = position_x.get(i);
      const pos_y = position_y.get(i);
      const vel_x = velocity_x.get(i);
      const vel_y = velocity_y.get(i);

      canvasContext.beginPath();

      canvasContext.lineWidth = 2.5;
      canvasContext.strokeStyle = "#AD0000";
      const screen_x = pos_x * WORLD_TO_SCREEN * game.scale;
      const screen_y = pos_y * WORLD_TO_SCREEN * game.scale;
      canvasContext.moveTo(screen_x, screen_y);
      const screen_end_x = (pos_x + vel_x) * WORLD_TO_SCREEN * game.scale;
      const screen_end_y = (pos_y + vel_y) * WORLD_TO_SCREEN * game.scale;
      canvasContext.lineTo(screen_end_x, screen_end_y);
      canvasContext.stroke();

      canvasContext.beginPath();

      canvasContext.strokeStyle = "#EE00EE";
      const r = radius.get(i);
      const angle = rotation.get(i);
      const normal_x = Math.sin(angle);
      const normal_y = -Math.cos(angle);

      const start_x = pos_x + normal_x * r;
      const start_y = pos_y + normal_y * r;
      const screen_tangent_start_x = start_x * WORLD_TO_SCREEN * game.scale;
      const screen_tangent_start_y = start_y * WORLD_TO_SCREEN * game.scale;
      canvasContext.moveTo(screen_tangent_start_x, screen_tangent_start_y);
      const ang_vel = angular_velocity.get(i);
      const tangent_x = -normal_y * ang_vel;
      const tangent_y = normal_x * ang_vel;
      const screen_tangent_end_x = (start_x + tangent_x) * WORLD_TO_SCREEN * game.scale;
      const screen_tangent_end_y = (start_y + tangent_y) * WORLD_TO_SCREEN * game.scale;
      canvasContext.lineTo(screen_tangent_end_x, screen_tangent_end_y);
      canvasContext.stroke();

      canvasContext.restore();
    }
  };
}
