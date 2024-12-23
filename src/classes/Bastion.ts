import * as PIXI from 'pixi.js';
import GameObject from './GameObject';
import GuiObject from './GuiObject';
import Scene from '../scenes/Scene';
import { Grid } from './game/Grid';
import WaveManager from './game/WaveManager';

export class Globals {
    public static app: PIXI.Application;
    public static GameMaster: GameMaster;
    public static WindowHeight: number;
    public static WindowWidth: number;
    public static AspectRatio: number = 16 / 9;
    public static Grid: Grid;
    public static WaveManager: WaveManager;
}

export default class GameMaster {
    public currentScene: Scene;
    private GameObjects: GameObject[] = [];
    private ticker: PIXI.Ticker;

    constructor() {
        Globals.GameMaster = this;
        this.ticker = new PIXI.Ticker();
        this.ticker.maxFPS = 60;
        this.ticker.minFPS = 30;
        this.ticker.add(() => this.update(this.ticker.elapsedMS));
    }

    public _CreateGuiObject(object: GuiObject) {
        this.currentScene.gui.push(object);
        Globals.app.stage.addChild(object.container);
    }

    public _RemoveGuiObject(object: GuiObject) {
        this.currentScene.gui.splice(this.currentScene.gui.indexOf(object), 1);
        Globals.app.stage.removeChild(object.container);
    }

    public changeScene(newScene: Scene) {
        if (this.currentScene) {
            this.currentScene.destroy();
        }
        this.GameObjects.forEach((element) => {
            element.destroy();
        });
        this.currentScene = newScene;
        this.currentScene.init();
    }

    public update(elapsedMS) {
        this.GameObjects.forEach((element) => {
            element.update(elapsedMS);
        });
    }
}
