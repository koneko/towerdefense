import * as PIXI from "pixi.js";
import GameObject from "../base/GameObject";
export default abstract class Scene extends GameObject {
  constructor(bounds: PIXI.Rectangle) {
    super(bounds);
    this.createScene();
  }
  protected triggerBoundsChanged() {
    this.createScene();
  }
  protected abstract createScene();

  public update() {}
}
