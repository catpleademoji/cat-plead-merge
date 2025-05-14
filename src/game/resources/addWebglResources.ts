import { AssetManifest } from "@/assets/AssetManifest";
import { loadCats, loadParticles } from "@/assets/loadAssets";
import { initWebgl } from "@/webgl/initWebgl";
import { Engine } from "cat-plead-engine";
import { Webgl, CatAssets, ParticleAssets, SpriteMaterial, WarningSprite } from ".";

export function addWebglResources(engine: Engine, gl: WebGL2RenderingContext, assets: AssetManifest) {
    engine.addResource(Webgl, gl);

    const materials = initWebgl(gl);

    loadCats(assets.cats, gl).then(cats => {
        engine.addResource(CatAssets, cats);
    });

    loadParticles(assets.particles, gl).then(particles => {
        engine.addResource(ParticleAssets, particles);
    });

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
