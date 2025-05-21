import { matrix3x3 } from "../../../webgl/matrix3x3";
import { Color, Position, Rotation, Scale, Sprite } from "../../../game/components";
import { SpriteMaterial, Webgl } from "../../../game/resources";
export const RenderSystem = {
    query: {
        resources: [
            Webgl,
            SpriteMaterial,
        ],
        all: [
            Position,
            Rotation,
            Scale,
            Sprite,
            Color,
        ],
    },
    run(queryResult) {
        const gl = queryResult.resources.get(Webgl);
        const spriteMaterial = queryResult.resources.get(SpriteMaterial);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindVertexArray(spriteMaterial.vao);
        gl.useProgram(spriteMaterial.programInfo.program);
        gl.activeTexture(gl.TEXTURE0);
        const canvas = gl.canvas;
        const projection = matrix3x3.projection(canvas.clientWidth, canvas.clientHeight);
        const matrix = matrix3x3.identity();
        queryResult.entities.foreach((components) => {
            const position = components[Position];
            const rotation = components[Rotation];
            const scale = components[Scale];
            const texture = components[Sprite];
            const color = components[Color];
            matrix3x3.translate(matrix, projection, position.x, position.y);
            matrix3x3.rotate(matrix, matrix, -rotation);
            matrix3x3.scale(matrix, matrix, scale.x, scale.y);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(spriteMaterial.programInfo.uniformLocations.texSampler, 0);
            gl.uniformMatrix3fv(spriteMaterial.programInfo.uniformLocations.matrix, false, matrix);
            gl.uniform4f(spriteMaterial.programInfo.uniformLocations.color, color.r, color.g, color.b, color.a);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        });
    },
};
