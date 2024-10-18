import * as PIXI from 'pixi.js';
import GameObject from '../base/GameObject';
import { GameMapDefinition, TerrainType } from '../base/Definitions';
import Creep, { CreepEvents } from './Creep';
import GameScene from '../scenes/GameScene';
import Assets from '../base/Assets';

export class Cell extends GameObject {
    public type: TerrainType;
    public row: number;
    public column: number;
    public isPath: boolean = false;
    private grid: Grid;

    constructor(type: TerrainType, row: number, column: number, isPath: boolean, grid: Grid, bounds?: PIXI.Rectangle) {
        super(bounds);
        this.type = type;
        this.row = row;
        this.column = column;
        this.isPath = isPath;
        this.grid = grid;
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
            case TerrainType.Path:
                g.fill(0xff00ff);
                break;
            case TerrainType.Buildable:
                g.stroke(0x00ff00);
                break;
        }
        this.container.addChild(g);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        if (!Assets.DebuggingEnabled) return;
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
        text.x = this.bounds.width / 2;
        text.y = this.bounds.height / 2;
        if (this.isPath) text.text += 'P';
    }
}

export class Grid extends GameObject {
    private gameMap: GameMapDefinition;
    private cells: Cell[] = [];
    private gameScene: GameScene;
    public creeps: Creep[] = [];

    constructor(map: GameMapDefinition, gameScene: GameScene, bounds?: PIXI.Rectangle) {
        super(bounds);
        this.gameMap = map;
        this.gameScene = gameScene;
        console.log(this.gameMap.paths);
        for (let y = 0; y < this.gameMap.columns; y++) {
            for (let x = 0; x < this.gameMap.rows; x++) {
                let type;
                try {
                    type = this.gameMap.cells[x][y];
                } catch (e) {
                    type = 1;
                }
                const isPath = this.gameMap.paths.some((path) => path.some((p) => p[0] === x && p[1] === y));
                if (isPath) type = TerrainType.Path;
                let cell = new Cell(type, x, y, isPath, this);
                this.cells.push(cell);
            }
        }
        console.log(this.cells);
        this.draw();
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
    protected draw() {
        console.log('Drawing Grid', this.bounds);
        this.container.removeChildren();
        // let g = new PIXI.Graphics();
        // g.rect(0, 0, this.bounds.width, this.bounds.height + 100);
        // g.fill(0xffffff);
        // this.container.addChild(g);
        let background = new PIXI.Sprite(Assets.MissionBackgrounds[this.gameScene.missionIndex]);
        background.x = 0;
        background.y = 0;
        background.width = this.bounds.width;
        background.height = this.bounds.height;
        this.container.addChild(background);
        for (let cell of this.cells) {
            cell.setBounds(
                this.gridUnitsToPixels(cell.column),
                this.gridUnitsToPixels(cell.row),
                this.gridUnitsToPixels(1),
                this.gridUnitsToPixels(1)
            );
            this.container.addChild(cell.container);
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
