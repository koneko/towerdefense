import Assets from '../classes/Assets';
import { Engine } from '../classes/Bastion';
import Button, { ButtonTexture } from '../classes/gui/Button';
import { GameScene } from './Game';
import { MainScene } from './Main';
import Scene from './Scene';
import * as PIXI from 'pixi.js';

export class SettingsScene extends Scene {
    public init() {
        this.addMainBackground();
        const button = new Button(new PIXI.Rectangle(10, 10, 300, 60), 'Back to main', ButtonTexture.Button01);
        button.onClick = (e) => {
            Engine.GameMaster.changeScene(new MainScene());
        };
    }
}
