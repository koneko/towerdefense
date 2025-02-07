import * as PIXI from 'pixi.js';
import GameAssets from '../Assets';
import ModalDialogBase from './ModalDialog';
import { HighScoreManager } from '../game/HighScoreManager';

export const HighScoreDialogButtons = {
    Retry: 'Retry',
    MainMenu: 'Main Menu',
    NextMission: 'Next Mission',
};

export default class HighScoreDialog extends ModalDialogBase {
    private dialogCaption: PIXI.Text;
    private highScore: HighScoreManager;

    constructor(missionName: string, retryPossible: boolean, nextMissionAvailable: boolean) {
        super(
            [
                ...(retryPossible ? [HighScoreDialogButtons.Retry] : []),
                ...(nextMissionAvailable ? [HighScoreDialogButtons.NextMission] : []),
                HighScoreDialogButtons.MainMenu,
            ],
            retryPossible
                ? HighScoreDialogButtons.Retry
                : nextMissionAvailable
                ? HighScoreDialogButtons.NextMission
                : HighScoreDialogButtons.MainMenu,
            HighScoreDialogButtons.MainMenu
        );
        this.highScore = new HighScoreManager(missionName);
    }

    protected override generate(): void {
        super.generate();
        this.dialogCaption = new PIXI.Text({
            text: 'Highscore',
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
        const caption = this.createText('Mission: ' + this.highScore.missionName, '#fee', true);
        container.addChild(caption);
        const lineHeight = 35;
        const scores = this.highScore.getScores();
        while (scores.length < 10) {
            scores.push({ playerName: '---', score: 0, timestamp: 0 });
        }

        const numberTexts = [
            this.createText('#', '#fee'),
            ...scores.map((_, i) => this.createText((i + 1).toString())),
        ];
        const playerTexts = [
            this.createText('Player', '#fee', true),
            ...scores.map((score) => this.createText(score.playerName)),
        ];
        const scoreTexts = [
            this.createText('Score', '#fee', true),
            ...scores.map((score) => this.createText(score.score.toString())),
        ];
        const playerX = numberTexts.reduce((maxX, text) => Math.max(maxX, text.width), 0) + 20;
        const scoreX = playerX + playerTexts.reduce((maxX, text) => Math.max(maxX, text.width), 0) + 20;
        for (let i = 0; i < playerTexts.length; i++) {
            numberTexts[i].x = 10;
            numberTexts[i].y = lineHeight + 10 + i * lineHeight;
            container.addChild(numberTexts[i]);

            playerTexts[i].x = playerX;
            playerTexts[i].y = lineHeight + 10 + i * lineHeight;
            container.addChild(playerTexts[i]);

            scoreTexts[i].x = scoreX;
            scoreTexts[i].y = lineHeight + 10 + i * lineHeight;
            container.addChild(scoreTexts[i]);
        }
        return container;
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
