import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import Assets from '../Assets';

export enum ButtonTexture {
    Button01 = 0,
    Button02 = 1,
}

export default class Button extends GuiObject {
    private caption: string;
    private bounds: PIXI.Rectangle;
    private buttonTexture: PIXI.Texture;

    private buttonSprite: PIXI.NineSliceSprite;
    private buttonText: PIXI.Text;

    setCaption(caption: string) {
        this.caption = caption;
        this.buttonText.text = caption;
    }

    constructor(bounds: PIXI.Rectangle, caption: string, buttonTexture: ButtonTexture, enabled: boolean = true) {
        super(true);
        if (buttonTexture == ButtonTexture.Button01) this.buttonTexture = Assets.Button01Texture;
        if (buttonTexture == ButtonTexture.Button02) this.buttonTexture = Assets.Button02Texture;
        this.caption = caption;
        this.enabled = enabled;
        this.bounds = bounds;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        this.container.width = this.bounds.width;
        this.container.height = this.bounds.height;
        this.buttonSprite = new PIXI.NineSliceSprite({
            texture: this.buttonTexture,
            leftWidth: 100,
            topHeight: 100,
            rightWidth: 100,
            bottomHeight: 100,
        });
        this.buttonSprite.x = 0;
        this.buttonSprite.y = 0;
        this.buttonSprite.width = this.bounds.width;
        this.buttonSprite.height = this.bounds.height;
        this.container.addChild(this.buttonSprite);
        this.buttonText = new PIXI.Text({
            text: this.caption,
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 24,
            }),
        });
        this.container.addChild(this.buttonText);
        this.buttonText.anchor.set(0.5, 0.5);
        this.buttonText.x = this.bounds.width / 2;
        this.buttonText.y = this.bounds.height / 2;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
