import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import { VisualGemSlot } from './TowerPanel';

export default class Gemsmith extends GuiObject {
    private bounds: PIXI.Rectangle;
    public sellVGem: VisualGemSlot;
    public upgradeVGem: VisualGemSlot;

    constructor(bounds: PIXI.Rectangle) {
        super(false);
        this.bounds = bounds;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        let background = new PIXI.Sprite({
            x: 0,
            y: 0,
            width: this.bounds.width,
            height: this.bounds.height,
            texture: GameAssets.BannerGemsmith,
        });
        this.container.addChild(background);
        let sellLabel = new PIXI.Text({
            x: 40,
            y: this.bounds.height / 6.5,
            text: 'Sell gem',
            style: new PIXI.TextStyle({
                fill: 0xffdb00, // orange color
                fontSize: 18,
                stroke: {
                    color: 0x000000,
                    width: 2,
                },
            }),
        });
        this.container.addChild(sellLabel);
        let upgradeLabel = new PIXI.Text({
            x: 155,
            y: this.bounds.height / 6.5,
            text: 'Upgrade gem',
            style: new PIXI.TextStyle({
                fill: 0x2df937,
                fontSize: 18,
                stroke: {
                    color: 0x000000,
                    width: 2,
                },
            }),
        });
        this.container.addChild(upgradeLabel);
        this.sellVGem = new VisualGemSlot(0, this.container, null, 'SELL');
        this.sellVGem.container.x = 45;
        this.sellVGem.container.y = this.bounds.height / 4;
        this.upgradeVGem = new VisualGemSlot(0, this.container, null, 'UPGRADE');
        this.upgradeVGem.container.x = 180;
        this.upgradeVGem.container.y = this.bounds.height / 4;
    }
}
