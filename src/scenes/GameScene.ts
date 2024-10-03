import Button from '../base/Button';
import { MissionDefinition } from '../base/Definitions';
import { Grid } from '../components/Grid';
import MissionStats from '../components/MissionStats';
import WaveManager from '../components/WaveManager';
import SceneBase from './SceneBase';
import * as PIXI from 'pixi.js';

export default class GameScene extends SceneBase {
    private ticker: PIXI.Ticker;
    private stats: MissionStats;
    private grid: Grid;
    public waveManager: WaveManager;

    constructor(mission: MissionDefinition, bounds: PIXI.Rectangle) {
        super(bounds);
        this.waveManager = new WaveManager(
            mission.rounds,
            mission.gameMap.paths
        );
        this.stats = new MissionStats(100, 200);
        this.grid = new Grid(mission.gameMap);
        this.ticker = new PIXI.Ticker();
        this.ticker.maxFPS = 60;
        this.ticker.minFPS = 30;
        this.ticker.add(() => this.update(this.ticker.FPS)); // bruh
        this.ticker.start();
        this.draw();
    }

    private getStatusBounds(): PIXI.Rectangle {
        // Top / Center
        return new PIXI.Rectangle(this.bounds.width / 2 - 200 / 2, 0, 200, 100);
    }

    private getGridBounds(): PIXI.Rectangle {
        // Center / Center
        return new PIXI.Rectangle(
            this.bounds.width / 2 - 600 / 2,
            this.bounds.height / 2 - 600 / 2,
            600,
            600
        );
    }

    public destroy() {
        super.destroy();
        this.ticker.stop();
        this.ticker.destroy();
    }

    public update(fps) {
        this.waveManager.update(fps);
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
        this.container.addChild(this.stats.container);
        this.container.addChild(this.grid.container);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
