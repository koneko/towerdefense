import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import { StatsEvents } from '../Events';
import Gem from '../game/Gem';
import { VisualGemSlot } from './TowerPanel';
import { distance, Tower } from '../game/Tower';

export default class GemTab extends GuiObject {
    private bounds: PIXI.Rectangle;
    private gemTabSprite: PIXI.NineSliceSprite;
    private vGems: VisualGemSlot[] = [];
    public isSelectingGem: boolean = false;
    public selectingGemSlotIndex: number = -1;
    public selectingGemTowerObject: Tower = null;
    public isDragAndDroppingGem: boolean = false;
    private dragAndDroppingGem: VisualGemSlot = null;

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
        Engine.app.canvas.addEventListener('pointermove', () => {
            this.pointerMoveEvent();
        });

        Engine.GameScene.events.on(StatsEvents.GemGivenEvent, () => {
            this.RebuildInventoryVisual();
        });
    }
    // TODO: add more visual clarity
    public TowerPanelSelectingGem(gem: Gem, index: number, tower: Tower) {
        console.log('TOWER PANEL SELECTING GEM ' + index);
        if (index < 0) console.error('TOWER PANEL SELECTING GEM INDEX IS LESS THAN 0, ', index);
        // index = Engine.GameScene.towerPanel.vGems.indexOf(gem);
        if (!this.isSelectingGem) {
            this.isSelectingGem = true;
            if (gem == null) {
                // Want to select gem to slot in, already checked if player has a Gem.
                Engine.NotificationManager.Notify(
                    'Click on any Gem in your inventory to slot it into this Gem slot.',
                    'info'
                );
                this.selectingGemSlotIndex = index;
                this.selectingGemTowerObject = tower;
            } else {
                // Already have a gem selected
                tower.UnslotGem(index);
                this.RebuildInventoryVisual();
                Engine.GameScene.towerPanel.Hide();
                Engine.GameScene.towerPanel.Show(tower);
                this.isSelectingGem = false;
                this.selectingGemSlotIndex = -1;
                this.selectingGemTowerObject = null;
            }
        } else {
            if (gem == null) {
                this.isSelectingGem = false;
                this.selectingGemSlotIndex = -1;
                this.selectingGemTowerObject = null;
            }
        }
    }
    public pointerMoveEvent() {
        if (!this.isDragAndDroppingGem || !Engine.GameScene.towerPanel.isShown || !this.dragAndDroppingGem) return;
        this.dragAndDroppingGem.container.x = Engine.MouseX - 32;
        this.dragAndDroppingGem.container.y = Engine.MouseY - 32;
    }
    public RebuildInventoryVisual() {
        this.vGems.forEach((vGem) => vGem.destroy());
        this.vGems = [];
        Engine.GameScene.MissionStats.getInventory().forEach((gem, index) => {
            let vGem = new VisualGemSlot(0, this.container, gem);
            let vGemYCoord = 10;
            let vGemXCoord = (index % 4) * 70 + 10;
            let vGemYIdx = index;
            while (true) {
                if (vGemYIdx <= 3) break;
                vGemYCoord += 66;
                vGemYIdx -= 4;
            }
            vGem.container.x = vGemXCoord;
            vGem.container.y = vGemYCoord;
            vGem.container.onpointermove = () => {
                if (gem == null || this.isDragAndDroppingGem) return;
                Engine.GameScene.tooltip.SetContentGem(gem);
                Engine.GameScene.tooltip.Show(Engine.MouseX, Engine.MouseY);
            };
            vGem.container.onpointerleave = () => {
                Engine.GameScene.tooltip.Hide();
            };
            vGem.container.onpointerdown = () => {
                Engine.GameScene.tooltip.Hide();
                if (this.isSelectingGem) {
                    // already clicked on vGem slot in towerpanel
                    this.isSelectingGem = false;
                    let takenGem = Engine.GameScene.MissionStats.takeGem(gem);
                    this.selectingGemTowerObject.SlotGem(takenGem, this.selectingGemSlotIndex);
                    this.RebuildInventoryVisual();
                } else {
                    if (!Engine.GameScene.towerPanel.isShown) return;
                    // initialise drag and drop
                    this.isDragAndDroppingGem = true;
                    this.dragAndDroppingGem = vGem;
                    vGem.container.removeFromParent();
                    Engine.GameScene.stage.addChild(vGem.container);
                    this.pointerMoveEvent();
                }
            };
            vGem.container.onpointerup = () => {
                if (this.isSelectingGem) return;
                let overlapping = null;
                Engine.GameScene.towerPanel.vGems.forEach((internVG) => {
                    if (overlapping || !this.dragAndDroppingGem) return;
                    let ddbb = this.dragAndDroppingGem.copyContainerToBB();
                    let vb = internVG.copyContainerToBB();
                    let x = Engine.GameScene.towerPanel.container.x + vb.x;
                    let y = Engine.GameScene.towerPanel.container.y + vb.y;

                    let vgbb = new PIXI.Rectangle(x, y, vb.width, vb.height);
                    console.log(ddbb, vgbb, ddbb.getBounds().intersects(vgbb));
                    if (ddbb.getBounds().intersects(vgbb)) {
                        if (internVG && internVG.gem == null) overlapping = internVG;
                    }
                });
                if (overlapping) {
                    let takenGem = Engine.GameScene.MissionStats.takeGem(gem);
                    Engine.GameScene.towerPanel.showingTower.SlotGem(takenGem, overlapping.i);
                }
                // clean up
                this.isDragAndDroppingGem = false;
                this.dragAndDroppingGem = null;
                this.RebuildInventoryVisual();
            };
            this.vGems.push(vGem);
        });
    }
}
