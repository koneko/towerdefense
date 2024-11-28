import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import Assets from '../Assets';

export default class Sidebar extends GuiObject {
    private bounds: PIXI.Rectangle;
    private sidebarSprite: PIXI.NineSliceSprite;

    constructor(bounds: PIXI.Rectangle) {
        super(false);
        this.bounds = bounds;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        this.container.width = this.bounds.width;
        this.container.height = this.bounds.height;
        this.sidebarSprite = new PIXI.NineSliceSprite({
            texture: Assets.Frame01Texture,
            leftWidth: 100,
            topHeight: 100,
            rightWidth: 100,
            bottomHeight: 100,
        });
        this.sidebarSprite.x = 40;
        this.sidebarSprite.y = -40;
        this.sidebarSprite.width = this.bounds.width + 40;
        this.sidebarSprite.height = this.bounds.height + 80;
        this.container.addChild(this.sidebarSprite);
    }
}
