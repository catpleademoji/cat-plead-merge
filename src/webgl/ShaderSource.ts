export const Vertex = `
    attribute vec2 aPosition;
    attribute vec2 aTextureCoord;

    uniform mat3 uMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
        gl_Position = vec4((uMatrix * vec3(aPosition, 1)).xy, 0, 1);
        vTextureCoord = aTextureCoord;
    }
`;

export const Fragment = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`;
