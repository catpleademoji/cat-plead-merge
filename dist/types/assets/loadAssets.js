import { createTexture } from "@/webgl/shaderUtils";
async function loadImage(src) {
    const image = new Image();
    image.src = src;
    await image.decode();
    return image;
}
export async function loadCats(catData, gl) {
    return await Promise.all(catData.map(async (cat, index) => {
        const image = await loadImage(cat.src);
        const texture = createTexture(gl, image);
        return {
            id: index,
            name: cat.name,
            texture: texture,
            size: image.width,
            score: cat.score,
        };
    }));
}
export async function loadParticles(particleData, gl) {
    return await Promise.all(particleData.map(async (particle) => {
        const image = await loadImage(particle.src);
        const texture = createTexture(gl, image);
        return {
            name: particle.name,
            texture: texture,
            size: particle.size,
        };
    }));
}
export async function loadSoundEffects(soundEffectData, audioContext) {
    const soundEffects = await Promise.all(soundEffectData.map(async (soundEffect) => {
        const audioBuffers = await Promise.all(soundEffect.src.map(async (src) => {
            const res = await fetch(src);
            // audio assets are stored as base64 text because neocities 
            // does not allow most non-image media formats.
            const base64AudioData = await res.text();
            const byteString = atob(base64AudioData);
            const audioData = new ArrayBuffer(byteString.length);
            const view = new Uint8Array(audioData);
            for (let i = 0; i < byteString.length; i++) {
                view[i] = byteString.charCodeAt(i);
            }
            return {
                src: src,
                audio: await audioContext.decodeAudioData(audioData),
            };
        }));
        return {
            name: soundEffect.name,
            variants: audioBuffers,
        };
    }));
    return soundEffects.reduce((map, soundEffect) => {
        map.set(soundEffect.name, soundEffect);
        return map;
    }, new Map());
}
