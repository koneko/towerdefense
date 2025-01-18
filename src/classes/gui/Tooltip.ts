import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';

// ! TODO NEXT!

export default class Tooltip extends GuiObject {
    private bounds: PIXI.Rectangle;
    private tooltipSprite: PIXI.NineSliceSprite;

    public titleText: PIXI.Text;
    public costText: PIXI.Text;
    public previewSprite: PIXI.Sprite;
    private gemAmountSprite: PIXI.Sprite;

    constructor(bounds: PIXI.Rectangle) {
        super(false);
        this.bounds = bounds;
        this.container.x = -500;
        this.container.y = -500;
        this.tooltipSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame04Texture,
            leftWidth: 200,
            topHeight: 200,
            rightWidth: 200,
            bottomHeight: 200,
        });
        this.tooltipSprite.width = this.bounds.width;
        this.tooltipSprite.height = this.bounds.height;
        this.container.addChild(this.tooltipSprite);

        this.titleText = new PIXI.Text({
            x: 87,
            y: 34,
            text: 'Something went wrong if you see this.',
            style: {
                fill: 0xffffff,
                dropShadow: true,
            },
        });
        this.titleText.anchor.set(0, 0.5);
        this.container.addChild(this.titleText);

        this.previewSprite = new PIXI.Sprite({
            x: 27,
            y: 30,
            width: 50,
            height: 50,
        });

        this.container.addChild(this.previewSprite);
        let frameSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame02Texture,
            leftWidth: 150,
            topHeight: 150,
            rightWidth: 150,
            bottomHeight: 150,
            roundPixels: true,
            height: 64,
            width: 64,
            x: 20,
            y: 20,
        });
        this.container.addChild(frameSprite);

        this.costText = new PIXI.Text({
            x: 113,
            y: 40,
            text: 'Something went wrong if you see this.',
            style: {
                fill: 'gold',
                fontWeight: 'bold',
                dropShadow: true,
            },
        });
        this.container.addChild(this.costText);
        const goldSprite = new PIXI.Sprite({
            texture: GameAssets.GoldTexture,
            x: 82,
            y: 40,
            width: 36,
            height: 34,
        });

        this.container.addChild(goldSprite);

        this.gemAmountSprite = new PIXI.Sprite({
            texture: GameAssets.GemAmountIcons[0],
            x: 300,
            y: 20,
            width: 64,
            height: 64,
        });

        this.container.addChild(this.gemAmountSprite);

        Engine.GameMaster.currentScene.stage.addChild(this.container);
    }
    public SetContent(title, spriteTexture, damage: number, cost: number, gemSlotsAmount: number) {
        this.titleText.text = title;
        this.previewSprite.texture = spriteTexture;
        this.gemAmountSprite.texture = GameAssets.GemAmountIcons[gemSlotsAmount];
        this.costText.text = cost;
    }
    public Show(x, y) {
        this.container.alpha = 1;
        if (x + this.container.width > Engine.app.canvas.width) {
            this.container.x = x - this.container.width;
        } else {
            this.container.x = x;
        }
        this.container.y = y;
    }
    public Hide() {
        this.container.alpha = 0;
        this.container.x = -500;
        this.container.y = -500;
    }
}
