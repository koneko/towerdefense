import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import Assets from '../Assets';
import GameAssets from '../Assets';
import KeyboardManager from '../game/KeyboardManager';

export default class TextInput extends GuiObject {
    private backgroundSprite: PIXI.NineSliceSprite;
    private text: PIXI.Text;
    private maxLength: number;
    private keyboardManagerUnsubscribe: () => void;

    public getText(): string {
        return this.text.text;
    }

    constructor(width: number, maxLength: number) {
        super();
        this.maxLength = maxLength;
        this.backgroundSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame01Texture,
            leftWidth: 20,
            topHeight: 20,
            rightWidth: 20,
            bottomHeight: 20,
        });
        this.backgroundSprite.x = 0;
        this.backgroundSprite.y = 0;
        this.backgroundSprite.width = width;
        this.backgroundSprite.height = 60;
        this.container.addChild(this.backgroundSprite);
        this.text = new PIXI.Text({
            text: '',
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 24,
            }),
        });
        this.text.x = 20;
        this.text.y = 20;
        this.container.addChild(this.text);
        this.keyboardManagerUnsubscribe = KeyboardManager.onKeyPressed(this.onKeyPress.bind(this));
    }

    private onKeyPress(event: KeyboardEvent) {
        if (event.key == 'Backspace') {
            this.text.text = this.text.text.slice(0, -1);
        } else if (event.key.length == 1 && this.text.text.length < this.maxLength) {
            this.text.text += event.key;
        }
    }
}
