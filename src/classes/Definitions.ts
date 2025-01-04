export type MissionDefinition = {
    name: string;
    description: string;
    mapImage: MapImageDefinition;
    gameMap: GameMapDefinition;
    rounds: MissionRoundDefinition[];
};

export type MapImageDefinition = {
    url: string;
};

export type GameMapDefinition = {
    rows: number;
    columns: number;
    cells: TerrainType[][];
    paths: PathDefinition[];
};

export type MissionRoundDefinition = {
    waves: WaveDefinition[];
    offeredGems: GemType[];
};

export type WaveDefinition = {
    firstCreepSpawnTick: number;
    spawnIntervalTicks: number;
    creeps: CreepType[];
};

export type CreepStatsDefinition = {
    health: number;
    speed: number;
    special: Function;
    resistance: CreepResistancesDefinition;
};

export type CreepResistancesDefinition = {
    physical: number;
    divine: number;
    fire: number;
    ice: number;
    frostfire: number;
};

export type TowerDefinition = {
    name: string;
    sprite: string;
    description: string;
    stats: TowerStatsDefinition;
};

export type TowerStatsDefinition = {
    damage: number;
    cooldown: number;
    gemSlotsAmount: number;
    cost: number;
    range: number;
};

export type PathDefinition = [[row: number, column: number]];

export enum CreepType {
    Basic = 0,
    Fast = 1,
}

export enum TerrainType {
    Restricted = 0,
    Buildable = 1,
    Path = 9,
}

export enum GemType {
    Fire = 0,
    Yeti = 1,
    Titalium = 2,
    Soulforge = 3,
}

export enum TowerType {
    Shooting = 0,
    Circle = 1,
}
