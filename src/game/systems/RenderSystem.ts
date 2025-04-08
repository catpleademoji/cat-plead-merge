import { Vector2 } from "@/game/types/Vector2";
import { matrix3x3 } from "@/webgl/matrix3x3";
import { ProgramInfo } from "@/webgl/ProgramInfo";
import { QueryResult, System } from "cat-plead-engine";
import { Position, Rotation, Scale, Sprite } from "../components";
import { Material, Webgl } from "../resources";

export const RenderSystem: System = {
    query: {
        resources: [
            Webgl,
            Material,
        ],
        all: [
            Position,
            Rotation,
            Scale,
            Sprite,
        ]
    },
    run(queryResult: QueryResult) {
        const gl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;
        const material = queryResult.resources.get<{ programInfo: ProgramInfo, vao: WebGLVertexArrayObject }>(Material)!;
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
            const position = components[Position] as Vector2;
            const rotation = components[Rotation] as number;
            const scale = components[Scale] as Vector2;
            const texture = components[Sprite] as WebGLTexture;

            matrix3x3.translate(matrix, projection, position.x, position.y);
            matrix3x3.rotate(matrix, matrix, rotation);
            matrix3x3.scale(matrix, matrix, scale.x, scale.y);

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(material.programInfo.uniformLocations.texSampler, 0);

            gl.uniformMatrix3fv(material.programInfo.uniformLocations.matrix, false, matrix);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        });
    },
}
