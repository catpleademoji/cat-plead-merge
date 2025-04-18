type Attributes = "position" | "textureCoord";
type Uniforms = "matrix" | "texSampler" | "color";

export type ProgramInfo = {
  program: WebGLProgram;
  attribLocations: Record<Attributes, number>;
  uniformLocations: Record<Uniforms, WebGLUniformLocation | null>;
};
