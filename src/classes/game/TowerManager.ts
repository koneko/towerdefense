import * as PIXI from 'pixi.js';
import { Globals } from '../Bastion';
import { TowerDefinition } from '../Definitions';
import GameAssets from '../Assets';
import GameObject from '../GameObject';

export type TowerInstance = {
    row: number;
    column: number;
    sprite: PIXI.Sprite;
    projectiles: Array<any>;
    baseDamage: number;
    damage: number;
    cooldown: number;
    ticksToFireAt: number;
    slottedGems: Array<any>;
    cost: number;
    baseRange: number;
    range: number;
};

export enum TowerEvents {
    TowerPlacedEvent = 'towerPlacedEvent',
}

enum TowerSprite {
    basic_tower = 'GameAssets.BasicTowerTexture',
}

class Tower extends GameObject {
    public row: number;
    public column: number;
    private sprite: PIXI.Sprite;
    constructor(row, column, texture, definition) {
        super();
        this.row = row;
        this.column = column;
        let parent = Globals.Grid.getCellByRowAndCol(row, column);
        this.sprite = new PIXI.Sprite({
            texture: texture,
            height: 64,
            width: 64,
            zIndex: 10,
        });
        this.container.addChild(this.sprite);
        parent.container.addChild(this.container);
    }
    public update(elapsedMS: any): void {}
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
            if (!this.selectedTower) throw console.warn('TowerManager.selectedTower is null.');
            this.PlaceTower(this.selectedTower, row, column);
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
    public PlaceTower(definition: TowerDefinition, row, column) {
        let idx = 0;
        GameAssets.Towers.forEach((item, index) => {
            if (item.sprite == definition.sprite) idx = index;
        });
        const sprite = GameAssets.TowerSprites[idx];
        if (!this.GetTowerByRowAndCol(row, column) && !Globals.Grid.getCellByRowAndCol(row, column).isPath) {
            let tower = new Tower(row, column, sprite, definition);
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
}
