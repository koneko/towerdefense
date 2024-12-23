import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { GameMapDefinition, TerrainType } from '../Definitions';
import GameAssets from '../Assets';
import { Globals } from '../Bastion';
import Creep, { CreepEvents } from './Creep';

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
        this.bb.x = this.column * 64;
        this.bb.y = this.row * 64;
        this.bb.width = 64;
        this.bb.height = 64;
        Globals.Grid.container.addChild(this.container);
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
    public creeps: Creep[] = [];

    constructor(map: GameMapDefinition, missionIndex) {
        super();
        this.gameMap = map;
        Globals.Grid = this;
        this.bb.x = 0;
        this.bb.y = 0;
        this.bb.width = 64 * 30;
        this.bb.height = 64 * 17;
        Globals.app.stage.addChild(this.container);

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
            creep.update(elapsedMS);
        });
    }
}
