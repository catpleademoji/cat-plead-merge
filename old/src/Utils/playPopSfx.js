import { random } from "./math.js";

export default function playPopSfx(soundEffects, audioContext) {
  const variants = soundEffects["pop"];
  const source = audioContext.createBufferSource();
  const variant = variants[random.int(variants.length)];
  source.buffer = variant;
  source.connect(audioContext.destination);
  source.start();
}
