import { Globals } from '../classes/Bastion';
import Button, { ButtonTexture } from '../classes/gui/Button';
import { MissionPickerScene } from './MissionPicker';
import Scene from './Scene';
import * as PIXI from 'pixi.js';

export class MainScene extends Scene {
    public init() {
        const NewGameButton = {
            caption: 'New Game',
            rect: new PIXI.Rectangle(Globals.WindowWidth / 2 - 300 / 2, Globals.WindowHeight / 2 - 80, 300, 60),
            texture: ButtonTexture.Button01,
        };

        const SettingsButton = {
            caption: 'Settings',
            rect: new PIXI.Rectangle(Globals.WindowWidth / 2 - 300 / 2, Globals.WindowHeight / 2 + 20, 300, 60),
            texture: ButtonTexture.Button01,
        };

        const button01 = new Button(NewGameButton.rect, NewGameButton.caption, NewGameButton.texture, true);
        button01.onClick = (e) => {
            Globals.GameMaster.changeScene(new MissionPickerScene());
        };

        new Button(SettingsButton.rect, SettingsButton.caption, SettingsButton.texture, true);
    }
}
