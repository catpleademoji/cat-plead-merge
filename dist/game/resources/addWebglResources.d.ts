import { AssetManifest } from "@/types/assets/AssetManifest";
import { Engine } from "cat-plead-engine";
export declare function addWebglResources(engine: Engine, gl: WebGL2RenderingContext, assets: AssetManifest): Promise<void>;
