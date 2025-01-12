import GameAssets from '../Assets';
import Assets from '../Assets';
import { Engine } from '../Bastion';
import { CreepStatsDefinition, CreepType, PathDefinition } from '../Definitions';
import GameObject from '../GameObject';
import * as PIXI from 'pixi.js';

export enum CreepEvents {
    Died = 'died',
    TakenDamage = 'takenDamage',
    Escaped = 'escaped',
    Moved = 'moved',
}

export default class Creep extends GameObject {
    public id: number;
    public creepType: CreepType;
    private sprite: PIXI.Sprite;
    private path: PathDefinition;
    private stats: CreepStatsDefinition;
    private pathIndex: number = 0;
    private speed: number;
    public health: number;
    public maxHealth: number;
    public escaped: boolean = false;
    public died: boolean = false;
    public x: number;
    public y: number;
    public dead: boolean = false;
    constructor(creepType: CreepType, path: PathDefinition, id) {
        super();
        this.creepType = creepType;
        // Structured clone is used just in case, so that 1 creep doesnt alter stats for all creeps.
        this.stats = structuredClone(Assets.CreepStats[this.creepType]);
        this.sprite = new PIXI.Sprite({
            texture: GameAssets.BasicCreepTexture,
        });
        this.id = id;
        // Explanation: WaveManager spawns all creeps instantly, and since I don't want
        // them to show up on the beginning while they are waiting, I put them outside the visible
        // part of the currentScene.stage map.
        this.container.x = -70;
        this.container.y = -50;
        this.sprite.width = Engine.GridCellSize;
        this.sprite.height = Engine.GridCellSize;
        this.speed = this.stats.speed;
        this.health = this.stats.health;
        this.maxHealth = this.stats.health;
        this.path = path;
        // Added + 32 to center them.
        this.x = path[0][1] * Engine.GridCellSize + Engine.GridCellSize / 2;
        this.y = path[0][0] * Engine.GridCellSize + Engine.GridCellSize / 2;
        Engine.GameScene.events.on(CreepEvents.TakenDamage, (creepID, damage) => {
            if (creepID != this.id) return;
            this.health -= damage;
        });
        Engine.Grid.container.addChild(this.container);
        this.container.addChild(this.sprite);
    }
    public update(elapsedMS: number) {
        if (this.dead) return;
        if (this.health <= 0) {
            Engine.GameScene.events.emit(CreepEvents.Died, this.maxHealth, this);
            this.destroy();
            // The reason for setting this.dead instead of deleting self is because
            // I need to allow WaveManager/Grid to manage their death and keep array up to date.
            this.dead = true;
            return;
        }
        if (this.pathIndex + 1 == this.path.length) {
            if (this.escaped) return;
            this.events.emit(CreepEvents.Escaped, this);
            this.escaped = true;
            return;
        }
        const currentCell = this.path[this.pathIndex];
        const targetCell = this.path[this.pathIndex + 1];

        // Added + 32 for centering.
        const targetX = targetCell[1] * Engine.GridCellSize + Engine.GridCellSize / 2;
        const targetY = targetCell[0] * Engine.GridCellSize + Engine.GridCellSize / 2;
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
        this.draw();
    }

    public takeDamage(amount: number) {
        this.health -= amount;
        if (this.health < 0 && !this.died) {
            this.died = true;
            this.events.emit(CreepEvents.Died, this);
        }
    }

    public destroy() {
        super.destroy();
        this.container.removeChildren();
    }
    protected draw() {
        this.sprite.anchor.set(0.5, 0.5);
        this.container.x = this.x;
        this.container.y = this.y;
    }
}
