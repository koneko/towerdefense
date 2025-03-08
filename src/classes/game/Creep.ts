import Assets from '../Assets';
import { Engine } from '../Bastion';
import { CreepResistancesDefinition, CreepStatsDefinition, CreepType, PathDefinition } from '../Definitions';
import GameObject from '../GameObject';
import * as PIXI from 'pixi.js';
import { CreepEvents } from '../Events';

export enum CreepEffects {
    MovingBackwards = 'MovingBackwards',
    DebuffTowerDebuff = 'DebuffTowerDebuff',
}

class Effect {
    public effectEnum: CreepEffects;
    public durationInMS: number;
    public ticks: number = 0;
    constructor(effectEnum: CreepEffects, durationInMS: number) {
        this.effectEnum = effectEnum;
        this.durationInMS = durationInMS;
    }
}

export default class Creep extends GameObject {
    public id: number;
    public creepType: CreepType;
    private sprite: PIXI.AnimatedSprite;
    private path: PathDefinition;
    private stats: CreepStatsDefinition;
    private pathIndex: number = 0;
    private speed: number;
    private direction: number = 1;
    private healthBarGraphics: PIXI.Graphics = new PIXI.Graphics();
    private healthBarWidth = 50;
    private effects: Effect[] = [];
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
        this.stats = structuredClone(Assets.Creeps[this.creepType].stats);
        this.sprite = new PIXI.AnimatedSprite(Assets.Creeps[this.creepType].textures);
        // Initially flip sprite to the right, since the asset is facing left.
        this.sprite.scale.x *= -1;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.animationSpeed = 0.3;
        this.sprite.tint = Assets.Creeps[this.creepType].tint;
        this.sprite.play();
        this.id = id;
        // Explanation: WaveManager spawns all creeps instantly, and since I don't want
        // them to show up on the beginning while they are waiting, I put them outside the visible
        // part of the currentScene.stage map.
        this.container.x = -70;
        this.container.y = -50;
        this.sprite.width = Engine.GridCellSize;
        this.sprite.height = Engine.GridCellSize;
        this.bb.width = this.sprite.width;
        this.speed = this.stats.speed / 60;
        this.health = this.stats.health;
        this.maxHealth = this.stats.health;
        this.path = path;
        this.x = path[0][0] * Engine.GridCellSize + Engine.GridCellSize / 2;
        this.y = path[0][1] * Engine.GridCellSize + Engine.GridCellSize / 2;
        Engine.GameScene.events.on(
            CreepEvents.TakenDamage,
            (creepID, damage, gemResistanceModifications: CreepResistancesDefinition) => {
                if (creepID != this.id) return;
                if (this.effects.find((e) => e.effectEnum == CreepEffects.DebuffTowerDebuff)) {
                    damage = damage * 1.5;
                }
                // Apply resistances.
                this.health -= Math.max(
                    damage + damage * (gemResistanceModifications.physical - this.stats.resistance.physical),
                    0
                );
                if (gemResistanceModifications.fire != 0)
                    this.health -= Math.max(damage * (gemResistanceModifications.fire - this.stats.resistance.fire), 0);
                if (gemResistanceModifications.ice != 0)
                    this.health -= Math.max(damage * (gemResistanceModifications.ice - this.stats.resistance.ice), 0);
                if (gemResistanceModifications.frostfire != 0)
                    this.health -= Math.max(
                        damage * (gemResistanceModifications.frostfire - this.stats.resistance.frostfire),
                        0
                    );
                if (gemResistanceModifications.divine != 0)
                    this.health -= Math.max(
                        damage * (gemResistanceModifications.divine - this.stats.resistance.divine),
                        0
                    );
                this.UpdateHealthbar();
            }
        );
        Engine.GameScene.events.on(
            CreepEvents.GiveEffect,
            (creepID: number, effect: CreepEffects, durationInMS: number) => {
                if (creepID != this.id) return;
                if (this.effects.find((e) => e.effectEnum == effect) == undefined)
                    this.effects.push(new Effect(effect, durationInMS));
            }
        );
        Engine.Grid.container.addChild(this.container);
        this.container.addChild(this.healthBarGraphics);
        this.container.addChild(this.sprite);
        this.UpdateHealthbar();
    }
    // Used ChatGPT to make this easier to understand.
    private UpdateHealthbar() {
        this.healthBarGraphics.clear();

        const hp = this.health;
        const maxHp = this.maxHealth;
        const percent = Math.max(0, hp / maxHp);

        const barWidth = this.healthBarWidth;
        const barHeight = 10; // Height of the health bar
        const borderPadding = 2; // Border thickness around the health bar
        const offsetX = -barWidth / 2; // Centering the bar
        const offsetY = -32; // Position above the entity

        // Border
        this.healthBarGraphics.rect(
            offsetX - borderPadding,
            offsetY - borderPadding,
            barWidth + borderPadding * 2,
            barHeight + borderPadding * 2
        );
        this.healthBarGraphics.fill({ color: 0x000000 });

        // Health
        const healthWidth = barWidth * percent;
        this.healthBarGraphics.rect(offsetX, offsetY, healthWidth, barHeight);
        this.healthBarGraphics.fill({ color: 0xff0000 });
    }

    public update(elapsedMS: number) {
        if (this.dead) return;
        if (this.health <= 0) {
            Engine.GameScene.events.emit(CreepEvents.Died, this.maxHealth, this);
            this.destroy();
            // The reason for setting this.dead instead of deleting self is because
            // I need to allow WaveManager/Grid to manage their death and keep array up to date.
            // Also I realised that you can't do that from the object itself.
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
        const previousCell = this.pathIndex - 1 != 0 ? this.path[this.pathIndex - 1] : this.path[0];
        let isMovingBackwards = false;
        for (let i = this.effects.length - 1; i >= 0; i--) {
            let effect = this.effects[i];
            effect.ticks += elapsedMS * Engine.GameScene.gameSpeedMultiplier;
            if (effect.ticks >= effect.durationInMS) this.effects.splice(i, 1);
            else if (effect.effectEnum == CreepEffects.MovingBackwards) return (isMovingBackwards = true);
        }

        let targetX, targetY, directionX, directionY;
        if (!isMovingBackwards) {
            targetX = targetCell[0] * Engine.GridCellSize + Engine.GridCellSize / 2;
            targetY = targetCell[1] * Engine.GridCellSize + Engine.GridCellSize / 2;
            directionX = targetCell[0] - currentCell[0];
            directionY = targetCell[1] - currentCell[1];
        } else {
            targetX = previousCell[0] * Engine.GridCellSize + Engine.GridCellSize / 2;
            targetY = previousCell[1] * Engine.GridCellSize + Engine.GridCellSize / 2;
            directionX = currentCell[0] - previousCell[0];
            directionY = previousCell[1] - currentCell[1];
        }
        if (directionX > 0) {
            // Going right
            if (this.direction != 1) {
                this.direction = 1;
                this.sprite.scale.x *= -1;
            }
        } else if (directionX < 0) {
            // Going left
            if (this.direction != -1) {
                this.direction = -1;
                this.sprite.scale.x *= -1;
            }
        }
        let deltaX = this.speed * elapsedMS * directionX * Engine.GameScene.gameSpeedMultiplier;
        let deltaY = this.speed * elapsedMS * directionY * Engine.GameScene.gameSpeedMultiplier;
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
        if (increaseIndex) {
            if (!isMovingBackwards) this.pathIndex++;
        }
        this.container.x = this.x;
        this.container.y = this.y;
    }

    // public takeDamage(amount: number) {
    //     this.health -= amount;
    //     if (this.health < 0 && !this.died) {
    //         this.died = true;
    //         this.events.emit(CreepEvents.Died, this);
    //     }
    // }

    public destroy() {
        super.destroy();
        this.container.removeChildren();
    }
}
