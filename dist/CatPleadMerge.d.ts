import { AssetManifest } from "./types/assets/AssetManifest";
import { Theme } from "./types/Theme";
export type CatPleadMergeProps = {
    id: string;
    assets: AssetManifest;
    theme: Theme;
};
export declare function CatPleadMerge({ id, assets, theme }: CatPleadMergeProps): import("react/jsx-runtime").JSX.Element;
