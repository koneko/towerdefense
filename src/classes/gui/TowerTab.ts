import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import { TowerEvents } from '../game/Tower';

class TowerButton extends GuiObject {
    private frameSprite: PIXI.NineSliceSprite;
    private background: PIXI.Sprite;
    private towerName: string;
    private iconSprite: PIXI.Sprite;
    private i: number = 0;
    constructor(index: number, row, width, height, parent: PIXI.Container, backgroundTexture, towerName, iconTexture) {
        if (index > 3 || row > 2 || index < 0 || row < 0) throw 'Index/row out of bounds for TowerButton.';
        super(true);
        this.towerName = towerName;
        this.container.x = index * width + 5;
        this.container.y = row * height + 5; // 5 is padding, looks better
        this.background = new PIXI.Sprite({
            texture: backgroundTexture,
        });
        this.iconSprite = new PIXI.Sprite({
            texture: iconTexture,
        });
        this.background.width = width;
        this.background.height = height;
        this.iconSprite.x = width / 2;
        this.iconSprite.y = height / 2;
        this.iconSprite.width = width / 2;
        this.iconSprite.height = height / 2;
        this.iconSprite.anchor.set(0.5, 0.5);
        this.container.addChild(this.background);
        this.container.addChild(this.iconSprite);
        this.frameSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame02Texture,
            leftWidth: 100,
            topHeight: 100,
            rightWidth: 100,
            bottomHeight: 100,
            roundPixels: true,
            height: height,
            width: width,
        });
        this.container.addChild(this.frameSprite);
        parent.addChild(this.container);
        Engine.GameScene.events.on(TowerEvents.TowerPlacedEvent, (name) => {
            this.resetTint();
        });
        this.container.onpointerenter = (e) => {
            // add on mouse over info (banner next to sidebar)
        };

        this.container.onpointerleave = (e) => {};
    }
    public onClick(e: PIXI.FederatedPointerEvent): void {
        if (Engine.TowerManager.isPlacingTower && Engine.TowerManager.selectedTower.name != this.towerName) {
            Engine.GameScene.sidebar.towerTab.resetTint();
            Engine.TowerManager.ResetChooseTower();
        }
        if (this.frameSprite.tint == 0x00ff00) this.frameSprite.tint = 0xffffff;
        else this.frameSprite.tint = 0x00ff00;
        Engine.TowerManager.ToggleChoosingTowerLocation(this.towerName);
    }
    public resetTint() {
        this.frameSprite.tint = 0xffffff;
    }
}

export default class TowerTab extends GuiObject {
    private bounds: PIXI.Rectangle;
    private towerTabSprite: PIXI.NineSliceSprite;
    private towerButtons: TowerButton[] = [];

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
        this.towerTabSprite.width = this.bounds.width;
        this.towerTabSprite.height = this.bounds.height;
        this.container.addChild(this.towerTabSprite);
        this.towerButtons.push(
            new TowerButton(
                0,
                0,
                70,
                70,
                this.container,
                GameAssets.RedBackground,
                'Basic Tower',
                GameAssets.HammerIconTexture
            )
        );
        this.towerButtons.push(
            new TowerButton(
                0,
                1,
                70,
                70,
                this.container,
                GameAssets.GreenBackground,
                'Circle Tower',
                GameAssets.HomeIconTexture
            )
        );
    }
    public resetTint() {
        this.towerButtons.forEach((item) => item.resetTint());
    }
}
