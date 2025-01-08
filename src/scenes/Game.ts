import GameAssets from '../classes/Assets';
import { Globals } from '../classes/Bastion';
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

    constructor(name: string) {
        super();
        Globals.GameScene = this;
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
        this.ticker.add(() => this.update(this.ticker.elapsedMS)); // bruh
        this.ticker.start();
        const SidebarRect = new PIXI.Rectangle(64 * 30 - 360, 0, 360, Globals.app.canvas.height);
        const changeRoundButtonRect = new PIXI.Rectangle(50, Globals.app.canvas.height - 100, 310, 100);
        new Grid(this.mission.gameMap, this.missionIndex);
        new TowerManager();
        new WaveManager(this.mission.rounds, this.mission.gameMap.paths);
        Globals.Grid.onGridCellClicked = (row, column) => {
            if (Globals.TowerManager.isPlacingTower) {
                Globals.TowerManager.PlayerClickOnGrid(row, column);
            }
        };
        Globals.WaveManager.events.on(WaveManagerEvents.CreepSpawned, (creep: Creep) => {
            Globals.Grid.addCreep(creep);
            creep.events.on(CreepEvents.Escaped, () => {
                this.onCreepEscaped(creep);
            });
        });
        Globals.WaveManager.events.on(WaveManagerEvents.Finished, () => {
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
            this.changeRoundButton.setEnabled(false);
            this.changeRoundButton.setCaption('[X]');
            this.setRoundMode(RoundMode.Combat);
        };

        this.MissionStats = new MissionStats(100, 200);
    }
    public update(elapsedMS) {
        Globals.WaveManager.update(elapsedMS);
        Globals.Grid.update(elapsedMS);
        Globals.TowerManager.update(elapsedMS);
        if (this.isWaveManagerFinished && Globals.Grid.creeps.length == 0) {
            this.changeRoundButton.setEnabled(true);
            this.changeRoundButton.setCaption('Start');
            this.setRoundMode(RoundMode.Purchase);
            this.NotifyPlayer(`Round ${this.currentRound + 1}/${this.mission.rounds.length} completed.`, 'info');
            if (this.currentRound + 1 == this.mission.rounds.length) {
                this.changeRoundButton.setCaption('WINNER!');
                this.NotifyPlayer(`Mission win!`, 'info');
                this.playerWon = true;
            }
        }

        if (this.MissionStats.getHP() <= 0) {
            this.isGameOver = true;
            this.ShowScoreScreen(true);
            this.ticker.stop();
        } else if (this.playerWon) {
            this.isGameOver = true;
            this.ShowScoreScreen(false);
            this.ticker.stop();
        }
    }

    private ShowScoreScreen(lost) {
        this.ticker.stop();
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
            Globals.WaveManager.start(this.currentRound);
        } else {
            Globals.WaveManager.end();
        }
    }
    public NotifyPlayer(notification, notifytype) {
        // TODO: show to player for real
        console.log('NOTIFY PLAYER! type: ' + notifytype);
        console.log(notification);
    }
    public onTowerPlaced() {}
}
