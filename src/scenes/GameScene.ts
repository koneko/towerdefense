import Button from "../base/Button";
import Scene from "./Base";
import * as PIXI from "pixi.js";

export default class GameScene extends Scene {
  private grid;
  // DO NOT CHANGE NAME, WILL BREAK Game.ts
  constructor(bounds: PIXI.Rectangle) {
    super(bounds);
  }

  public update() {}

  protected createScene() {
    console.log("Creating Game Scene ", this.bounds);
    this.container.removeChildren();
    this.container.x = this.bounds.x;
    this.container.y = this.bounds.y;
  }
}
