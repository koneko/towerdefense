import * as PIXI from 'pixi.js';
import GameObject from '../base/GameObject';
import GameScene from '../scenes/GameScene';
import Assets from '../base/Assets';
import { ScrollingFrame } from '../base/ScrollingFrame';

export default class TowerPicker extends GameObject {
    private gameScene: GameScene;
    private scrollingFrame: ScrollingFrame;
    constructor(gameScene: GameScene, bounds?: PIXI.Rectangle) {
        super(bounds);
        this.gameScene = gameScene;
        this.scrollingFrame = new ScrollingFrame(null, this.bounds);
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

        this.scrollingFrame.setBounds(this.bounds);
        this.container.addChild(this.scrollingFrame.container);
        sprite.width = this.bounds.width;
        sprite.height = this.bounds.height;
        this.container.addChild(sprite);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
