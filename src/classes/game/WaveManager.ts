import { CreepType, MissionRoundDefinition, PathDefinition } from '../Definitions';
import Creep from './Creep';
import { Engine } from '../Bastion';
import { WaveManagerEvents } from '../Events';
import GameObject from '../GameObject';

type CreepInstance = {
    creep: Creep;
    tickToSpawnAt: number;
    spawned: boolean;
};

export default class WaveManager extends GameObject {
    // Doesn't need to extend GameObject since it does not render
    private creeps: CreepInstance[] = [];
    private rounds: MissionRoundDefinition[];
    private paths: PathDefinition[];
    private ticks: number = 0;
    private started: boolean = false;
    private internalCreepId: number = 0;
    private pathsIndex: number;
    public finished: boolean = false;

    constructor(rounds: MissionRoundDefinition[], paths: PathDefinition[]) {
        super();
        Engine.WaveManager = this;
        this.rounds = rounds;
        this.paths = paths;
        this.pathsIndex = 0;
    }
    public start(roundIndex) {
        this.started = true;
        this.ticks = 0;
        this.creeps = [];
        this.finished = false;
        if (this.pathsIndex + 1 == this.paths.length) {
            this.pathsIndex = 0;
        } else {
            this.pathsIndex++;
        }
        let tickToSpawnAt = 0;
        this.rounds[roundIndex].waves.forEach((wave) => {
            tickToSpawnAt += wave.firstCreepSpawnTick;
            wave.creeps.forEach((creep) => {
                const creepObj = new Creep(creep, this.paths[this.pathsIndex], this.internalCreepId);
                this.internalCreepId++;
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
        this.ticks += elapsedMS * Engine.GameScene.gameSpeedMultiplier;
        this.creeps.forEach((creep) => {
            if (!creep.spawned && creep.tickToSpawnAt <= this.ticks) {
                creep.spawned = true;
                this.events.emit(WaveManagerEvents.CreepSpawned, creep.creep);
                if (!this.finished && this.creeps.every((creep) => creep.spawned)) {
                    this.finished = true;
                    this.events.emit(WaveManagerEvents.Finished);
                }
            } else if (creep.spawned) {
                creep.creep.update(elapsedMS);
            }
        });
    }
}
