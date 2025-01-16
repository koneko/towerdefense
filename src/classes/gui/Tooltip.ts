import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';

// ! TODO NEXT!

export default class Tooltip extends GuiObject {
    private bounds: PIXI.Rectangle;
    private tooltipSprite: PIXI.NineSliceSprite;

    constructor(bounds: PIXI.Rectangle) {
        super(false);
        this.bounds = bounds;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        this.tooltipSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.FrameTowerTab,
            leftWidth: 1000,
            topHeight: 1000,
            rightWidth: 1000,
            bottomHeight: 1000,
        });
        this.tooltipSprite.x = 0;
        this.tooltipSprite.y = 0;
        this.tooltipSprite.width = this.bounds.width;
        this.tooltipSprite.height = this.bounds.height;

        this.container.addChild(this.tooltipSprite);
    }
}
