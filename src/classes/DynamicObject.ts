import * as PIXI from 'pixi.js';
import { Foundation } from './Bastion';

export default abstract class DynamicObject {
    protected _container: PIXI.Container;

    protected bounds: PIXI.Rectangle;

    private _events: PIXI.EventEmitter = new PIXI.EventEmitter();

    public abstract events: Enumerator;

    public destroy() {
        this._events.removeAllListeners();
        if (this._container.parent) this._container.parent.removeChild(this._container);
        this._container.destroy();
    }

    public get container(): PIXI.Container {
        return this._container;
    }

    constructor(bounds?: PIXI.Rectangle) {
        this.bounds = bounds ?? new PIXI.Rectangle(0, 0, 0, 0);
        this._container = new PIXI.Container();
        Foundation.Master.DynamicObjects.push(this);
    }
}
