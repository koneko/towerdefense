import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';

export default class TowerTab extends GuiObject {
    private bounds: PIXI.Rectangle;
    private towerTabSprite: PIXI.NineSliceSprite;

    constructor(bounds: PIXI.Rectangle) {
        super(false);
        this.bounds = bounds;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        this.towerTabSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.FrameTowerTab,
            leftWidth: 500,
            topHeight: 500,
            rightWidth: 500,
            bottomHeight: 500,
            roundPixels: true,
        });
        this.towerTabSprite.x = 0;
        this.towerTabSprite.y = 0;
        this.towerTabSprite.width = this.bounds.width;
        this.towerTabSprite.height = this.bounds.height;

        this.container.addChild(this.towerTabSprite);
    }
}
