import * as PIXI from 'pixi.js';

export default abstract class GuiObject {
    public readonly name: string = this.constructor.name;

    protected _container: PIXI.Container;

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

    public onClick(e: PIXI.FederatedPointerEvent) {
        console.warn(`[${this.name} does not implement GuiObject.onClick()]`);
    }
    public onWheel(e: PIXI.FederatedWheelEvent) {
        console.warn(`[${this.name} does not implement GuiObject.onWheel()]`);
    }

    constructor() {
        this._container = new PIXI.Container();
        this._container.interactive = true;
        this._container.onwheel = (e) => {
            this.onWheel(e);
        };
        this._container.onclick = (e) => {
            this.onClick(e);
        };
    }
}
