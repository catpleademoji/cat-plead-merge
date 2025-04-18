import { SoundEffect } from "@/types/SoundEffect";
import { System, QueryResult } from "cat-plead-engine";
import { EventQueue } from "../EventQueue";
import { AudioContext as AudioContextAsset, CatMergedEvents, SoundEffectAssets } from "../resources";
import { CatMergeEvent } from "../types/CatMergeEvent";

export const PlayPopSoundOnMergeSystem: System = {
  query: {
    resources: [
      CatMergedEvents,
      AudioContextAsset,
      SoundEffectAssets,
    ],
  },
  run(queryResult: QueryResult) {
    const audioContext = queryResult.resources.get<AudioContext>(AudioContextAsset);
    if (!audioContext) {
      return;
    }

    const soundEffects = queryResult.resources.get<Map<string, SoundEffect>>(SoundEffectAssets);
    if (!soundEffects) {
      return;
    }

    const popSoundEffect = soundEffects.get("pop")!;
    const mergeEvents = queryResult.resources.get<EventQueue<CatMergeEvent>>(CatMergedEvents)!;

    mergeEvents.foreach(_ => {
      const source = audioContext.createBufferSource();
      const randomIndex = Math.floor(Math.random() * popSoundEffect.variants.length);
      const variant = popSoundEffect.variants[randomIndex];
      source.buffer = variant.audio;
      source.connect(audioContext.destination);
      source.start();
    });
  }
};
