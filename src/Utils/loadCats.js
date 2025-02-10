import config from "../config.js";
import { sphere_volume, sphere_inv_volume } from "./math.js";
import { SCREEN_TO_WORLD } from "./screen.js";

export default async function loadCats() {
  const loadImagePromises = config.cats.map(async (cat, index) => {
    const image = new Image();
    image.src = `/assets/images/cats/${cat.name}.svg`;

    await image.decode();

    // radius of outer circle
    const radius = Math.round(cat.size * Math.SQRT1_2);
    const halfSize = cat.size / 2;

    const prerenderCanvas = document.createElement("canvas");
    prerenderCanvas.width = 2 * radius;
    prerenderCanvas.height = 2 * radius;

    prerender_canvas: {
      const context = prerenderCanvas.getContext("2d");

      context.drawImage(image, radius - halfSize, radius - halfSize, cat.size, cat.size);

      const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
      gradient.addColorStop(0, "#96916400");
      gradient.addColorStop(0.75, "#DCD796A0");
      gradient.addColorStop(1, "#FFFAAFFF");

      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(radius, radius, radius, radius, 0, 0, 2 * Math.PI);
      context.fill();
    }

    const volume = sphere_volume(radius);
    const mass = sphere_inv_volume(volume / 2) / 18;
    const moment_of_inertia = 2 / 5 * mass * Math.pow(mass, 3);

    return {
      name: cat.name,
      type: index,
      image: prerenderCanvas,
      score: cat.score,
      radius: radius * SCREEN_TO_WORLD,
      inv_mass: 1 / mass,
      inv_inertia: 1 / moment_of_inertia,
    };
  });
  return Promise.all(loadImagePromises);
}
