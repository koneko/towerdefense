import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import { StatsEvents } from '../Events';
import Gem from '../game/Gem';
import { VisualGemSlot } from './TowerPanel';

export default class GemTab extends GuiObject {
    private bounds: PIXI.Rectangle;
    private gemTabSprite: PIXI.NineSliceSprite;
    private vGems: VisualGemSlot[] = [];

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

        Engine.GameScene.events.on(StatsEvents.GemGivenEvent, () => {
            this.RebuildInventoryVisual();
        });
    }
    public RebuildInventoryVisual() {
        this.vGems.forEach((vGem) => vGem.destroy());
        Engine.GameScene.MissionStats.getInventory().forEach((gem, index) => {
            let vGem = new VisualGemSlot(0, this.container, gem);

            let vGemYValue = 5;
            let vGemXValue = (index % 4) * 64 + 20;
            let vGemYIdx = index;
            while (true) {
                if (vGemYIdx <= 3) break;
                vGemYValue += 66;
                vGemYIdx -= 4;
            }

            vGem.container.x = vGemXValue;
            vGem.container.y = vGemYValue;
            this.vGems.push(vGem);
        });
    }
}
