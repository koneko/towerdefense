import * as PIXI from 'pixi.js';
import { GemType, GemDefinition } from '../Definitions';
import GameAssets from '../Assets';
export default class Gem {
    public texture: PIXI.Texture;
    public level: number = 1;
    public definition: GemDefinition;
    constructor(gemType: GemType) {
        this.definition = GameAssets.Gems[gemType];
        this.texture = this.definition.textures[0];
    }
}
