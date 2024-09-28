import * as PIXI from "pixi.js";
import GameObject from "../base/GameObject";
export default abstract class SceneBase extends GameObject {
  constructor(bounds: PIXI.Rectangle) {
    super(bounds);
  }
}
