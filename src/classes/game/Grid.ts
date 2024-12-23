import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { GameMapDefinition, TerrainType } from '../Definitions';
// import Creep, { CreepEvents } from './Creep';
import GameAssets from '../Assets';
import { Viewport } from 'pixi-viewport';
import { Globals } from '../Bastion';

export class Cell extends GameObject {
    public type: TerrainType;
    public row: number;
    public column: number;
    public isPath: boolean = false;

    constructor(type: TerrainType, row: number, column: number, isPath: boolean) {
        super();
        this.type = type;
        this.row = row;
        this.column = column;
        this.isPath = isPath;
        // this.bb.x = parseFloat(environment.Grid.gridUnitsToPixels(this.column).toFixed(2));
        // this.bb.y = parseFloat(environment.Grid.gridUnitsToPixels(this.row).toFixed(2));
        if (column == 24 || column == 23) console.log(`col ${column} ` + Globals.Grid.gridUnitsToPixels(this.column));
        this.bb.x = Globals.Grid.gridUnitsToPixels(this.column);
        this.bb.y = Globals.Grid.gridUnitsToPixels(this.row);
        this.bb.width = Globals.Grid.gridUnitsToPixels(1);
        this.bb.height = Globals.Grid.gridUnitsToPixels(1);
        Globals.Grid.container.addChild(this.container);
        Globals.GameMaster._CreateGameObject(this);
        let g = new PIXI.Graphics();
        g.rect(0, 0, this.bb.width, this.bb.height);
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
        this.container.x = this.bb.x;
        this.container.y = this.bb.y;
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
        if (this.isPath) text.text += 'P';
    }
    public update() {}
}

export class Grid extends GameObject {
    private gameMap: GameMapDefinition;
    private cells: Cell[] = [];
    // public creeps: Creep[] = [];

    constructor(map: GameMapDefinition, missionIndex) {
        super();
        this.gameMap = map;
        Globals.Grid = this;
        this.container.isRenderGroup = true;
        this.bb.x = 0;
        this.bb.y = 110;
        this.bb.width = Globals.WindowWidth - 360;
        this.bb.height = Globals.WindowHeight - 110;
        Globals.app.stage.addChild(this.container);
        Globals.GameMaster._CreateGameObject(this);

        let background = new PIXI.Sprite(GameAssets.MissionBackgrounds[missionIndex]);
        background.x = 0;
        background.y = 0;
        this.bb.width = this.gridUnitsToPixels(1) * this.gameMap.columns;
        this.bb.height = this.gridUnitsToPixels(1) * this.gameMap.rows;
        background.width = this.bb.width;
        background.height = this.bb.height;

        this.container.addChild(background);
    }
    public update() {}
    private getPixelScalingFactor() {
        const pixelScaleX = this.bb.width / this.gameMap.columns;
        const pixelScaleY = this.bb.height / this.gameMap.rows;
        return pixelScaleX < pixelScaleY ? pixelScaleX : pixelScaleY;
    }

    public gridUnitsToPixels(amount: number): number {
        return amount * this.getPixelScalingFactor();
    }

    public pixelsToGridUnits(pixels: number): number {
        return pixels / this.getPixelScalingFactor();
    }
}
