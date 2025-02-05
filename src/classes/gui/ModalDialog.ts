import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import Assets from '../Assets';
import { Engine } from '../Bastion';
import GameAssets from '../Assets';
import Button, { ButtonTexture } from './Button';
import KeyboardManager from '../game/KeyboardManager';

export default abstract class ModalDialogBase extends GuiObject {
    private overlay: PIXI.Graphics;
    private dialogPadding = 40;
    private contentPadding = 10;
    private buttonPadding = 10;
    private buttonAreaHeight = 40;
    private buttonHeight = 60;
    private buttonCaptions: string[];
    private buttons: Button[] = [];
    private escapeKeyIndex: number;
    private keyboardManagerUnsubscribe: () => void;
    private pixiContent: PIXI.Container;
    private guiContent: GuiObject;
    private generated = false;

    constructor(buttonCaptions: string[], escapeKeyIndex: number = buttonCaptions.length - 1) {
        super();
        this.escapeKeyIndex = escapeKeyIndex;
        this.buttonCaptions = buttonCaptions;
        this.keyboardManagerUnsubscribe = KeyboardManager.onKey('Escape', this.onKeyPress.bind(this));
    }

    protected generate() {
        if (this.generated) return;
        this.generated = true;
        // Show overlay to prevent user from interacting with the game
        this.overlay = new PIXI.Graphics();
        this.overlay.rect(0, 0, Engine.app.canvas.width, Engine.app.canvas.height);
        this.overlay.fill({ color: 0x000000, alpha: 0.5 });
        // Prevent interaction with the underlying scene
        this.overlay.interactive = true;
        this.container.addChild(this.overlay);

        const content = this.createContent();
        if (content instanceof GuiObject) {
            this.guiContent = content;
            this.pixiContent = content.container;
        } else {
            this.pixiContent = content;
        }

        const buttonDefs = this.buttonCaptions.map((btnCaption) => ({
            caption: btnCaption,
            width: btnCaption.length * 16 + 40,
            height: this.buttonHeight,
            click: () => this.buttonClickHandler(btnCaption),
        }));
        let buttonTotalWidth = 0;
        for (const buttonDef of buttonDefs) {
            if (buttonTotalWidth > 0) buttonTotalWidth += this.buttonPadding;
            buttonTotalWidth += buttonDef.width;
        }
        const contentWidth = this.pixiContent.width + this.contentPadding * 2;
        const contentHeight = this.pixiContent.height + this.contentPadding * 2;
        let width = Math.max(buttonTotalWidth, contentWidth) + this.dialogPadding * 2;

        const height = contentHeight + this.buttonAreaHeight + this.dialogPadding * 2;
        const modalBounds = new PIXI.Rectangle(
            Engine.app.canvas.width / 2 - width / 2,
            Engine.app.canvas.height / 2 - height / 2,
            width,
            height
        );

        const modalContainer = new PIXI.Container();
        modalContainer.x = modalBounds.x;
        modalContainer.y = modalBounds.y;

        const background = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame04Texture,
            leftWidth: 60,
            topHeight: 60,
            rightWidth: 60,
            bottomHeight: 60,
        });
        background.x = 0;
        background.y = 0;
        background.width = modalBounds.width;
        background.height = modalBounds.height;
        modalContainer.addChild(background);

        if (this.pixiContent.width < modalBounds.width)
            this.pixiContent.x = modalBounds.width / 2 - this.pixiContent.width / 2;
        if (this.pixiContent.height < modalBounds.height - this.buttonAreaHeight)
            this.pixiContent.y = (modalBounds.height - this.buttonAreaHeight) / 2 - this.pixiContent.height / 2;
        modalContainer.addChild(this.pixiContent);

        let buttonXPos = modalBounds.width / 2 - buttonTotalWidth / 2;
        for (const buttonDef of buttonDefs) {
            const button = new Button(
                new PIXI.Rectangle(
                    buttonXPos,
                    modalBounds.height - this.buttonAreaHeight - this.dialogPadding,
                    buttonDef.width,
                    buttonDef.height
                ),
                buttonDef.caption,
                ButtonTexture.Button01
            );
            button.onClick = buttonDef.click;
            this.buttons.push(button);
            modalContainer.addChild(button.container);
            buttonXPos += buttonDef.width + this.buttonPadding;
        }
        this.container.addChild(modalContainer);
    }

    protected abstract createContent(): PIXI.Container | GuiObject;

    public show(): Promise<string> {
        this.generate();
        console.debug(
            `ModalDialogBase.show(content: ${this.pixiContent.width}x${this.pixiContent.height}, buttons: ${this.buttonCaptions})`
        );
        return new Promise((resolve, reject) => {
            Engine.app.stage.addChild(this.container);
            this.onButtonClicked = (button) => {
                this.destroy();
                resolve(button);
            };
        });
    }

    /**
     * Event that is triggered when the button is clicked.
     */
    public onButtonClicked: (button: string) => void;

    override destroy(): void {
        this.keyboardManagerUnsubscribe();
        this.guiContent?.destroy();
        super.destroy();
    }

    protected buttonClickHandler(button: string) {
        if (this.onButtonClicked) this.onButtonClicked(button);
        this.destroy();
    }

    private onKeyPress(event: KeyboardEvent) {
        if (this.buttons.length === 0) return;
        // Message box is modal, so we can safely prevent the default behavior
        event.preventDefault();
        if (event.key === 'Escape') {
            this.buttonClickHandler(this.buttons[this.escapeKeyIndex].getCaption());
        } else if (event.key === 'Enter') {
            this.buttonClickHandler(this.buttons[0].getCaption());
        }
    }
}
