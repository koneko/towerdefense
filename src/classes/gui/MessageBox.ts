import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import Assets from '../Assets';
import { Engine } from '../Bastion';
import GameAssets from '../Assets';
import Button, { ButtonTexture } from './Button';
import KeyboardManager from '../game/KeyboardManager';

export default class MessageBox extends GuiObject {
    private overlay: PIXI.Graphics;
    private buttonPadding = 10;
    private buttons: Button[] = [];
    private escapeKeyIndex: number;
    private keyboardManagerUnsubscribe: () => void;

    constructor(caption: string, buttons: string[], escapeKeyIndex: number = buttons.length - 1) {
        super();
        console.log(`MessageBox(caption: ${caption}, buttons: ${buttons})`);
        this.escapeKeyIndex = escapeKeyIndex;
        // Show overlay to prevent user from interacting with the game
        this.overlay = new PIXI.Graphics();
        this.overlay.rect(0, 0, Engine.app.canvas.width, Engine.app.canvas.height);
        this.overlay.fill({ color: 0x000000, alpha: 0.5 });
        // Prevent interaction with the underlying scene
        this.overlay.interactive = true;
        this.container.addChild(this.overlay);

        const buttonDefs = buttons.map((btn) => ({
            caption: btn,
            width: btn.length * 10 + 40,
            height: 60,
            click: () => this.buttonClicked(btn),
        }));
        let buttonTotalWidth = 0;
        for (const buttonDef of buttonDefs) {
            if (buttonTotalWidth > 0) buttonTotalWidth += this.buttonPadding;
            buttonTotalWidth += buttonDef.width;
        }
        const captionWidth = caption.length * 10 + 100;
        let width = Math.max(buttonTotalWidth, captionWidth);

        const height = 150;
        const inputContainerBounds = new PIXI.Rectangle(
            Engine.app.canvas.width / 2 - width / 2,
            Engine.app.canvas.height / 2 - height / 2,
            width,
            height
        );

        const inputContainer = new PIXI.Container();
        inputContainer.x = inputContainerBounds.x;
        inputContainer.y = inputContainerBounds.y;
        inputContainer.width = inputContainerBounds.width;
        inputContainer.height = inputContainerBounds.height;

        const background = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame04Texture,
            leftWidth: 200,
            topHeight: 200,
            rightWidth: 200,
            bottomHeight: 200,
        });
        background.x = 0;
        background.y = 0;
        background.width = inputContainerBounds.width;
        background.height = inputContainerBounds.height;
        inputContainer.addChild(background);

        const text = new PIXI.Text({
            text: caption,
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 24,
            }),
        });
        text.anchor.set(0.5, 0.5);
        text.x = inputContainerBounds.width / 2;
        text.y = 40;
        inputContainer.addChild(text);

        let buttonXPos = inputContainerBounds.width / 2 - buttonTotalWidth / 2;
        for (const buttonDef of buttonDefs) {
            const button = new Button(
                new PIXI.Rectangle(
                    buttonXPos,
                    inputContainerBounds.height - buttonDef.height - 20,
                    buttonDef.width,
                    buttonDef.height
                ),
                buttonDef.caption,
                ButtonTexture.Button01
            );
            button.onClick = buttonDef.click;
            this.buttons.push(button);
            inputContainer.addChild(button.container);
            buttonXPos += buttonDef.width + this.buttonPadding;
        }
        this.container.addChild(inputContainer);
        this.keyboardManagerUnsubscribe = KeyboardManager.onKey('Escape', this.onKeyPress.bind(this));
    }

    /**
     * Event that is triggered when the button is clicked.
     */
    public onButtonClicked: (button: string) => void;

    override destroy(): void {
        this.keyboardManagerUnsubscribe();
        super.destroy();
    }

    private buttonClicked(button: string) {
        if (this.onButtonClicked) this.onButtonClicked(button);
        this.destroy();
    }

    private onKeyPress(event: KeyboardEvent) {
        // Message box is modal, so we can safely prevent the default behavior
        event.preventDefault();
        if (event.key === 'Escape') {
            this.onButtonClicked(this.buttons[this.escapeKeyIndex].getCaption());
        } else if (event.key === 'Enter') {
            this.onButtonClicked(this.buttons[0].getCaption());
        }
    }

    /**
     * Shows a message box with the specified caption and buttons.
     * @param caption  The caption of the message box.
     * @param buttons  The buttons to show.
     * @returns  A promise that resolves with the button that was clicked.
     */
    public static show(caption: string, buttons: string[], escapeKeyButtonIndex: number = 0): Promise<string> {
        return new Promise((resolve, reject) => {
            const messageBox = new MessageBox(caption, buttons);
            Engine.app.stage.addChild(messageBox.container);
            messageBox.onButtonClicked = (button) => {
                messageBox.destroy();
                resolve(button);
            };
        });
    }
}
