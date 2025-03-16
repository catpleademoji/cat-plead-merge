type Attributes = "vertexPosition" | "textureCoord";
type Uniforms = "projectionMatrix" | "modelViewMatrix" | "uSampler";
type Buffers = "position" | "textureCoord" | "indices";

export type ProgramInfo = {
  program: WebGLProgram;
  attribLocations: Record<Attributes, number>;
  uniformLocations: Record<Uniforms, WebGLUniformLocation | null>;
};

export type ProgramBuffers = {
  [key in Buffers]: WebGLBuffer;
}