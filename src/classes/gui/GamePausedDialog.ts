import * as PIXI from 'pixi.js';
import ModalDialogBase from './ModalDialog';
import Button, { ButtonTexture } from './Button';
import { Engine } from '../Bastion';
import { MissionPickerScene } from '../../scenes/MissionPicker';
import { GameScene } from '../../scenes/Game';
import KeyboardManager from '../game/KeyboardManager';

export default class GamePausedDialog extends ModalDialogBase {
    private btnMainMenu: Button;
    private btnRetry: Button;
    private btnContinue: Button;
    private _unsubKeypress: () => void;

    constructor() {
        super([]);
        this._unsubKeypress = KeyboardManager.onKeyPressed(this.onContinueClick.bind(this));
    }

    protected override createContent(): PIXI.Container {
        const container = new PIXI.Container();
        this.btnMainMenu = new Button(new PIXI.Rectangle(0, 0, 300, 60), 'Main Menu', ButtonTexture.Button01);
        this.btnMainMenu.onClick = this.onMainMenuClick.bind(this);
        container.addChild(this.btnMainMenu.container);
        this.btnRetry = new Button(new PIXI.Rectangle(0, 70, 300, 60), 'Retry', ButtonTexture.Button01);
        this.btnRetry.onClick = this.onRetryClick.bind(this);
        container.addChild(this.btnRetry.container);

        this.btnContinue = new Button(new PIXI.Rectangle(0, 140, 300, 60), 'Continue', ButtonTexture.Button01);
        this.btnContinue.onClick = this.onContinueClick.bind(this);
        container.addChild(this.btnContinue.container);

        return container;
    }

    private onMainMenuClick(): void {
        this.close();
        this._unsubKeypress();
        Engine.GameScene.destroy();
        Engine.GameMaster.changeScene(new MissionPickerScene());
    }

    private onRetryClick(): void {
        const missionName = Engine.GameScene.mission.name;
        this.close();
        this._unsubKeypress();
        Engine.GameScene.destroy();
        Engine.GameMaster.changeScene(new MissionPickerScene());
        Engine.GameMaster.changeScene(new GameScene(missionName));
        Engine.NotificationManager.Notify('Retrying mission.', 'green');
    }

    private onContinueClick(): void {
        this.close();
        Engine.GameScene.UnpauseGame();
    }
}
