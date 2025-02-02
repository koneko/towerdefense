import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import TowerTab from './TowerTab';
import GemTab from './GemTab';

export default class Sidebar extends GuiObject {
    public towerTab: TowerTab;
    public gemTab: GemTab;
    private bounds: PIXI.Rectangle;
    private sidebarSprite: PIXI.NineSliceSprite;

    constructor(bounds: PIXI.Rectangle) {
        super(false);
        this.bounds = bounds;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        this.sidebarSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame01Texture,
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

        const towerTabRect = new PIXI.Rectangle(60, 20, this.bounds.width - 65, 150);
        this.towerTab = new TowerTab(towerTabRect);
        this.container.addChild(this.towerTab.container);

        const gemTabRect = new PIXI.Rectangle(60, 180, this.bounds.width - 65, this.bounds.height - 280);
        this.gemTab = new GemTab(gemTabRect);
        this.container.addChild(this.gemTab.container);
    }
}
