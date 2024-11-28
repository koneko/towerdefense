import Assets from '../classes/Assets';
import { environment } from '../classes/Bastion';
import Button, { ButtonTexture } from '../classes/gui/Button';
import { GameScene } from './Game';
import Scene from './Scene';
import * as PIXI from 'pixi.js';

export class MissionPickerScene extends Scene {
    public init() {
        Assets.Missions.forEach((mission, index) => {
            const button = new Button(
                new PIXI.Rectangle(
                    environment.WindowWidth / 2 - 300 / 2,
                    environment.WindowHeight / 5 + index * 80,
                    300,
                    60
                ),
                mission.name,
                ButtonTexture.Button01
            );
            button.onClick = (e) => {
                environment.GameMaster.changeScene(new GameScene(mission.name));
            };
        });
    }
}
