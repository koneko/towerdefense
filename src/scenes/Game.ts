import GameAssets from '../classes/Assets';
import { Engine } from '../classes/Bastion';
import { MissionDefinition } from '../classes/Definitions';
import Creep, { CreepEvents } from '../classes/game/Creep';
import { Grid } from '../classes/game/Grid';
import WaveManager, { WaveManagerEvents } from '../classes/game/WaveManager';
import Sidebar from '../classes/gui/Sidebar';
import Button, { ButtonTexture } from '../classes/gui/Button';
import Scene from './Scene';
import * as PIXI from 'pixi.js';
import MissionStats from '../classes/game/MissionStats';
import TowerManager from '../classes/game/TowerManager';
import { MissionPickerScene } from './MissionPicker';

enum RoundMode {
    Purchase = 0,
    Combat = 1,
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
    private currentRound: number = 0;
    private isWaveManagerFinished: boolean = false;
    private playerWon: boolean = false;
    private destroyTicker: boolean = false;

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
        this.ticker = new PIXI.Ticker();
        this.ticker.maxFPS = 60;
        this.ticker.minFPS = 30;
        this.ticker.add(() => {
            if (this.update) this.update(this.ticker.elapsedMS);
        });
        this.ticker.start();
        const SidebarRect = new PIXI.Rectangle(Engine.GridCellSize * 30 - 360, 0, 360, Engine.app.canvas.height);
        const changeRoundButtonRect = new PIXI.Rectangle(50, Engine.app.canvas.height - 100, 310, 100);
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
        this.sidebar = new Sidebar(SidebarRect);
        this.changeRoundButton = new Button(changeRoundButtonRect, 'Start', ButtonTexture.Button01, true);
        this.changeRoundButton.container.removeFromParent();
        this.sidebar.container.addChild(this.changeRoundButton.container);
        this.changeRoundButton.onClick = () => {
            if (this.playerWon) return this.ReturnToMain();
            if (this.isGameOver) return Engine.NotificationManager.Notify('No more waves.', 'warn');
            this.changeRoundButton.setEnabled(false);
            this.changeRoundButton.setCaption('WAVE IN PROGRESS');
            this.setRoundMode(RoundMode.Combat);
            this.events.emit(WaveManagerEvents.NewWave, `${this.currentRound + 1}`);
        };

        this.MissionStats = new MissionStats(100, 200);
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
        if (this.isWaveManagerFinished && Engine.Grid.creeps.length == 0) {
            this.isWaveManagerFinished = false;
            this.changeRoundButton.setEnabled(true);
            this.changeRoundButton.setCaption('Start');
            this.setRoundMode(RoundMode.Purchase);
            Engine.NotificationManager.Notify(
                `Round ${this.currentRound + 1}/${this.mission.rounds.length} completed.`,
                'info'
            );
            if (this.currentRound == this.mission.rounds.length) {
                Engine.NotificationManager.Notify(`Final round.`, 'danger');
            }
            if (this.currentRound + 1 == this.mission.rounds.length) {
                Engine.NotificationManager.Notify(`Mission victory!!`, 'reward');
                this.changeRoundButton.setCaption('Return to menu');
                this.playerWon = true;
            } else this.currentRound++;
        }

        if (this.MissionStats.getHP() <= 0) {
            this.isGameOver = true;
            this.ShowScoreScreen(true);
        } else if (this.playerWon) {
            this.isGameOver = true;
            this.ShowScoreScreen(false);
        }
    }

    private ShowScoreScreen(lost) {
        // TODO: show to player for real
        if (lost) {
            console.log('LOSE!');
        } else {
            console.log('WIN!');
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
        this.destroy();
        Engine.GameMaster.currentScene.stage.removeChildren();
        Engine.GameMaster.changeScene(new MissionPickerScene());
    }
    public onTowerPlaced() {}
}
