import * as PIXI from 'pixi.js';
import { GemType, GemDefinition } from '../Definitions';
import GameAssets from '../Assets';

let latestGemId = 0;

export default class Gem {
    public texture: PIXI.Texture;
    public level: number = 1;
    public definition: GemDefinition;
    private id;
    constructor(gemType: GemType) {
        this.definition = GameAssets.Gems[gemType];
        this.texture = this.definition.textures[0];
        this.id = latestGemId + 1;
        latestGemId++;
    }
}
