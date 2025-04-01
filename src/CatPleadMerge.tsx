import { useCallback, useEffect, useRef, useState } from "react";
import { AssetManifest } from "./assets/AssetManifest";
import { useAudioContext } from "./hooks/useAudioContext";
import { initShaderProgram } from "./webgl/shaderUtils";
import { VertexShaderSource, FragmentShaderSource } from "./webgl/ShaderSource";
import { ProgramInfo } from "./webgl/ProgramInfo";
import { initBuffers } from "./webgl/initBuffers";
import { loadCats, loadParticles, loadSoundEffects } from "./assets/loadAssets";
import { Engine } from "cat-plead-engine";
import { addSystems } from "./game/systems";

export type CatPleadMergeProps = {
  id: string;
  assets: AssetManifest;
}

export function CatPleadMerge({ id, assets }: CatPleadMergeProps) {
  const engine = useRef<Engine>(new Engine());

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useAudioContext((audioContext) => {
    engine.current.addResource("audioContext", audioContext);
    loadSoundEffects(assets.soundEffects, audioContext)
      .then(_soundEffects => {
        engine.current.addResource("soundEffects", _soundEffects);
        // soundEffects.current = _soundEffects;
        // const source = audioContext.createBufferSource();
        // const variant = _soundEffects[0].variants[0];
        // source.buffer = variant.audio;
        // source.connect(audioContext.destination);
        // source.start();
      });
  });

  function initWebgl(gl: WebGL2RenderingContext) {
    engine.current.addResource("webgl", gl);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const shaderProgram = initShaderProgram(gl, VertexShaderSource, FragmentShaderSource);

    const programInfo: ProgramInfo = {
      program: shaderProgram,
      attribLocations: {
        position: gl.getAttribLocation(shaderProgram, "aPosition"),
        textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
      },
      uniformLocations: {
        matrix: gl.getUniformLocation(shaderProgram, "uMatrix"),
        texSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
      },
    };

    const vao = initBuffers(gl, programInfo);

    loadCats(assets.cats, gl).then(cats => {
      engine.current.addResource("cats", cats);
      // entities.current = Array.from({ length: 50 }, () => {
      //   const angle = Math.random() * Math.PI * 2;
      //   const index = Math.floor(Math.random() * catImages.current!.length);

      //   return {
      //     position: {
      //       x: Math.random() * glContext.current!.canvas.width,
      //       y: Math.random() * glContext.current!.canvas.height,
      //     },
      //     direction: {
      //       x: Math.cos(angle),
      //       y: Math.sin(angle),
      //     },
      //     speed: Math.random() * 20 + 10,
      //     cat: catImages.current![index],
      //   }
      // });
    });

    loadParticles(assets.particles, gl).then(particles => {
      engine.current.addResource("particles", particles);
    });

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    engine.current.addResource("material", {
      programInfo: programInfo,
      vao,
    });
  }

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

    initWebgl(gl);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      engine.current.stop();
      return;
    }
    engine.current.run();
  }, [isPlaying]);

  useEffect(() => {
    engine.current.addResource("gravity", {
      x: 0,
      y: 9.81
    });
    addSystems(engine.current);
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
