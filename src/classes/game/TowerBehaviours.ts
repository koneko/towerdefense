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
            tower.damageDealt += tower.computedDamageToDeal;
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
    tower.slottedGems.forEach((gem) => {
        gemDamage += gem.currentGemImprovement().damageUp;
    });
    tower.computedDamageToDeal = tower.definition.stats.damage + gemDamage;
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
        if (tower.ticksUntilNextShot == 0) {
            tower.ticksUntilNextShot = tower.definition.stats.cooldown;
            tower.Shoot(focus);
        }
    }
}
