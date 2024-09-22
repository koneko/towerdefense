import GameObject from "./GameObject";
import Assets from "./Assets";
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
    this.buttonTexture = Assets.ButtonTexture;
    this.createButton();
  }

  protected triggerBoundsChanged() {
    this.createButton();
  }

  private createButton() {
    this.container.removeChildren();
    // const button = new PIXI.Graphics();
    // button.rect(0, 0, this.bounds.width, this.bounds.height);
    // button.fill(this.color);
    console.log(this.buttonTexture);
    const button = new PIXI.Sprite(this.buttonTexture); // TODO: sliced texture
    button.x = 0;
    button.y = 0;
    button.width = this.bounds.width;
    button.height = this.bounds.height;
    this.container.addChild(button);
    const text = new PIXI.Text({ text: this.caption });
    this.container.addChild(text);
    text.anchor.set(0.5, 0.5);
    text.x = this.bounds.width / 2;
    text.y = this.bounds.height / 2;
    this.container.x = this.bounds.x;
    this.container.y = this.bounds.y;
    this.container.on("click", () => {
      this.events.emit("click");
    });
  }
}
