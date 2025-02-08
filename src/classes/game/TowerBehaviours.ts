import { Engine } from '../Bastion';
import { calculateAngleToPoint } from './Projectile';
import { Tower } from './Tower';

/**
 * Checks the projectiles of the tower and updates or removes them based on their state.
 * If a projectile is marked for deletion, it is removed from the tower's projectiles array
 * and the tower's damage dealt is incremented.
 *
 * @param tower - The tower whose projectiles are being checked.
 * @param elapsedMS - The elapsed time in milliseconds since the last update.
 */
function projectileCheck(tower: Tower, elapsedMS: number) {
    tower.projectiles.forEach((proj) => {
        if (proj.deleteMe) {
            proj.collidedCreepIDs.forEach(() => {
                tower.damageDealt += tower.computedDamageToDeal;
            });
            tower.projectiles.splice(tower.projectiles.indexOf(proj), 1);
            proj = null;
        } else proj.update(elapsedMS);
    });
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
        let ccurrentGemImprovements = gem.currentGemImprovement();
        gemDamage += ccurrentGemImprovements.damageUp;
        gemAttackSpeedUp += ccurrentGemImprovements.attackSpeedUp;
        gemRangeUp += ccurrentGemImprovements.rangeUp;
        gemTimeToLiveUp += ccurrentGemImprovements.timeToLiveUp;
        gemPierceUp += ccurrentGemImprovements.pierceUp;

        let gemResMod = gem.currentGemResistanceModifications();
        tower.totalGemResistanceModifications.physical += gemResMod.physical;
        tower.totalGemResistanceModifications.ice += gemResMod.ice;
        tower.totalGemResistanceModifications.fire += gemResMod.fire;
        tower.totalGemResistanceModifications.divine += gemResMod.divine;
        tower.totalGemResistanceModifications.frostfire += gemResMod.frostfire;
    });
    tower.computedDamageToDeal = tower.definition.stats.damage + gemDamage;
    tower.computedAttackSpeed = tower.definition.stats.cooldown - gemAttackSpeedUp;
    tower.computedRange = tower.definition.stats.range + gemRangeUp;
    tower.computedTimeToLive = tower.definition.stats.timeToLive + gemTimeToLiveUp;
    tower.computedPierce = tower.definition.stats.pierce + gemPierceUp;
}

/**
 * Defines the basic behavior of a tower, including computing damage, checking projectiles,
 * and handling shooting at creeps within range.
 *
 * @param tower - The tower whose behavior is being defined.
 * @param elapsedMS - The elapsed time in milliseconds since the last update.
 */
export function BasicTowerBehaviour(tower: Tower, elapsedMS: number) {
    if (tower.ticksUntilNextShot % 2 == 0) computeGemImprovements(tower);
    projectileCheck(tower, elapsedMS);
    if (tower.ticksUntilNextShot > 0) tower.ticksUntilNextShot--;
    let creepsInRange = tower.GetCreepsInRange();
    if (creepsInRange.length > 0) {
        let focus = creepsInRange[0];
        if (tower.ticksUntilNextShot <= 0) {
            let x = tower.column * Engine.GridCellSize + Engine.GridCellSize / 2;
            let y = tower.row * Engine.GridCellSize + Engine.GridCellSize / 2;
            tower.ticksUntilNextShot = tower.computedAttackSpeed;
            tower.Shoot(calculateAngleToPoint(x, y, focus.x, focus.y));
        }
    }
}

export function CircleTowerBehaviour(tower: Tower, elapsedMS: number) {
    if (tower.ticksUntilNextShot % 2 == 0) computeGemImprovements(tower);
    projectileCheck(tower, elapsedMS);
    if (tower.ticksUntilNextShot > 0) tower.ticksUntilNextShot--;
    let creepsInRange = tower.GetCreepsInRange();
    if (creepsInRange.length > 0) {
        let focus = creepsInRange[0];
        if (tower.ticksUntilNextShot <= 0) {
            tower.ticksUntilNextShot = tower.computedAttackSpeed;
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
