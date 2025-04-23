import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { Engine } from '../Bastion';
import Creep from './Creep';
import { CreepEvents } from '../Events';
import { distance, Tower } from './Tower';
import { CreepResistancesDefinition } from '../Definitions';
import GameAssets from '../Assets';

export function calculateAngleToPoint(x, y, targetX, targetY) {
    const dx = targetX - x;
    const dy = targetY - y;
    return Math.atan2(dy, dx);
}

export default class Projectile extends GameObject {
    public deleteMe: boolean = false;
    public sprite: PIXI.AnimatedSprite;
    public x: number;
    public y: number;
    public angle: number;
    public speed: number;
    public damage: number;
    public pierce: number = 1;
    public timeToLive: number;
    public parent: Tower;
    public gemResistanceModifications: CreepResistancesDefinition;
    public collidedCreepIDs = [];
    constructor(
        x,
        y,
        textures,
        angle,
        damage,
        tint,
        timeToLive,
        pierce,
        gemResistanceModifications: CreepResistancesDefinition
    ) {
        super();
        this.x = x;
        this.y = y;
        this.timeToLive = timeToLive;
        this.pierce = pierce;
        this.damage = damage;
        this.gemResistanceModifications = gemResistanceModifications;
        this.sprite = new PIXI.AnimatedSprite({ textures: textures, scale: 0.25, rotation: angle });
        this.sprite.anchor.set(0.5, 0.5);
        // this.sprite.tint = tint;
        this.sprite.play();
        this.container.x = this.x;
        this.container.y = this.y;
        // this.sprite.tint = tint;
        this.container.addChild(this.sprite);
        Engine.GameMaster.currentScene.stage.addChild(this.container);

        this.angle = angle;
        this.speed = 0.9;
    }

    public destroy(): void {
        super.destroy();
        this.deleteMe = true;
    }

    public update(elapsedMS) {
        if (this.deleteMe) return;
        if (this.x > 1720 || this.x < 0 || this.y > 2000 || this.y < 0 || this.pierce <= 0 || this.timeToLive <= 0)
            return this.destroy();
        this.timeToLive -= Engine.GameScene.gameSpeedMultiplier;
        Engine.Grid.creeps.forEach((creep) => {
            if (this.pierce <= 0) return;
            if (creep && creep.container && this.checkCollision(creep)) {
                const exists = this.collidedCreepIDs.find((c) => creep.id == c.id);
                if (!exists) {
                    this.collidedCreepIDs.push(creep);
                    this.pierce--;
                    this.onCollide(creep, this);
                    return;
                }
            }
        });
        this.x += Math.cos(this.angle) * this.speed * elapsedMS * Engine.GameScene.gameSpeedMultiplier;
        this.y += Math.sin(this.angle) * this.speed * elapsedMS * Engine.GameScene.gameSpeedMultiplier;

        this.container.x = this.x;
        this.container.y = this.y;
    }

    public onCollide(creep, proj) {
        /*
        Note:
        Right now it is possible for the bullet to 'overshoot' the creep if the bullet speed is too fast and the position is updated so that the 
        new position is beyond the creep (i.e. the bullet is never 'in the creep').
        This should be fixed so that we calculate the hit if the creep is in a line from the previous position to the new position.
        */
        Engine.GameScene.events.emit(CreepEvents.TakenDamage, creep.id, proj.damage, proj.gemResistanceModifications);
    }

    public checkCollision(creep: Creep) {
        //console.debug(creep);
        if (creep == null || creep.container == null || creep.container._position == null) return;
        const mybb = this.copyContainerToBB();
        const otherbb = creep.copyContainerToBB();
        return mybb.getBounds().intersects(otherbb.getBounds());
    }
}

export class RailProjectile extends Projectile {
    public visuals: PIXI.Sprite[] = [];
    public counter: number = 0;
    constructor(
        x,
        y,
        textures,
        angle,
        damage,
        tint,
        timeToLive,
        pierce,
        gemResistanceModifications: CreepResistancesDefinition
    ) {
        super(x, y, textures, angle, damage, tint, timeToLive, pierce, gemResistanceModifications);
        this.pierce = 1000;
        this.timeToLive = 2000;
    }

    public destroy(): void {
        super.destroy();
        this.visuals.forEach((visual) => visual.destroy());
        this.visuals = [];
    }
    public update(elapsedMS) {
        super.update(elapsedMS);
        if (this.counter == 2) {
            this.counter = 0;
            let newVisual = new PIXI.Sprite({
                x: this.x,
                y: this.y,
                rotation: this.angle,
                texture: this.sprite.texture,
                scale: 0.25,
            });
            newVisual.anchor.set(0.5, 0.5);
            this.visuals.push(newVisual);
            this.visuals.forEach((visual) => {
                if (visual.scale == null) return visual.destroy();
                if (visual.width && visual.height && visual.alpha) {
                    visual.width -= 4;
                    visual.height -= 4;
                    visual.alpha -= 0.1;
                    if (visual.width <= 0 || visual.height <= 0 || visual.alpha <= 0) visual.destroy();
                }
            });
            Engine.GameScene.stage.addChild(newVisual);
        } else this.counter++;
    }
}

export class TrapProjectile extends Projectile {
    public visuals: PIXI.Sprite[] = [];
    public counter: number = 0;
    private goalX: number;
    private goalY: number;
    constructor(
        x,
        y,
        textures,
        angle,
        goalX,
        goalY,
        damage,
        tint,
        timeToLive,
        pierce,
        gemResistanceModifications: CreepResistancesDefinition
    ) {
        super(x, y, textures, angle, damage, tint, timeToLive, pierce, gemResistanceModifications);
        this.sprite.scale = 0.5;
        this.sprite.rotation = Math.random() * Math.PI * 2;
        this.goalX = goalX;
        this.goalY = goalY;
    }

    public destroy(): void {
        super.destroy();
        this.visuals.forEach((visual) => visual.destroy());
        this.visuals = [];
    }
    public update(elapsedMS) {
        if (this.deleteMe) return;
        if (this.x > 1720 || this.x < 0 || this.y > 2000 || this.y < 0 || this.pierce <= 0 || this.timeToLive <= 0)
            return this.destroy();
        if (distance(this.x, this.y, this.goalX, this.goalY) < 25) {
            this.timeToLive -= Engine.GameScene.gameSpeedMultiplier;
            Engine.Grid.creeps.forEach((creep) => {
                if (this.pierce <= 0) return;
                if (creep && creep.container && this.checkCollision(creep)) {
                    this.collidedCreepIDs.push(creep);
                    this.pierce--;
                    this.onCollide(creep, this);
                    return;
                }
            });
        } else {
            this.x += Math.cos(this.angle) * this.speed * elapsedMS * Engine.GameScene.gameSpeedMultiplier;
            this.y += Math.sin(this.angle) * this.speed * elapsedMS * Engine.GameScene.gameSpeedMultiplier;

            this.container.x = this.x;
            this.container.y = this.y;
        }
    }
}

export class VisualLightning extends GameObject {
    public deleteMe: boolean = false;
    private c: Creep;
    private oc: Creep;
    private Lightning: PIXI.AnimatedSprite;
    constructor(creep: Creep, otherCreep: Creep) {
        super();
        this.c = creep;
        this.oc = otherCreep;
        let lightningAngle = calculateAngleToPoint(creep.x, creep.y, otherCreep.x, otherCreep.y);
        this.Lightning = new PIXI.AnimatedSprite({
            textures: GameAssets.SpecialLightning,
            x: creep.x,
            y: creep.y,
            width: distance(this.c.x, this.c.y, this.oc.x, this.oc.y),
            height: 64,
            scale: 1.2,
            rotation: lightningAngle,
        });
        this.Lightning.anchor.set(0, 0.5);
        this.Lightning.play();
        Engine.GameMaster.currentScene.stage.addChild(this.Lightning);
        Engine.DebrisManager.CreateDebris(this, 30);
    }
    public destroy(): void {
        this.deleteMe = true;
        this.container.destroy();
        this.Lightning.destroy();
    }
    public update() {
        if (this.deleteMe) {
            return;
        }
        this.Lightning.x = this.c.x;
        this.Lightning.y = this.c.y;
        this.Lightning.width = distance(this.c.x, this.c.y, this.oc.x, this.oc.y);
    }
}
