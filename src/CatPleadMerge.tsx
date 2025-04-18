import { useCallback, useEffect, useRef, useState } from "react";
import { AssetManifest } from "./assets/AssetManifest";
import { useAudioContext } from "./hooks/useAudioContext";
import { loadSoundEffects } from "./assets/loadAssets";
import { Engine } from "cat-plead-engine";
import { addSystems } from "./game/systems";
import { AudioContext, SoundEffectAssets } from "./game/resources";
import { addPhysicsResources } from "./game/resources/addPhysicsResources";
import { addWebglResources } from "./game/resources/addWebglResources";
import { Theme } from "./types/Theme";

export type CatPleadMergeProps = {
  id: string;
  assets: AssetManifest;
  theme: Theme
}

export function CatPleadMerge({ id, assets, theme }: CatPleadMergeProps) {
  const engine = useRef<Engine>(new Engine());

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useAudioContext((audioContext) => {
    engine.current.addResource(AudioContext, audioContext);
    loadSoundEffects(assets.soundEffects, audioContext)
      .then(_soundEffects => {
        engine.current.addResource(SoundEffectAssets, _soundEffects);
      });
  });

  const getCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return;
    }

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const gl = canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    addWebglResources(engine.current, gl, assets);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      engine.current.stop();
      return;
    }
    engine.current.run();
  }, [isPlaying]);

  useEffect(() => {
    addPhysicsResources(engine.current);
    addSystems(engine.current);
    engine.current.addResource("theme", theme);
  }, []);

  return (
    <>
      <div >
        <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "Pause" : "Play"}</button>
      </div>
      <canvas id={id} ref={getCanvasRef}></canvas>
    </>
  );
}
