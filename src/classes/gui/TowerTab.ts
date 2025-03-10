import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import { TowerEvents } from '../Events';
import { TowerDefinition } from '../Definitions';

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
        this.container.onpointermove = (e) => {
            if (Engine.Grid.gridInteractionEnabled == false) return;
            if (Engine.TowerManager.isPlacingTower) return;
            this.ShowTooltip();
        };

        this.container.onpointerleave = (e) => {
            Engine.GameScene.tooltip.Hide();
        };
    }
    private ShowTooltip() {
        let definition: TowerDefinition;
        GameAssets.Towers.forEach((item) => {
            if (item.name == this.towerName) {
                definition = item;
            }
        });
        Engine.GameScene.tooltip.SetContentTower(
            this.towerName,
            definition.stats.damage,
            definition.stats.cost,
            definition.stats.gemSlotsAmount
        );
        Engine.GameScene.tooltip.Show(Engine.MouseX, Engine.MouseY);
    }
    public onClick(e: PIXI.FederatedPointerEvent): void {
        if (Engine.Grid.gridInteractionEnabled == false) return;
        if (Engine.TowerManager.isPlacingTower && Engine.TowerManager.selectedTower.name != this.towerName) {
            Engine.GameScene.sidebar.towerTab.resetTint();
            Engine.TowerManager.ResetChooseTower();
        }
        Engine.GameScene.towerPanel.Hide();
        Engine.GameScene.tooltip.Hide();
        if (this.frameSprite.tint == 0x00ff00) {
            this.frameSprite.tint = 0xffffff;
            this.ShowTooltip();
        } else this.frameSprite.tint = 0x00ff00;

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
                GameAssets.Towers[0].name,
                GameAssets.Towers[0].texture
            )
        );
        this.towerButtons.push(
            new TowerButton(
                1,
                0,
                70,
                70,
                this.container,
                GameAssets.RedBackground,
                GameAssets.Towers[1].name,
                GameAssets.Towers[1].texture
            )
        );
        this.towerButtons.push(
            new TowerButton(
                2,
                0,
                70,
                70,
                this.container,
                GameAssets.BlueBackground,
                GameAssets.Towers[2].name,
                GameAssets.Towers[2].texture
            )
        );
        this.towerButtons.push(
            new TowerButton(
                3,
                0,
                70,
                70,
                this.container,
                GameAssets.BlueBackground,
                GameAssets.Towers[3].name,
                GameAssets.Towers[3].texture
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
                GameAssets.Towers[4].name,
                GameAssets.Towers[4].texture
            )
        );
        this.towerButtons.push(
            new TowerButton(
                1,
                1,
                70,
                70,
                this.container,
                GameAssets.GreenBackground,
                GameAssets.Towers[5].name,
                GameAssets.Towers[5].texture
            )
        );
        this.towerButtons.push(
            new TowerButton(
                2,
                1,
                70,
                70,
                this.container,
                GameAssets.YellowBackground,
                GameAssets.Towers[6].name,
                GameAssets.Towers[6].texture
            )
        );
        this.towerButtons.push(
            new TowerButton(
                3,
                1,
                70,
                70,
                this.container,
                GameAssets.YellowBackground,
                GameAssets.Towers[7].name,
                GameAssets.Towers[7].texture
            )
        );
    }
    public resetTint() {
        this.towerButtons.forEach((item) => item.resetTint());
    }
}
