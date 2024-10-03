import {
    CreepType,
    MissionRoundDefinition,
    PathDefinition,
} from '../base/Definitions';
import Creep from './Creep';

export default class WaveManager {
    // Doesn't need to extend GameObject since it does not render
    private currentWave: number;
    private creeps: Creep[] = [];
    private rounds: MissionRoundDefinition[];
    private paths: PathDefinition[];
    private spawnIntervalTicks: number;
    private firstCreepSpawnTick: number;
    public ticks: number = 0;
    constructor(rounds: MissionRoundDefinition[], paths: PathDefinition[]) {
        this.rounds = rounds;
        this.paths = paths;
    }
    private updateCreeps() {
        this.creeps.forEach((creep) => {
            creep.update();
            // TODO: updating here is fine, change to make spawning emit an event
            // which GameScene will catch and send to Grid who will draw the creep
            // based on the coordinates that the creep calculates.
        });
    }
    public update(fps): void {
        if (this.creeps.length != 0) this.updateCreeps();
        this.ticks++;
        if (this.ticks == 200) {
            this.creeps.push(new Creep(CreepType.Basic, this.paths[0]));
        }
    }
}
