import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import GameUIConstants from '../GameUIConstants';
import Button, { ButtonTexture } from './Button';
import { Tower } from '../game/Tower';
import Gem from '../game/Gem';
import { GemEvents } from '../Events';

export class VisualGemSlot extends GuiObject {
    public iconSprite: PIXI.Sprite;
    private background: PIXI.Sprite;
    private gem: Gem;
    private i: number = 0;
    constructor(index: number, parent: PIXI.Container, gem: Gem | null) {
        super(true);
        let gtexture;
        this.container.x = 10;
        this.container.y = index * Engine.GridCellSize + 300;
        this.background = new PIXI.Sprite({
            texture: GameAssets.FrameInventory,
        });
        this.gem = gem;
        if (gem == null) {
            gtexture = GameAssets.PlusIconTexture;
        } else {
            gtexture = gem.texture;
        }
        this.iconSprite = new PIXI.Sprite({
            texture: gtexture,
            zIndex: 10,
        });
        this.background.width = Engine.GridCellSize;
        this.background.height = Engine.GridCellSize;
        if (gem == null) {
            this.iconSprite.x = Engine.GridCellSize / 2;
            this.iconSprite.y = Engine.GridCellSize / 2;
            this.iconSprite.width = Engine.GridCellSize / 2;
            this.iconSprite.height = Engine.GridCellSize / 2;
            this.iconSprite.anchor.set(0.5, 0.5);
        } else {
            this.iconSprite.x = 4;
            this.iconSprite.y = 4;
            this.iconSprite.width = Engine.GridCellSize - 8;
            this.iconSprite.height = Engine.GridCellSize - 8;
        }
        this.container.addChild(this.background);
        this.container.addChild(this.iconSprite);
        parent.addChild(this.container);
    }
    public onClick(e: PIXI.FederatedPointerEvent): void {}
}

export default class TowerPanel extends GuiObject {
    private bounds: PIXI.Rectangle;
    private towerPanel: PIXI.NineSliceSprite;
    private closeBtn: Button;
    private vGems: VisualGemSlot[] = [];
    public isShown: boolean = false;
    public titleText: PIXI.Text;

    constructor(bounds: PIXI.Rectangle) {
        super(false);
        this.bounds = bounds;
        this.towerPanel = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame03Texture,
            leftWidth: 100,
            topHeight: 100,
            rightWidth: 100,
            bottomHeight: 100,
        });
        this.towerPanel.width = this.bounds.width;
        this.towerPanel.height = this.bounds.height - this.bounds.height / 3.5;
        this.closeBtn = new Button(new PIXI.Rectangle(-20, -20, 60, 60), '', ButtonTexture.Button01, true);
        this.closeBtn.container.removeFromParent();
        // Added custom button logic to still keep all the regular events for the button, just have an icon instead of text.
        // TODO: maybe make this better? add like a seperate class for icon buttons or smth
        this.closeBtn.CustomButtonLogic = () => {
            this.closeBtn.buttonIcon = new PIXI.Sprite({
                texture: GameAssets.XIconTexture,
                x: this.closeBtn.container.width / 2,
                y: this.closeBtn.container.height / 2,
                scale: 0.2,
            });
            this.closeBtn.buttonIcon.anchor.set(0.5, 0.5);
            this.closeBtn.container.addChild(this.closeBtn.buttonIcon);
        };
        this.closeBtn.onClick = () => {
            this.Hide();
        };
        this.Hide();
        this.closeBtn.CustomButtonLogic();
        this.container.y = Engine.app.canvas.height / 2 - Engine.app.canvas.height / 2.7;
        this.container.addChild(this.towerPanel);
        this.container.addChild(this.closeBtn.container);
        Engine.GameMaster.currentScene.stage.addChild(this.container);

        this.titleText = new PIXI.Text({
            x: this.bounds.width / 3,
            y: 50,
            zIndex: 5,
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                stroke: {
                    color: 0x000000,
                    width: 2,
                },
            }),
        });
        this.titleText.anchor.set(0.5, 0);
        this.container.addChild(this.titleText);
    }
    private MakeSlots(tower: Tower) {
        this.vGems.forEach((vGem) => {
            vGem.destroy();
        });
        this.vGems = [];
        let amount = tower.definition.stats.gemSlotsAmount;
        // amount = 6;
        for (let i = 0; i < amount; i++) {
            let gem = tower.slottedGems[i];
            console.log(gem);
            if (!gem) gem = null;
            const vGem = new VisualGemSlot(i, this.container, gem);
            this.vGems.push(vGem);
            vGem.container.onpointermove = () => {
                if (!gem) return;
                Engine.GameScene.tooltip.SetContentGem(gem);
                Engine.GameScene.tooltip.Show(Engine.MouseX, Engine.MouseY);
            };
            vGem.container.onpointerleave = () => {
                Engine.GameScene.tooltip.Hide();
            };
            vGem.onClick = () => {
                Engine.GameScene.tooltip.Hide();
                console.log('MAKESLOTS ', gem);
                Engine.GameScene.events.emit(GemEvents.TowerPanelSelectGem, gem, i, tower);
            };
        }
    }
    public Show(tower: Tower) {
        let mouseX = Engine.MouseX;
        this.isShown = true;
        this.SetContent(tower);
        this.MakeSlots(tower);
        if (tower.container.x < 900) {
            this.ShowRight();
        } else {
            this.ShowLeft();
        }
    }
    private SetContent(tower: Tower) {
        this.titleText.text = tower.definition.name;
    }
    private ShowLeft() {
        this.towerPanel.x = -100;
        this.container.x = 0;
        this.container.alpha = 1;
        this.closeBtn.container.x = this.bounds.width - 150;
    }
    private ShowRight() {
        this.towerPanel.x = -10;
        this.container.x = GameUIConstants.SidebarRect.x - 210;
        this.closeBtn.container.x = -20;
        this.container.alpha = 1;
    }
    public Hide() {
        this.isShown = false;
        this.container.alpha = 0;
        this.container.x = GameUIConstants.SidebarRect.x + 10;
    }
}
