import Button from '../base/Button';
import { MissionDefinition } from '../base/Definitions';
import Creep, { CreepEvents } from '../components/Creep';
import { Grid } from '../components/Grid';
import MissionStats from '../components/MissionStats';
import WaveManager, { WaveManagerEvents } from '../components/WaveManager';
import SceneBase from './SceneBase';
import * as PIXI from 'pixi.js';

enum RoundMode {
    Purchase = 0,
    Combat = 1,
}

export default class GameScene extends SceneBase {
    private ticker: PIXI.Ticker;
    private stats: MissionStats;
    private grid: Grid;
    private waveManager: WaveManager;
    private roundMode = RoundMode.Purchase;
    private changeRoundButton: Button;
    private currentRound: number = 0;

    constructor(mission: MissionDefinition, bounds: PIXI.Rectangle) {
        super(bounds);
        this.waveManager = new WaveManager(mission.rounds, mission.gameMap.paths);
        this.waveManager.events.on(WaveManagerEvents.CreepSpawned, (creep: Creep) => {
            this.grid.addCreep(creep);
            creep.events.on(CreepEvents.Escaped, () => {
                this.onCreepEscaped(creep);
            });
        });
        this.stats = new MissionStats(100, 200);
        this.grid = new Grid(mission.gameMap);
        this.ticker = new PIXI.Ticker();
        this.ticker.maxFPS = 60;
        this.ticker.minFPS = 30;
        this.ticker.add(() => this.update(this.ticker.elapsedMS)); // bruh
        this.ticker.start();
        this.changeRoundButton = new Button('Start', new PIXI.Color('white'), true);
        this.changeRoundButton.events.on('click', () => {
            console.log('clicked');
            this.changeRoundButton.setEnabled(false);
            this.changeRoundButton.setCaption('[X]');
            this.setRoundMode(RoundMode.Combat);
        });
        this.draw();
    }

    public destroy() {
        super.destroy();
        this.ticker.stop();
        this.ticker.destroy();
    }

    public update(elapsedMS: number) {
        if (this.checkGameOver()) return;
        this.waveManager.update(elapsedMS);
        this.checkToEndCombat();
    }

    private setRoundMode(roundMode: RoundMode) {
        this.roundMode = roundMode;
        if (this.roundMode == RoundMode.Combat) {
            this.waveManager.start(this.currentRound);
        } else {
            this.waveManager.end();
        }
    }

    private checkToEndCombat() {
        let isFinished = false; // todo: implement
        if (!this.waveManager.finished) {
            isFinished = false;
        }
        if (isFinished) {
            this.currentRound++;
            this.setRoundMode(RoundMode.Purchase);
        }
    }

    private checkGameOver() {
        if (this.stats.getHP() <= 0) {
            // TODO: end game
            return true;
        }
        return false;
    }

    private onCreepEscaped(creep: Creep) {
        this.stats.takeDamage(creep.health);
    }

    protected draw() {
        console.log('Drawing Game Scene ', this.bounds);
        this.container.removeChildren();
        const g = new PIXI.Graphics();
        g.rect(0, 0, this.bounds.width, this.bounds.height);
        g.fill(0x000033);
        this.container.addChild(g);
        this.stats.setBounds(this.getStatusBounds());
        this.grid.setBounds(this.getGridBounds());
        this.changeRoundButton.setBounds(this.getChangeRoundButtonBounds());
        this.container.addChild(this.stats.container);
        this.container.addChild(this.grid.container);
        this.container.addChild(this.changeRoundButton.container);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }

    private getStatusBounds(): PIXI.Rectangle {
        // Top / Center
        return new PIXI.Rectangle(this.bounds.width / 2 - 200 / 2, 0, 200, 100);
    }

    private getGridBounds(): PIXI.Rectangle {
        // Center / Center
        return new PIXI.Rectangle(this.bounds.width / 2 - 600 / 2, this.bounds.height / 2 - 600 / 2, 600, 600);
    }
    private getChangeRoundButtonBounds(): PIXI.Rectangle {
        // Center / Center
        return new PIXI.Rectangle(this.bounds.width - 300, this.bounds.height - 150, 300, 150);
    }
}
