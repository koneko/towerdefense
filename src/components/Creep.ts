import Assets from '../base/Assets';
import { CreepType, PathDefinition } from '../base/Definitions';
import GameObject from '../base/GameObject';
import * as PIXI from 'pixi.js';
import GameScene from '../scenes/GameScene';
import { Grid } from './Grid';

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
    private speed: number = 0.002;
    private gameScene: GameScene;
    public health: number = 2;
    public escaped: boolean = false;
    public died: boolean = false;
    public x: number; // X and Y are local to the grid, not canvas
    public y: number;
    constructor(creepType: CreepType, path: PathDefinition, gameScene: GameScene, bounds?: PIXI.Rectangle) {
        super(bounds);
        this.creepType = creepType;
        this.path = path;
        this.gameScene = gameScene;
        this.x = path[0][1] + 0.5; // centered
        this.y = path[0][0] + 0.5;
        this.gameScene.grid.container.addChild(this.container);
    }
    public update(elapsedMS: number) {
        if (this.pathIndex + 1 == this.path.length) {
            if (this.escaped) return;
            this.events.emit(CreepEvents.Escaped, this);
            this.escaped = true;
            return;
        }
        const currentCell = this.path[this.pathIndex];
        const targetCell = this.path[this.pathIndex + 1];

        const targetX = targetCell[1] + 0.5;
        const targetY = targetCell[0] + 0.5;
        const directionX = targetCell[1] - currentCell[1];
        const directionY = targetCell[0] - currentCell[0];
        let deltaX = this.speed * elapsedMS * directionX;
        let deltaY = this.speed * elapsedMS * directionY;
        let increaseIndex = false;

        if (deltaX > 0 && this.x + deltaX > targetX) {
            // limit to center of target cell
            deltaX = targetX - this.x;
            increaseIndex = true;
        }
        if (deltaX < 0 && this.x + deltaX < targetX) {
            // limit to center of target cell
            deltaX = targetX - this.x;
            increaseIndex = true;
        }
        if (deltaY > 0 && this.y + deltaY > targetY) {
            // limit to center of target cell
            deltaY = targetY - this.y;
            increaseIndex = true;
        }
        if (deltaY < 0 && this.y + deltaY < targetY) {
            // limit to center of target cell
            deltaY = targetY - this.y;
            increaseIndex = true;
        }
        this.x += deltaX;
        this.y += deltaY;
        if (increaseIndex) this.pathIndex++;
        this.setBounds(
            new PIXI.Rectangle(
                this.gameScene.grid.gridUnitsToPixels(this.x),
                this.gameScene.grid.gridUnitsToPixels(this.y),
                this.gameScene.grid.gridUnitsToPixels(0.5),
                this.gameScene.grid.gridUnitsToPixels(0.6)
            )
        );
    }

    public takeDamage(amount: number) {
        this.health -= amount;
        if (this.health < 0 && !this.died) {
            this.died = true;
            this.events.emit(CreepEvents.Died, this);
        }
    }

    public override destroy() {
        super.destroy();
        this.draw = null;
        this.container.removeChildren();
    }
    protected draw() {
        this.container.removeChildren();
        const sprite = new PIXI.Sprite(Assets.BasicCreepTexture);
        sprite.x = 0;
        sprite.y = 0;
        sprite.anchor.set(0.5, 0.5);
        sprite.width = this.bounds.width;
        sprite.height = this.bounds.height;
        this.container.addChild(sprite);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
