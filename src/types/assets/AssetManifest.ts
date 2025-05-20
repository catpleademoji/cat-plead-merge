import { CatAssetData, ParticleAssetData, SoundEffectAssetData } from "./AssetData";

export type AssetManifest = {
  cats: CatAssetData[],
  particles: ParticleAssetData[],
  soundEffects: SoundEffectAssetData[],
};
