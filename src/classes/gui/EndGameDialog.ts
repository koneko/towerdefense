import * as PIXI from 'pixi.js';
import GameAssets from '../Assets';
import GameUIConstants from '../GameUIConstants';
import ModalDialogBase from './ModalDialog';
import TextInput from './TextInput';
import MessageBox from './MessageBox';
import { HighScoreManager } from '../game/HighScoreManager';
import MissionStats from '../game/MissionStats';

export const EndGameDialogButtons = {
    Confirm: 'OK',
    Skip: 'Skip',
};

export default class EndGameDialog extends ModalDialogBase {
    private dialogCaption: PIXI.Text;
    private playerNameTextInput: TextInput;
    private lost: boolean;
    private highScore: HighScoreManager;
    private missionStats: MissionStats;

    constructor(missionName: string, missionStats: MissionStats, lost: boolean) {
        super(
            [EndGameDialogButtons.Confirm, EndGameDialogButtons.Skip],
            EndGameDialogButtons.Confirm,
            EndGameDialogButtons.Skip
        );
        this.lost = lost;
        this.highScore = new HighScoreManager(missionName);
        this.missionStats = missionStats;
    }

    protected override generate(): void {
        super.generate();
        this.dialogCaption = new PIXI.Text({
            text: this.lost ? 'You lost!' : 'You won!',
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 36,
                stroke: { color: 0x000000, width: 2 },
                dropShadow: {
                    color: 0x000000,
                    blur: 8,
                    distance: 0,
                },
            }),
        });
        this.dialogCaption.anchor.set(0.5, 0.5);
        this.dialogCaption.x = this.dialogContainer.width / 2;
        this.dialogCaption.y = 50;
        this.dialogContainer.addChild(this.dialogCaption);
    }

    protected override createDialogBackground(): PIXI.NineSliceSprite {
        return new PIXI.NineSliceSprite({
            texture: GameAssets.EndScreenDialog,
            leftWidth: 50,
            topHeight: 100,
            rightWidth: 50,
            bottomHeight: 50,
        });
    }

    protected override createContent(): PIXI.Container {
        const container = new PIXI.Container();
        const lineHeight = 35;
        const lblScore = this.createText('Mission details:', '#fee', true);
        container.addChild(lblScore);
        const stats = this.missionStats.getStats();
        const width = this.getWidth() - this.background.leftWidth - this.background.rightWidth - 20;
        const labels = [
            this.createText('HP:'),
            this.createText('Gold:'),
            this.createText('Waves Survived:'),
            this.createText('Gold Earned:'),
            this.createText('Gold Spent:'),
            this.createText('----'),
            this.createText('Score:'),
        ];
        const values = [
            this.createText(stats.hp.toString(), 'yellow'),
            this.createText(stats.gold.toString(), 'yellow'),
            this.createText(stats.wavesSurvived.toString(), 'yellow'),
            this.createText(stats.goldEarned.toString(), 'yellow'),
            this.createText(stats.goldSpent.toString(), 'yellow'),
            this.createText('----', 'yellow'),
            this.createText(stats.score.toString(), 'yellow'),
        ];
        const valueX = 300;
        for (let i = 0; i < labels.length; i++) {
            if (labels[i].text === '----') {
                const line = new PIXI.Graphics();
                const y = lblScore.y + lblScore.height + 10 + i * lineHeight + lineHeight / 2;
                line.moveTo(10, y);
                line.lineTo(width, y);
                line.stroke({ color: 'yellow', width: 2 });
                container.addChild(line);
            } else {
                labels[i].x = 10;
                labels[i].y = lblScore.y + lblScore.height + 10 + i * lineHeight;
                container.addChild(labels[i]);

                values[i].x = valueX;
                values[i].y = lblScore.y + lblScore.height + 10 + i * lineHeight;
                container.addChild(values[i]);
            }
        }
        const offsetY = values[values.length - 1].y + lineHeight + 80;

        const lblName = this.createText('Enter your name:');
        lblName.y = offsetY;
        container.addChild(lblName);
        this.playerNameTextInput = new TextInput(width, GameUIConstants.MaximumPlayerNameLength);
        this.playerNameTextInput.container.y = lblName.y + lblName.height + 10;
        container.addChild(this.playerNameTextInput.container);
        return container;
    }

    override close(button?: string): void {
        if (button === EndGameDialogButtons.Confirm) {
            if (this.playerNameTextInput.getText().length == 0) {
                MessageBox.show('Please enter your name.\n(Just start typing, input bar is automatically selected.)', [
                    'OK',
                ]);
            } else {
                this.highScore.addScore({
                    playerName: this.playerNameTextInput.getText(),
                    score: this.missionStats.getStats().score,
                    timestamp: Date.now(),
                });
                super.close(button);
            }
        } else {
            super.close(button);
        }
    }

    private createText(caption: string, color: string = '#fff', bold = false): PIXI.Text {
        return new PIXI.Text({
            text: caption,
            style: new PIXI.TextStyle({
                fill: color,
                fontSize: 24,
                fontWeight: bold ? 'bold' : 'normal',
            }),
        });
    }

    protected override getWidth(): number | undefined {
        return 600;
    }

    protected override getHeight(): number | undefined {
        return 800;
    }
}
