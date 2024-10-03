export type MissionDefinition = {
    name: string;
    description: string;
    mapImageUrl: string;
    gameMap: GameMapDefinition;
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

export type PathDefinition = [[row: number, column: number]];

export enum CreepType {
    Basic = 0,
    Fast = 1,
}

export enum TerrainType {
    Restricted = 0,
    Buildable = 1,
}

export enum GemType {
    Fire = 0,
    Yeti = 1,
    Titalium = 2,
    Soulforge = 3,
}
