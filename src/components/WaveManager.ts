import { CreepType, MissionRoundDefinition, PathDefinition } from '../base/Definitions';
import * as PIXI from 'pixi.js';
import Creep, { CreepEvents } from './Creep';

export enum WaveManagerEvents {
    CreepSpawned = 'creepSpawned',
    Finished = 'finished',
}

type CreepInstance = {
    creep: Creep;
    tickToSpawnAt: number;
    spawned: boolean;
};

export default class WaveManager {
    // Doesn't need to extend GameObject since it does not render
    // public currentRound: number = 0;
    private creeps: CreepInstance[] = [];
    private rounds: MissionRoundDefinition[];
    private paths: PathDefinition[];
    private ticks: number = 0;
    private started: boolean = false;
    public finished: boolean = false;
    public events = new PIXI.EventEmitter();
    constructor(rounds: MissionRoundDefinition[], paths: PathDefinition[]) {
        this.rounds = rounds;
        this.paths = paths;
    }
    public start(roundIndex) {
        this.started = true;
        this.ticks = 0;
        this.creeps = [];
        this.finished = false;
        let tickToSpawnAt = 0;
        this.rounds[roundIndex].waves.forEach((wave) => {
            tickToSpawnAt += wave.firstCreepSpawnTick;
            wave.creeps.forEach((creep) => {
                const creepObj = new Creep(creep, this.paths[0]);
                const creepInstance = {
                    creep: creepObj,
                    tickToSpawnAt,
                    spawned: false,
                };
                tickToSpawnAt += wave.spawnIntervalTicks;
                this.creeps.push(creepInstance);
            });
        });
        console.log(this.creeps);
    }
    public end() {
        this.started = false;
    }
    public update(elapsedMS: number): void {
        if (this.started == false) return;
        this.ticks += elapsedMS;
        this.creeps.forEach((creep) => {
            if (!creep.spawned && creep.tickToSpawnAt <= this.ticks) {
                creep.spawned = true;
                this.events.emit(WaveManagerEvents.CreepSpawned, creep.creep);
                console.log('Wave manager creep spawned, ', creep, this.ticks);
                if (!this.finished && this.creeps.every((creep) => creep.spawned)) {
                    this.finished = true;
                    console.log('wave maanger finisehd');
                    this.events.emit(WaveManagerEvents.Finished);
                }
            } else if (creep.spawned) {
                creep.creep.update(elapsedMS);
            }
        });
    }
}
