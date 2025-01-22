import * as PIXI from 'pixi.js';
import { GemType } from '../Definitions';
import GameAssets from '../Assets';
export default class Gem {
    public texture: PIXI.Texture;
    public type: GemType;
    public level: number = 1;
    constructor(gemType: GemType) {
        this.texture = GameAssets.Gems[gemType].textures[0];
    }
}
