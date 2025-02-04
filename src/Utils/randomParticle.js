import { random } from "./math.js";

export default function randomParticle(particles) {
  const particle_type = random.int(particles.length);
  const particle = particles[particle_type];

  const sprite_index = random.int(particle.spritesheet.count);

  const sqrt = Math.sqrt(particle.spritesheet.count);
  const cols = Math.ceil(sqrt);

  const row_index = Math.floor(sprite_index / cols);
  const col_index = sprite_index % cols;

  const source_x = col_index * particle.spritesheet.sprite_width;
  const source_y = row_index * particle.spritesheet.sprite_height;

  const duration = random.range(0.5, 1.25);
  const scale = random.range(0.75, 1.25);

  return {
    spritesheet: particle.spritesheet,
    width: particle.width * scale,
    height: particle.height * scale,
    source_x,
    source_y,
    duration: duration,
    inv_mass: particle.inv_mass,
    inv_inertia: particle.inv_inertia
  };
}