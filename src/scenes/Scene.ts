import GameAssets from '../classes/Assets';
import { Engine } from '../classes/Bastion';
import GuiObject from '../classes/GuiObject';
import * as PIXI from 'pixi.js';

export default class Scene {
    public stage: PIXI.Container = new PIXI.Container();
    public gui: GuiObject[] = [];
    private _events: PIXI.EventEmitter = new PIXI.EventEmitter();

    constructor() {
        Engine.app.stage.addChild(this.stage);
    }
    public destroy() {
        this.stage.destroy();
        this._events.removeAllListeners();
        this.gui.forEach((element) => {
            element.destroy();
        });
    }

    public addMainBackground() {
        // Background
        const sprite = new PIXI.Sprite(GameAssets.MainBackground);
        sprite.width = Engine.app.canvas.width;
        sprite.height = Engine.app.canvas.height;
        this.stage.addChild(sprite);
    }

    public get events(): PIXI.EventEmitter {
        return this._events;
    }

    public init() {
        // Definitions for scene elements.
    }
}
