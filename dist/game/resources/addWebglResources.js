import { Webgl, CatAssets, ParticleAssets, SpriteMaterial, WarningSprite } from ".";
import { loadCats, loadParticles } from "../../types/assets/loadAssets";
import { initWebgl } from "../../webgl/initWebgl";
export async function addWebglResources(engine, gl, assets) {
    engine.addResource(Webgl, gl);
    const materials = initWebgl(gl);
    const cats = await loadCats(assets.cats, gl);
    engine.addResource(CatAssets, cats);
    const particles = await loadParticles(assets.particles, gl);
    engine.addResource(ParticleAssets, particles);
    const warningSprite = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, warningSprite);
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
    engine.addResource(WarningSprite, warningSprite);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    engine.addResource(SpriteMaterial, materials.simpleSpriteShader);
}
