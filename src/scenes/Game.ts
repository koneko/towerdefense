import GameAssets from '../classes/Assets';
import { Engine } from '../classes/Bastion';
import { MissionDefinition } from '../classes/Definitions';
import Creep from '../classes/game/Creep';
import { Grid } from '../classes/game/Grid';
import WaveManager from '../classes/game/WaveManager';
import { WaveManagerEvents, CreepEvents, GemEvents } from '../classes/Events';
import Sidebar from '../classes/gui/Sidebar';
import Button, { ButtonTexture } from '../classes/gui/Button';
import Scene from './Scene';
import * as PIXI from 'pixi.js';
import MissionStats from '../classes/game/MissionStats';
import TowerManager from '../classes/game/TowerManager';
import { MissionPickerScene } from './MissionPicker';
import GameUIConstants from '../classes/GameUIConstants';
import Tooltip from '../classes/gui/Tooltip';
import TowerPanel, { VisualGemSlot } from '../classes/gui/TowerPanel';
import Gem from '../classes/game/Gem';
import EndGameDialog from '../classes/gui/EndGameDialog';
import HighScoreDialog, { HighScoreDialogButtons } from '../classes/gui/HighScoreDialog';
import GamePausedDialog from '../classes/gui/GamePausedDialog';

enum RoundMode {
    Purchase = 0,
    Combat = 1,
    Misc = 2,
}

export class GameScene extends Scene {
    public isGameOver: boolean = false;
    public mission: MissionDefinition;
    public missionIndex: number;
    public MissionStats: MissionStats;
    public roundMode: RoundMode;
    public ticker: PIXI.Ticker;
    public changeRoundButton: Button;
    public sidebar: Sidebar;
    public tooltip: Tooltip;
    public towerPanel: TowerPanel;
    public isPaused: boolean = false;
    private isFastForwarded: boolean = false;
    private pauseButton: Button;
    private visualGems: VisualGemSlot[] = [];
    private currentRound: number = 0;
    private isWaveManagerFinished: boolean = false;
    private playerWon: boolean = false;
    private destroyTicker: boolean = false;
    private offerGemsSprite: PIXI.NineSliceSprite;
    private dimGraphics: PIXI.Graphics = new PIXI.Graphics({
        x: 0,
        y: 0,
        zIndex: 120,
    });

    constructor(name: string) {
        super();
        Engine.GameScene = this;
        GameAssets.Missions.forEach((mission, index) => {
            if (mission.name == name) {
                this.mission = mission;
                this.missionIndex = index;
            }
        });
    }
    public init() {
        Engine.latestGemId = 0;
        new Grid(this.mission.gameMap, this.missionIndex);
        new TowerManager();
        new WaveManager(this.mission.rounds, this.mission.gameMap.paths);
        Engine.Grid.onGridCellClicked = (row, column) => {
            if (Engine.TowerManager.isPlacingTower) {
                Engine.TowerManager.PlayerClickOnGrid(row, column);
            }
        };
        Engine.WaveManager.events.on(WaveManagerEvents.CreepSpawned, (creep: Creep) => {
            Engine.Grid.addCreep(creep);
            creep.events.on(CreepEvents.Escaped, () => {
                this.onCreepEscaped(creep);
            });
        });
        Engine.WaveManager.events.on(WaveManagerEvents.Finished, () => {
            this.isWaveManagerFinished = true;
        });
        this.events.on(CreepEvents.Died, (playerAward, creepThatDied) => {
            this.MissionStats.earnGold(playerAward);
        });
        this.towerPanel = new TowerPanel(GameUIConstants.SidebarRect);
        this.sidebar = new Sidebar(GameUIConstants.SidebarRect);
        this.changeRoundButton = new Button(GameUIConstants.ChangeRoundButtonRect, '', ButtonTexture.Button01, true);
        this.changeRoundButton.container.removeFromParent();
        this.sidebar.container.addChild(this.changeRoundButton.container);
        Engine.GameMaster.currentScene.stage.addChildAt(this.dimGraphics, 0);
        this.tooltip = new Tooltip(new PIXI.Rectangle(0, 0, 350, 160));
        // Added custom button logic to still keep all the regular events for the button, just have an icon instead of text.
        this.changeRoundButton.CustomButtonLogic = () => {
            this.changeRoundButton.buttonIcon = new PIXI.Sprite({
                texture: GameAssets.PlayIconTexture,
                x: this.changeRoundButton.container.width / 2,
                y: this.changeRoundButton.container.height / 2,
                scale: 0.2,
            });
            this.changeRoundButton.buttonIcon.anchor.set(0.5, 0.5);
            this.changeRoundButton.container.addChild(this.changeRoundButton.buttonIcon);
        };
        this.changeRoundButton.CustomButtonLogic();
        this.changeRoundButton.onClick = () => {
            if (this.playerWon) return this.ReturnToMain();
            if (this.roundMode == RoundMode.Combat) {
                // TODO: figure out how to actually double speed without causing bugs.
                if (this.isFastForwarded) {
                    this.isFastForwarded = false;
                    Engine.NotificationManager.Notify('Regular speed.', 'info');
                } else {
                    this.isFastForwarded = true;
                    Engine.NotificationManager.Notify('Fast forward activated.', 'info');
                }
            }
            if (this.isGameOver) return Engine.NotificationManager.Notify('No more waves.', 'danger');
            if (this.roundMode == RoundMode.Misc) return;
            this.setRoundMode(RoundMode.Combat);
            this.changeRoundButton.buttonIcon.texture = GameAssets.FastForwardIconTexture;
            this.events.emit(WaveManagerEvents.NewWave, `${this.currentRound + 1}`);
        };
        this.MissionStats = new MissionStats(125, 450);
        this.events.on(GemEvents.TowerPanelSelectGem, (gem, index, tower) => {
            if (gem == null) {
                if (!this.MissionStats.checkIfPlayerHasAnyGems())
                    return Engine.NotificationManager.Notify(
                        'You require atleast 1 Gem in your inventory to slot it in a Gem slot.',
                        'warn'
                    );
            }
            this.sidebar.gemTab.TowerPanelSelectingGem(gem, index, tower);
        });

        this.pauseButton = new Button(new PIXI.Rectangle(5, 5, 120, 80), '', ButtonTexture.Button01, true);
        this.pauseButton.container.removeFromParent();
        this.stage.addChild(this.pauseButton.container);
        this.pauseButton.CustomButtonLogic = () => {
            this.pauseButton.buttonIcon = new PIXI.Sprite({
                texture: GameAssets.PauseIconTexture,
                x: this.pauseButton.container.width / 2,
                y: this.pauseButton.container.height / 2,
                scale: 0.2,
            });
            this.pauseButton.buttonIcon.anchor.set(0.5, 0.5);
            this.pauseButton.container.addChild(this.pauseButton.buttonIcon);
        };
        this.pauseButton.CustomButtonLogic();
        this.pauseButton.onClick = () => {
            if (this.isPaused) {
                this.UnpauseGame();
            } else {
                this.ShowPauseDialog();
                this.PauseGame();
            }
        };

        this.ticker = new PIXI.Ticker();
        this.ticker.maxFPS = 60;
        this.ticker.minFPS = 30;
        // fix tooltip behaving weirdly for some reason
        this.tooltip.SetContentTower(0, 0, 0, 0);
        this.tooltip.Show(Engine.MouseX, Engine.MouseY);
        this.tooltip.Hide();

        this.ticker.add(() => {
            if (this.update) this.update(this.ticker.elapsedMS);
            // if (this.isFastForwarded) this.update(this.ticker.elapsedMS);
        });
        this.ticker.start();
    }
    public update(elapsedMS) {
        if (this.isGameOver) {
            if (this.destroyTicker) {
                this.destroyTicker = false;
                this.ticker.destroy();
            }
            return;
        }
        Engine.WaveManager.update(elapsedMS);
        Engine.Grid.update(elapsedMS);
        Engine.TowerManager.update(elapsedMS);
        // Means the round is finished.
        if (this.isWaveManagerFinished && Engine.Grid.creeps.length == 0) {
            this.isWaveManagerFinished = false;
            this.setRoundMode(RoundMode.Purchase);
            this.changeRoundButton.buttonIcon.texture = GameAssets.PlayIconTexture;
            Engine.NotificationManager.Notify(
                `Round ${this.currentRound + 1}/${this.mission.rounds.length} completed.`,
                'info'
            );
            if (this.currentRound + 1 == this.mission.rounds.length) {
                Engine.NotificationManager.Notify(`Mission victory!!`, 'reward');
                this.changeRoundButton.buttonIcon.texture = GameAssets.HomeIconTexture;
                this.playerWon = true;
            } else {
                this.OfferPlayerGems();
                this.currentRound++;
            }
        }

        if (this.MissionStats.getHP() <= 0) {
            this.isGameOver = true;
            this.ShowEndgameDialog(true);
        } else if (this.playerWon) {
            this.isGameOver = true;
            this.ShowEndgameDialog(false);
        }
    }
    public DarkenScreen() {
        this.dimGraphics.rect(0, 0, Engine.app.canvas.width, Engine.app.canvas.height);
        this.dimGraphics.fill({ color: 0x000000, alpha: 0.5 });
    }
    public UndarkenScreen() {
        this.dimGraphics.clear();
    }
    private OfferPlayerGems() {
        Engine.Grid.gridInteractionEnabled = false;
        Engine.GameScene.sidebar.towerTab.resetTint();
        Engine.TowerManager.ResetChooseTower();
        this.setRoundMode(RoundMode.Misc);
        let gemsToOffer = this.mission.rounds[this.currentRound].offeredGems;
        this.DarkenScreen();
        this.offerGemsSprite = new PIXI.NineSliceSprite({
            width: 380,
            height: 150,
            texture: GameAssets.Frame01Texture,
            leftWidth: 100,
            topHeight: 100,
            rightWidth: 100,
            bottomHeight: 100,
            zIndex: this.dimGraphics.zIndex + 1,
            x: Engine.app.canvas.width / 2 - 190,
            y: Engine.app.canvas.height / 2 - 75,
        });
        Engine.GameMaster.currentScene.stage.addChildAt(this.offerGemsSprite, 0);
        let offerText = new PIXI.Text({
            x: Engine.app.canvas.width / 4,
            y: Engine.app.canvas.height / 4,
            zIndex: this.dimGraphics.zIndex + 1,
            text: 'Choose a Gem as your reward for beating this round!',
            style: {
                fontSize: 40,
                fill: 'orange',
                fontWeight: 'bold',
                stroke: {
                    color: 0x000000,
                    width: 5,
                },
            },
        });
        // offerText.x -= offerText.width;
        Engine.GameMaster.currentScene.stage.addChildAt(offerText, 0);
        gemsToOffer.forEach((gType, index) => {
            let _Gem = new Gem(gType, true);
            let vGem = new VisualGemSlot(0, Engine.app.stage, _Gem);
            this.visualGems.push(vGem);
            vGem.container.x = this.offerGemsSprite.x - 15 + 69 * (index + 1);
            vGem.container.y = this.offerGemsSprite.y + 40;
            vGem.container.onpointermove = () => {
                Engine.GameScene.tooltip.SetContentGem(_Gem);
                Engine.GameScene.tooltip.Show(Engine.MouseX, Engine.MouseY);
            };
            vGem.container.onpointerleave = () => {
                Engine.GameScene.tooltip.Hide();
            };
            vGem.onClick = () => {
                Engine.GameScene.tooltip.Hide();
                offerText.destroy();
                this.PlayerPickedGem(new Gem(gType));
            };
        });
    }
    private PlayerPickedGem(gem: Gem) {
        this.offerGemsSprite.destroy();
        this.UndarkenScreen();
        this.visualGems.forEach((item) => item.destroy());
        Engine.Grid.gridInteractionEnabled = true;
        this.MissionStats.giveGem(gem);
        this.setRoundMode(RoundMode.Purchase);
    }

    public PauseGame() {
        this.isPaused = true;
        this.ticker.stop();
    }
    public UnpauseGame() {
        this.isPaused = false;
        this.ticker.start();
    }
    public ShowPauseDialog() {
        const gamePausedDialog = new GamePausedDialog();
        gamePausedDialog.show();
    }

    private async ShowEndgameDialog(lost) {
        const endGameDialog = new EndGameDialog(this.mission.name, this.MissionStats, lost);
        await endGameDialog.show();
        const highScore = new HighScoreDialog(
            this.mission.name,
            lost,
            !lost && this.missionIndex + 1 < GameAssets.Missions.length
        );
        const result = await highScore.show();
        if (result === HighScoreDialogButtons.MainMenu) {
            this.ReturnToMain();
        } else if (result === HighScoreDialogButtons.NextMission) {
            this.destroy();
            Engine.GameMaster.changeScene(new MissionPickerScene());
            Engine.GameMaster.changeScene(new GameScene(GameAssets.Missions[this.missionIndex + 1].name));
            Engine.NotificationManager.Notify('Loading next mission. Good luck.', 'green');
        } else if (result === HighScoreDialogButtons.Retry) {
            this.destroy();
            Engine.GameMaster.changeScene(new MissionPickerScene());
            Engine.GameMaster.changeScene(new GameScene(this.mission.name));
            Engine.NotificationManager.Notify('Retrying mission.', 'green');
        }
    }

    public onCreepEscaped(creep: Creep) {
        this.MissionStats.takeDamage(creep.health);
    }

    private setRoundMode(roundMode: RoundMode) {
        this.roundMode = roundMode;
        if (this.roundMode == RoundMode.Combat) {
            Engine.WaveManager.start(this.currentRound);
        } else {
            Engine.WaveManager.end();
        }
    }

    public destroy(): void {
        super.destroy();
        this.isGameOver = true;
        this.destroyTicker = true;
        Engine.GameScene = null;
    }

    private ReturnToMain() {
        Engine.GameMaster.changeScene(new MissionPickerScene());
    }
}
