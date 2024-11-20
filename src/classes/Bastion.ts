import * as PIXI from 'pixi.js';
import DynamicObject from './DynamicObject';

export class Foundation {
    public static _PIXIApp: PIXI.Application;
    public static Master: Master;
    public static WindowHeight: number;
    public static WindowWidth: number;
    public static AspectRatio: number = 4 / 3;
}

export default class Master {
    private DynamicObjects: DynamicObject[];
    private ticker: PIXI.Ticker;
    public stage: PIXI.Container = new PIXI.Container({
        width: Foundation.WindowWidth,
        height: Foundation.WindowHeight,
    });

    constructor() {
        Foundation.Master = this;
        this.ticker = new PIXI.Ticker();
        this.ticker.maxFPS = 60;
        this.ticker.minFPS = 30;
        this.ticker.add(() => this.update(this.ticker.elapsedMS));
    }

    public _CreateDynamicObject(object: DynamicObject) {
        this.DynamicObjects.push(object);
    }

    public _RemoveDynamicObject(object: DynamicObject) {
        this.DynamicObjects.splice(this.DynamicObjects.indexOf(object), 1);
    }

    public RefreshStage() {
        Foundation._PIXIApp.stage.removeChildren();
        this.stage.width = Foundation.WindowWidth;
        this.stage.height = Foundation.WindowHeight;
        Foundation._PIXIApp.stage.addChild(this.stage);
    }

    public update(elapsedMS) {
        this.DynamicObjects.forEach((element) => {
            element.update(elapsedMS);
        });
    }
}
