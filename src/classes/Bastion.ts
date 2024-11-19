import * as PIXI from 'pixi.js';
import DynamicObject from './DynamicObject';

export class Foundation {
    public static Master: Master;
    public static WindowHeight: number;
    public static WindowWidth: number;
}

export default class Master {
    public DynamicObjects: DynamicObject[];
    public ticker: PIXI.Ticker;
    constructor() {
        Foundation.Master = this;
        this.ticker = new PIXI.Ticker();
        this.ticker.maxFPS = 60;
        this.ticker.minFPS = 30;
        this.ticker.add(() => this.update(this.ticker.elapsedMS)); // bruh
    }
    public update(elapsedMS) {}
}
