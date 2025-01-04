import GuiObject from '../classes/GuiObject';
import * as PIXI from 'pixi.js';

export default class Scene {
    public gui: GuiObject[] = [];
    private _events: PIXI.EventEmitter = new PIXI.EventEmitter();

    public destroy() {
        this.gui.forEach((element) => {
            element.destroy();
        });
    }
    public GetGuiObject(object: GuiObject) {
        return this.gui.find((obj) => obj == object);
    }
    public GetGuiObjectByName(name: string) {
        return this.gui.filter((obj) => obj.name == name);
    }

    public get events(): PIXI.EventEmitter {
        return this._events;
    }

    public init() {
        // Definitions for scene elements.
    }
}
