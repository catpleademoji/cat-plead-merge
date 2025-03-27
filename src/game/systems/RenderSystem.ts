import { matrix3x3 } from "@/webgl/matrix3x3";
import { ProgramInfo } from "@/webgl/ProgramInfo";
import { QueryResult, System } from "cat-plead-engine";

export const RenderSystem: System = {
    query: {
        resources: [
            "webgl",
            "material",
        ],
        all: [
            "position",
            "sprite",
        ]
    },
    run(queryResult: QueryResult) {
        const gl = queryResult.resources.get<WebGL2RenderingContext>("webgl")!;
        const material = queryResult.resources.get<{ programInfo: ProgramInfo, vao: WebGLVertexArrayObject }>("material")!;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        // gl.enable(gl.DEPTH_TEST); // Enable depth testing
        // gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindVertexArray(material.vao);

        gl.useProgram(material.programInfo.program);

        gl.activeTexture(gl.TEXTURE0);

        const canvas = gl.canvas as HTMLCanvasElement;
        const projection = matrix3x3.projection(canvas.clientWidth, canvas.clientHeight);
        const matrix = matrix3x3.identity();

        queryResult.entities.foreach((components) => {
            const position = components["position"] as { x: number, y: number };
            const texture = components["sprite"] as WebGLTexture;
            matrix3x3.translate(matrix, projection, position.x, position.y);
            matrix3x3.rotate(matrix, matrix, 0);
            matrix3x3.scale(matrix, matrix, 150 / 4, 150 / 4);

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(material.programInfo.uniformLocations.texSampler, 0);

            gl.uniformMatrix3fv(material.programInfo.uniformLocations.matrix, false, matrix);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        });
    },
}
