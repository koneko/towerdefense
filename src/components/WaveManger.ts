import Creep from './Creep';

export default class WaveManager {
    // Doesn't need to extend GameObject since it does not render
    private totalWaves: number;
    private currentWave: number;
    private creeps: Creep[];
    private spawnIntervalTicks: number;
    private firstCreepSpawnTick: number;
    constructor(totalWaves) {
        this.totalWaves = totalWaves;
    }
}
