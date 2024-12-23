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

enum RoundMode {
    Purchase = 0,
    Combat = 1,
}

export class GameScene extends Scene {
    public mission: MissionDefinition;
    public missionIndex: number;
    public roundMode: RoundMode;
    public ticker: PIXI.Ticker;
    private currentRound: number = 0;

    constructor(name: string) {
        super();
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
        const SidebarRect = new PIXI.Rectangle(Globals.WindowWidth - 350, 0, 350, Globals.app.canvas.height);
        const StartButtonRect = new PIXI.Rectangle(Globals.WindowWidth - 200, Globals.WindowHeight, 200, 100);

        new Grid(this.mission.gameMap, this.missionIndex);
        new WaveManager(this.mission.rounds, this.mission.gameMap.paths);
        Globals.WaveManager.events.on(WaveManagerEvents.CreepSpawned, (creep: Creep) => {
            Globals.Grid.addCreep(creep);
            creep.events.on(CreepEvents.Escaped, () => {
                this.onCreepEscaped(creep);
            });
        });
        new Sidebar(SidebarRect);
        // const changeRoundButton = new Button('Start', new PIXI.Color('white'), true);
        const changeRoundButton = new Button(StartButtonRect, 'Start', ButtonTexture.Button01, true);
        changeRoundButton.onClick = () => {
            console.log('clicked');
            changeRoundButton.setEnabled(false);
            changeRoundButton.setCaption('[X]');
            this.setRoundMode(RoundMode.Combat);
        };
    }
    public update(elapsedMS) {
        Globals.WaveManager.update(elapsedMS);
        Globals.Grid.update(elapsedMS);
    }
    public onCreepEscaped(creep: Creep) {}

    private setRoundMode(roundMode: RoundMode) {
        this.roundMode = roundMode;
        if (this.roundMode == RoundMode.Combat) {
            Globals.WaveManager.start(this.currentRound);
        } else {
            Globals.WaveManager.end();
        }
    }
}
