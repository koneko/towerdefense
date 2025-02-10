import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { Engine } from '../Bastion';
import Creep from './Creep';
import { CreepEvents } from '../Events';
import { Tower } from './Tower';
import { CreepResistancesDefinition } from '../Definitions';

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
        this.timeToLive = timeToLive * (0.9 / 0.1);
        this.pierce = pierce;
        this.damage = damage;
        this.gemResistanceModifications = gemResistanceModifications;
        this.sprite = new PIXI.AnimatedSprite({ textures: textures, scale: 0.25, rotation: angle });
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.play();
        this.container.x = this.x;
        this.container.y = this.y;
        this.sprite.tint = tint;
        this.container.addChild(this.sprite);
        Engine.GameMaster.currentScene.stage.addChild(this.container);

        this.angle = angle;
        this.speed = 0.1;
    }
    public destroy(): void {
        super.destroy();
        this.deleteMe = true;
    }

    public update(elapsedMS) {
        if (this.deleteMe) return;
        if (this.x > 2000 || this.x < 0 || this.y > 2000 || this.y < 0 || this.pierce <= 0 || this.timeToLive <= 0)
            return this.destroy();
        this.timeToLive -= Engine.GameScene.gameSpeedMultiplier;
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
        this.x += Math.cos(this.angle) * this.speed * elapsedMS * Engine.GameScene.gameSpeedMultiplier;
        this.y += Math.sin(this.angle) * this.speed * elapsedMS * Engine.GameScene.gameSpeedMultiplier;

        this.container.x = this.x;
        this.container.y = this.y;
    }

    public onCollide(creep) {
        /*
        Note:
        Right now it is possible for the bullet to 'overshoot' the creep if the bullet speed is too fast and the position is updated so that the 
        new position is beyond the creep (i.e. the bullet is never 'in the creep').
        This should be fixed so that we calculate the hit if the creep is in a line from the previous position to the new position.
        */
        Engine.GameScene.events.emit(CreepEvents.TakenDamage, creep.id, this.damage, this.gemResistanceModifications);
    }

    public checkCollision(creep: Creep) {
        console.debug(creep);
        if (creep == null || creep.container == null || creep.container._position == null) return;
        let mybb = this.copyContainerToBB();
        let otherbb = creep.copyContainerToBB();
        return mybb.getBounds().intersects(otherbb.getBounds());
    }
}
