import { RoundMode } from '../../scenes/Game';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';
import { TowerType } from '../Definitions';
import { CreepEvents } from '../Events';
import Creep, { CreepEffects } from './Creep';
import Projectile, { calculateAngleToPoint, TrapProjectile, VisualLightning } from './Projectile';
import { distance, Tower } from './Tower';
import * as PIXI from 'pixi.js';
import { TowerBehaviours } from './TowerManager';

/**
 * Checks the projectiles of the tower and updates or removes them based on their state.
 * If a projectile is marked for deletion, it is removed from the tower's projectiles array
 * and the tower's damage dealt is incremented.
 *
 * @param tower - The tower whose projectiles are being checked.
 * @param elapsedMS - The elapsed time in milliseconds since the last update.
 */
function projectileCheck(tower: Tower, elapsedMS: number) {
    for (let i = tower.projectiles.length - 1; i >= 0; i--) {
        let proj = tower.projectiles[i];

        if (proj.deleteMe || tower.sold) {
            proj.collidedCreepIDs.forEach(() => {
                tower.damageDealt += tower.computedDamageToDeal;
            });
            proj.collidedCreepIDs = [];

            proj.destroy();
            tower.projectiles.splice(i, 1);
        } else {
            proj.update(elapsedMS);
        }
    }
}

/**
 * Computes the total damage the tower can deal by summing its base damage and the damage
 * improvements from its slotted gems. Mutates passed tower.
 *
 * @param tower - The tower whose damage is being computed.
 */
export function computeGemImprovements(tower: Tower) {
    let gemDamage = 0;
    let gemAttackSpeedUp = 0;
    let gemRangeUp = 0;
    let gemTimeToLiveUp = 0;
    let gemPierceUp = 0;
    tower.totalGemResistanceModifications = {
        fire: 0,
        frostfire: 0,
        divine: 0,
        ice: 0,
        physical: 0,
    };
    tower.slottedGems.forEach((gem) => {
        let improvements = gem.currentGemImprovement();
        gemDamage += improvements.damageUp;
        gemAttackSpeedUp += improvements.attackSpeedUp;
        gemRangeUp += improvements.rangeUp;
        gemTimeToLiveUp += improvements.timeToLiveUp;
        gemPierceUp += improvements.pierceUp;

        let resistances = gem.currentGemResistanceModifications();
        tower.totalGemResistanceModifications.physical += Number(resistances.physical.toFixed(2));
        tower.totalGemResistanceModifications.ice += Number(resistances.ice.toFixed(2));
        tower.totalGemResistanceModifications.fire += Number(resistances.fire.toFixed(2));
        tower.totalGemResistanceModifications.divine += Number(resistances.divine.toFixed(2));
        tower.totalGemResistanceModifications.frostfire += Number(resistances.frostfire.toFixed(2));
    });

    tower.computedDamageToDeal = tower.definition.stats.damage + gemDamage;
    tower.computedCooldown = tower.definition.stats.cooldown - gemAttackSpeedUp;
    tower.computedRange = tower.definition.stats.range + gemRangeUp;
    if (tower.behaviour != TowerBehaviours.TrapperTowerBehaviour)
        tower.computedTimeToLive = tower.definition.stats.timeToLive + gemTimeToLiveUp;
    else tower.computedTimeToLive = tower.definition.stats.timeToLive + gemTimeToLiveUp * 10;
    tower.computedPierce = tower.definition.stats.pierce + gemPierceUp;

    // Buff tower
    if (tower.parent.isBuffedBy.length > 0 && tower.definition.name != GameAssets.Towers[TowerType.Buff].name) {
        let buffedBy = tower.parent.isBuffedBy[0];
        tower.computedDamageToDeal += Number((buffedBy.computedDamageToDeal / 2).toFixed(1));
        tower.computedCooldown -= Number((buffedBy.computedCooldown / 5).toFixed(1));
        tower.computedRange += Number((buffedBy.computedRange / 10).toFixed(1));
        tower.computedTimeToLive += Number((buffedBy.computedTimeToLive / 5).toFixed(1));
        tower.computedPierce += Number((buffedBy.computedPierce / 4).toFixed(1));

        tower.totalGemResistanceModifications.physical += Number(
            (buffedBy.totalGemResistanceModifications.physical / 2).toFixed(2)
        );
        tower.totalGemResistanceModifications.ice += Number(
            (buffedBy.totalGemResistanceModifications.ice / 2).toFixed(2)
        );
        tower.totalGemResistanceModifications.fire += Number(
            (buffedBy.totalGemResistanceModifications.fire / 2).toFixed(2)
        );
        tower.totalGemResistanceModifications.divine += Number(
            (buffedBy.totalGemResistanceModifications.divine / 2).toFixed(2)
        );
        tower.totalGemResistanceModifications.frostfire += Number(
            (buffedBy.totalGemResistanceModifications.frostfire / 2).toFixed(2)
        );
    }
}

export function BasicTowerBehaviour(tower: Tower, elapsedMS: number) {
    computeGemImprovements(tower);
    projectileCheck(tower, elapsedMS);
    if (tower.millisecondsUntilNextShot > 0)
        tower.millisecondsUntilNextShot -= elapsedMS * Engine.GameScene.gameSpeedMultiplier;
    else {
        let creepsInRange = tower.GetCreepsInRange();
        if (creepsInRange.length > 0) {
            let focus = creepsInRange[0];
            let x = tower.column * Engine.GridCellSize + Engine.GridCellSize / 2;
            let y = tower.row * Engine.GridCellSize + Engine.GridCellSize / 2;
            tower.millisecondsUntilNextShot = tower.computedCooldown;
            tower.Shoot(calculateAngleToPoint(x, y, focus.x, focus.y));
        }
    }
}

export function CircleTowerBehaviour(tower: Tower, elapsedMS: number) {
    computeGemImprovements(tower);
    projectileCheck(tower, elapsedMS);
    if (tower.millisecondsUntilNextShot > 0)
        tower.millisecondsUntilNextShot -= elapsedMS * Engine.GameScene.gameSpeedMultiplier;
    else {
        let creepsInRange = tower.GetCreepsInRange();
        if (creepsInRange.length > 0) {
            tower.millisecondsUntilNextShot = tower.computedCooldown;
            let x = tower.column * Engine.GridCellSize + Engine.GridCellSize / 2;
            let y = tower.row * Engine.GridCellSize + Engine.GridCellSize / 2;
            tower.Shoot(calculateAngleToPoint(x, y, x, y + 10)); // Up
            tower.Shoot(calculateAngleToPoint(x, y, x + 10, y)); // Right
            tower.Shoot(calculateAngleToPoint(x, y, x - 10, y)); // Left
            tower.Shoot(calculateAngleToPoint(x, y, x, y - 10)); // Down
            tower.Shoot(calculateAngleToPoint(x, y, x + 10, y + 10)); // Up right
            tower.Shoot(calculateAngleToPoint(x, y, x - 10, y + 10)); // Up left
            tower.Shoot(calculateAngleToPoint(x, y, x - 10, y - 10)); // Down left
            tower.Shoot(calculateAngleToPoint(x, y, x + 10, y - 10)); // Down right
        }
    }
}

export function ElectricTowerBehaviour(tower: Tower, elapsedMS: number) {
    computeGemImprovements(tower);
    projectileCheck(tower, elapsedMS);

    if (tower.millisecondsUntilNextShot > 0)
        tower.millisecondsUntilNextShot -= elapsedMS * Engine.GameScene.gameSpeedMultiplier;
    else {
        let creepsInRange = tower.GetCreepsInRange();

        if (creepsInRange.length > 0) {
            let focus = creepsInRange[0];
            let x = tower.column * Engine.GridCellSize + Engine.GridCellSize / 2;
            let y = tower.row * Engine.GridCellSize + Engine.GridCellSize / 2;
            tower.millisecondsUntilNextShot = tower.computedCooldown;
            let proj = tower.Shoot(calculateAngleToPoint(x, y, focus.x, focus.y));
            proj.onCollide = (creep: Creep, proj: Projectile) => {
                let chainedCreepIds = [];
                proj.pierce = 0;
                let recursionCount = 0;
                function checkNearBy(c: Creep) {
                    if (recursionCount >= 50) {
                        Engine.GameScene.PauseGame();
                        Engine.NotificationManager.Notify(
                            'Electric Tower max recursion exceeded! Please tell koneko! (game paused)',
                            'danger'
                        );
                        return;
                    }
                    recursionCount++;

                    Engine.Grid.creeps.forEach((nCreep) => {
                        if (nCreep.id != creep.id) {
                            const x = nCreep.x;
                            const y = nCreep.y;
                            const radius = 1.5 * Engine.GridCellSize;
                            const d = distance(c.x, c.y, x, y);
                            if (d < radius) {
                                if (chainedCreepIds.find((crID) => crID == nCreep.id) != undefined) return;
                                chainedCreepIds.push(nCreep.id);
                                new VisualLightning(c, nCreep);
                                Engine.GameScene.events.emit(
                                    CreepEvents.TakenDamage,
                                    nCreep.id,
                                    Math.round(proj.damage / 2),
                                    proj.gemResistanceModifications
                                );
                                checkNearBy(nCreep);
                            }
                        }
                    });
                }
                Engine.GameScene.events.emit(
                    CreepEvents.TakenDamage,
                    creep.id,
                    proj.damage,
                    proj.gemResistanceModifications
                );
                chainedCreepIds.push(creep.id);
                checkNearBy(creep);
            };
        }
    }
}

export function BuffTowerBehaviour(tower: Tower, elapsedMS: number) {
    computeGemImprovements(tower);
    // Buff tower does not do anything and doesn't have a behaviour.
    // For how its implemented, Cell tracks when it's placed and removed (via event)
    // and tower takes improvements via computeGemImprovements()
}

export function StrongTowerBehaviour(tower: Tower, elapsedMS: number) {
    computeGemImprovements(tower);
    projectileCheck(tower, elapsedMS);

    if (tower.millisecondsUntilNextShot > 0)
        tower.millisecondsUntilNextShot -= elapsedMS * Engine.GameScene.gameSpeedMultiplier;
    else {
        let creepsInRange = tower.GetCreepsInRange();
        if (creepsInRange.length > 0) {
            let focus = creepsInRange[0];
            let x = tower.column * Engine.GridCellSize + Engine.GridCellSize / 2;
            let y = tower.row * Engine.GridCellSize + Engine.GridCellSize / 2;
            tower.millisecondsUntilNextShot = tower.computedCooldown;
            let proj = tower.Shoot(calculateAngleToPoint(x, y, focus.x, focus.y));
            proj.onCollide = (creep: Creep, proj: Projectile) => {
                Engine.GameScene.events.emit(CreepEvents.GiveEffect, creep.id, CreepEffects.MovingBackwards, 750);
                Engine.GameScene.events.emit(
                    CreepEvents.TakenDamage,
                    creep.id,
                    proj.damage / 2,
                    proj.gemResistanceModifications
                );
            };
        }
    }
}

export function RailTowerBehaviour(tower: Tower, elapsedMS: number) {
    computeGemImprovements(tower);
    projectileCheck(tower, elapsedMS);

    if (tower.millisecondsUntilNextShot > 0)
        tower.millisecondsUntilNextShot -= elapsedMS * Engine.GameScene.gameSpeedMultiplier;
    else {
        let creepsInRange = tower.GetCreepsInRange();
        if (creepsInRange.length > 0) {
            let focus = creepsInRange[0];
            let x = tower.column * Engine.GridCellSize + Engine.GridCellSize / 2;
            let y = tower.row * Engine.GridCellSize + Engine.GridCellSize / 2;
            tower.millisecondsUntilNextShot = tower.computedCooldown;
            // Custom logic handled via tower.Shoot
            tower.Shoot(calculateAngleToPoint(x, y, focus.x, focus.y));
        }
    }
}

export function TrapperTowerBehaviour(tower: Tower, elapsedMS: number) {
    computeGemImprovements(tower);
    projectileCheck(tower, elapsedMS);

    if (tower.millisecondsUntilNextShot > 0)
        tower.millisecondsUntilNextShot -= elapsedMS * Engine.GameScene.gameSpeedMultiplier;
    else {
        if (Engine.GameScene.roundMode != RoundMode.Combat) return;
        let x = tower.column * Engine.GridCellSize + Engine.GridCellSize / 2;
        let y = tower.row * Engine.GridCellSize + Engine.GridCellSize / 2;
        let cells = Engine.Grid.GetPathCellsInRange(tower.row, tower.column, tower.computedRange);
        if (cells.length > 0) {
            let idx = Math.floor(Math.random() * cells.length);
            let cell = cells[idx];
            let cellx = cell.column * Engine.GridCellSize + Engine.GridCellSize / 2;
            let celly = cell.row * Engine.GridCellSize + Engine.GridCellSize / 2;
            let combinedTint = new PIXI.Color('white');
            if (tower.slottedGems.length > 0) {
                let color = new PIXI.Color(tower.slottedGems[0].definition.color);
                for (let i = 1; i < tower.slottedGems.length; i++) {
                    const element = tower.slottedGems[i];
                    color.multiply(element.definition.color);
                }
                combinedTint = color;
            }
            let proj = new TrapProjectile(
                x,
                y,
                tower.definition.projectileTextures,
                calculateAngleToPoint(x, y, cellx, celly),
                cellx,
                celly,
                tower.computedDamageToDeal,
                combinedTint,
                tower.computedTimeToLive,
                tower.computedPierce,
                tower.totalGemResistanceModifications
            );
            tower.projectiles.push(proj);
            tower.millisecondsUntilNextShot = tower.computedCooldown;
        }
    }
}

export function DebuffTowerBehaviour(tower: Tower, elapsedMS: number) {
    computeGemImprovements(tower);
    projectileCheck(tower, elapsedMS);

    if (tower.millisecondsUntilNextShot > 0)
        tower.millisecondsUntilNextShot -= elapsedMS * Engine.GameScene.gameSpeedMultiplier;
    let creepsInRange = tower.GetCreepsInRange();
    if (creepsInRange.length > 0) {
        let focus = creepsInRange[0];
        if (tower.millisecondsUntilNextShot <= 0) {
            let x = tower.column * Engine.GridCellSize + Engine.GridCellSize / 2;
            let y = tower.row * Engine.GridCellSize + Engine.GridCellSize / 2;
            tower.millisecondsUntilNextShot = tower.computedCooldown;
            let proj = tower.Shoot(calculateAngleToPoint(x, y, focus.x, focus.y));
            proj.onCollide = (creep: Creep, proj: Projectile) => {
                Engine.GameScene.events.emit(CreepEvents.GiveEffect, creep.id, CreepEffects.DebuffTowerDebuff, 5000);
                Engine.GameScene.events.emit(
                    CreepEvents.TakenDamage,
                    creep.id,
                    proj.damage / 1.5,
                    proj.gemResistanceModifications
                );
            };
        }
    }
}
