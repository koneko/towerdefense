import * as PIXI from 'pixi.js';
import { CreepDefinition, MissionDefinition, TowerDefinition } from './Definitions';
import { Engine } from './Bastion';

export default class GameAssets {
    public static Frame01Texture: PIXI.Texture;
    public static Frame02Texture: PIXI.Texture;
    public static Frame03Texture: PIXI.Texture;
    public static Frame04Texture: PIXI.Texture;
    public static FrameInventory: PIXI.Texture;
    public static FrameBackground: PIXI.Texture;
    public static FrameTowerTab: PIXI.Texture;
    public static VioletBackground: PIXI.Texture;
    public static RedBackground: PIXI.Texture;
    public static GreenBackground: PIXI.Texture;
    public static BlueBackground: PIXI.Texture;
    public static Button01Texture: PIXI.Texture;
    public static Button02Texture: PIXI.Texture;
    public static ButtonSmallTexture: PIXI.Texture;
    public static HealthTexture: PIXI.Texture;
    public static GoldTexture: PIXI.Texture;
    public static WaveTexture: PIXI.Texture;
    public static SwordsTexture: PIXI.Texture;
    public static TitleTexture: PIXI.Texture;

    public static PlayIconTexture: PIXI.Texture;
    public static PauseIconTexture: PIXI.Texture;
    public static ExclamationIconTexture: PIXI.Texture;
    public static HomeIconTexture: PIXI.Texture;
    public static HammerIconTexture: PIXI.Texture;
    public static XIconTexture: PIXI.Texture;
    public static PlusIconTexture: PIXI.Texture;
    public static GemAmountIcons: PIXI.Texture[] = [];

    public static Missions: MissionDefinition[];
    public static MissionBackgrounds: PIXI.Texture[] = [];
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
            console.warn('Do not call GameAssets.LoadAssets() more than once.');
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

        await Promise.all([
            this.Load('/aclonica.woff2'),
            this.Load('/assets/gui/button_01.png').then((texture) => (this.Button01Texture = texture)),
            this.Load('/assets/gui/button_02.png').then((texture) => (this.Button02Texture = texture)),
            this.Load('/assets/gui/button_small.png').then((texture) => (this.ButtonSmallTexture = texture)),
            this.Load('/assets/gui/frame_01.png').then((texture) => (this.Frame01Texture = texture)),
            this.Load('/assets/gui/frame_02.png').then((texture) => (this.Frame02Texture = texture)),
            this.Load('/assets/gui/frame_03.png').then((texture) => (this.Frame03Texture = texture)),
            this.Load('/assets/gui/frame_04.png').then((texture) => (this.Frame04Texture = texture)),
            this.Load('/assets/gui/frame_inv.png').then((texture) => (this.FrameInventory = texture)),
            this.Load('/assets/gui/background_01.png').then((texture) => (this.FrameBackground = texture)),
            this.Load('/assets/gui/background_02.png').then((texture) => (this.FrameTowerTab = texture)),
            this.Load('/assets/gui/frame_violet.png').then((texture) => (this.VioletBackground = texture)),
            this.Load('/assets/gui/frame_red.png').then((texture) => (this.RedBackground = texture)),
            this.Load('/assets/gui/frame_green.png').then((texture) => (this.GreenBackground = texture)),
            this.Load('/assets/gui/frame_blue.png').then((texture) => (this.BlueBackground = texture)),
            this.Load('/assets/gui/heart.png').then((texture) => (this.HealthTexture = texture)),
            this.Load('/assets/gui/money.png').then((texture) => (this.GoldTexture = texture)),
            this.Load('/assets/gui/wave.png').then((texture) => (this.WaveTexture = texture)),
            this.Load('/assets/gui/sword_02.png').then((texture) => (this.SwordsTexture = texture)),
            this.Load('/assets/gui/title01.png').then((texture) => (this.TitleTexture = texture)),
            this.Load('/assets/gui/icons/play.png').then((texture) => (this.PlayIconTexture = texture)),
            this.Load('/assets/gui/icons/pause.png').then((texture) => (this.PauseIconTexture = texture)),
            this.Load('/assets/gui/icons/exclamation.png').then((texture) => (this.ExclamationIconTexture = texture)),
            this.Load('/assets/gui/icons/home.png').then((texture) => (this.HomeIconTexture = texture)),
            this.Load('/assets/gui/icons/hammer.png').then((texture) => (this.HammerIconTexture = texture)),
            this.Load('/assets/gui/icons/cross.png').then((texture) => (this.XIconTexture = texture)),
            this.Load('/assets/gui/icons/plus.png').then((texture) => (this.PlusIconTexture = texture)),
            this.LoadMissions(),
            this.LoadTowers(),
            this.LoadCreeps(),
            this.LoadGemIcons(),
        ]);
        t.destroy();
        this.text.destroy();
        // Set this.text = true to disallow calling GameAssets.LoadAssets() again
        this.text = true;
    }
    private static async LoadGemIcons() {
        for (let i = 0; i < 7; i++) {
            this.GemAmountIcons[i] = await this.Load(`/assets/gui/gem_amount_${i}.png`);
        }
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
        this.Towers = towers;
        for (let idx = 0; idx < this.Towers.length; idx++) {
            const tower = this.Towers[idx];
            for (let i = 0; i < tower.projectileTexturesArrayLength; i++) {
                const projTexture = await this.Load(`/assets/projectiles/${tower.sprite}/${i}.png`);
                tower.projectileTextures[i] = projTexture;
            }
            tower.texture = await this.Load(`/assets/towers/${tower.sprite}.png`);
        }
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
