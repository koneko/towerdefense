import Assets from '../base/Assets';
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

export enum CreepEvents {
    Died = 'died',
    TakenDamage = 'takenDamage',
    Escaped = 'escaped',
    Moved = 'moved',
}

export default class Creep extends GameObject {
    public creepType: CreepType;
    private path: PathDefinition;
    private pathIndex: number = 0;
    private health: number;
    private speed: number = 0.5;
    public x: number; // X and Y are local to the grid, not canvas
    public y: number;
    constructor(creepType: CreepType, path: PathDefinition, bounds?: PIXI.Rectangle) {
        super(bounds);
        this.creepType = creepType;
        this.path = path;
        this.x = path[0][0] + 0.5; // centered
        this.y = path[0][1] + 0.5;
    }
    public update(elapsedMS: number) {
        if (this.pathIndex + 1 == this.path.length) {
            this.events.emit(CreepEvents.Escaped, this);
            return;
        }
        const currentCell = this.path[this.pathIndex];
        const targetCell = this.path[this.pathIndex + 1];
        const directionX = targetCell[1] - currentCell[1];
        const directionY = targetCell[0] - currentCell[0];
        let deltaX = this.speed * elapsedMS * directionX;
        let deltaY = this.speed * elapsedMS * directionY;
        if (this.x + deltaX > targetCell[1] + 0.5) {
            // limit to center of target cell
            deltaX = targetCell[1] + 0.5 - this.x;
            this.pathIndex++;
        }
        if (this.y + deltaY > targetCell[0] + 0.5) {
            // limit to center of target cell
            deltaY = targetCell[0] + 0.5 - this.y;
            this.pathIndex++;
        }
        this.x += deltaX;
        this.y += deltaY;
        console.log('creep moved', deltaX, deltaY);
        this.events.emit(CreepEvents.Moved, this);
    }

    public takeDamage(amount: number) {
        this.health -= amount;
        if (this.health < 0) {
            this.events.emit(CreepEvents.Died, this);
        }
    }

    protected draw() {
        this.container.removeChildren();
        const sprite = new PIXI.Sprite(Assets.BasicCreepTexture);
        sprite.x = 0;
        sprite.y = 0;
        sprite.width = this.bounds.width;
        sprite.height = this.bounds.height;
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
