import * as PIXI from 'pixi.js';
import { CreepStatsDefinition, MissionDefinition, TowerDefinition } from './Definitions';

export default class Assets {
    public static async LoadAssets() {
        console.log('Loading Texture Assets');
        Assets.Button01Texture = await PIXI.Assets.load({
            src: '/assets/gui/button_01.png',
        });
        Assets.Button02Texture = await PIXI.Assets.load({
            src: '/assets/gui/button_02.png',
        });
        Assets.Frame01Texture = await PIXI.Assets.load({
            src: '/assets/gui/frame_01.png',
        });
        Assets.Frame02Texture = await PIXI.Assets.load({
            src: '/assets/gui/frame_02.png',
        });
        Assets.FrameGreenTexture = await PIXI.Assets.load({
            src: '/assets/gui/frame_green.png',
        });
        Assets.FrameRedTexture = await PIXI.Assets.load({
            src: '/assets/gui/frame_red.png',
        });
        Assets.FrameVioletTexture = await PIXI.Assets.load({
            src: '/assets/gui/frame_violet.png',
        });
        Assets.HealthTexture = await PIXI.Assets.load({
            src: '/assets/gui/heart.png',
        });
        Assets.GoldTexture = await PIXI.Assets.load({
            src: '/assets/gui/star.png',
        });
        Assets.BasicCreepTexture = await PIXI.Assets.load({
            src: '/assets/creeps/basic.jpg',
        });
        await this.LoadMissions();
        await this.LoadTowers();
        await this.LoadCreepStats();
    }

    public static async LoadCreepStats() {
        const res = await fetch('/assets/CreepStats.json');
        const stats = await res.json();
        this.CreepStats = stats;
    }

    private static async LoadMissions() {
        Assets.Missions = [await this.LoadMission('/assets/missions/mission_01.json')];
    }

    private static async LoadTowers() {
        const res = await fetch('/assets/Towers.json');
        const towers = await res.json();
        Assets.Towers = towers;
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
    public static FrameGreenTexture: PIXI.Texture;
    public static FrameRedTexture: PIXI.Texture;
    public static FrameVioletTexture: PIXI.Texture;
    public static Button01Texture: PIXI.Texture;
    public static Button02Texture: PIXI.Texture;
    public static HealthTexture: PIXI.Texture;
    public static GoldTexture: PIXI.Texture;

    public static MissionBackgrounds: PIXI.Texture[] = [];
    public static Missions: MissionDefinition[];
    public static Towers: TowerDefinition[];
    public static CreepStats: CreepStatsDefinition[];
    public static DebuggingEnabled: boolean = true;
}