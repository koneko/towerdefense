import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { GameMapDefinition, TerrainType } from '../Definitions';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import Creep, { CreepEvents } from './Creep';

export class Cell extends GameObject {
    public type: TerrainType;
    public row: number;
    public column: number;
    public isPath: boolean = false;
    private g: PIXI.Graphics;
    public clickDetector: PIXI.Graphics;

    constructor(type: TerrainType, row: number, column: number, isPath: boolean) {
        super();
        this.type = type;
        this.row = row;
        this.column = column;
        this.isPath = isPath;
        this.bb.x = this.column * 64;
        this.bb.y = this.row * 64;
        this.bb.width = 64;
        this.bb.height = 64;
        Engine.Grid.container.addChild(this.container);
        this.container.x = this.bb.x;
        this.container.y = this.bb.y;

        this.clickDetector = new PIXI.Graphics({
            zIndex: 99,
            interactive: true,
        });
        this.clickDetector.rect(0, 0, this.bb.width, this.bb.height);
        this.clickDetector.fill({ color: 0xff0000, alpha: 0 });
        this.container.addChild(this.clickDetector);
        this.clickDetector.onpointerdown = (e) => {
            Engine.Grid._gridCellClicked(row, column);
        };

        if (!GameAssets.DebuggingEnabled) return;
        const text = new PIXI.Text({
            text: `${this.row}|${this.column}`,
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                dropShadow: true,
                fontSize: 16,
            }),
        });
        this.container.addChild(text);
        text.anchor.set(0.5, 0.5);
        text.x = this.bb.width / 2;
        text.y = this.bb.height / 2;
        if (isPath) text.text += 'p';
    }
    public gDraw() {
        this.g = new PIXI.Graphics({
            zIndex: 5,
        });
        this.g.rect(0, 0, this.bb.width, this.bb.height);
        switch (this.type) {
            case TerrainType.Restricted:
                this.g.fill({ color: 0x222222, alpha: 0.5 });
                break;
            case TerrainType.Path:
                this.g.fill({ color: 0x222222, alpha: 0.5 });
                break;
            case TerrainType.Buildable:
                this.g.stroke({ color: 0x00ff00, alpha: 0.9 });
                break;
        }
        this.container.addChild(this.g);
    }
    public gClear() {
        if (this.g != null) {
            this.container.removeChild(this.g);
            this.g.destroy();
        }
    }
    public update() {}
}

export class Grid extends GameObject {
    private gameMap: GameMapDefinition;
    private cells: Cell[] = [];
    public creeps: Creep[] = [];
    public gridShown: boolean = false;

    constructor(map: GameMapDefinition, missionIndex) {
        super();
        this.gameMap = map;
        Engine.Grid = this;
        this.bb.x = 0;
        this.bb.y = 0;
        this.bb.width = 64 * 30;
        this.bb.height = 64 * 17;
        Engine.app.stage.addChild(this.container);

        let background = new PIXI.Sprite(GameAssets.MissionBackgrounds[missionIndex]);
        background.x = 0;
        background.y = 0;
        background.width = this.bb.width;
        background.height = this.bb.height;

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
    }
    public toggleGrid() {
        this.cells.forEach((cell) => {
            if (this.gridShown) {
                cell.gClear();
            } else {
                cell.gDraw();
            }
        });
        this.gridShown = !this.gridShown;
    }
    public addCreep(creep: Creep) {
        console.log('ADD CREEP');
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
    public _gridCellClicked(row, column) {
        // function will be assigned by GameScene, but must be predefined here.
        this.onGridCellClicked(row, column);
    }
    public onGridCellClicked(row, column) {}
}
