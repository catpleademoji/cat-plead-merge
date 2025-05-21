declare function initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string): WebGLProgram;
declare function loadShader(gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader;
declare function loadTexture(gl: WebGL2RenderingContext, image: TexImageSource): WebGLTexture;
export { initShaderProgram, loadShader, loadTexture as createTexture, };
