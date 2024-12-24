import * as PIXI from 'pixi.js';
import { CreepStatsDefinition, MissionDefinition, TowerDefinition } from './Definitions';
import { Globals } from './Bastion';

export default class GameAssets {
    public static async LoadAssets() {
        console.log('Loading Texture Assets');
        const text = new PIXI.Text({
            text: 'Loading textures. This might take a while.',
            style: new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 50,
            }),
        });
        text.x = Globals.WindowWidth / 2;
        text.y = Globals.WindowHeight / 2;
        text.anchor.set(0.5, 0.5);
        Globals.app.stage.addChild(text);
        GameAssets.Button01Texture = await PIXI.Assets.load({
            src: '/assets/gui/button_01.png',
        });
        GameAssets.Button02Texture = await PIXI.Assets.load({
            src: '/assets/gui/button_02.png',
        });
        GameAssets.Frame01Texture = await PIXI.Assets.load({
            src: '/assets/gui/frame_01.png',
        });
        GameAssets.Frame02Texture = await PIXI.Assets.load({
            src: '/assets/gui/frame_02.png',
        });
        GameAssets.FrameBackground = await PIXI.Assets.load({
            src: '/assets/gui/background_01.png',
        });
        GameAssets.FrameTowerTab = await PIXI.Assets.load({
            src: '/assets/gui/background_02.png',
        });
        GameAssets.FrameVioletTexture = await PIXI.Assets.load({
            src: '/assets/gui/frame_violet.png',
        });
        GameAssets.HealthTexture = await PIXI.Assets.load({
            src: '/assets/gui/heart.png',
        });
        GameAssets.GoldTexture = await PIXI.Assets.load({
            src: '/assets/gui/money.png',
        });
        GameAssets.BasicCreepTexture = await PIXI.Assets.load({
            src: '/assets/creeps/basic.jpg',
        });
        await this.LoadMissions();
        await this.LoadTowers();
        await this.LoadCreepStats();
        text.destroy();
    }

    public static async LoadCreepStats() {
        const res = await fetch('/assets/CreepStats.json');
        const stats = await res.json();
        this.CreepStats = stats;
    }

    private static async LoadMissions() {
        GameAssets.Missions = [await this.LoadMission('/assets/missions/mission_01.json')];
    }

    private static async LoadTowers() {
        const res = await fetch('/assets/Towers.json');
        const towers = await res.json();
        GameAssets.Towers = towers;
    }

    private static async LoadMission(missionUrl: string) {
        const res = await fetch(missionUrl);
        const mission = await res.json();
        await this.LoadBackground(mission.mapImage.url);
        return mission;
    }

    private static async LoadBackground(backgroundUrl: string) {
        let index = this.MissionBackgrounds.length - 1;
        if (index == -1) index = 0;
        this.MissionBackgrounds[index] = await PIXI.Assets.load({
            src: backgroundUrl,
        });
    }

    public static BasicCreepTexture: PIXI.Texture;

    public static Frame01Texture: PIXI.Texture;
    public static Frame02Texture: PIXI.Texture;
    public static FrameBackground: PIXI.Texture;
    public static FrameTowerTab: PIXI.Texture;
    public static FrameVioletTexture: PIXI.Texture;
    public static Button01Texture: PIXI.Texture;
    public static Button02Texture: PIXI.Texture;
    public static HealthTexture: PIXI.Texture;
    public static GoldTexture: PIXI.Texture;

    public static MissionBackgrounds: PIXI.Texture[] = [];
    public static Missions: MissionDefinition[];
    public static Towers: TowerDefinition[];
    public static CreepStats: CreepStatsDefinition[];
    public static DebuggingEnabled: boolean = false;
}
