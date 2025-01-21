import * as PIXI from 'pixi.js';
import { GemType } from '../Definitions';
export default class Gem {
    public texture: PIXI.Texture;
    public type: GemType;
    public level: number = 1;
    // TODO: create and load from Gems.json and also load gem textures
    constructor(gemType) {}
}
