import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { Engine } from '../Bastion';
import Creep from './Creep';
import { CreepEvents } from '../Events';
import { Tower } from './Tower';

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
    private collidedCreepIDs = [];
    constructor(x, y, textures, angle, damage, tint, tower: Tower) {
        super();
        this.x = x;
        this.y = y;
        this.timeToLive = tower.computedTimeToLive;
        this.pierce = tower.computedPierce;
        this.parent = tower;
        this.damage = damage;
        this.sprite = new PIXI.AnimatedSprite({ textures: textures, scale: 0.25, rotation: angle });
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.play();
        this.container.x = this.x;
        this.container.y = this.y;
        this.sprite.tint = tint;
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
        if (this.x > 2000 || this.x < 0 || this.y > 2000 || this.y < 0 || this.pierce <= 0 || this.timeToLive <= 0)
            return this.destroy();
        this.timeToLive--;
        Engine.Grid.creeps.forEach((creep) => {
            if (this.pierce <= 0) return;
            if (creep && creep.container && this.checkCollision(creep)) {
                let exists = this.collidedCreepIDs.find((c) => creep.id == c.id);
                if (!exists) {
                    this.collidedCreepIDs.push(creep);
                    this.pierce--;
                    this.onCollide(creep);
                    return;
                }
            }
        });
        this.x += Math.cos(this.angle) * this.speed * elapsedMS;
        this.y += Math.sin(this.angle) * this.speed * elapsedMS;

        this.container.x = this.x;
        this.container.y = this.y;
    }

    public onCollide(creep) {
        Engine.GameScene.events.emit(CreepEvents.TakenDamage, creep.id, this.damage);
    }

    public checkCollision(creep: Creep) {
        console.debug(creep);
        if (creep == null || creep.container == null || creep.container._position == null) return;
        let mybb = this.copyContainerToBB();
        let otherbb = creep.copyContainerToBB();
        return mybb.getBounds().intersects(otherbb.getBounds());
    }
}
