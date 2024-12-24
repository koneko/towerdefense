import Assets from '../Assets';
import { Globals } from '../Bastion';
import GameObject from '../GameObject';
import * as PIXI from 'pixi.js';

export default class MissionStats extends GameObject {
    private hp: number = 100;
    private gold: number = 0;
    private goldText: PIXI.Text;
    private healthText: PIXI.Text;

    public getHP() {
        return this.hp;
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

    constructor(initialHP: number, initialGold: number) {
        super();
        this.hp = initialHP;
        this.gold = initialGold;
        this.container.x = 0;
        this.container.y = 20;
        Globals.app.stage.addChild(this.container);
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
        const healthSprite = new PIXI.Sprite(Assets.HealthTexture);
        const goldSprite = new PIXI.Sprite(Assets.GoldTexture);

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

        this.container.addChild(this.healthText);
        this.container.addChild(this.goldText);
        this.container.addChild(healthSprite);
        this.container.addChild(goldSprite);
    }

    public update() {}
}
