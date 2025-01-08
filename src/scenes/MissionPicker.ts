import Assets from '../classes/Assets';
import { Globals } from '../classes/Bastion';
import Button, { ButtonTexture } from '../classes/gui/Button';
import { GameScene } from './Game';
import { MainScene } from './Main';
import Scene from './Scene';
import * as PIXI from 'pixi.js';

export class MissionPickerScene extends Scene {
    public init() {
        const button = new Button(new PIXI.Rectangle(0, 0, 300, 60), 'Back to main', ButtonTexture.Button01);
        button.onClick = (e) => {
            Globals.GameMaster.changeScene(new MainScene());
        };
        Assets.Missions.forEach((mission, index) => {
            const button = new Button(
                new PIXI.Rectangle(
                    Globals.app.canvas.width / 2 - 300 / 2,
                    Globals.app.canvas.height / 5 + index * 80,
                    300,
                    60
                ),
                mission.name,
                ButtonTexture.Button01
            );
            button.onClick = (e) => {
                Globals.GameMaster.changeScene(new GameScene(mission.name));
            };
        });
    }
}
