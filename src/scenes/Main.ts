import GameAssets from '../classes/Assets';
import { Engine } from '../classes/Bastion';
import { FadeInOut, Tween } from '../classes/game/AnimationManager';
import Button, { ButtonTexture } from '../classes/gui/Button';
import { HowToPlay } from './HowToPlay';
import { MissionPickerScene } from './MissionPicker';
import Scene from './Scene';
import * as PIXI from 'pixi.js';
import { SettingsScene } from './Settings';

export class MainScene extends Scene {
    public init() {
        // Background
        this.addMainBackground();

        const NewGameButton = {
            caption: 'Play',
            rect: new PIXI.Rectangle(Engine.app.canvas.width / 2 - 300 / 2, 400 + 0 * 70, 300, 60),

            texture: ButtonTexture.Button01,
        };
        const TutorialButton = {
            caption: 'How to play',
            rect: new PIXI.Rectangle(Engine.app.canvas.width / 2 - 300 / 2, 400 + 1 * 70, 300, 60),
            texture: ButtonTexture.Button01,
        };

        const SettingsButton = {
            caption: 'Settings',
            rect: new PIXI.Rectangle(Engine.app.canvas.width / 2 - 300 / 2, 400 + 2 * 70, 300, 60),
            texture: ButtonTexture.Button01,
        };

        let text2 = new PIXI.Text({
            x: 0,
            y: 0,
            text: 'Latest commit: ' + Engine.latestCommit,
            style: {
                fill: 0xffffff,
                fontSize: 10,
                fontWeight: 'bold',
            },
        });
        this.stage.addChild(text2);
        const button01 = new Button(NewGameButton.rect, NewGameButton.caption, NewGameButton.texture, true);
        button01.onClick = (e) => {
            Engine.GameMaster.changeScene(new MissionPickerScene());
        };

        // let b2 = new Button(SettingsButton.rect, SettingsButton.caption, SettingsButton.texture, true);
        // b2.onClick = (e) => {
        //     Engine.GameMaster.changeScene(new SettingsScene());
        // };
        let b3 = new Button(TutorialButton.rect, TutorialButton.caption, TutorialButton.texture, true);
        b3.onClick = (e) => {
            Engine.GameMaster.changeScene(new HowToPlay());
        };
    }
}
