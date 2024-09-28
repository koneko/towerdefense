import Button from "../base/Button";
import SceneBase from "./SceneBase";
import * as PIXI from "pixi.js";

export default class GameScene extends SceneBase {
  private _ticker: PIXI.Ticker;

  constructor(bounds: PIXI.Rectangle) {
    super(bounds);
    this._ticker = new PIXI.Ticker();
    this._ticker = new PIXI.Ticker();
    this._ticker.maxFPS = 60;
    this._ticker.minFPS = 30;
    this._ticker.add(this.update);
    this._ticker.start();
    this.draw();
  }

  public destroy() {
    super.destroy();
    this._ticker.stop();
    this._ticker.destroy();
  }

  public update() {}

  protected draw() {
    console.log("Creating Game Scene ", this.bounds);
    this.container.removeChildren();
    this.container.x = this.bounds.x;
    this.container.y = this.bounds.y;
  }
}
