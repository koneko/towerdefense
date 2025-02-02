import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import { StatsEvents } from '../Events';
import Gem from '../game/Gem';
import { VisualGemSlot } from './TowerPanel';
import { Tower } from '../game/Tower';

export default class GemTab extends GuiObject {
    private bounds: PIXI.Rectangle;
    private gemTabSprite: PIXI.NineSliceSprite;
    private vGems: VisualGemSlot[] = [];
    public isSelectingGem: boolean = false;
    public selectingGemSlotIndex: number = -1;
    public selectingGemTowerObject: Tower = null;

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
                if (gem == null) return;
                Engine.GameScene.tooltip.SetContentGem(gem);
                Engine.GameScene.tooltip.Show(Engine.MouseX, Engine.MouseY);
            };
            vGem.container.onpointerleave = () => {
                Engine.GameScene.tooltip.Hide();
            };
            vGem.onClick = () => {
                Engine.GameScene.tooltip.Hide();
                if (this.isSelectingGem) {
                    this.isSelectingGem = false;
                    let takenGem = Engine.GameScene.MissionStats.takeGem(gem);
                    this.selectingGemTowerObject.SlotGem(takenGem, this.selectingGemSlotIndex);
                    this.RebuildInventoryVisual();
                }
            };
            this.vGems.push(vGem);
        });
    }
}
