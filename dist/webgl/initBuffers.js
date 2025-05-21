export function initBuffers(gl, programInfo) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    initPositionBuffer(gl, programInfo);
    initTextureBuffer(gl, programInfo);
    return vao;
}
function initTextureBuffer(gl, programInfo) {
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    const texCoords = [
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, size, type, normalize, stride, offset);
}
function initPositionBuffer(gl, programInfo) {
    const positionBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(programInfo.attribLocations.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -0.5, +0.5,
        +0.5, +0.5,
        -0.5, -0.5,
        -0.5, -0.5,
        +0.5, +0.5,
        +0.5, -0.5,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(programInfo.attribLocations.position, size, type, normalize, stride, offset);
}
