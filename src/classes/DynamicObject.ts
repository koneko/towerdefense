import * as PIXI from 'pixi.js';
import { Foundation } from './Bastion';

export default abstract class DynamicObject {
    public readonly name: string = this.constructor.name;

    protected _container: PIXI.Container = new PIXI.Container();

    protected _events: PIXI.EventEmitter = new PIXI.EventEmitter();

    public destroy() {
        this._events.removeAllListeners();
        if (this._container.parent) this._container.parent.removeChild(this._container);
        this._container.destroy();
        Foundation.Master._RemoveDynamicObject(this);
    }

    public get container(): PIXI.Container {
        return this._container;
    }

    public get events(): PIXI.EventEmitter {
        return this._events;
    }

    public update(elapsedMS) {}

    constructor() {
        Foundation.Master._CreateDynamicObject(this);
    }
}
