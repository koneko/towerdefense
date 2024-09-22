import Button from "../base/Button";
import Scene from "./Base";
import * as PIXI from "pixi.js";

export default class MissionMenuSelect extends Scene {
  private _buttons: Button[] = [];

  constructor(bounds: PIXI.Rectangle) {
    super(bounds);
  }

  protected createScene() {
    this.container.removeChildren();
    this._buttons = [];
    const g = new PIXI.Graphics();
    g.rect(0, 0, this.bounds.width, this.bounds.height);
    g.fill(0x000000);
    this.container.addChild(g);
    this.addMission("Mission 1");
    this.addMission("Mission 2");
    this.addMission("Mission 3");
    this.addMission("Mission 4");
    this.addButton("Back", () => {
      this.events.emit("back");
    });
    this.container.x = this.bounds.x;
    this.container.y = this.bounds.y;
  }

  private addMission(mission: string) {
    this.addButton(mission, () => {
      this.events.emit("mission", mission);
    });
  }

  private addButton(caption: string, onClick: () => void) {
    const yOffset = this._buttons.length * 80 + 100;
    const button = new Button(
      caption,
      new PIXI.Rectangle(100, yOffset, this.bounds.width - 200, 60),
      new PIXI.Color("white")
    );
    button.events.on("click", onClick);
    this._buttons.push(button);
    this.container.addChild(button.container);
  }
}
