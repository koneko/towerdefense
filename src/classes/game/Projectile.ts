import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { Globals } from '../Bastion';

export function calculateAngleToPoint(x, y, targetX, targetY) {
    const dx = targetX - x;
    const dy = targetY - y;
    return Math.atan2(dy, dx);
}

export default class Projectile extends GameObject {
    public sprite: PIXI.Sprite;
    public x: number;
    public y: number;
    public angle: number;
    public speed: number;
    constructor(x, y, spriteTexture, angle) {
        super();
        this.x = x;
        this.y = y;

        this.sprite = new PIXI.Sprite({ texture: spriteTexture, scale: 0.5, rotation: angle });
        this.sprite.anchor.set(0.5);
        this.container.x = this.x;
        this.container.y = this.y;
        this.container.addChild(this.sprite);
        Globals.app.stage.addChild(this.container);

        this.angle = angle;

        this.speed = 0.9;
    }

    public update(elapsedMS) {
        if (this.x > 2000 || this.x < 0 || this.y > 2000 || this.y < 0) return this.destroy();
        this.x += Math.cos(this.angle) * this.speed * elapsedMS;
        this.y += Math.sin(this.angle) * this.speed * elapsedMS;

        this.container.x = this.x;
        this.container.y = this.y;
    }

    public onCollide(otherSprite) {
        console.log(`Collision detected with`, otherSprite);
    }

    public checkCollision(otherSprite) {
        const boundsA = this.sprite.getBounds();
        const boundsB = otherSprite.getBounds();
        return (
            boundsA.x < boundsB.x + boundsB.width &&
            boundsA.x + boundsA.width > boundsB.x &&
            boundsA.y < boundsB.y + boundsB.height &&
            boundsA.y + boundsA.height > boundsB.y
        );
    }
}
