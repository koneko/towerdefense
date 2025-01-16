import * as PIXI from 'pixi.js';
import { CreepDefinition, CreepStatsDefinition, MissionDefinition, TowerDefinition } from './Definitions';
import { Engine } from './Bastion';

export default class GameAssets {
    public static BasicTowerTexture: PIXI.Texture;

    public static BasicProjectileTexture: PIXI.Texture;

    public static Frame01Texture: PIXI.Texture;
    public static Frame02Texture: PIXI.Texture;
    public static FrameBackground: PIXI.Texture;
    public static FrameTowerTab: PIXI.Texture;
    public static VioletBackground: PIXI.Texture;
    public static RedBackground: PIXI.Texture;
    public static GreenBackground: PIXI.Texture;
    public static Button01Texture: PIXI.Texture;
    public static Button02Texture: PIXI.Texture;
    public static HealthTexture: PIXI.Texture;
    public static GoldTexture: PIXI.Texture;
    public static WaveTexture: PIXI.Texture;

    public static Missions: MissionDefinition[];
    public static MissionBackgrounds: PIXI.Texture[] = [];
    public static TowerSprites: PIXI.Texture[] = [];
    public static Towers: TowerDefinition[];
    public static Creeps: CreepDefinition[];

    private static text;
    private static async Load(src) {
        this.text.text = 'Loading asset: ' + src;
        return await PIXI.Assets.load({
            src: src,
        });
    }

    public static async LoadAssets() {
        if (this.text) {
            throw 'Do not call GameAssets.LoadAssets() more than once.';
            return;
        }
        console.log('Loading Texture Assets');
        const t = new PIXI.Text({
            text: 'Loading textures. This might take a while.',
            style: new PIXI.TextStyle({
                fill: 0x333333,
                fontSize: 50,
            }),
        });
        t.x = Engine.app.canvas.width / 2;
        t.y = Engine.app.canvas.height / 2;
        t.anchor.set(0.5, 0.5);
        Engine.app.stage.addChild(t);

        this.text = new PIXI.Text({
            text: '',
            style: new PIXI.TextStyle({
                fill: 0x333333,
                fontSize: 50,
            }),
        });
        this.text.x = Engine.app.canvas.width / 2;
        this.text.y = Engine.app.canvas.height / 2 + 50;
        this.text.anchor.set(0.5, 0.5);
        Engine.app.stage.addChild(this.text);
        this.Load('/aclonica.woff2');
        this.Button01Texture = await this.Load('/assets/gui/button_01.png');
        this.Button02Texture = await this.Load('/assets/gui/button_02.png');
        this.Frame01Texture = await this.Load('/assets/gui/frame_01.png');
        this.Frame02Texture = await this.Load('/assets/gui/frame_02.png');
        this.FrameBackground = await this.Load('/assets/gui/background_01.png');
        this.FrameTowerTab = await this.Load('/assets/gui/background_02.png');
        this.VioletBackground = await this.Load('/assets/gui/frame_violet.png');
        this.RedBackground = await this.Load('/assets/gui/frame_red.png');
        this.GreenBackground = await this.Load('/assets/gui/frame_green.png');
        this.HealthTexture = await this.Load('/assets/gui/heart.png');
        this.GoldTexture = await this.Load('/assets/gui/money.png');
        this.WaveTexture = await this.Load('/assets/gui/wave.png');
        this.BasicTowerTexture = await this.Load('/assets/towers/basic_tower.png');
        this.BasicProjectileTexture = await this.Load('/assets/projectiles/basic_tower.png');
        await this.LoadMissions();
        await this.LoadTowers();
        await this.LoadCreeps();
        t.destroy();
        this.text.destroy();
        // Set this.text = true to disallow calling GameAssets.LoadAssets() again
        this.text = true;
    }

    private static async LoadCreeps() {
        const res = await fetch('/assets/json/Creeps.json');
        const creeps = await res.json();
        this.Creeps = creeps;
        for (let idx = 0; idx < this.Creeps.length; idx++) {
            const creep = this.Creeps[idx];
            for (let i = 0; i < creep.textureArrayLength; i++) {
                const texture = await this.Load(`/assets/creeps/${creep.name}/${i}.png`);
                creep.textures[i] = texture;
            }
        }
    }

    private static async LoadMissions() {
        // When adding missions, make sure to keep order.
        GameAssets.Missions = [await this.LoadMission('/assets/missions/mission_01.json')];
    }

    private static async LoadTowers() {
        const res = await fetch('/assets/json/Towers.json');
        const towers = await res.json();
        GameAssets.Towers = towers;
        towers.forEach(async (tower) => {
            let index = this.TowerSprites.length - 1;
            if (index == -1) index = 0;
            this.TowerSprites[index] = await this.Load(`/assets/towers/${tower.sprite}.png`);
        });
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
        this.MissionBackgrounds[index] = await this.Load(backgroundUrl);
    }
}
