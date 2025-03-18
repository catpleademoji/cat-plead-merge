type Attributes = "position" | "textureCoord";
type Uniforms = "matrix" | "texSampler";
type Buffers = "position" | "textureCoord" | "indices";

export type ProgramInfo = {
  program: WebGLProgram;
  attribLocations: Record<Attributes, number>;
  uniformLocations: Record<Uniforms, WebGLUniformLocation | null>;
};

export type ProgramBuffers = {
  [key in Buffers]: WebGLBuffer;
}