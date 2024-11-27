import * as PIXI from 'pixi.js';
import GameObject from './GameObject';
import GuiObject from './GuiObject';
import Scene from '../scenes/Scene';

export class environment {
    public static app: PIXI.Application;
    public static GameMaster: GameMaster;
    public static WindowHeight: number;
    public static WindowWidth: number;
    public static AspectRatio: number = 4 / 3;
}

export default class GameMaster {
    public currentScene: Scene;
    private GameObjects: GameObject[];
    private ticker: PIXI.Ticker;

    constructor() {
        environment.GameMaster = this;
        this.ticker = new PIXI.Ticker();
        this.ticker.maxFPS = 60;
        this.ticker.minFPS = 30;
        this.ticker.add(() => this.update(this.ticker.elapsedMS));
    }

    public _CreateGameObject(object: GameObject) {
        this.GameObjects.push(object);
        environment.app.stage.addChild(object.container);
    }

    public _RemoveGameObject(object: GameObject) {
        this.GameObjects.splice(this.GameObjects.indexOf(object), 1);
        environment.app.stage.removeChild(object.container);
    }

    public _CreateGuiObject(object: GuiObject) {
        this.currentScene.gui.push(object);
        environment.app.stage.addChild(object.container);
    }

    public _RemoveGuiObject(object: GuiObject) {
        this.currentScene.gui.splice(this.currentScene.gui.indexOf(object), 1);
        environment.app.stage.removeChild(object.container);
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
