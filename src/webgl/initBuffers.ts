import { ProgramBuffers, ProgramInfo } from "./ProgramInfo";

function initBuffers(gl: WebGL2RenderingContext, programInfo: ProgramInfo): WebGLVertexArrayObject {
    const vao = gl.createVertexArray();

    gl.enableVertexAttribArray(programInfo.attribLocations.position);
    const positionBuffer = initPositionBuffer(gl);
    setPositionAttribute(gl, programInfo);

    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    const textureCoordBuffer = initTextureBuffer(gl);
    setTextureAttribute(gl, programInfo);

    // const indexBuffer = initIndexBuffer(gl);

    return vao;
    // return {
    //     position: positionBuffer,
    //     textureCoord: textureCoordBuffer,
    //     indices: indexBuffer,
    // };
}

function initPositionBuffer(gl: WebGL2RenderingContext) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -1.0, -1.0,
        +1.0, -1.0,
        +1.0, +1.0,
        -1.0, +1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function initTextureBuffer(gl: WebGL2RenderingContext) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    return textureCoordBuffer;
}

function setPositionAttribute(gl: WebGL2RenderingContext, programInfo: ProgramInfo) {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
        programInfo.attribLocations.position,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
}

function setTextureAttribute(gl: WebGL2RenderingContext, programInfo: ProgramInfo) {
    const num = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        num,
        type,
        normalize,
        stride,
        offset
    );
}

export { initBuffers };
