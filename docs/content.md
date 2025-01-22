# How to add new content to the game

A small guide so other people also understand how to add content.

## Tower

1. Update Towers.json by adding to the end of the array.
2. Update TowerType in Defintions.ts
3. Based of the Tower.sprite value, add projectile folder with appropriate projectiles as .png.
4. Based of the Tower.sprite value, add the tower sprite into towers folder as a .png.
5. Add appropriate behaviour in Tower.ts (if statement in update).
6. Add way to spawn via TowerTab.ts button.

## Creep

1. Update Creeps.json by adding to the end of the array.
2. Update CreepType in Defintions.ts
3. Based of the Creep.name value, add creep's walking animations to the same named subfolder in creeps folder.
4. When using creeps in waves, reference them by their index in the CreepType enum.

## Gem

1. Update Gems.json by adding to the end of the array.
2. Update GemType in Defintions.ts and make sure Gem.type is CaSe sensitively the same.
