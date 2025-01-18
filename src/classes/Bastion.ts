import * as PIXI from 'pixi.js';
import GameObject from './GameObject';
import GuiObject from './GuiObject';
import Scene from '../scenes/Scene';
import { Grid } from './game/Grid';
import WaveManager from './game/WaveManager';
import TowerManager from './game/TowerManager';
import { GameScene } from '../scenes/Game';
import { AnimationManager } from './game/AnimationManager';
import NotificationManager from './game/NotificationManager';

export class Engine {
    public static app: PIXI.Application;
    public static GameMaster: GameMaster;
    public static Grid: Grid;
    public static WaveManager: WaveManager;
    public static TowerManager: TowerManager;
    public static AnimationManager: AnimationManager;
    public static NotificationManager: NotificationManager;
    public static GameScene: GameScene;
    public static latestCommit: string;

    public static GridCellSize: number = 64;
    public static GridColumns: number = 25;
    public static GridRows: number = 17;
    public static MouseX: number = 0;
    public static MouseY: number = 0;
}

export default class GameMaster {
    public currentScene: Scene;
    private GameObjects: GameObject[] = [];

    constructor() {
        Engine.GameMaster = this;
    }

    public _CreateGuiObject(object: GuiObject) {
        this.currentScene.gui.push(object);
        Engine.GameMaster.currentScene.stage.addChild(object.container);
    }

    public _RemoveGuiObject(object: GuiObject) {
        this.currentScene.gui.splice(this.currentScene.gui.indexOf(object), 1);
        Engine.GameMaster.currentScene.stage.removeChild(object.container);
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
}
