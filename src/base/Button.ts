import GameObject from "./GameObject";
import Assets from "./Assets";
import * as PIXI from "pixi.js";

export default class Button extends GameObject {
  private caption: string;
  private color: PIXI.Color;
  private buttonTexture: PIXI.Texture;

  setCaption(caption: string) {
    this.caption = caption;
    this.drawButton();
  }

  constructor(caption: string, bounds: PIXI.Rectangle, color: PIXI.Color) {
    super(bounds);
    this.caption = caption;
    this.color = color;
    this.container.interactive = true;
    this.buttonTexture = Assets.ButtonTexture;
    this.drawButton();
  }

  protected triggerBoundsChanged() {
    this.drawButton();
  }

  private drawButton() {
    console.log(
      `Drawing button ${this.caption} at ${JSON.stringify(this.bounds)}`
    );
    this.container.removeChildren();
    // const button = new PIXI.Graphics();
    // button.rect(0, 0, this.bounds.width, this.bounds.height);
    // button.fill(this.color);
    //console.log(this.buttonTexture);
    const button = new PIXI.NineSliceSprite({
      texture: this.buttonTexture,
      leftWidth: 100,
      topHeight: 100,
      rightWidth: 100,
      bottomHeight: 100,
    });
    button.x = 0;
    button.y = 0;
    button.width = this.bounds.width;
    button.height = this.bounds.height;
    this.container.addChild(button);
    const text = new PIXI.Text({
      text: this.caption,
      style: new PIXI.TextStyle({
        fill: 0xffffff,
        fontSize: 24,
      }),
    });
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
