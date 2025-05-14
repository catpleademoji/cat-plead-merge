import { SoundEffect } from "@/types/SoundEffect";
import { System, QueryResult } from "cat-plead-engine";
import { EventQueue } from "../../EventQueue";
import { AudioContext as AudioContextAsset, CatPoppedEvents, SoundEffectAssets } from "../../resources";
import { CatPopEvent } from "../../types/CatPopEvent";

export const PlayPopSoundSystem: System = {
  query: {
    resources: [
      CatPoppedEvents,
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
    const mergeEvents = queryResult.resources.get<EventQueue<CatPopEvent>>(CatPoppedEvents)!;

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
