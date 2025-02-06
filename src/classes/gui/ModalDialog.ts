import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import Assets from '../Assets';
import { Engine } from '../Bastion';
import GameAssets from '../Assets';
import Button, { ButtonTexture } from './Button';
import KeyboardManager from '../game/KeyboardManager';

export default abstract class ModalDialogBase extends GuiObject {
    protected overlay: PIXI.Graphics;
    protected dialogPadding = 40;
    protected contentPadding = 10;
    protected buttonPadding = 10;
    protected buttonAreaHeight = 40;
    protected buttonHeight = 60;
    protected buttonCaptions: string[];
    protected buttons: Button[] = [];
    protected dialogContent: PIXI.Container;
    protected dialogContainer: PIXI.Container;

    private generated = false;
    private escapeKeyButton?: string | null;
    private enterKeyButton?: string | null;
    private keyboardManagerUnsubscribe: () => void;

    protected constructor(buttons: string[], enterKeyButton?: string | null, escapeKeyButton?: string | null) {
        super();
        this.buttonCaptions = buttons;
        if (escapeKeyButton && !buttons.includes(escapeKeyButton))
            throw new Error(`Escape key button "${escapeKeyButton}" not found in buttons: ${buttons}`);
        this.escapeKeyButton = escapeKeyButton;
        if (enterKeyButton && !buttons.includes(enterKeyButton))
            throw new Error(`Enter key button "${enterKeyButton}" not found in buttons: ${buttons}`);
        this.enterKeyButton = enterKeyButton;
        this.keyboardManagerUnsubscribe = KeyboardManager.onKeyPressed(this.onKeyPress.bind(this));
    }

    /**
     * Show the dialog and await the user's response.
     * @param width  The width of the dialog (optional, if not provided then it is automatically calculated).
     * @param height  The height of the dialog (optional, if not provided then it is automatically calculated).
     * @returns Button that was clicked or null if dialog was closed without clicking a button (potentially no buttons defined).
     */
    public show(): Promise<string | null> {
        this.generate();
        console.debug(
            `ModalDialogBase.show(content: ${this.dialogContainer.width}x${this.dialogContainer.height}, buttons: ${this.buttonCaptions})`
        );
        return new Promise((resolve, reject) => {
            Engine.app.stage.addChild(this.container);
            this.onClosed = (button) => {
                this.destroy();
                resolve(button);
            };
        });
    }

    /**
     * Event that is triggered when the dialog is closed.
     * @param button The button that was clicked or null if the dialog was closed without clicking a button.
     */
    public onClosed: (button?: string) => void;

    /**
     * Create the content of the dialog.
     */
    protected abstract createContent(): PIXI.Container;

    /**
     * Creates dialog background.
     */
    protected createDialogBackground(width: number, height: number): PIXI.Container {
        const background = new PIXI.NineSliceSprite({
            texture: GameAssets.Frame04Texture,
            leftWidth: 60,
            topHeight: 60,
            rightWidth: 60,
            bottomHeight: 60,
        });
        background.x = 0;
        background.y = 0;
        background.width = width;
        background.height = height;
        return background;
    }

    /**
     * Gets the width of the dialog.
     * If not overridden, the width is automatically calculated.
     */
    protected getWidth(): number | undefined {
        return undefined;
    }

    /**
     * Gets the height of the dialog.
     * If not overridden, the height is automatically calculated.
     */
    protected getHeight(): number | undefined {
        return undefined;
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

        this.dialogContent = this.createContent();
        const buttonDefs = this.buttonCaptions.map((btnCaption) => ({
            caption: btnCaption,
            width: btnCaption.length * 16 + 40,
            height: this.buttonHeight,
            click: () => this.close(btnCaption),
        }));
        let buttonTotalWidth = 0;
        for (const buttonDef of buttonDefs) {
            if (buttonTotalWidth > 0) buttonTotalWidth += this.buttonPadding;
            buttonTotalWidth += buttonDef.width;
        }
        const contentWidth = this.dialogContent.width + this.contentPadding * 2;
        const contentHeight = this.dialogContent.height + this.contentPadding * 2;
        let width = this.getWidth() || Math.max(buttonTotalWidth, contentWidth) + this.dialogPadding * 2;
        let height = this.getHeight() || contentHeight + this.buttonAreaHeight + this.dialogPadding * 2;
        const modalBounds = new PIXI.Rectangle(
            Engine.app.canvas.width / 2 - width / 2,
            Engine.app.canvas.height / 2 - height / 2,
            width,
            height
        );

        this.dialogContainer = new PIXI.Container();
        this.dialogContainer.x = modalBounds.x;
        this.dialogContainer.y = modalBounds.y;

        const background = this.createDialogBackground(modalBounds.width, modalBounds.height);
        this.dialogContainer.addChild(background);

        if (this.dialogContent.width < modalBounds.width)
            this.dialogContent.x = modalBounds.width / 2 - this.dialogContent.width / 2;
        if (this.dialogContent.height < modalBounds.height - this.buttonAreaHeight)
            this.dialogContent.y = (modalBounds.height - this.buttonAreaHeight) / 2 - this.dialogContent.height / 2;
        this.dialogContainer.addChild(this.dialogContent);

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
            this.dialogContainer.addChild(button.container);
            buttonXPos += buttonDef.width + this.buttonPadding;
        }
        this.container.addChild(this.dialogContainer);
    }

    /**
     * Close the dialog.
     * Only use this method if you want to close the dialog without clicking a button.
     */
    public close(button?: string) {
        this.destroy();
        if (this.onClosed) this.onClosed(button);
    }

    override destroy(): void {
        this.keyboardManagerUnsubscribe();
        super.destroy();
    }

    private onKeyPress(event: KeyboardEvent) {
        if (this.buttons.length === 0) return;
        if (this.escapeKeyButton && event.key === 'Escape') {
            // Message box is modal, so we can safely prevent the default behavior
            event.preventDefault();
            this.close(this.escapeKeyButton);
        } else if (this.enterKeyButton && event.key === 'Enter') {
            // Message box is modal, so we can safely prevent the default behavior
            event.preventDefault();
            this.close(this.enterKeyButton);
        }
    }
}
