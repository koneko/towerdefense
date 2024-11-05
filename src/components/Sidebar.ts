import * as PIXI from 'pixi.js';
import GameObject from '../base/GameObject';
import GameScene from '../scenes/GameScene';
import Assets from '../base/Assets';

export default class Sidebar extends GameObject {
    private gameScene: GameScene;
    constructor(gameScene: GameScene, bounds?: PIXI.Rectangle) {
        super(bounds);
        this.gameScene = gameScene;
    }
    protected draw() {
        this.container.removeChildren();
        const sprite = new PIXI.NineSliceSprite({
            texture: Assets.SidebarTexture,
            leftWidth: 100,
            topHeight: 100,
            rightWidth: 100,
            bottomHeight: 100,
        });
        sprite.width = this.bounds.width;
        sprite.height = this.bounds.height;
        this.container.addChild(sprite);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
