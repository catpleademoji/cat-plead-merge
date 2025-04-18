import { AssetManifest } from "@/assets/AssetManifest";
import { loadCats, loadParticles } from "@/assets/loadAssets";
import { initWebgl } from "@/webgl/initWebgl";
import { Engine } from "cat-plead-engine";
import { Webgl, CatAssets, ParticleAssets, SpriteMaterial, WarningMaterial } from ".";

export function addWebglResources(engine: Engine, gl: WebGL2RenderingContext, assets: AssetManifest) {
    engine.addResource(Webgl, gl);

    const materials = initWebgl(gl);

    loadCats(assets.cats, gl).then(cats => {
        engine.addResource(CatAssets, cats);
    });

    loadParticles(assets.particles, gl).then(particles => {
        engine.addResource(ParticleAssets, particles);
    });

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    engine.addResource(SpriteMaterial, materials.simpleSpriteShader);
    // engine.addResource(WarningMaterial, materials.warningShader);
}
