import GameObject from "./GameObject";
import * as PIXI from "pixi.js";

export default class Button extends GameObject {
  private caption: string;
  private color: PIXI.Color;
  private buttonTexture: PIXI.Texture;

  setCaption(caption: string) {
    this.caption = caption;
    this.createButton();
  }

  constructor(caption: string, bounds: PIXI.Rectangle, color: PIXI.Color) {
    super(bounds);
    this.caption = caption;
    this.color = color;
    this.container.interactive = true;
    this.buttonTexture = PIXI.Texture.from("/assets/gui/button02.png");
    this.createButton();
  }

  protected triggerBoundsChanged() {
    this.createButton();
  }

  private createButton() {
    this.container.removeChildren();
    const button = new PIXI.Graphics();
    button.rect(0, 0, this.bounds.width, this.bounds.height);
    button.fill(this.color);
    this.container.addChild(button);
    const text = new PIXI.Text({ text: this.caption });
    this.container.addChild(text);
    text.anchor.set(0.5, 0.5);
    text.x = this.bounds.width / 2;
    text.y = this.bounds.height / 2;
    this._container.x = this.bounds.x;
    this._container.y = this.bounds.y;
    this._container.on("click", () => {
      this.events.emit("click");
    });
  }
}
