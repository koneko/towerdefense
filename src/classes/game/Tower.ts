import { Globals } from '../Bastion';
import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { TowerDefinition } from '../Definitions';
import { Cell } from './Grid';

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

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

export class Tower extends GameObject {
    public row: number;
    public column: number;
    private definition: TowerDefinition;
    private sprite: PIXI.Sprite;
    private antiLag = 0;
    private debugGraphics: PIXI.Graphics = new PIXI.Graphics();
    private dbgtxt: any;
    constructor(row, column, texture, definition) {
        super();
        this.row = row;
        this.column = column;
        this.definition = definition;
        let parent: Cell = Globals.Grid.getCellByRowAndCol(row, column);
        this.sprite = new PIXI.Sprite({
            texture: texture,
            height: 64,
            width: 64,
            zIndex: 10,
        });
        this.dbgtxt = new PIXI.Text({
            text: 'instantiating',
            x: 0,
            y: -20,
            style: {
                fill: 0x0ff00f,
            },
        });
        this.container.addChild(this.sprite);
        this.container.addChild(this.dbgtxt);
        parent.container.addChild(this.container);
        parent.clickDetector.onmouseenter = (e) => {
            this.debugGraphics.circle(this.column * 64 + 32, this.row * 64 + 32, this.definition.stats.range * 64);
            this.debugGraphics.fill({ color: 0xff0000, alpha: 0.5 });
        };
        parent.clickDetector.onmouseleave = (e) => {
            this.debugGraphics.clear();
        };
        Globals.app.stage.addChild(this.debugGraphics);
    }
    public GetCreepsInRange() {
        let creeps = Globals.Grid.creeps;
        return creeps.filter((creep) => {
            const x = creep.x;
            const y = creep.y;
            const towerX = this.column * 64 + 32;
            const towerY = this.row * 64 + 32;
            const radius = this.definition.stats.range * 64;
            const d = distance(towerX, towerY, x, y);
            return d < radius;
        });
    }
    public update(elapsedMS: any): void {
        if (this.antiLag >= 10) {
            this.antiLag = 0;
            let inrange = this.GetCreepsInRange().length;
            this.dbgtxt.text = inrange;
        }
        this.antiLag++;
    }
}
