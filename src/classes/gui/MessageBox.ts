import * as PIXI from 'pixi.js';
import ModalDialogBase from './ModalDialog';
import GuiObject from '../GuiObject';

export default class MessageBox extends ModalDialogBase {
    private caption: string;

    constructor(caption: string, buttons: string[], escapeKeyButton?: string | null, enterKeyButton?: string | null) {
        if (!enterKeyButton && buttons.length > 0) enterKeyButton = buttons[0];
        if (!escapeKeyButton && buttons.length > 0) escapeKeyButton = buttons[buttons.length - 1];

        super(buttons, escapeKeyButton, enterKeyButton);
        this.caption = caption;
    }

    protected override createContent(): PIXI.Container {
        const text = new PIXI.Text({
            text: this.caption,
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 24,
            }),
        });
        return text;
    }

    /**
     * Shows a message box with the specified caption and buttons.
     * @param caption  The caption of the message box.
     * @param buttons  The buttons to show.
     * @returns  A promise that resolves with the button that was clicked.
     */
    public static show(caption: string, buttons: string[], escapeKeyButtonIndex: number = 0): Promise<string> {
        const messageBox = new MessageBox(caption, buttons);
        return messageBox.show();
    }
}
