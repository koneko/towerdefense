import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';

export default class GemTab extends GuiObject {
    private bounds: PIXI.Rectangle;
    private gemTabSprite: PIXI.NineSliceSprite;

    constructor(bounds: PIXI.Rectangle) {
        super(false);
        this.bounds = bounds;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        this.gemTabSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.FrameTowerTab,
            leftWidth: 1000,
            topHeight: 1000,
            rightWidth: 1000,
            bottomHeight: 1000,
        });
        this.gemTabSprite.x = 0;
        this.gemTabSprite.y = 0;
        this.gemTabSprite.width = this.bounds.width;
        this.gemTabSprite.height = this.bounds.height;

        this.container.addChild(this.gemTabSprite);
    }
}
