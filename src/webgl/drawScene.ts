import { Entity } from "@/types/Entity";
import { ProgramInfo } from "./ProgramInfo";
import { matrix3x3 } from "./matrix3x3";

function drawScene(gl: WebGL2RenderingContext, programInfo: ProgramInfo, vao: WebGLVertexArrayObject, entities: Entity[]) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    // gl.enable(gl.DEPTH_TEST); // Enable depth testing
    // gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindVertexArray(vao);

    gl.useProgram(programInfo.program);

    gl.activeTexture(gl.TEXTURE0);

    const canvas = gl.canvas as HTMLCanvasElement;
    const projection = matrix3x3.projection(canvas.clientWidth, canvas.clientHeight);
    const matrix = matrix3x3.identity();

    for (let i = 0; i < entities.length; i++) {
        const position = entities[i].position;
        matrix3x3.translate(matrix, projection, position.x, position.y);
        matrix3x3.rotate(matrix, matrix, 0);
        matrix3x3.scale(matrix, matrix, 150 / 4, 150 / 4);

        gl.bindTexture(gl.TEXTURE_2D, entities[i].cat.texture);
        gl.uniform1i(programInfo.uniformLocations.texSampler, 0);

        gl.uniformMatrix3fv(programInfo.uniformLocations.matrix, false, matrix);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

export { drawScene };
