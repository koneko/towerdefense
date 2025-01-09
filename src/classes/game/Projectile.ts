import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { Engine } from '../Bastion';
import Creep, { CreepEvents } from './Creep';

export function calculateAngleToPoint(x, y, targetX, targetY) {
    const dx = targetX - x;
    const dy = targetY - y;
    return Math.atan2(dy, dx);
}

export default class Projectile extends GameObject {
    public deleteMe: boolean = false;
    public sprite: PIXI.Sprite;
    public x: number;
    public y: number;
    public angle: number;
    public speed: number;
    public damage: number;
    public timeToLive: number = 1;
    constructor(x, y, spriteTexture, angle, damage) {
        super();
        console.log('I SHOOTTED!');
        this.x = x;
        this.y = y;
        this.damage = damage;

        this.sprite = new PIXI.Sprite({ texture: spriteTexture, scale: 0.5, rotation: angle });
        this.sprite.anchor.set(0.5);
        this.container.x = this.x;
        this.container.y = this.y;
        this.container.addChild(this.sprite);
        Engine.app.stage.addChild(this.container);

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
        console.log('COLLIDED WITH' + creep);
        Engine.GameScene.events.emit(CreepEvents.TakenDamage, creep.id, this.damage);
    }

    public checkCollision(creep: Creep) {
        if (creep == null) return;
        let mybb = this.copyContainerToBB();
        let otherbb = creep.copyContainerToBB();
        return mybb.getBounds().intersects(otherbb.getBounds());
        // console.log(boundsA, boundsB);
        // return (
        //     boundsA.x < boundsB.x + boundsB.width &&
        //     boundsA.x + boundsA.width > boundsB.x &&
        //     boundsA.y < boundsB.y + boundsB.height &&
        //     boundsA.y + boundsA.height > boundsB.y
        // );
    }
}
