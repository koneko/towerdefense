import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { Engine } from '../Bastion';
import Creep from './Creep';
import { CreepEvents } from '../Events';

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
    public timeToLive: number = 1;
    constructor(x, y, textures, angle, damage) {
        super();
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.sprite = new PIXI.AnimatedSprite({ textures: textures, scale: 0.25, rotation: angle });
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.play();
        this.container.x = this.x;
        this.container.y = this.y;
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
        if (this.x > 2000 || this.x < 0 || this.y > 2000 || this.y < 0 || this.timeToLive <= 0) return this.destroy();
        Engine.Grid.creeps.forEach((creep) => {
            if (this.timeToLive <= 0) return;
            if (creep.container && this.checkCollision(creep)) {
                this.timeToLive--;
                this.onCollide(creep);
                return;
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
        if (creep == null) return;
        let mybb = this.copyContainerToBB();
        let otherbb = creep.copyContainerToBB();
        return mybb.getBounds().intersects(otherbb.getBounds());
    }
}
