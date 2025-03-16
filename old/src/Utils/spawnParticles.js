import ParticleArchetype from "../Archetypes/particle.js";
import { random } from "./math.js";
import randomParticle from "./randomParticle.js";

export default function spawnParticles(cat, particles, game) {
  const scoreLog2 = Math.log2(cat.score) + 1;
  const num_particles = random.intRange(scoreLog2, scoreLog2 * 2);

  const particles_to_create = Array.from({ length: num_particles }, () => {
    const particle = randomParticle(particles);

    const angle = random.angle();
    const radius = cat.radius * Math.sqrt(Math.random());

    const position_x = cat.position_x + radius * Math.cos(angle);
    const position_y = cat.position_y + radius * Math.sin(angle);

    const velocity_x = random.range(1, 2) * random.sign();
    const velocity_y = -random.range(2, 5);

    particle.position_x = position_x;
    particle.position_y = position_y;
    particle.velocity_x = velocity_x;
    particle.velocity_y = velocity_y;

    particle.rotation = Math.atan2(velocity_y, velocity_x) + Math.PI / 2;

    return particle;
  });
  game.instantiateEntities(particles_to_create, ParticleArchetype);
}
