import * as PIXI from 'pixi.js';
import GameObject from '../base/GameObject';
import { GameMapDefinition, TerrainType } from '../base/Definitions';
import Creep, { CreepEvents } from './Creep';

export class Cell extends GameObject {
    public type: TerrainType;
    public row: number;
    public column: number;
    public isPath: boolean = false;

    constructor(type: TerrainType, row: number, column: number, isPath: boolean, bounds?: PIXI.Rectangle) {
        super(bounds);
        this.type = type;
        this.row = row;
        this.column = column;
        this.isPath = isPath;
        this.draw();
    }

    protected draw() {
        this.container.removeChildren();
        let g = new PIXI.Graphics();
        g.rect(0, 0, this.bounds.width, this.bounds.height);
        switch (this.type) {
            case TerrainType.Restricted:
                g.fill(0xff0000);
                break;
            case TerrainType.Buildable:
                g.fill(0x00ff00);
                break;
        }
        this.container.addChild(g);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}

export class Grid extends GameObject {
    private gameMap: GameMapDefinition;
    private cells: Cell[] = [];
    private creeps: Creep[] = [];

    constructor(map: GameMapDefinition, bounds?: PIXI.Rectangle) {
        super(bounds);
        this.gameMap = map;
        console.log(this.gameMap.paths);
        for (let y = 0; y < this.gameMap.rows; y++) {
            for (let x = 0; x < this.gameMap.columns; x++) {
                let type = this.gameMap.cells[x][y];
                const isPath = this.gameMap.paths.some((path) => path.some((p) => p[0] === x && p[1] === y));
                if (isPath) type = TerrainType.Restricted;
                let cell = new Cell(type, x, y, isPath);
                this.cells.push(cell);
            }
        }
        console.log(this.cells);
        this.draw();
    }
    public addCreep(creep: Creep) {
        this.creeps.push(creep);
        creep.events.on(CreepEvents.Moved, (movedCreep) => {
            this.onCreepMoved(movedCreep);
        });
        creep.events.on(CreepEvents.Died, (diedCreep) => {
            this.onCreepDiedOrEscaped(diedCreep);
        });
        creep.events.on(CreepEvents.Escaped, (escapedCreep) => {
            this.onCreepDiedOrEscaped(escapedCreep);
        });
        this.draw();
    }
    private onCreepMoved(movedCreep: Creep) {
        movedCreep.setBounds(
            new PIXI.Rectangle(
                this.gridUnitsToPixels(movedCreep.x),
                this.gridUnitsToPixels(movedCreep.y),
                this.gridUnitsToPixels(0.5),
                this.gridUnitsToPixels(0.6)
            )
        );
    }
    private onCreepDiedOrEscaped(creep: Creep) {
        this.creeps.splice(this.creeps.indexOf(creep), 1);
        this.draw();
    }
    protected draw() {
        console.log('Drawing Grid', this.bounds);
        this.container.removeChildren();
        let g = new PIXI.Graphics();
        g.rect(0, 0, this.bounds.width, this.bounds.height);
        g.fill(0x00aa00);
        this.container.addChild(g);
        for (let cell of this.cells) {
            cell.setBounds(
                this.gridUnitsToPixels(cell.column),
                this.gridUnitsToPixels(cell.row),
                this.gridUnitsToPixels(1),
                this.gridUnitsToPixels(1)
            );
            this.container.addChild(cell.container);
        }
        for (const creep of this.creeps) {
            creep.setBounds(
                this.gridUnitsToPixels(creep.x),
                this.gridUnitsToPixels(creep.y),
                this.gridUnitsToPixels(0.5),
                this.gridUnitsToPixels(0.6)
            );
            // console.log(creep.getBounds());
            this.container.addChild(creep.container);
        }
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }

    private getPixelScalingFactor() {
        const pixelScaleX = this.container.width / this.gameMap.columns;
        const pixelScaleY = this.container.height / this.gameMap.rows;
        return pixelScaleX < pixelScaleY ? pixelScaleX : pixelScaleY;
    }

    public gridUnitsToPixels(amount: number): number {
        return amount * this.getPixelScalingFactor();
    }

    public pixelsToGridUnits(pixels: number): number {
        return pixels / this.getPixelScalingFactor();
    }
}
