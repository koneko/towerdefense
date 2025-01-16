import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';

// ! TODO NEXT!

export default class SelectedTowerPanel extends GuiObject {
    private bounds: PIXI.Rectangle;
    private towerPanel: PIXI.NineSliceSprite;

    constructor(bounds: PIXI.Rectangle) {
        super(false);
        this.bounds = bounds;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        this.towerPanel = new PIXI.NineSliceSprite({
            texture: GameAssets.FrameTowerTab,
            leftWidth: 1000,
            topHeight: 1000,
            rightWidth: 1000,
            bottomHeight: 1000,
        });
        this.towerPanel.x = -300;
        this.towerPanel.y = -300;
        this.towerPanel.width = this.bounds.width;
        this.towerPanel.height = this.bounds.height;

        this.container.addChild(this.towerPanel);
        Engine.GameMaster.currentScene.stage.addChild(this.container);
    }
}
