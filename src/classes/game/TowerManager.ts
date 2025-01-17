import * as PIXI from 'pixi.js';
import { Engine } from '../Bastion';
import { TerrainType, TowerDefinition } from '../Definitions';
import GameAssets from '../Assets';
import { Tower, TowerEvents } from './Tower';
import { Cell, GridEvents } from './Grid';

export enum TowerBehaviours {
    BasicTowerBehaviour = 'BasicTowerBehaviour',
}

export default class TowerManager {
    public isPlacingTower: boolean = false;
    public canPlaceTowers: boolean = true;
    private selectedTower: TowerDefinition | null = null;
    private previewSprite: PIXI.Sprite = new PIXI.Sprite({
        parent: Engine.GameMaster.currentScene.stage,
        zIndex: 10,
        width: 64,
        height: 64,
        alpha: 0.8,
    });
    private towers: Tower[] = [];
    constructor() {
        Engine.TowerManager = this;
        Engine.GameScene.events.on(GridEvents.CellMouseOver, (cell: Cell) => {
            //console.log(`${cell.column}x${cell.row}, ${cell.type}, ${this.isPlacingTower}`);
            if (this.isPlacingTower) {
                let cantPlace =
                    this.GetTowerByRowAndCol(cell.row, cell.column) ||
                    cell.hasTowerPlaced ||
                    cell.isPath ||
                    cell.type == TerrainType.Path ||
                    cell.type == TerrainType.Restricted;
                cell.rangePreview.circle(
                    Engine.GridCellSize / 2,
                    Engine.GridCellSize / 2,
                    this.selectedTower.stats.range * Engine.GridCellSize
                );
                if (cantPlace) {
                    cell.rangePreview.fill({ color: 0xff0000, alpha: 0.4 });
                    this.previewSprite.tint = 0xff0000;
                } else {
                    cell.rangePreview.fill({ color: 0xffffff, alpha: 0.4 });
                    this.previewSprite.tint = 0xffffff;
                }
                this.previewSprite.x = cell.column * Engine.GridCellSize;
                this.previewSprite.y = cell.row * Engine.GridCellSize;
                this.previewSprite.texture = this.selectedTower.texture;
            }
        });
    }
    public ToggleChoosingTowerLocation(towerName: string) {
        if (!this.canPlaceTowers) return;
        Engine.Grid.toggleGrid();
        if (!this.isPlacingTower) {
            GameAssets.Towers.forEach((item) => {
                if (item.name == towerName) {
                    this.selectedTower = item;
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
                throw console.warn('TowerManager.selectedTower is null when trying to place tower.');
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
        let idx = 0;
        GameAssets.Towers.forEach((item, index) => {
            if (item.sprite == definition.sprite) idx = index;
        });
        const sprite = GameAssets.TowerSprites[idx];
        if (!Engine.GameScene.MissionStats.hasEnoughGold(definition.stats.cost) && !ignoreCost)
            return Engine.NotificationManager.Notify('Not enough gold.', 'warn');
        if (
            !this.GetTowerByRowAndCol(row, column) &&
            Engine.Grid.getCellByRowAndCol(row, column).type != TerrainType.Path &&
            Engine.Grid.getCellByRowAndCol(row, column).type != TerrainType.Restricted
        ) {
            Engine.GameScene.MissionStats.spendGold(definition.stats.cost);
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
        this.towers.forEach((twr) => {
            twr.update(elapsedMS);
        });
    }
}
