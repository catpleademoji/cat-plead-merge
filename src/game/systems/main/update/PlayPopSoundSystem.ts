import { System, QueryResult } from "cat-plead-engine";
import { SoundEffect } from "../../../../types/SoundEffect";
import { EventQueue } from "../../../EventQueue";
import { CatPoppedEvents, SoundEffectAssets } from "../../../resources";
import { CatPopEvent } from "../../../types/CatPopEvent";
import { AudioContext } from "../../../resources";

export const PlayPopSoundSystem: System = {
  query: {
    resources: [
      CatPoppedEvents,
      AudioContext,
      SoundEffectAssets,
    ],
  },
  run(queryResult: QueryResult) {
    const audioContext = queryResult.resources.get<AudioContext>(AudioContext);
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
