import { Engine } from '../classes/Bastion';
import { FadeInOut, Tween } from '../classes/game/AnimationManager';
import Button, { ButtonTexture } from '../classes/gui/Button';
import { MissionPickerScene } from './MissionPicker';
import Scene from './Scene';
import * as PIXI from 'pixi.js';

export class MainScene extends Scene {
    public init() {
        const NewGameButton = {
            caption: 'New Game',
            rect: new PIXI.Rectangle(
                Engine.app.canvas.width / 2 - 300 / 2,
                Engine.app.canvas.height / 5 + 3 * 80,
                300,
                60
            ),
            texture: ButtonTexture.Button02,
        };

        const SettingsButton = {
            caption: 'Settings',
            rect: new PIXI.Rectangle(
                Engine.app.canvas.width / 2 - 300 / 2,
                Engine.app.canvas.height / 5 + 4 * 80,
                300,
                60
            ),
            texture: ButtonTexture.Button02,
        };
        let text = new PIXI.Text({
            x: Engine.app.canvas.width / 2 - 300 / 2,
            y: Engine.app.canvas.height / 5 + 1 * 80,
            text: 'BASTION',
            style: {
                fill: 0xffaa00,
                fontFamily: 'Aclonica',
                fontSize: 100,
            },
        });
        text.x = text.x - text.width / 5;
        Engine.app.stage.addChild(text);
        let text2 = new PIXI.Text({
            x: 0,
            y: 0,
            text: 'Latest commit: ' + Engine.latestCommit,
            style: {
                fill: 0x000000,
                fontSize: 10,
                fontWeight: 'bold',
            },
        });
        Engine.app.stage.addChild(text2);
        const button01 = new Button(NewGameButton.rect, NewGameButton.caption, NewGameButton.texture, true);
        button01.onClick = (e) => {
            Engine.app.stage.removeChild(text);
            Engine.app.stage.removeChild(text2);
            Engine.GameMaster.changeScene(new MissionPickerScene());
        };

        let b2 = new Button(SettingsButton.rect, SettingsButton.caption, SettingsButton.texture, true);
        b2.onClick = (e) => {
            alert('Does nothing for now, just placeholder.');
        };
    }
}
