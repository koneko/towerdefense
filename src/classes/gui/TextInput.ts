import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import Assets from '../Assets';
import GameAssets from '../Assets';

export default class TextInput extends GuiObject {
    private bounds: PIXI.Rectangle;
    private backgroundSprite: PIXI.NineSliceSprite;
    private text: PIXI.Text;
    private maxLength: number;

    constructor(bounds: PIXI.Rectangle, maxLength: number) {
        super();
        this.bounds = bounds;
        this.maxLength = maxLength;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        this.container.width = this.bounds.width;
        this.container.height = this.bounds.height;
        this.backgroundSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame01Texture,
            leftWidth: 20,
            topHeight: 20,
            rightWidth: 20,
            bottomHeight: 20,
        });
        this.backgroundSprite.x = 0;
        this.backgroundSprite.y = 0;
        this.backgroundSprite.width = this.bounds.width;
        this.backgroundSprite.height = this.bounds.height;
        this.container.addChild(this.backgroundSprite);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        this.text = new PIXI.Text({
            text: '',
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 16,
            }),
        });
        this.text.x = 10;
        this.text.y = 10;
        this.container.addChild(this.text);
    }

    private onKeyPress(event: KeyboardEvent) {
        if (event.key == 'Backspace') {
            this.text.text = this.text.text.slice(0, -1);
        } else if (event.key.length == 1 && this.text.text.length < this.maxLength) {
            this.text.text += event.key;
        }
    }
}
