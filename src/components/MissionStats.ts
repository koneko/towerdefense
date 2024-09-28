import GameObject from "../base/GameObject";
import * as PIXI from "pixi.js";

export default class MissionStats extends GameObject {
  constructor(bounds: PIXI.Rectangle) {
    super(bounds);
    this.draw();
  }

  protected draw() {}
}
