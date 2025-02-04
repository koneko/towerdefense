import Assets from '../Assets';
import { Engine } from '../Bastion';
import GameObject from '../GameObject';
import * as PIXI from 'pixi.js';
import { WaveManagerEvents, StatsEvents } from '../Events';
import Gem from './Gem';

export default class MissionStats extends GameObject {
    private hp: number = 100;
    private gold: number = 0;
    private goldText: PIXI.Text;
    private healthText: PIXI.Text;
    private waveText: PIXI.Text;
    private inventory: Gem[] = [];

    // TODO: implement score keeping for leaderboards.
    private score: number = 0;

    public getHP() {
        return this.hp;
    }

    public hasEnoughGold(amount) {
        return amount <= this.gold;
    }

    public setHP(hp: number) {
        this.hp = hp;
        this.healthText.text = this.hp;
    }

    public takeDamage(damage: number) {
        this.hp -= damage;
        this.healthText.text = this.hp;
    }

    public setGold(gold: number) {
        this.gold = gold;
        this.goldText.text = this.gold;
    }

    public earnGold(gold: number) {
        this.gold += gold;
        this.goldText.text = this.gold;
    }

    public spendGold(amount: number) {
        this.gold -= amount;
        this.goldText.text = this.gold;
    }

    public giveGem(gem: Gem, noNotify?) {
        if (this.inventory.length >= 32)
            return Engine.NotificationManager.Notify(
                "Can't hold more than 32 Gems. Extra Gem was thrown away.",
                'danger'
            );
        this.inventory.push(gem);
        if (!noNotify)
            Engine.NotificationManager.Notify(
                `Lv. ${gem.level} ${gem.definition.name}` + ' added to your inventory.',
                'gemaward'
            );
        Engine.GameScene.events.emit(StatsEvents.GemGivenEvent, gem);
    }

    public takeGem(gem) {
        return this.inventory.splice(this.inventory.indexOf(gem), 1)[0];
    }

    public getInventory() {
        return this.inventory;
    }

    public checkIfPlayerHasAnyGems() {
        return this.inventory.length > 0;
    }

    constructor(initialHP: number, initialGold: number) {
        super();
        this.hp = initialHP;
        this.gold = initialGold;
        this.container.x = 0;
        this.container.y = 20;
        Engine.GameMaster.currentScene.stage.addChild(this.container);
        this.healthText = new PIXI.Text({
            text: `${this.hp}`,
            style: new PIXI.TextStyle({
                fill: 'red',
                fontSize: 36,
                fontWeight: 'bold',
                dropShadow: true,
            }),
        });
        this.goldText = new PIXI.Text({
            text: `${this.gold}`,
            style: new PIXI.TextStyle({
                fill: 'gold',
                fontSize: 36,
                fontWeight: 'bold',
                dropShadow: true,
            }),
        });
        this.waveText = new PIXI.Text({
            text: `0/${Engine.GameScene.mission.rounds.length}`,
            style: new PIXI.TextStyle({
                fill: 'dodgerblue',
                fontSize: 36,
                fontWeight: 'bold',
                dropShadow: true,
            }),
        });
        const healthSprite = new PIXI.Sprite(Assets.HealthTexture);
        const goldSprite = new PIXI.Sprite(Assets.GoldTexture);
        const waveSprite = new PIXI.Sprite(Assets.WaveTexture);

        this.healthText.x = 200;
        this.healthText.y = -15;
        healthSprite.x = 160;
        healthSprite.width = 36;
        healthSprite.height = 32;
        healthSprite.y = -10;

        this.goldText.x = 200;
        this.goldText.y = 20;
        goldSprite.x = 150;
        goldSprite.width = 56;
        goldSprite.height = 56;
        goldSprite.y = 15;

        this.waveText.x = 200;
        this.waveText.y = 55;
        waveSprite.x = 155;
        waveSprite.width = 46;
        waveSprite.height = 32;
        waveSprite.y = 65;

        this.container.addChild(this.healthText);
        this.container.addChild(this.goldText);
        this.container.addChild(this.waveText);
        this.container.addChild(healthSprite);
        this.container.addChild(goldSprite);
        this.container.addChild(waveSprite);

        Engine.GameScene.events.on(WaveManagerEvents.NewWave, (wave) => {
            this.waveText.text = `${wave}/${Engine.GameScene.mission.rounds.length}`;
        });
    }

    public update() {}
}
