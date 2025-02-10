import * as PIXI from 'pixi.js';
import { Engine } from '../Bastion';
import { TerrainType, TowerDefinition } from '../Definitions';
import GameAssets from '../Assets';
import { Tower } from './Tower';
import { Cell } from './Grid';
import { GridEvents, TowerEvents } from '../Events';

export enum TowerBehaviours {
    BasicTowerBehaviour = 'BasicTowerBehaviour',
    CircleTowerBehaviour = 'CircleTowerBehaviour',
}

export default class TowerManager {
    public isPlacingTower: boolean = false;
    public canPlaceTowers: boolean = true;
    public selectedTower: TowerDefinition | null = null;
    private previewSprite: PIXI.Sprite = new PIXI.Sprite({
        parent: Engine.GameMaster.currentScene.stage,
        zIndex: 10,
        width: 64,
        height: 64,
        alpha: 0.8,
    });
    private towers: Tower[] = [];
    constructor() {
        // TODO: Unsubscribe from events once the scene is destroyed
        Engine.TowerManager = this;
        Engine.GameScene.events.on(GridEvents.CellMouseOver, (cell: Cell) => {
            if (this.isPlacingTower) {
                let cantPlace = cell.checkIfCantPlace();
                if (cantPlace) {
                    cell.showRangePreview(true, this.selectedTower.stats.range);
                    this.previewSprite.tint = 0xff0000;
                } else {
                    cell.showRangePreview(false, this.selectedTower.stats.range);
                    this.previewSprite.tint = 0xffffff;
                }
                this.previewSprite.x = cell.column * Engine.GridCellSize;
                this.previewSprite.y = cell.row * Engine.GridCellSize;
                this.previewSprite.texture = this.selectedTower.texture;
            }
        });
        Engine.GameScene.events.on(GridEvents.CellMouseLeave, (cell: Cell) => {
            this.previewSprite.texture = null;
            Engine.Grid.rangePreview.clear();
        });
    }
    public ResetChooseTower() {
        this.selectedTower = null;
        this.isPlacingTower = false;
        Engine.Grid.toggleGrid('hide');
    }
    public ToggleChoosingTowerLocation(towerName: string) {
        if (!this.canPlaceTowers) return;
        Engine.Grid.toggleGrid();
        if (!this.isPlacingTower) {
            GameAssets.Towers.forEach((item) => {
                if (item.name == towerName) {
                    this.selectedTower = item;
                    console.log(this.selectedTower);
                }
            });
        } else {
            this.previewSprite.texture = null;
            this.selectedTower = null;
        }
        this.isPlacingTower = !this.isPlacingTower;
    }
    public PlayerClickOnGrid(row, column) {
        if (!this.canPlaceTowers) return;
        if (this.isPlacingTower) {
            if (!this.selectedTower) {
                Engine.NotificationManager.Notify(
                    'TowerManager.selectedTower is null when trying to place tower.',
                    'danger'
                );
                return console.warn('TowerManager.selectedTower is null when trying to place tower.');
            }
            this.PlaceTower(this.selectedTower, row, column, this.selectedTower.behaviour);
        }
    }
    public GetTowerByRowAndCol(row, col) {
        // i just want to say that this is really stupid, why do i need to define a type for a local
        // variable i will temporarily use? TS is weird
        let returnTower: Tower | null = null;
        this.towers.forEach((tower) => {
            if (tower.row == row && tower.column == col) returnTower = tower;
        });
        // console.log(returnTower, row, col);
        return returnTower;
    }
    public PlaceTower(definition: TowerDefinition, row, column, behaviour: string, ignoreCost?) {
        const sprite = definition.texture;
        if (!Engine.GameScene.MissionStats.hasEnoughGold(definition.stats.cost) && !ignoreCost)
            return Engine.NotificationManager.Notify('Not enough gold.', 'warn');
        if (
            !this.GetTowerByRowAndCol(row, column) &&
            Engine.Grid.getCellByRowAndCol(row, column).type != TerrainType.Path &&
            Engine.Grid.getCellByRowAndCol(row, column).type != TerrainType.Restricted
        ) {
            if (!ignoreCost) Engine.GameScene.MissionStats.spendGold(definition.stats.cost);
            let tower = new Tower(row, column, sprite, definition, behaviour);
            this.towers.push(tower);
            this.ToggleChoosingTowerLocation('RESET');
            this.selectedTower = null;
            this.previewSprite.x = -100;
            Engine.GameScene.events.emit(TowerEvents.TowerPlacedEvent, definition.name, row, column);
        } else {
            Engine.NotificationManager.Notify(
                'Can not place tower on path or other tower, choose another spot.',
                'warn'
            );
            console.warn('Can not place tower on occupied spot or path. Try again.');
        }
    }
    public update(elapsedMS) {
        this.towers.forEach((twr, idx) => {
            if (twr.sold) {
                twr.slottedGems = twr.slottedGems.filter((gem) => gem != null);
                while (twr.slottedGems.length > 0) {
                    twr.UnslotGem(0);
                }
                Engine.GameScene.MissionStats.earnGold(twr.definition.stats.cost);
                twr.destroy();
                this.towers.splice(idx, 1);
                Engine.GameScene.events.emit(TowerEvents.TowerSoldEvent, twr.name, twr.row, twr.column);
            } else twr.update(elapsedMS);
        });
    }
}
