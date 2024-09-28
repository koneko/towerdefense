import Button from "../base/Button";
import SceneBase from "./SceneBase";
import * as PIXI from "pixi.js";

export default class SettingsMenu extends SceneBase {
  private _newGameButton: Button;
  private _settingsButton: Button;

  constructor(bounds: PIXI.Rectangle) {
    super(bounds);
    this.draw();
  }

  protected draw() {
    this.container.removeChildren();
    const g = new PIXI.Graphics();
    g.rect(0, 0, this.bounds.width, this.bounds.height);
    g.fill(0x000000);
    this.container.addChild(g);
    this._newGameButton = new Button(
      "New Game",
      new PIXI.Rectangle(
        100,
        this.bounds.height / 2 - 80,
        this.bounds.width - 200,
        60
      ),
      new PIXI.Color("blue")
    );
    this._newGameButton.events.on("click", () => {
      this.events.emit("newGame");
    });
    this.container.addChild(this._newGameButton.container);

    this._settingsButton = new Button(
      "Settings",
      new PIXI.Rectangle(
        100,
        this.bounds.height / 2 + 20,
        this.bounds.width - 200,
        60
      ),
      new PIXI.Color("gray")
    );
    this._settingsButton.events.on("click", () => {
      this.events.emit("settings");
    });
    this.container.addChild(this._settingsButton.container);
    this.container.x = this.bounds.x;
    this.container.y = this.bounds.y;
  }
}
