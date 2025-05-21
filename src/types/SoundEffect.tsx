export type SoundEffect = {
  name: string;
  variants: {
    audio: AudioBuffer;
    src: string;
  }[];
};
