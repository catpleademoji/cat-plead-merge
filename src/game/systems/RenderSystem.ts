import { Vector2 } from "@/game/types/Vector2";
import { matrix3x3 } from "@/webgl/matrix3x3";
import { QueryResult, System } from "cat-plead-engine";
import { Color, Position, Rotation, Scale, Sprite } from "../components";
import { SpriteMaterial, WarningMaterial, Webgl } from "../resources";
import { ColorRgba } from "../types/Color";
import { Material } from "@/webgl/Material";

export const RenderSystem: System = {
    query: {
        resources: [
            Webgl,
            SpriteMaterial,
            WarningMaterial,
        ],
        all: [
            Position,
            Rotation,
            Scale,
            Sprite,
            Color,
        ],
    },
    run(queryResult: QueryResult) {
        const gl = queryResult.resources.get<WebGL2RenderingContext>(Webgl)!;
        const spriteMaterial = queryResult.resources.get<Material>(SpriteMaterial)!;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        // gl.enable(gl.DEPTH_TEST); // Enable depth testing
        // gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindVertexArray(spriteMaterial.vao);
        gl.useProgram(spriteMaterial.programInfo.program);

        gl.activeTexture(gl.TEXTURE0);

        const canvas = gl.canvas as HTMLCanvasElement;
        const projection = matrix3x3.projection(canvas.clientWidth, canvas.clientHeight);
        const matrix = matrix3x3.identity();

        queryResult.entities.foreach((components) => {
            const position = components[Position] as Vector2;
            const rotation = components[Rotation] as number;
            const scale = components[Scale] as Vector2;
            const texture = components[Sprite] as WebGLTexture;
            const color = components[Color] as ColorRgba;

            matrix3x3.translate(matrix, projection, position.x, position.y);
            matrix3x3.rotate(matrix, matrix, -rotation);
            matrix3x3.scale(matrix, matrix, scale.x, scale.y);

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(spriteMaterial.programInfo.uniformLocations.texSampler, 0);

            gl.uniformMatrix3fv(spriteMaterial.programInfo.uniformLocations.matrix, false, matrix);

            gl.uniform4f(spriteMaterial.programInfo.uniformLocations.color, color.r, color.g, color.b, color.a);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        });

        // const warningMaterial = queryResult.resources.get<Material>(WarningMaterial)!;

        // gl.bindVertexArray(warningMaterial.vao);
        // gl.useProgram(warningMaterial.programInfo.program);

        // gl.uniformMatrix3fv(warningMaterial.programInfo.uniformLocations.matrix!, false, projection);

        // gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
}
