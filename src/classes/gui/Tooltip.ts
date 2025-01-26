import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import Gem from '../game/Gem';

// ! TODO NEXT!

export default class Tooltip extends GuiObject {
    private bounds: PIXI.Rectangle;
    private tooltipSprite: PIXI.NineSliceSprite;

    private titleText: PIXI.Text;
    private costText: PIXI.Text;
    private damageText: PIXI.Text;
    private gemAmount: PIXI.Text;
    private gemAmountSprite: PIXI.Sprite;
    private title: PIXI.Sprite;
    private costSprite: PIXI.Sprite;
    private damageSprite: PIXI.Sprite;
    private gemDescriptionText: PIXI.Text;

    constructor(bounds: PIXI.Rectangle) {
        super(false);
        this.bounds = bounds;
        this.container.x = -500;
        this.container.y = -500;
        this.container.zIndex = 150;
        this.tooltipSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame04Texture,
            leftWidth: 200,
            topHeight: 200,
            rightWidth: 200,
            bottomHeight: 200,
        });
        this.tooltipSprite.width = this.bounds.width;
        this.tooltipSprite.height = this.bounds.height;

        this.titleText = new PIXI.Text({
            x: this.tooltipSprite.width / 2,
            y: -20,
            zIndex: 5,
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                stroke: {
                    color: 0x000000,
                    width: 2,
                },
            }),
        });
        this.titleText.anchor.set(0.5, 0);
        this.title = new PIXI.Sprite({
            x: this.tooltipSprite.width / 2,
            y: -20,
            width: 250,
            height: 40,
            texture: GameAssets.TitleTexture,
        });
        this.title.anchor.set(0.5, 0);

        this.costSprite = new PIXI.Sprite({
            texture: GameAssets.GoldTexture,
            x: 10,
            y: 20,
            width: 56,
            height: 50,
        });
        this.costText = new PIXI.Text({
            x: 54,
            y: 26,
            zIndex: 5,
            text: 'Something went wrong if you see this.',
            style: {
                fill: 'gold',
                fontWeight: 'bold',
                stroke: {
                    color: 0x000000,
                    width: 5,
                },
            },
        });

        this.damageText = new PIXI.Text({
            x: 54,
            y: 65,
            zIndex: 5,
            text: 'Something went wrong if you see this.',
            style: {
                fill: 'red',
                fontWeight: 'bold',
                stroke: {
                    color: 0x000000,
                    width: 5,
                },
            },
        });
        this.damageSprite = new PIXI.Sprite({
            texture: GameAssets.SwordsTexture,
            x: 22,
            y: 70,
            width: 32,
            height: 32,
        });

        this.gemAmountSprite = new PIXI.Sprite({
            texture: GameAssets.GemAmountIcons[0],
            x: 22,
            y: 110,
            width: 32,
            height: 32,
        });
        this.gemAmount = new PIXI.Text({
            x: 54,
            y: 105,
            zIndex: 5,
            text: 'Something went wrong if you see this.',
            style: {
                fill: 'white',
                fontWeight: 'bold',
                stroke: {
                    color: 0x000000,
                    width: 5,
                },
            },
        });
        this.gemDescriptionText = new PIXI.Text({
            x: 10,
            y: 20,
            text: '',
            style: {
                fontSize: 18,
                wordWrap: true,
                wordWrapWidth: this.tooltipSprite.width - 30,
                fill: 'white',
                fontWeight: 'bold',
                fontStyle: 'italic',
                stroke: {
                    color: 0x000000,
                    width: 5,
                },
            },
        });

        this.container.addChild(this.tooltipSprite);
        this.container.addChild(this.title);
        this.container.addChild(this.costSprite);
        this.container.addChild(this.damageSprite);
        this.container.addChild(this.gemAmountSprite);
        this.container.addChild(this.costText);
        this.container.addChild(this.titleText);
        this.container.addChild(this.damageText);
        this.container.addChild(this.gemAmount);

        this.container.addChild(this.gemDescriptionText);
        Engine.app.stage.addChildAt(this.container, 0);
    }
    public SetContentTower(title, damage: number, cost: number, gemSlotsAmount: number) {
        this.costSprite.alpha = 1;
        this.damageSprite.alpha = 1;
        this.gemAmountSprite.alpha = 1;
        this.costText.alpha = 1;
        this.damageText.alpha = 1;
        this.gemAmount.alpha = 1;
        this.gemDescriptionText.alpha = 0;

        this.titleText.text = title;
        this.gemAmount.text = `Has ${gemSlotsAmount} Gem slots.`;
        this.gemAmountSprite.texture = GameAssets.GemAmountIcons[gemSlotsAmount];
        this.costText.text = `Costs ${cost} gold.`;
        this.damageText.text = `Deals ${damage} base damage.`;
    }
    public SetContentGem(gem: Gem) {
        this.costSprite.alpha = 0;
        this.damageSprite.alpha = 0;
        this.gemAmountSprite.alpha = 0;
        this.costText.alpha = 0;
        this.damageText.alpha = 0;
        this.gemAmount.alpha = 0;
        this.gemDescriptionText.alpha = 1;

        this.titleText.text = `Lv. ${gem.level} ` + gem.gemDefinition.name;
        this.gemDescriptionText.text = gem.gemDefinition.description;
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
