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
    var vao = gl.createVertexArray();

    // Create a buffer
    var positionBuffer = gl.createBuffer();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(programInfo.attribLocations.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      programInfo.attribLocations.position, size, type, normalize, stride, offset);

    // create the texcoord buffer, make it the current ARRAY_BUFFER
    // and copy in the texcoord values
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    setTexcoords(gl);

    // Turn on the attribute
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

    // Tell the attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floating point values
    var normalize = true;  // convert from 0-255 to 0.0-1.0
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord, size, type, normalize, stride, offset);

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

function setGeometry(gl: WebGL2RenderingContext) {
  var positions = new Float32Array([
    -0.5, +0.5,
    +0.5, +0.5,
    -0.5, -0.5,
    -0.5, -0.5,
    +0.5, +0.5,
    +0.5, -0.5,
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// Fill the current ARRAY_BUFFER buffer
// with texture coordinates for a plane
function setTexcoords(gl: WebGL2RenderingContext) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1,
    ]),
    gl.STATIC_DRAW);
}
