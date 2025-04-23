import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { GameMapDefinition, TerrainType, TowerType } from '../Definitions';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import Creep from './Creep';
import { CreepEvents, TowerEvents, GridEvents } from '../Events';
import { distance, Tower } from './Tower';

let genPath = [];

export class Cell extends GameObject {
    public type: TerrainType;
    public row: number;
    public column: number;
    public isPath: boolean = false;
    public g: PIXI.Graphics;
    public hasTowerPlaced: boolean = false;
    public isBuffedBy: Tower[] = [];
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
            if (!Engine.Grid.gridInteractionEnabled) return;
            if (Engine.TowerManager.isPlacingTower) Engine.Grid.onGridCellClicked(row, column);
            else this.OpenSelectedTowerPanel();
        });
        this.clickDetector.on('pointerenter', (e) => {
            if (!Engine.Grid.gridInteractionEnabled || Engine.GameScene.towerPanel.isShown) return;
            Engine.GameScene.events.emit(GridEvents.CellMouseOver, this);
        });
        this.clickDetector.on('pointerleave', (e) => {
            if (!Engine.Grid.gridInteractionEnabled || Engine.GameScene.towerPanel.isShown) return;
            Engine.GameScene.events.emit(GridEvents.CellMouseLeave, this);
        });

        Engine.GameScene.events.on(TowerEvents.TowerPlacedEvent, (towerName, row, col) => {
            if (row == this.row && col == this.column) {
                this.hasTowerPlaced = true;
                Engine.Grid.rangePreview.clear();
            } else if (towerName == GameAssets.Towers[TowerType.Buff].name) {
                let twr = Engine.TowerManager.GetTowerByRowAndCol(row, col);
                if (Engine.Grid.IsCellInRangeOfOtherCell(row, col, twr.computedRange, this)) {
                    this.isBuffedBy.push(twr);
                }
            }
        });
        Engine.GameScene.events.on(TowerEvents.TowerSoldEvent, (towerName, row, col) => {
            console.log(towerName, row, col);
            if (row == this.row && col == this.column) {
                this.hasTowerPlaced = false;
                Engine.Grid.rangePreview.clear();
            } else if (towerName == GameAssets.Towers[TowerType.Buff].name) {
                let twr = Engine.TowerManager.GetTowerByRowAndCol(row, col);
                if (Engine.Grid.IsCellInRangeOfOtherCell(row, col, twr.computedRange, this)) {
                    console.log('REMOVED!');
                    this.isBuffedBy.splice(this.isBuffedBy.indexOf(twr), 1);
                    console.log(this.isBuffedBy);
                }
            }
        });

        // See commit f84108847b6ba6c337954a742f4dc1a38a2c925b
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
    public gridInteractionEnabled = true;

    constructor(map: GameMapDefinition, missionIndex) {
        super();
        this.gameMap = map;
        Engine.Grid = this;
        this.bb.x = 0;
        this.bb.y = 0;
        this.bb.width = Engine.GridCellSize * Engine.GridColumns;
        this.bb.height = Engine.GridCellSize * Engine.GridRows;

        Engine.GameMaster.currentScene.stage.addChild(this.container);

        const background = new PIXI.Sprite(GameAssets.MissionBackgrounds[missionIndex]);
        this.container.addChild(background);

        for (let y = 0; y < this.gameMap.columns; y++) {
            for (let x = 0; x < this.gameMap.rows; x++) {
                let type = this.gameMap.cells[x][y];
                const isPath = this.gameMap.paths.some((path) => path.some((p) => p[1] === x && p[0] === y));
                if (isPath) type = TerrainType.Path;
                let cell = new Cell(type, x, y, isPath);
                this.cells.push(cell);
            }
        }
        this.rangePreview = new PIXI.Graphics({
            zIndex: 10,
            x: 0,
            y: 0,
            width: Engine.app.canvas.width,
            height: Engine.app.canvas.height,
        });
        this.container.addChild(this.rangePreview);
    }
    public generateCells() {
        const newGrid = Array.from({ length: this.gameMap.rows }, () => Array(this.gameMap.columns).fill(1));

        this.cells.forEach((cell) => {
            if (cell.isPath) {
                newGrid[cell.row][cell.column] = 9;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const newRow = cell.row + i;
                        const newCol = cell.column + j;
                        if (
                            newRow >= 0 &&
                            newRow < this.gameMap.rows &&
                            newCol >= 0 &&
                            newCol < this.gameMap.columns &&
                            newGrid[newRow][newCol] !== 9
                        ) {
                            newGrid[newRow][newCol] = 0;
                        }
                    }
                }
            }
        });

        console.log(JSON.stringify(newGrid));
    }

    public IsCellInRangeOfOtherCell(row, col, range, otherCell) {
        range = range * Engine.GridCellSize;
        const x = otherCell.column * Engine.GridCellSize + Engine.GridCellSize / 2;
        const y = otherCell.row * Engine.GridCellSize + Engine.GridCellSize / 2;
        const cellX = col * Engine.GridCellSize + Engine.GridCellSize / 2;
        const cellY = row * Engine.GridCellSize + Engine.GridCellSize / 2;
        const d = distance(cellX, cellY, x, y);
        if (d < range + Engine.GridCellSize / 2) return true;
        else return false;
    }
    public GetPathCellsInRange(row, col, range) {
        let result = [];
        this.cells.forEach((cell) => {
            if (cell.isPath) {
                if (this.IsCellInRangeOfOtherCell(row, col, range, cell)) {
                    result.push(cell);
                }
            }
        });
        return result;
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
