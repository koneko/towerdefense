import * as PIXI from 'pixi.js';
import { Globals } from './Bastion';

export default abstract class GameObject {
    public readonly name: string = this.constructor.name;

    protected _container: PIXI.Container = new PIXI.Container();

    // bb = bounding box
    protected bb: PIXI.Rectangle = new PIXI.Rectangle();

    protected _events: PIXI.EventEmitter = new PIXI.EventEmitter();

    public destroy() {
        Globals.GameMaster._RemoveGameObject(this);
        this._events.removeAllListeners();
        if (this._container.parent) this._container.parent.removeChild(this._container);
        this._container.destroy();
    }

    public get container(): PIXI.Container {
        return this._container;
    }

    public get events(): PIXI.EventEmitter {
        return this._events;
    }

    public abstract update(elapsedMS): void;
}
