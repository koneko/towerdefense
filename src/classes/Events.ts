export enum WaveManagerEvents {
    CreepSpawned = 'creepSpawned',
    Finished = 'finished',
    NewWave = 'newwave',
}

export enum CreepEvents {
    Died = 'died',
    TakenDamage = 'takenDamage',
    GiveEffect = 'giveEffect',
    Escaped = 'escaped',
    Moved = 'moved',
}

export enum GridEvents {
    CellMouseOver = 'cellmouseover',
    CellMouseLeave = 'cellmouseleave',
}

export enum TowerEvents {
    TowerPlacedEvent = 'towerPlacedEvent',
    TowerSoldEvent = 'towerSoldEvent',
}

export enum StatsEvents {
    GemGivenEvent = 'gemGivenEvent',
}

export enum GemEvents {
    TowerPanelSelectGem = 'towerTabSelectGem',
}
