import Assets from '../Assets';
import { Globals } from '../Bastion';
import GameObject from '../GameObject';
import * as PIXI from 'pixi.js';

export default class MissionStats extends GameObject {
    private hp: number = 100;
    private gold: number = 0;

    public getHP() {
        return this.hp;
    }

    public setHP(hp: number) {
        this.hp = hp;
    }

    public takeDamage(damage: number) {
        this.hp -= damage;
    }

    public setGold(gold: number) {
        this.gold = gold;
    }

    constructor(initialHP: number, initialGold: number) {
        super();
        this.hp = initialHP;
        this.gold = initialGold;
        this.container.x = 0;
        this.container.y = 20;
        Globals.app.stage.addChild(this.container);
        const healthText = new PIXI.Text({
            text: `HP: ${this.hp}`,
            style: new PIXI.TextStyle({
                fill: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                dropShadow: true,
            }),
        });
        healthText.x = 200;
        const goldText = new PIXI.Text({
            text: `Gold: ${this.gold}`,
            style: new PIXI.TextStyle({
                fill: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                dropShadow: true,
            }),
        });
        goldText.x = 200;
        goldText.y = 30;

        const healthSprite = new PIXI.Sprite(Assets.HealthTexture);
        healthSprite.x = 165;
        healthSprite.width = 30;
        healthSprite.height = 26;
        healthSprite.y = 1;

        const goldSprite = new PIXI.Sprite(Assets.GoldTexture);
        goldSprite.x = 165;
        goldSprite.width = 30;
        goldSprite.height = 26;
        goldSprite.y = 30;
        this.container.addChild(healthText);
        this.container.addChild(goldText);
        this.container.addChild(healthSprite);
        this.container.addChild(goldSprite);
    }

    public update() {}
}
