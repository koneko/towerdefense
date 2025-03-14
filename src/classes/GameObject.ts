import * as PIXI from 'pixi.js';

export default abstract class GameObject {
    public readonly name: string = this.constructor.name;

    protected _container: PIXI.Container = new PIXI.Container();

    protected bb: PIXI.Rectangle = new PIXI.Rectangle();

    protected _events: PIXI.EventEmitter = new PIXI.EventEmitter();

    public destroy() {
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

    public copyContainerToBB() {
        if (this.container == null) return null;
        this.bb.x = this.container.x;
        this.bb.y = this.container.y;
        this.bb.width = this.container.width;
        this.bb.height = this.container.height;
        return this.bb;
    }

    public copyBBToContainer() {
        this.container.x = this.bb.x;
        this.container.y = this.bb.y;
        this.container.width = this.bb.width;
        this.container.height = this.bb.height;
        return this.container;
    }

    public copyPropertiesToObj(obj: PIXI.Container) {
        obj.x = this.bb.x;
        obj.y = this.bb.y;
        obj.width = this.bb.width;
        obj.height = this.bb.height;
        return obj;
    }

    public abstract update(elapsedMS): void;
}
