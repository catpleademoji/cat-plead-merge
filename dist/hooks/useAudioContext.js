"use client";
import { useRef, useEffect } from "react";
export function useAudioContext(callback) {
    const audioContext = useRef(null);
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
        ["keyup", "pointerup"].map(eventType => {
            document.addEventListener(eventType, resumeAudioContext);
        });
        return () => {
            ["keyup", "pointerup"].forEach(eventType => {
                document.removeEventListener(eventType, resumeAudioContext);
            });
        };
    }, []);
    return audioContext;
}
