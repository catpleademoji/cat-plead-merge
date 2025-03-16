import config from "../config.js";
import { random } from "./math.js";
import { SCREEN_TO_WORLD } from "./screen.js";

export default async function loadParticles() {
  const themeIndex = random.int(config.themes.length);
  const theme = config.themes[themeIndex];
  const loadImagesPromise = config.particles.map(async (particle, index) => {
    const image = new Image();
    image.src = `./assets/images/particles/${particle.name}.svg`;

    await image.decode();

    const prerenderCanvas = document.createElement("canvas");

    const sqrt = Math.sqrt(theme.values.length);
    const cols = Math.ceil(sqrt);
    const rows = Math.ceil(theme.values.length / cols);

    prerenderCanvas.width = particle.width * cols;
    prerenderCanvas.height = particle.height * rows;

    prerender_canvas: {
      const context = prerenderCanvas.getContext("2d");

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (i * cols + j >= theme.values.length) {
            break;
          }
          
          context.drawImage(image, particle.width * j, particle.height * i, particle.width, particle.height);
          context.fillStyle = theme.values[i * cols + j];
          context.globalCompositeOperation = "source-atop";
          context.globalAlpha = 0.85;
          context.fillRect(particle.width* j, particle.height * i, particle.width, particle.height);
          context.globalCompositeOperation = "source-over";
          context.globalAlpha = 1;
        }
      }
    }
    const mass = 1;
    const moment_of_inertia = 1;

    return {
      name: particle.name,
      spritesheet: {
        source: prerenderCanvas,
        sprite_width: particle.width,
        sprite_height: particle.height,
        count: theme.values.length
      },
      width: particle.width * SCREEN_TO_WORLD,
      height: particle.height * SCREEN_TO_WORLD,
      inv_mass: 1 / mass,
      inv_inertia: 1 / moment_of_inertia,
    };
  });
  return Promise.all(loadImagesPromise);
}