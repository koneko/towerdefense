import * as PIXI from 'pixi.js';
import { Globals } from '../Bastion';
import { TerrainType, TowerDefinition } from '../Definitions';
import GameAssets from '../Assets';
import GameObject from '../GameObject';
import { Tower, TowerEvents } from './Tower';

export enum TowerBehaviours {
    BasicTowerBehaviour = 'BasicTowerBehaviour',
}

export default class TowerManager {
    public isPlacingTower: boolean = false;
    public canPlaceTowers: boolean = true;
    private selectedTower: TowerDefinition | null = null;
    private towers: Tower[] = [];
    constructor() {
        Globals.TowerManager = this;
    }
    public ToggleChoosingTowerLocation(towerName: string) {
        if (!this.canPlaceTowers) return;
        Globals.Grid.toggleGrid();
        if (!this.isPlacingTower) {
            GameAssets.Towers.forEach((item) => {
                if (item.name == towerName) {
                    this.selectedTower = item;
                }
            });
        } else {
            this.selectedTower = null;
        }
        this.isPlacingTower = !this.isPlacingTower;
    }
    public PlayerClickOnGrid(row, column) {
        if (!this.canPlaceTowers) return;
        if (this.isPlacingTower) {
            if (!this.selectedTower)
                throw console.warn('TowerManager.selectedTower is null when trying to place tower.');
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
        return returnTower;
    }
    public PlaceTower(definition: TowerDefinition, row, column, behaviour: string, ignoreCost?) {
        let idx = 0;
        GameAssets.Towers.forEach((item, index) => {
            if (item.sprite == definition.sprite) idx = index;
        });
        const sprite = GameAssets.TowerSprites[idx];
        if (!Globals.GameScene.MissionStats.hasEnoughGold(definition.stats.cost) && !ignoreCost)
            return console.warn('Does not have enough gold.');
        if (
            !this.GetTowerByRowAndCol(row, column) &&
            Globals.Grid.getCellByRowAndCol(row, column).type != TerrainType.Path &&
            Globals.Grid.getCellByRowAndCol(row, column).type != TerrainType.Restricted
        ) {
            Globals.GameScene.MissionStats.spendGold(definition.stats.cost);
            let tower = new Tower(row, column, sprite, definition, behaviour);
            this.towers.push(tower);
            this.ToggleChoosingTowerLocation('RESET');
            console.log('SHOULDVE PLACED TOWER');
            console.log(this.selectedTower);
            this.selectedTower = null;
            Globals.GameScene.events.emit(TowerEvents.TowerPlacedEvent, definition.name);
        } else {
            console.warn('Can not place tower on occupied spot or path. Try again.');
        }
    }
    public update(elapsedMS) {
        this.towers.forEach((twr) => {
            twr.update(elapsedMS);
        });
    }
}
