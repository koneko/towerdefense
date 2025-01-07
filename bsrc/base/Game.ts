import MainMenu from '../scenes/MainMenu';
import MissionMenuSelect from '../scenes/MissionSelectMenu';
import GameScene from '../scenes/GameScene';
import GameObject from './GameObject';
import * as PIXI from 'pixi.js';
import SceneBase from '../scenes/SceneBase';
import Assets from './Assets';

export default class Game extends GameObject {
    private _currentScene: SceneBase | null = null;

    constructor(bounds: PIXI.Rectangle) {
        super(bounds);
        let params = new URLSearchParams(location.href);
        if (params.entries().next().value[1] == 'game') {
            this.setScene(new GameScene(Assets.Missions[0], 0, this.bounds));
        } else this.onMainMenu();
    }

    private onMainMenu() {
        const mainScene = new MainMenu(this.bounds);
        mainScene.events.on('newGame', this.onNewGame);
        mainScene.events.on('settings', this.onSettings);
        this.setScene(mainScene);
    }

    private setScene(scene: SceneBase) {
        if (this._currentScene) {
            this.container.removeChild(this._currentScene.container);
            this._currentScene.destroy();
        }
        this._currentScene = scene;
        console.log('Setting scene', this._currentScene.constructor);
        this.container.addChild(scene.container);
    }

    private onNewGame = () => {
        console.log('New Game');
        const missionSelectScene = new MissionMenuSelect(this.bounds);
        missionSelectScene.events.on('mission', (mission) => {
            console.log('Mission selected', mission);
            this.setScene(new GameScene(mission, Assets.Missions.indexOf(mission), this.bounds));
        });
        missionSelectScene.events.on('back', () => {
            this.onMainMenu();
        });
        this.setScene(missionSelectScene);
    };

    private onSettings = () => {
        console.log('Settings');
    };

    protected triggerBoundsChanged(): void {
        if (this._currentScene) {
            this._currentScene.setBounds(0, 0, this.bounds.width, this.bounds.height);
        }
    }

    protected draw() {
        // Nothing to draw, scene is drawing itself.
    }
}
