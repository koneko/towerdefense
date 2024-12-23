import GameAssets from '../classes/Assets';
import { Globals } from '../classes/Bastion';
import { MissionDefinition } from '../classes/Definitions';
import { Grid } from '../classes/game/Grid';
import Sidebar from '../classes/gui/Sidebar';
import Scene from './Scene';
import * as PIXI from 'pixi.js';

export class GameScene extends Scene {
    public mission: MissionDefinition;
    public missionIndex: number;
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
        const SidebarRect = new PIXI.Rectangle(Globals.WindowWidth - 400, 0, 400, Globals.WindowHeight);

        new Sidebar(SidebarRect);
        new Grid(this.mission.gameMap, this.missionIndex);
    }
}
