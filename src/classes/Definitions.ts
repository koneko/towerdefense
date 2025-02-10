import * as PIXI from 'pixi.js';
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

export type CreepDefinition = {
    name: string;
    textures: PIXI.Texture[];
    textureArrayLength: number;
    stats: CreepStatsDefinition;
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
    behaviour: string;
    sprite: string;
    description: string;
    texture: PIXI.Texture;
    projectileTextures: PIXI.Texture[];
    projectileTexturesArrayLength: number;
    stats: TowerStatsDefinition;
};

export type TowerStatsDefinition = {
    damage: number;
    cooldown: number;
    gemSlotsAmount: number;
    cost: number;
    range: number;
    timeToLive: number;
    pierce: number;
};

export type GemDefinition = {
    name: string;
    description: string;
    color: PIXI.ColorSource;
    type: GemType;
    totalLevels: number;
    textures: PIXI.Texture[];
    cantCombineWith: GemType[];
    specialCombine: GemType[];
    initialGemValue: number;
    genericImprovements: GenericGemImprovement[];
    gemResistanceModifications: CreepResistancesDefinition[];
};

export type GenericGemImprovement = {
    damageUp: number;
    attackSpeedUp: number;
    rangeUp: number;
    timeToLiveUp: number;
    pierceUp: number;
    gemValueUp: number;
};

export type PathDefinition = [[column: number, row: number]];

export enum TerrainType {
    Restricted = 0,
    Buildable = 1,
    Path = 9,
}

// Make sure to sync these with the respective JSON files.
export enum CreepType {
    Basic = 0,
    Quick = 1,
    Tank = 2,
    Cloaker = 3,
    Demon = 4,
    Maker = 5,
}

export enum GemType {
    Fire = 0,
    Yeti = 1,
    Titalium = 2,
    Soulforge = 3,
}

export enum TowerType {
    Basic = 0,
    Circle = 1,
}
