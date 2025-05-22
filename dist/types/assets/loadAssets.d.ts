import { Cat } from "../Cat";
import { Particle } from "../Particle";
import { SoundEffect } from "../SoundEffect";
import { CatAssetData, ParticleAssetData, SoundEffectAssetData } from "./AssetData";
export declare function loadCats(catData: CatAssetData[], gl: WebGL2RenderingContext): Promise<Cat[]>;
export declare function loadParticles(particleData: ParticleAssetData[], gl: WebGL2RenderingContext): Promise<Particle[]>;
export declare function loadSoundEffects(soundEffectData: SoundEffectAssetData[], audioContext: AudioContext): Promise<Map<string, SoundEffect>>;
