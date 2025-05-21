"use client";
import { useRef, useEffect } from "react";

export function useAudioContext(callback: (audioContext: AudioContext) => void) {
  const audioContext = useRef<AudioContext>(null);

  function resumeAudioContext() {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
      callback(audioContext.current);
      return;
    }

    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }
  }

  useEffect(() => {
    (["keyup", "pointerup"] satisfies (keyof GlobalEventHandlersEventMap)[]).map(eventType => {

      document.addEventListener(eventType, resumeAudioContext);
    });

    return () => {
      (["keyup", "pointerup"] satisfies (keyof GlobalEventHandlersEventMap)[]).forEach(eventType => {
        document.removeEventListener(eventType, resumeAudioContext);
      });
    };
  }, []);

  return audioContext;
}
