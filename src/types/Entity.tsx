import { Cat } from "./Cat";
import { Vector2 } from "./Vector2";

export type Entity = {
  position: Vector2;
  direction: Vector2;
  speed: number;
  cat: Cat;
};
