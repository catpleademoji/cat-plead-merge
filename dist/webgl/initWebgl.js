import { initBuffers } from "./initBuffers";
import { SimpleSpriteShader } from "./ShaderSource";
import { initShaderProgram } from "./shaderUtils";
export function initWebgl(gl) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const simpleSpriteShaderProgram = initShaderProgram(gl, SimpleSpriteShader.vertex, SimpleSpriteShader.fragment);
    const simpleSpriteShaderProgramInfo = {
        program: simpleSpriteShaderProgram,
        attribLocations: {
            position: gl.getAttribLocation(simpleSpriteShaderProgram, "aPosition"),
            textureCoord: gl.getAttribLocation(simpleSpriteShaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
            matrix: gl.getUniformLocation(simpleSpriteShaderProgram, "uMatrix"),
            texSampler: gl.getUniformLocation(simpleSpriteShaderProgram, "uSampler"),
            color: gl.getUniformLocation(simpleSpriteShaderProgram, "uColor"),
        },
    };
    const simpleSpriteVao = initBuffers(gl, simpleSpriteShaderProgramInfo);
    const simpleSpriteShader = {
        programInfo: simpleSpriteShaderProgramInfo,
        vao: simpleSpriteVao,
    };
    return {
        simpleSpriteShader,
    };
}
