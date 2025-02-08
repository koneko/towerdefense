import * as PIXI from 'pixi.js';
import { GemType, GemDefinition, GenericGemImprovement } from '../Definitions';
import GameAssets from '../Assets';
import { Engine } from '../Bastion';

export default class Gem {
    public texture: PIXI.Texture;
    public level: number = 1;
    public definition: GemDefinition;
    public id: number | string;
    constructor(gemType: GemType, doNotIncrement?: boolean) {
        this.definition = GameAssets.Gems[gemType];
        this.texture = this.definition.textures[0];

        if (!doNotIncrement) {
            this.id = Engine.latestGemId + 1;
            Engine.latestGemId++;
        } else this.id = '';
    }
    public currentGemImprovement() {
        let totalGemImprovement: GenericGemImprovement = {
            damageUp: 0,
            attackSpeedUp: 0,
            rangeUp: 0,
            timeToLiveUp: 0,
            pierceUp: 0,
            gemValueUp: 0,
        };
        for (let i = 0; i < this.level; i++) {
            const item = this.definition.genericImprovements[i];
            totalGemImprovement.damageUp += item.damageUp;
            totalGemImprovement.attackSpeedUp += item.attackSpeedUp;
            totalGemImprovement.rangeUp += item.rangeUp;
            totalGemImprovement.timeToLiveUp += item.timeToLiveUp;
            totalGemImprovement.pierceUp += item.pierceUp;
            totalGemImprovement.gemValueUp += item.gemValueUp;
        }
        return totalGemImprovement;
    }
    public currentGemResistanceModifications() {
        return this.definition.gemResistanceModifications[this.level - 1];
    }
    public isMaxLevel() {
        return this.level == this.definition.totalLevels;
    }
    public levelUp(howMuch) {
        if (!howMuch) howMuch = 1;
        this.level += howMuch;
        this.texture = this.definition.textures[this.level - 1];
    }
}
