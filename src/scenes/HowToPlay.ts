import GameAssets from '../classes/Assets';
import Assets from '../classes/Assets';
import { Engine } from '../classes/Bastion';
import Button, { ButtonTexture } from '../classes/gui/Button';
import { GameScene } from './Game';
import { MainScene } from './Main';
import Scene from './Scene';
import * as PIXI from 'pixi.js';

export class HowToPlay extends Scene {
    public currentImg = 1;
    public sprite;
    public init() {
        let sprites = [
            null,
            GameAssets.Tutorial01,
            GameAssets.Tutorial02,
            GameAssets.Tutorial03,
            GameAssets.Tutorial04,
            GameAssets.Tutorial05,
        ];
        this.sprite = new PIXI.Sprite({
            texture: GameAssets.Tutorial01,
            scale: 0.6,
            x: 250,
            y: 150,
        });
        this.stage.addChild(this.sprite);
        let leftButton = new Button(
            new PIXI.Rectangle(250, this.sprite.height + 160, 120, 60),
            'Back',
            ButtonTexture.Button01
        );
        leftButton.container.alpha = 0;
        leftButton.onClick = () => {
            if (leftButton.container.alpha == 0 || this.currentImg == 1) return;
            this.currentImg--;
            if (this.currentImg == 3) this.sprite.scale = 1.1;
            else this.sprite.scale = 0.6;
            this.sprite.texture = sprites[this.currentImg];
            if (this.currentImg == 1) leftButton.container.alpha = 0;
        };

        let right = new Button(
            new PIXI.Rectangle(this.sprite.width + 130, this.sprite.height + 160, 120, 60),
            'Next',
            ButtonTexture.Button01
        );
        right.onClick = () => {
            if (right.container.alpha == 0) return;
            this.currentImg++;
            if (this.currentImg == 3) this.sprite.scale = 1.1;
            else this.sprite.scale = 0.6;
            if (this.currentImg != 1) leftButton.container.alpha = 1;
            this.sprite.texture = sprites[this.currentImg];
            if (this.currentImg == 5) right.container.alpha = 0;
        };
        const button = new Button(
            new PIXI.Rectangle(this.sprite.width - 540, this.sprite.height + 160, 200, 60),
            'Main menu',
            ButtonTexture.Button01
        );
        button.onClick = (e) => {
            Engine.GameMaster.changeScene(new MainScene());
        };
    }
}
