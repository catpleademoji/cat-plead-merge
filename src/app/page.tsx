"use client"
import { drawScene } from "@/webgl/drawScene";
import { initBuffers } from "@/webgl/initBuffers";
import { initShaderProgram, loadTexture } from "@/webgl/shaderUtils";
import { ProgramInfo } from "../webgl/ProgramInfo";
import { Fragment, Vertex } from "@/webgl/ShaderSource";
import { useState } from "react";
import "./page.css";

export default function Home() {
  const [errors, setErrors] = useState<string[]>([]);

  function init(gl: WebGL2RenderingContext) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const shaderProgram = initShaderProgram(gl, Vertex, Fragment);

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

    // const vertexArrayObject = initBuffers(gl, programInfo);

    // Create a vertex array object (attribute state)
    const vao = initBuffers(gl, programInfo);

    // use texture unit 0
    gl.activeTexture(gl.TEXTURE0 + 0);
    const texture = loadTexture(gl, "/images/cat-plead.svg");
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let deltaTime = 0;
    let then = 0;

    // Draw the scene repeatedly
    function render(now: DOMHighResTimeStamp) {
      now *= 0.001; // convert to seconds
      deltaTime = now - then;
      then = now;

      drawScene(gl!, programInfo, vao, texture);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  function getCanvasRef(canvas: HTMLCanvasElement | null) {
    if (!canvas) {
      return;
    }

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const gl = canvas.getContext("webgl2");

    if (!gl) {
      setErrors((errors) => {
        return [...errors, "Unable to initialize WebGL. Your browser or machine may not support it."];
      });
      return;
    }

    init(gl);
  }

  return (
    <>
      {
        errors.length > 0 && <div>{errors.map(error => error)}</div>
      }
      <canvas id="game-canvas" ref={getCanvasRef}></canvas>
    </>
  );
}
