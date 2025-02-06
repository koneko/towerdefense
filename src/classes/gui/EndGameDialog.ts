import * as PIXI from 'pixi.js';
import GameAssets from '../Assets';
import GameUIConstants from '../GameUIConstants';
import ModalDialogBase from './ModalDialog';
import TextInput from './TextInput';
import MessageBox from './MessageBox';

export const EndGameDialogButtons = {
    Confirm: 'OK',
    Skip: 'Skip',
};

export default class EndGameDialog extends ModalDialogBase {
    private dialogCaption: PIXI.Text;
    private playerNameTextInput: TextInput;
    private lost: boolean;

    constructor(lost: boolean) {
        super(
            [EndGameDialogButtons.Confirm, EndGameDialogButtons.Skip],
            EndGameDialogButtons.Confirm,
            EndGameDialogButtons.Skip
        );
        this.lost = lost;
    }

    protected override generate(): void {
        super.generate();
        this.dialogCaption = new PIXI.Text({
            text: this.lost ? 'You lost!' : 'You won!',
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 36,
            }),
        });
        this.dialogContainer.addChild(this.dialogCaption);
        this.dialogCaption.anchor.set(0.5, 0.5);
        this.dialogCaption.x = this.dialogContainer.width / 2;
        this.dialogCaption.y = 50;
    }

    protected override createDialogBackground(width: number, height: number): PIXI.Container {
        const background = new PIXI.NineSliceSprite({
            texture: GameAssets.EndScreenDialog,
            leftWidth: 50,
            topHeight: 100,
            rightWidth: 50,
            bottomHeight: 50,
        });
        background.x = 0;
        background.y = 0;
        background.width = width;
        background.height = height;
        return background;
    }

    protected override createContent(): PIXI.Container {
        const container = new PIXI.Container();
        const caption = new PIXI.Text({
            text: 'Enter your name:',
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 24,
            }),
        });
        container.addChild(caption);
        this.playerNameTextInput = new TextInput(
            GameUIConstants.MaximumPlayerNameLength * 20,
            GameUIConstants.MaximumPlayerNameLength
        );
        this.playerNameTextInput.container.y = caption.height + 10;
        container.addChild(this.playerNameTextInput.container);
        return container;
    }

    override close(button?: string): void {
        if (button === EndGameDialogButtons.Confirm && this.playerNameTextInput.getText().length == 0) {
            MessageBox.show('Please enter your name.', ['OK']);
        } else {
            super.close(button);
        }
    }

    protected override getWidth(): number | undefined {
        return GameUIConstants.StandardDialogWidth;
    }

    protected override getHeight(): number | undefined {
        return GameUIConstants.StandardDialogHeight;
    }
}
