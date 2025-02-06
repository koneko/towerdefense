import * as PIXI from 'pixi.js';
import GameAssets from '../Assets';
import GameUIConstants from '../GameUIConstants';
import ModalDialogBase from './ModalDialog';
import TextInput from './TextInput';

export const HighScoreDialogButtons = {
    Retry: 'Retry',
    MainMenu: 'Main Menu',
    NextMission: 'Next Mission',
};

export default class HighScoreDialog extends ModalDialogBase {
    private dialogCaption: PIXI.Text;
    private playerNameTextInput: TextInput;
    private lost: boolean;

    constructor(nextMissionAvailable: boolean) {
        super(
            nextMissionAvailable
                ? [HighScoreDialogButtons.Retry, HighScoreDialogButtons.NextMission, HighScoreDialogButtons.MainMenu]
                : [HighScoreDialogButtons.Retry, HighScoreDialogButtons.MainMenu],
            nextMissionAvailable ? HighScoreDialogButtons.NextMission : HighScoreDialogButtons.Retry,
            HighScoreDialogButtons.MainMenu
        );
    }

    protected override generate(): void {
        super.generate();
        this.dialogCaption = new PIXI.Text({
            text: 'Highscore',
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
            text: 'Leaderboard:',
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 24,
            }),
        });
        container.addChild(caption);
        return container;
    }

    protected override getWidth(): number | undefined {
        return GameUIConstants.StandardDialogWidth;
    }

    protected override getHeight(): number | undefined {
        return GameUIConstants.StandardDialogHeight;
    }
}
