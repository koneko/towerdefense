import { Engine } from '../Bastion';
import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { TowerDefinition } from '../Definitions';
import { Cell } from './Grid';
import { TowerBehaviours } from './TowerManager';
import Projectile, { calculateAngleToPoint } from './Projectile';
import GameAssets from '../Assets';
import Creep from './Creep';

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export type TowerInstance = {
    row: number;
    column: number;
    sprite: PIXI.Sprite;
    projectiles: Array<any>;
    baseDamage: number;
    damage: number;
    cooldown: number;
    ticksToFireAt: number;
    slottedGems: Array<any>;
    cost: number;
    baseRange: number;
    range: number;
};

export enum TowerEvents {
    TowerPlacedEvent = 'towerPlacedEvent',
}

export class Tower extends GameObject {
    public row: number;
    public column: number;
    private projectiles: Projectile[] = [];
    private behaviour: string;
    private definition: TowerDefinition;
    private sprite: PIXI.Sprite;
    private ticksUntilNextShot: number;
    private graphics: PIXI.Graphics = new PIXI.Graphics();
    constructor(row, column, texture, definition, behaviour) {
        super();
        this.row = row;
        this.column = column;
        this.behaviour = behaviour;
        this.definition = definition;
        this.ticksUntilNextShot = 0;
        let parent: Cell = Engine.Grid.getCellByRowAndCol(row, column);
        this.sprite = new PIXI.Sprite({
            texture: texture,
            height: Engine.GridCellSize,
            width: Engine.GridCellSize,
            zIndex: 10,
        });
        this.container.addChild(this.sprite);
        parent.container.addChild(this.container);
        parent.clickDetector.onmouseenter = (e) => {
            this.graphics.circle(
                this.column * Engine.GridCellSize + Engine.GridCellSize / 2,
                this.row * Engine.GridCellSize + Engine.GridCellSize / 2,
                this.definition.stats.range * Engine.GridCellSize
            );
            this.graphics.fill({ color: 0xff0000, alpha: 0.5 });
        };
        parent.clickDetector.onmouseleave = (e) => {
            this.graphics.clear();
        };
        Engine.GameMaster.currentScene.stage.addChild(this.graphics);
    }
    public GetCreepsInRange() {
        let creeps = Engine.Grid.creeps;
        return creeps.filter((creep) => {
            const x = creep.x;
            const y = creep.y;
            const towerX = this.column * Engine.GridCellSize + Engine.GridCellSize / 2;
            const towerY = this.row * Engine.GridCellSize + Engine.GridCellSize / 2;
            const radius = this.definition.stats.range * Engine.GridCellSize;
            const d = distance(towerX, towerY, x, y);
            return d < radius + Engine.GridCellSize;
        });
    }
    public Shoot(creep: Creep) {
        let x = this.column * Engine.GridCellSize + Engine.GridCellSize / 2;
        let y = this.row * Engine.GridCellSize + Engine.GridCellSize / 2;
        let angle = calculateAngleToPoint(x, y, creep.x, creep.y);
        this.projectiles.push(
            new Projectile(x, y, GameAssets.BasicProjectileTexture, angle, this.definition.stats.damage)
        );
    }
    public update(elapsedMS: any): void {
        this.projectiles.forEach((proj) => {
            if (proj.deleteMe) {
                this.projectiles.splice(this.projectiles.indexOf(proj), 1);
                proj = null;
            } else proj.update(elapsedMS);
        });
        if (this.behaviour == TowerBehaviours.BasicTowerBehaviour) {
            if (this.ticksUntilNextShot > 0) this.ticksUntilNextShot--;
            let creepsInRange = this.GetCreepsInRange();
            if (creepsInRange.length > 0) {
                let focus = creepsInRange[0];
                if (this.ticksUntilNextShot == 0) {
                    this.ticksUntilNextShot = this.definition.stats.cooldown;
                    this.Shoot(focus);
                }
            }
        }
    }
}
