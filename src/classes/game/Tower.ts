import { Engine } from '../Bastion';
import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { TowerDefinition } from '../Definitions';
import { Cell } from './Grid';
import { TowerBehaviours } from './TowerManager';
import Projectile, { calculateAngleToPoint } from './Projectile';
import Creep from './Creep';
import Gem from './Gem';

export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export class Tower extends GameObject {
    public row: number;
    public column: number;
    public definition: TowerDefinition;
    public slottedGems: Array<Gem> = [];
    public damageDealt: number = 0;
    private projectiles: Projectile[] = [];
    private behaviour: string;
    private sprite: PIXI.Sprite;
    private ticksUntilNextShot: number;
    private graphics: PIXI.Graphics = new PIXI.Graphics();
    private parent: Cell;

    constructor(row, column, texture, definition, behaviour) {
        super();
        this.row = row;
        this.column = column;
        this.behaviour = behaviour;
        this.definition = definition;
        this.ticksUntilNextShot = 0;
        this.parent = Engine.Grid.getCellByRowAndCol(row, column);
        this.sprite = new PIXI.Sprite({
            texture: texture,
            height: Engine.GridCellSize,
            width: Engine.GridCellSize,
            zIndex: 130,
        });
        this.container.addChild(this.sprite);
        this.parent.container.addChild(this.container);
        this.container.interactiveChildren = true;
        this.parent.clickDetector.on('pointerenter', this.onParentCellEnter);
        this.parent.clickDetector.on('pointerleave', this.onParentCellLeave);
        Engine.GameMaster.currentScene.stage.addChild(this.graphics);
    }

    private onParentCellEnter = (e) => {
        if (!Engine.TowerManager.isPlacingTower && Engine.Grid.gridInteractionEnabled)
            this.parent.showRangePreview(false, this.definition.stats.range);
    };

    private onParentCellLeave = (e) => {
        this.graphics.clear();
    };
    public SlotGem(gem: Gem, index: number) {
        console.log('ATTEMPTING TO SLOT ', gem, index);
        this.slottedGems[index] = gem;
        Engine.GameScene.towerPanel.Hide();
        Engine.GameScene.towerPanel.Show(this);
    }
    public UnslotGem(index) {
        const gem = this.slottedGems.splice(index, 1)[0];
        Engine.GameScene.MissionStats.giveGem(gem, true);
        for (let i = index; i < this.slottedGems.length - 1; i++) {
            if (this.slottedGems[i] == null) {
                this.slottedGems[i] = this.slottedGems[i + 1];
                this.slottedGems[i + 1] = null;
            }
        }
        Engine.GameScene.sidebar.gemTab.selectingGemTowerObject = this;
        this.slottedGems = this.slottedGems.filter((gem) => gem != null);
        Engine.NotificationManager.Notify(
            `Lv. ${gem.level} ${gem.definition.name} unslotted and placed back in your inventory.`,
            'info'
        );
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
            return d < radius + (Engine.GridCellSize * 2) / 3;
        });
    }
    public Shoot(creep: Creep) {
        let x = this.column * Engine.GridCellSize + Engine.GridCellSize / 2;
        let y = this.row * Engine.GridCellSize + Engine.GridCellSize / 2;
        let angle = calculateAngleToPoint(x, y, creep.x, creep.y);
        this.projectiles.push(
            new Projectile(x, y, this.definition.projectileTextures, angle, this.definition.stats.damage)
        );
    }
    public update(elapsedMS: any): void {
        this.projectiles.forEach((proj) => {
            if (proj.deleteMe) {
                this.damageDealt += this.definition.stats.damage;
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

    public destroy(): void {
        super.destroy();
        this.parent.clickDetector.off('pointerenter', this.onParentCellEnter);
        this.parent.clickDetector.off('pointerleave', this.onParentCellLeave);
        this.graphics.destroy();
    }
}
