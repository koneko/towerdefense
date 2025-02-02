import * as PIXI from 'pixi.js';
import { Engine } from './Bastion';

export default abstract class GuiObject {
    public readonly name: string = this.constructor.name;

    protected _container: PIXI.Container = new PIXI.Container();

    protected _events: PIXI.EventEmitter = new PIXI.EventEmitter();

    protected enabled: boolean = true;

    public bb: PIXI.Rectangle = new PIXI.Rectangle();

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

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    public copyContainerToBB() {
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

    constructor(interactive?: boolean) {
        Engine.GameMaster._CreateGuiObject(this);
        if (!interactive) return;
        this._container.interactive = true;
        this._container.onwheel = (e) => {
            if (this.enabled) this.onWheel(e);
        };
        this._container.onpointerdown = (e) => {
            if (this.enabled) this.onClick(e);
        };
    }
}
