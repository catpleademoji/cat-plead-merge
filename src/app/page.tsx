"use client"
import { drawScene } from "@/webgl/drawScene";
import { initBuffers } from "@/webgl/initBuffers";
import { initShaderProgram, loadTexture } from "@/webgl/shaderUtils";
import { ProgramInfo } from "../webgl/ProgramInfo";
import { Fragment, Vertex } from "@/webgl/ShaderSource";

let deltaTime = 0;

export default function Home() {

  function getCanvasRef(canvas: HTMLCanvasElement | null) {
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl2");

    if (gl === null) {
      throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(gl, Vertex, Fragment);

    const programInfo: ProgramInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram,
          "uProjectionMatrix"
        ),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
      },
    };

    const buffers = initBuffers(gl);

    const texture = loadTexture(gl, "/images/cat-plead.svg");
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let then = 0;

    // Draw the scene repeatedly
    function render(now: DOMHighResTimeStamp) {
      now *= 0.001; // convert to seconds
      deltaTime = now - then;
      then = now;

      drawScene(gl!, programInfo, buffers, texture);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  return (
    <>
      <canvas ref={getCanvasRef}></canvas>
    </>
  );
}
