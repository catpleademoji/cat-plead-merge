import { Cat } from "@/types/Cat";
import { CatAssetData, ParticleAssetData, SoundEffectAssetData } from "./AssetData";
import { Particle } from "@/types/Particle";
import { SoundEffect } from "@/types/SoundEffect";
export declare function loadCats(catData: CatAssetData[], gl: WebGL2RenderingContext): Promise<Cat[]>;
export declare function loadParticles(particleData: ParticleAssetData[], gl: WebGL2RenderingContext): Promise<Particle[]>;
export declare function loadSoundEffects(soundEffectData: SoundEffectAssetData[], audioContext: AudioContext): Promise<Map<string, SoundEffect>>;
