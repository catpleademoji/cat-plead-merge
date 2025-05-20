import { AudioContext as AudioContextAsset, CatPoppedEvents, SoundEffectAssets } from "@/game/resources";
export const PlayPopSoundSystem = {
    query: {
        resources: [
            CatPoppedEvents,
            AudioContextAsset,
            SoundEffectAssets,
        ],
    },
    run(queryResult) {
        const audioContext = queryResult.resources.get(AudioContextAsset);
        if (!audioContext) {
            return;
        }
        const soundEffects = queryResult.resources.get(SoundEffectAssets);
        if (!soundEffects) {
            return;
        }
        const popSoundEffect = soundEffects.get("pop");
        const mergeEvents = queryResult.resources.get(CatPoppedEvents);
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
