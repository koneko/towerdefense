import * as PIXI from 'pixi.js';
import GameObject from '../base/GameObject';
import Assets from '../base/Assets';
import { ScrollingFrame, ScrollingFrameChild } from '../base/ScrollingFrame';
import { TowerDefinition, TowerStatsDefinition, TowerType } from '../base/Definitions';

export default class TowerPicker extends GameObject {
    private scrollingFrame: ScrollingFrame;
    constructor(bounds?: PIXI.Rectangle) {
        super(bounds);
        const towers = Assets.Towers.map((t) => new UITower(t));
        this.scrollingFrame = new ScrollingFrame(towers, this.bounds);
    }
    protected draw() {
        this.container.removeChildren();
        const sprite = new PIXI.NineSliceSprite({
            texture: Assets.Frame2Texture,
            leftWidth: 100,
            topHeight: 100,
            rightWidth: 100,
            bottomHeight: 100,
        });

        sprite.width = this.bounds.width;
        sprite.height = this.bounds.height;
        this.container.addChild(sprite);

        this.scrollingFrame.setBounds(20, 20, this.bounds.width - 20 * 2, this.bounds.height - 20 * 2);
        this.container.addChild(this.scrollingFrame.container);

        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}

export class UITower extends ScrollingFrameChild {
    private definition: TowerDefinition;

    constructor(definition: TowerDefinition, bounds?: PIXI.Rectangle) {
        super(bounds);
        this.definition = definition;
    }

    getAspectRatio(): number {
        return 0.8;
    }

    public override destroy() {
        super.destroy();
        this.draw = null;
        this.container.removeChildren();
    }
    protected draw() {
        this.container.removeChildren();
        const sprite = new PIXI.Sprite(Assets.SwordTexture);
        sprite.x = 0;
        sprite.y = 0;
        sprite.width = this.bounds.width;
        sprite.height = this.bounds.height;
        this.container.addChild(sprite);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
