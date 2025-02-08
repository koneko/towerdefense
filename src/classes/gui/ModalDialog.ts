import * as PIXI from 'pixi.js';
import GuiObject from '../GuiObject';
import Assets from '../Assets';
import { Engine } from '../Bastion';
import GameAssets from '../Assets';
import Button, { ButtonTexture } from './Button';
import KeyboardManager from '../game/KeyboardManager';

export default abstract class ModalDialogBase extends GuiObject {
    protected overlay: PIXI.Graphics;
    protected buttonHeight = 65;
    protected buttonCaptions: string[];
    protected buttons: Button[] = [];
    protected dialogContent: PIXI.Container;
    protected dialogContainer: PIXI.Container;
    protected background: PIXI.NineSliceSprite;

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
        const dialogBounds = `x: ${Math.round(this.dialogContainer.x)}, y: ${Math.round(
            this.dialogContainer.y
        )}, width: ${Math.round(this.dialogContainer.width)}, height: ${Math.round(this.dialogContainer.height)}`;
        const contentBounds = `x: ${Math.round(this.dialogContent.x)}, y: ${Math.round(
            this.dialogContent.y
        )}, width: ${Math.round(this.dialogContent.width)}, height: ${Math.round(this.dialogContent.height)}`;
        console.debug(
            `ModalDialogBase.show(dialog: ${dialogBounds}, content: ${contentBounds}, buttons: ${this.buttonCaptions})`
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
    protected createDialogBackground(): PIXI.NineSliceSprite {
        return new PIXI.NineSliceSprite({
            texture: GameAssets.Frame04Texture,
            leftWidth: 60,
            topHeight: 60,
            rightWidth: 60,
            bottomHeight: 60,
        });
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
        const buttonDefs = this.buttonCaptions.map((btnCaption) => ({
            caption: btnCaption,
            width: btnCaption.length * 14 + 60,
            height: this.buttonHeight,
            click: () => this.close(btnCaption),
        }));

        this.background = this.createDialogBackground();
        this.dialogContent = this.createContent();

        let buttonTotalWidth = 0;
        for (const buttonDef of buttonDefs) {
            if (buttonTotalWidth > 0) buttonTotalWidth += 10;
            buttonTotalWidth += buttonDef.width;
        }
        const buttonAreaHeight = this.buttonCaptions.length > 0 ? this.buttonHeight + 10 : 0;

        let width =
            this.getWidth() ||
            Math.max(buttonTotalWidth, this.dialogContent.width) +
                this.background.leftWidth +
                this.background.rightWidth;
        let height =
            this.getHeight() ||
            this.dialogContent.height + buttonAreaHeight + this.background.topHeight + this.background.bottomHeight;
        const modalBounds = new PIXI.Rectangle(
            Engine.app.canvas.width / 2 - width / 2,
            Engine.app.canvas.height / 2 - height / 2,
            width,
            height
        );

        this.dialogContainer = new PIXI.Container();
        this.dialogContainer.x = modalBounds.x;
        this.dialogContainer.y = modalBounds.y;
        this.background.width = width;
        this.background.height = height;
        this.dialogContainer.addChild(this.background);

        if (this.dialogContent.width < modalBounds.width) {
            this.dialogContent.x = modalBounds.width / 2 - this.dialogContent.width / 2;
        }
        if (
            this.dialogContent.height <
            modalBounds.height - buttonAreaHeight - this.background.topHeight - this.background.bottomHeight
        ) {
            this.dialogContent.y =
                this.background.topHeight +
                (modalBounds.height - buttonAreaHeight - this.background.topHeight - this.background.bottomHeight) / 2 -
                this.dialogContent.height / 2;
        } else {
            this.dialogContent.y = this.background.topHeight;
        }
        this.dialogContainer.addChild(this.dialogContent);

        let buttonXPos = modalBounds.width / 2 - buttonTotalWidth / 2;
        for (const buttonDef of buttonDefs) {
            const button = new Button(
                new PIXI.Rectangle(
                    buttonXPos,
                    modalBounds.height - this.buttonHeight - this.background.bottomHeight,
                    buttonDef.width,
                    buttonDef.height
                ),
                buttonDef.caption,
                ButtonTexture.Button01
            );
            button.onClick = buttonDef.click;
            this.buttons.push(button);
            this.dialogContainer.addChild(button.container);
            buttonXPos += buttonDef.width + 10;
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
