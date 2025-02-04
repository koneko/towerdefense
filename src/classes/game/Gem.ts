import * as PIXI from 'pixi.js';
import { GemType, GemDefinition, GenericGemImprovement } from '../Definitions';
import GameAssets from '../Assets';

let latestGemId = 0;

export default class Gem {
    public texture: PIXI.Texture;
    public level: number = 1;
    public definition: GemDefinition;
    public id: number | string;
    constructor(gemType: GemType, doNotIncrement?: boolean) {
        this.definition = GameAssets.Gems[gemType];
        this.texture = this.definition.textures[0];

        if (!doNotIncrement) {
            this.id = latestGemId + 1;
            latestGemId++;
        } else this.id = '';
    }
    public currentGemImprovement() {
        let totalGemImprovement: GenericGemImprovement = {
            damageUp: 0,
            attackSpeedUp: 0,
            rangeUp: 0,
            timeToLiveUp: 0,
            pierceUp: 0,
        };
        for (let i = 0; i < this.level; i++) {
            const item = this.definition.genericImprovements[i];
            totalGemImprovement.damageUp += item.damageUp;
            totalGemImprovement.attackSpeedUp += item.attackSpeedUp;
            totalGemImprovement.rangeUp += item.rangeUp;
            totalGemImprovement.timeToLiveUp += item.timeToLiveUp;
            totalGemImprovement.pierceUp += item.pierceUp;
        }
        return totalGemImprovement;
    }
    public currentGemResistanceModifications() {
        return this.definition.gemResistanceModifications[this.level - 1];
    }
}
