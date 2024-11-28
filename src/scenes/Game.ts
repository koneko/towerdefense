import Assets from '../classes/Assets';
import { environment } from '../classes/Bastion';
import { MissionDefinition } from '../classes/Definitions';
import Sidebar from '../classes/gui/Sidebar';
import Topbar from '../classes/gui/Topbar';
import Scene from './Scene';
import * as PIXI from 'pixi.js';

export class GameScene extends Scene {
    public mission: MissionDefinition;
    constructor(name: string) {
        super();
        Assets.Missions.forEach((mission) => {
            if (mission.name == name) this.mission = mission;
        });
    }
    public init() {
        const SidebarRect = new PIXI.Rectangle(environment.WindowWidth - 400, 0, 400, environment.WindowHeight);
        const TopbarRect = new PIXI.Rectangle(0, 0, environment.WindowWidth, 150);

        new Topbar(TopbarRect);
        new Sidebar(SidebarRect);
    }
}
