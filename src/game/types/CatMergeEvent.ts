import { Vector2 } from "./Vector2";

export type CatMergeEvent = {
  cat: {
    catIndex: number;
    score: number;
    position: Vector2,
    colliderRadius: number;
  };
};
