import { CreepType, PathDefinition } from '../base/Definitions';
import GameObject from '../base/GameObject';
import * as PIXI from 'pixi.js';

export function CreepStats(ctype: CreepType): object {
    switch (ctype) {
        case CreepType.Basic:
            return {
                health: 2,
                speed: 0.45,
                special: null,
                resistance: {
                    physical: 0,
                    divine: 0,
                    fire: 0,
                    ice: 0,
                    frostfire: 0,
                },
            };
        case CreepType.Fast:
            throw new Error('Fast creep not defined.');
        default:
            return {
                health: null,
                speed: null,
                special: null,
                resistance: {
                    physical: null,
                    divine: null,
                    fire: null,
                    ice: null,
                    frostfire: null,
                },
            };
    }
}
export default class Creep extends GameObject {
    public creepType: CreepType;
    private path: PathDefinition;
    private pathIndex: number = 0;
    private health: number;
    private x: number; // X and Y are local to the grid, not canvas
    private y: number;
    constructor(
        creepType: CreepType,
        path: PathDefinition,
        bounds?: PIXI.Rectangle
    ) {
        super(bounds);
        this.creepType = creepType;
        this.path = path;
    }
    public update() {}

    protected draw() {
        this.container.removeChildren();

        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
