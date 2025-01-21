import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { GameMapDefinition, TerrainType } from '../Definitions';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import Creep, { CreepEvents } from './Creep';
import { TowerEvents } from './Tower';

export enum GridEvents {
    CellMouseOver = 'cellmouseover',
    CellMouseLeave = 'cellmouseleave',
}

export class Cell extends GameObject {
    public type: TerrainType;
    public row: number;
    public column: number;
    public isPath: boolean = false;
    public g: PIXI.Graphics;
    public hasTowerPlaced: boolean = false;
    public clickDetector: PIXI.Graphics;

    constructor(type: TerrainType, row: number, column: number, isPath: boolean) {
        super();
        this.type = type;
        this.row = row;
        this.column = column;
        this.isPath = isPath;
        this.bb.x = this.column * Engine.GridCellSize;
        this.bb.y = this.row * Engine.GridCellSize;
        this.bb.width = Engine.GridCellSize;
        this.bb.height = Engine.GridCellSize;
        Engine.Grid.container.addChild(this.container);
        this.container.x = this.bb.x;
        this.container.y = this.bb.y;

        this.clickDetector = new PIXI.Graphics({
            zIndex: 99,
            interactive: true,
        });

        this.g = new PIXI.Graphics({
            zIndex: 5,
        });
        this.clickDetector.rect(0, 0, this.bb.width, this.bb.height);
        this.clickDetector.fill({ color: 0xff0000, alpha: 0 });
        this.container.addChild(this.clickDetector);
        this.container.addChild(this.g);
        this.clickDetector.on('pointerup', (e) => {
            if (Engine.TowerManager.isPlacingTower) Engine.Grid.onGridCellClicked(row, column);
            else this.OpenSelectedTowerPanel();
        });
        this.clickDetector.on('pointerenter', (e) => {
            Engine.GameScene.events.emit(GridEvents.CellMouseOver, this);
        });
        this.clickDetector.on('pointerleave', (e) => {
            Engine.GameScene.events.emit(GridEvents.CellMouseLeave, this);
            Engine.Grid.rangePreview.clear();
        });
        Engine.GameScene.events.on(TowerEvents.TowerPlacedEvent, (_, row, col) => {
            if (row == this.row && col == this.column) {
                this.hasTowerPlaced = true;
                Engine.Grid.rangePreview.clear();
            }
        });
        Engine.GameScene.events.on(TowerEvents.TowerSoldEvent, (_, row, col) => {
            if (row == this.row && col == this.column) {
                this.hasTowerPlaced = false;
            }
        });
    }
    public showRangePreview(invalid, range) {
        let color = 0xffffff;
        if (invalid) color = 0xff0000;
        Engine.Grid.rangePreview.clear();
        Engine.Grid.rangePreview.circle(
            this.column * Engine.GridCellSize + Engine.GridCellSize / 2,
            this.row * Engine.GridCellSize + Engine.GridCellSize / 2,
            range * Engine.GridCellSize
        );
        Engine.Grid.rangePreview.fill({ color: color, alpha: 0.3 });
    }
    public OpenSelectedTowerPanel() {
        if (this.hasTowerPlaced) {
            const tower = Engine.TowerManager.GetTowerByRowAndCol(this.row, this.column);
            Engine.GameScene.towerPanel.Show(tower);
        } else {
            // TODO: hide the sidepanel somehow
        }
    }
    public checkIfCantPlace() {
        return (
            this.hasTowerPlaced || this.isPath || this.type == TerrainType.Path || this.type == TerrainType.Restricted
        );
    }
    public gDraw() {
        this.g.rect(0, 0, this.bb.width, this.bb.height);
        if (this.type == TerrainType.Restricted) {
            this.g.fill({ color: 0x222222, alpha: 0.5 });
        } else if (this.hasTowerPlaced) {
            this.g.fill({ color: 0xff0000, alpha: 0.5 });
        } else if (this.type == TerrainType.Path) {
            this.g.fill({ color: 0x222222, alpha: 0.5 });
        } else if (this.type == TerrainType.Buildable) {
            this.g.stroke({ color: 0x00ff00, alpha: 0.9 });
        }
    }
    public gClear() {
        this.g.clear();
    }
    public update() {}
}

export class Grid extends GameObject {
    private gameMap: GameMapDefinition;
    private cells: Cell[] = [];
    public rangePreview: PIXI.Graphics;
    public creeps: Creep[] = [];
    public gridShown: boolean = false;

    constructor(map: GameMapDefinition, missionIndex) {
        super();
        this.gameMap = map;
        Engine.Grid = this;
        this.bb.x = 0;
        this.bb.y = 0;
        this.bb.width = Engine.GridCellSize * Engine.GridColumns;
        this.bb.height = Engine.GridCellSize * Engine.GridRows;

        Engine.GameMaster.currentScene.stage.addChild(this.container);

        let background = new PIXI.Sprite(GameAssets.MissionBackgrounds[missionIndex]);
        this.container.addChild(background);

        for (let y = 0; y < this.gameMap.columns; y++) {
            for (let x = 0; x < this.gameMap.rows; x++) {
                let type = this.gameMap.cells[x][y];
                if (!type) type = 1;
                const isPath = this.gameMap.paths.some((path) => path.some((p) => p[0] === x && p[1] === y));
                if (isPath) type = TerrainType.Path;
                let cell = new Cell(type, x, y, isPath);
                this.cells.push(cell);
            }
        }
        this.rangePreview = new PIXI.Graphics({
            zIndex: 10,
        });
        this.container.addChild(this.rangePreview);
    }
    public toggleGrid(force?: 'hide' | 'show') {
        this.cells.forEach((cell) => {
            if (force) {
                if (force == 'hide') {
                    cell.gClear();
                } else {
                    cell.gDraw();
                }
                return;
            }
            if (this.gridShown) {
                cell.gClear();
            } else {
                cell.gDraw();
            }
        });
        if (force == 'hide') this.gridShown = false;
        else if (force == 'show') this.gridShown = true;
        else this.gridShown = !this.gridShown;
    }
    public addCreep(creep: Creep) {
        this.creeps.push(creep);
        creep.events.on(CreepEvents.Died, (diedCreep) => {
            this.onCreepDiedOrEscaped(diedCreep);
        });
        creep.events.on(CreepEvents.Escaped, (escapedCreep) => {
            this.onCreepDiedOrEscaped(escapedCreep);
        });
    }
    private onCreepDiedOrEscaped(creep: Creep) {
        this.creeps.splice(this.creeps.indexOf(creep), 1);
        creep.destroy();
    }
    public update(elapsedMS) {
        this.creeps.forEach((creep) => {
            if (creep.dead) {
                this.creeps.splice(this.creeps.indexOf(creep), 1);
                creep = null;
            } else creep.update(elapsedMS);
        });
    }
    public getCellByRowAndCol(row, column) {
        return this.cells.filter((item) => item.row == row && item.column == column)[0];
    }
    // Not defined here, rather GameScene defines it. This is just for TS.
    public onGridCellClicked(row, column) {}
}
