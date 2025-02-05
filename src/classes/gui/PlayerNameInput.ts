import * as PIXI from 'pixi.js';
import { Engine } from '../Bastion';
import ModalDialogBase from './ModalDialog';
import TextInput from './TextInput';
import GuiObject from '../GuiObject';

const maxNameLength = 20;

export default class PlayerNameInput extends ModalDialogBase {
    private textInput: TextInput;

    constructor(content: PIXI.Container) {
        super(['OK', 'Cancel']);
    }

    public getName(): string {
        return this.textInput.getText();
    }

    protected override createContent(): PIXI.Container | GuiObject {
        const container = new PIXI.Container();
        const caption = new PIXI.Text({
            text: 'Enter your name:',
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 24,
            }),
        });
        container.addChild(caption);
        this.textInput = new TextInput(new PIXI.Rectangle(0, 0, maxNameLength * 20, 40), maxNameLength);
        this.textInput.container.y = caption.height + 10;
        container.addChild(this.textInput.container);
        return container;
    }

    override buttonClickHandler(button: string) {
        if (button === 'OK') {
            if (this.textInput.getText().length > 0) {
                super.buttonClickHandler(button);
            }
        } else {
            super.buttonClickHandler(button);
        }
    }
}
