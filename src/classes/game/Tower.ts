import { Engine } from '../Bastion';
import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import { CreepResistancesDefinition, TowerDefinition } from '../Definitions';
import { Cell } from './Grid';
import { TowerBehaviours } from './TowerManager';
import Projectile, { RailProjectile } from './Projectile';
import Gem from './Gem';
import {
    DebuffTowerBehaviour,
    BasicTowerBehaviour,
    CircleTowerBehaviour,
    ElectricTowerBehaviour,
    BuffTowerBehaviour,
    RailTowerBehaviour,
    StrongTowerBehaviour,
    TrapperTowerBehaviour,
} from './TowerBehaviours';

export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export class Tower extends GameObject {
    public row: number;
    public column: number;
    public setAsSold: boolean = false;
    public sold: boolean = false;
    public definition: TowerDefinition;
    public slottedGems: Array<Gem> = [];
    public damageDealt: number = 0;
    public projectiles: Projectile[] = [];
    public behaviour: string;
    public sprite: PIXI.Sprite;
    public millisecondsUntilNextShot: number;
    public graphics: PIXI.Graphics = new PIXI.Graphics();
    public computedDamageToDeal: number = 0;
    public computedCooldown: number = 0;
    public computedRange: number = 0;
    public computedTimeToLive: number = 0;
    public computedPierce: number = 0;
    public totalGemResistanceModifications: CreepResistancesDefinition = {
        fire: 0,
        frostfire: 0,
        divine: 0,
        ice: 0,
        physical: 0,
    };
    public parent: Cell;

    constructor(row, column, texture, definition, behaviour) {
        super();
        this.row = row;
        this.column = column;
        this.behaviour = behaviour;
        this.definition = definition;
        this.millisecondsUntilNextShot = 0;
        this.parent = Engine.Grid.getCellByRowAndCol(row, column);
        this.sprite = new PIXI.Sprite({
            texture: texture,
            height: Engine.GridCellSize,
            width: Engine.GridCellSize,
            zIndex: 130,
        });
        this.container.addChild(this.sprite);
        this.computedDamageToDeal = this.definition.stats.damage;
        this.computedRange = this.definition.stats.range;
        this.parent.container.addChild(this.container);
        this.container.interactiveChildren = true;
        this.parent.clickDetector.on('pointerenter', this.onParentCellEnter);
        this.parent.clickDetector.on('pointerleave', this.onParentCellLeave);
        Engine.GameMaster.currentScene.stage.addChild(this.graphics);
    }

    private onParentCellEnter = (e) => {
        if (
            !Engine.TowerManager.isPlacingTower &&
            Engine.Grid.gridInteractionEnabled &&
            !Engine.GameScene.towerPanel.isShown
        )
            this.parent.showRangePreview(false, this.computedRange);
    };

    private onParentCellLeave = (e) => {
        this.graphics.clear();
    };
    public SlotGem(gem: Gem, index: number) {
        this.slottedGems[index] = gem;
        Engine.GameScene.towerPanel.Hide();
        Engine.GameScene.towerPanel.Show(this);
    }
    public UnslotGem(index) {
        const gem = this.slottedGems.splice(index, 1)[0];
        if (gem == null || !gem) return console.warn('UnslotGem: Gem is null.');
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
            const radius = this.computedRange * Engine.GridCellSize;
            const d = distance(towerX, towerY, x, y);
            return d < radius + (Engine.GridCellSize * 2) / 3;
        });
    }

    public Shoot(angle) {
        let x = this.column * Engine.GridCellSize + Engine.GridCellSize / 2;
        let y = this.row * Engine.GridCellSize + Engine.GridCellSize / 2;
        let combinedTint = new PIXI.Color('white');
        if (this.slottedGems.length > 0) {
            let color = new PIXI.Color(this.slottedGems[0].definition.color);
            for (let i = 1; i < this.slottedGems.length; i++) {
                const element = this.slottedGems[i];
                color.multiply(element.definition.color);
            }
            combinedTint = color;
        }

        let proj;
        if (this.behaviour == TowerBehaviours.RailTowerBehaviour) {
            proj = new RailProjectile(
                x,
                y,
                this.definition.projectileTextures,
                angle,
                this.computedDamageToDeal,
                combinedTint,
                this.computedTimeToLive,
                this.computedPierce,
                this.totalGemResistanceModifications
            );
        } else {
            proj = new Projectile(
                x,
                y,
                this.definition.projectileTextures,
                angle,
                this.computedDamageToDeal,
                combinedTint,
                this.computedTimeToLive,
                this.computedPierce,
                this.totalGemResistanceModifications
            );
        }
        // const time = new Date().toISOString();
        // console.log(`${time} ${this.definition.name} shot at ${angle} degrees`);
        this.projectiles.push(proj);
        return proj;
    }
    public Sell() {
        // Selling logic is handled in TowerManager.update()
        this.setAsSold = true;
    }
    public update(elapsedMS: any): void {
        if (this.sold) return;
        if (this.setAsSold) {
            this.sold = true;
        }
        if (this.behaviour == TowerBehaviours.BasicTowerBehaviour) BasicTowerBehaviour(this, elapsedMS);
        if (this.behaviour == TowerBehaviours.CircleTowerBehaviour) CircleTowerBehaviour(this, elapsedMS);
        if (this.behaviour == TowerBehaviours.ElectricTowerBehaviour) ElectricTowerBehaviour(this, elapsedMS);
        if (this.behaviour == TowerBehaviours.BuffTowerBehaviour) BuffTowerBehaviour(this, elapsedMS);
        if (this.behaviour == TowerBehaviours.StrongTowerBehaviour) StrongTowerBehaviour(this, elapsedMS);
        if (this.behaviour == TowerBehaviours.RailTowerBehaviour) RailTowerBehaviour(this, elapsedMS);
        if (this.behaviour == TowerBehaviours.TrapperTowerBehaviour) TrapperTowerBehaviour(this, elapsedMS);
        if (this.behaviour == TowerBehaviours.DebuffTowerBehaviour) DebuffTowerBehaviour(this, elapsedMS);
    }

    public destroy(): void {
        super.destroy();
        this.parent.clickDetector.off('pointerenter', this.onParentCellEnter);
        this.parent.clickDetector.off('pointerleave', this.onParentCellLeave);
        this.graphics.destroy();
    }
}
