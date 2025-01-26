import * as PIXI from 'pixi.js';
import { GemType, GemDefinition } from '../Definitions';
import GameAssets from '../Assets';
export default class Gem {
    public texture: PIXI.Texture;
    public level: number = 1;
    public gemDefinition: GemDefinition;
    constructor(gemType: GemType) {
        this.gemDefinition = GameAssets.Gems[gemType];
        this.texture = this.gemDefinition.textures[0];
    }
}
