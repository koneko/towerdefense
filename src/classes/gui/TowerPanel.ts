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
    private frame: PIXI.Sprite;
    public i: number = 0;
    public gem: Gem = null;
    constructor(index: number, parent: PIXI.Container, gem: Gem | null) {
        super(true);
        let gtexture;
        this.i = index;
        this.container.x = 10;
        this.container.y = index * (Engine.GridCellSize + 6) + 300;
        this.background = new PIXI.Sprite({
            texture: GameAssets.Frame01Texture,
        });
        if (gem == null) {
            gtexture = GameAssets.PlusIconTexture;
        } else {
            gtexture = gem.texture;
            this.gem = gem;
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
        this.frame = new PIXI.Sprite({
            texture: GameAssets.Frame05Texture,
            width: 64,
            height: 64,
        });

        this.container.addChild(this.background);
        this.container.addChild(this.iconSprite);
        this.container.addChild(this.frame);
        let txt = gem ? gem.id : '';
        let dbgText = new PIXI.Text({
            text: txt,
            zIndex: 11,
            style: {
                fill: 'white',
                stroke: {
                    color: 0x000000,
                    width: 5,
                },
            },
        });
        this.container.addChild(dbgText);
        parent.addChild(this.container);
    }

    public setTint(color) {
        this.frame.tint = color;
    }

    public resetTint() {
        this.frame.tint = 0xffffff;
    }
}

export default class TowerPanel extends GuiObject {
    private bounds: PIXI.Rectangle;
    private towerPanel: PIXI.NineSliceSprite;
    private closeBtn: Button;
    public vGems: VisualGemSlot[] = [];
    public showingTower: Tower = null;
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
            console.log('BUILDING TOWER PANEL ' + i);
            let gem = tower.slottedGems[i];
            if (!gem) gem = null;
            const vGem = new VisualGemSlot(i, this.container, gem);
            vGem.resetTint();
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
                console.warn('EMITTING TOWER PANEL SELECT GEM', gem, vGem.i, i, tower);
                Engine.GameScene.events.emit(GemEvents.TowerPanelSelectGem, gem, vGem.i, tower);
                if (!gem && Engine.GameScene.sidebar.gemTab.isSelectingGem) vGem.setTint(0x00ffff);
                else vGem.resetTint();
            };
        }
    }
    public Show(tower: Tower) {
        this.isShown = true;
        this.SetContent(tower);
        this.MakeSlots(tower);
        this.showingTower = tower;
        Engine.GameScene.sidebar.gemTab.selectingGemTowerObject = tower;
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
