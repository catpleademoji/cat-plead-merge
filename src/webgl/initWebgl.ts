import { Material } from "@/webgl/Material";
import { initBuffers } from "./initBuffers";
import { ProgramInfo } from "./ProgramInfo";
import { VertexShaderSource, FragmentShaderSource } from "./ShaderSource";
import { initShaderProgram } from "./shaderUtils";

export function initWebgl(gl: WebGL2RenderingContext): Material {
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
    return { programInfo, vao };
}
