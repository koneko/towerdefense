import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import GameAssets from '../Assets';
import GameUIConstants from '../GameUIConstants';
import Button, { ButtonTexture } from './Button';
import { Engine } from '../Bastion';
import { EndMissionDialogEvents } from '../Events';
import MessageBox from './MessageBox';
import KeyboardManager from '../game/KeyboardManager';

export default class EndGameDialog extends GuiObject {
    private dialogSprite: PIXI.NineSliceSprite;
    private dialogCaption: PIXI.Text;
    private nextMissionButton: Button;
    private retryButton: Button;
    private mainMenuButton: Button;
    private overlay: PIXI.Graphics;
    private lost: boolean;
    private keyboardManagerUnsubscribe: () => void;

    constructor(bounds: PIXI.Rectangle, lost: boolean) {
        super();
        this.lost = lost;
        // Show overlay to prevent user from interacting with the game
        this.overlay = new PIXI.Graphics();
        this.overlay.rect(0, 0, bounds.width, bounds.height);
        this.overlay.fill({ color: 0x000000, alpha: 0.5 });
        // Prevent interaction with the underlying scene
        this.overlay.interactive = true;
        this.container.addChild(this.overlay);

        this.dialogSprite = new PIXI.NineSliceSprite({
            texture: GameAssets.EndScreenDialog,
            leftWidth: 50,
            topHeight: 100,
            rightWidth: 50,
            bottomHeight: 50,
        });
        this.dialogSprite.x = GameUIConstants.EndGameDialogRect.x;
        this.dialogSprite.y = GameUIConstants.EndGameDialogRect.y;
        this.dialogSprite.width = GameUIConstants.EndGameDialogRect.width;
        this.dialogSprite.height = GameUIConstants.EndGameDialogRect.height;
        this.container.addChild(this.dialogSprite);
        this.dialogCaption = new PIXI.Text({
            text: lost ? 'You lost!' : 'You won!',
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 36,
            }),
        });
        this.container.addChild(this.dialogCaption);
        this.dialogCaption.anchor.set(0.5, 0.5);
        this.dialogCaption.x = GameUIConstants.EndGameDialogRect.x + GameUIConstants.EndGameDialogRect.width / 2;
        this.dialogCaption.y = GameUIConstants.EndGameDialogRect.y + 50;
        //this.setupButtons(lost);
        this.keyboardManagerUnsubscribe = KeyboardManager.onKey('Escape', (e) => {
            if (e.key === 'Escape') {
                this.onMainMission();
            }
        });
        this.container.on('destroyed', () => {
            this.keyboardManagerUnsubscribe();
        });
    }

    private setupButtons(lost: boolean) {
        const buttonContainer = new PIXI.Container();
        const buttonWidth = 200;
        const buttonHeight = 80;
        const buttonPadding = 10;
        if (lost) {
            this.retryButton = new Button(
                new PIXI.Rectangle(0, 0, buttonWidth, buttonHeight),
                'Retry',
                ButtonTexture.Button01
            );
            this.retryButton.onClick = () => {
                Engine.GameScene.events.emit(EndMissionDialogEvents.RetryMission);
            };
            buttonContainer.addChild(this.retryButton.container);
        } else {
            this.nextMissionButton = new Button(
                new PIXI.Rectangle(0, 0, buttonWidth, buttonHeight),
                'Next Mission',
                ButtonTexture.Button01
            );
            this.nextMissionButton.onClick = () => {
                Engine.GameScene.events.emit(EndMissionDialogEvents.NextMission);
            };
            buttonContainer.addChild(this.nextMissionButton.container);
        }
        this.mainMenuButton = new Button(
            new PIXI.Rectangle(0, buttonHeight + buttonPadding, buttonWidth, buttonHeight),
            'Main Menu',
            ButtonTexture.Button01
        );
        this.mainMenuButton.onClick = this.onMainMission.bind(this);
        buttonContainer.addChild(this.mainMenuButton.container);
        this.container.addChild(buttonContainer);
        buttonContainer.x =
            GameUIConstants.EndGameDialogRect.x +
            GameUIConstants.EndGameDialogRect.width / 2 -
            buttonContainer.width / 2;
        buttonContainer.y =
            GameUIConstants.EndGameDialogRect.y + GameUIConstants.EndGameDialogRect.height - buttonContainer.height;
    }

    private showingMessageBox: boolean;

    private async onMainMission() {
        if (this.showingMessageBox) return;
        this.showingMessageBox = true;
        const result = await MessageBox.show('Are you sure you want to return to the main menu?', ['Yes', 'No']);
        this.showingMessageBox = false;
        if (result === 'Yes') {
            Engine.GameScene.events.emit(EndMissionDialogEvents.MainMenu);
        }
    }
}
