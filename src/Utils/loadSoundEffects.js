import config from "../config.js";

export default async function loadSoundEffects(audioContext) {
  const loadAudioPromises = config.soundEffects.map(async (sound) => {
    const audioBuffers = await Promise.all(sound.variants.map(async variant => {
      const audio = await fetch(`./assets/audio/${variant}.txt`);
      // const audioData = await audio.arrayBuffer();
      const audioBase64Data = await audio.text();

      const byteString = atob(audioBase64Data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const view = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        view[i] = byteString.charCodeAt(i);
      }
      
      return audioContext.decodeAudioData(arrayBuffer);
    }));

    return {
      name: sound.name,
      variants: audioBuffers
    };
  });
  return Promise.all(loadAudioPromises)
    .then(sounds => {
      return sounds.reduce((soundsMap, sound) => {
        soundsMap[sound.name] = sound.variants;
        return soundsMap;
      }, {});
    });
}