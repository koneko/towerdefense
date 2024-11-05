import Assets from '../base/Assets';
import GameObject from '../base/GameObject';
import * as PIXI from 'pixi.js';

export default class MissionStats extends GameObject {
    private hp: number = 100;
    private gold: number = 0;

    public getHP() {
        return this.hp;
    }

    public setHP(hp: number) {
        this.hp = hp;
        this.draw();
    }

    public takeDamage(damage: number) {
        this.hp -= damage;
        this.draw();
    }

    public setGold(gold: number) {
        this.gold = gold;
        this.draw();
    }

    constructor(initialHP: number, initialGold: number, bounds?: PIXI.Rectangle) {
        super(bounds);
        this.hp = initialHP;
        this.gold = initialGold;
        this.draw();
    }

    protected draw() {
        this.container.removeChildren();
        const sprite = new PIXI.NineSliceSprite({
            texture: Assets.SidebarTexture,
            leftWidth: 100,
            topHeight: 100,
            rightWidth: 100,
            bottomHeight: 100,
        });
        sprite.width = this.bounds.width + 200;
        sprite.height = this.bounds.height + 5;
        sprite.x = sprite.x - 100;
        sprite.y = sprite.y - 5;
        const healthText = new PIXI.Text({
            text: `HP: ${this.hp}`,
            style: new PIXI.TextStyle({
                fill: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                dropShadow: true,
            }),
        });
        healthText.x = 400;
        const goldText = new PIXI.Text({
            text: `Gold: ${this.gold}`,
            style: new PIXI.TextStyle({
                fill: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                dropShadow: true,
            }),
        });
        goldText.x = 400;
        goldText.y = 30;

        const healthSprite = new PIXI.Sprite(Assets.HealthTexture);
        healthSprite.x = 365;
        healthSprite.width = 30;
        healthSprite.height = 26;
        healthSprite.y = 1;

        const goldSprite = new PIXI.Sprite(Assets.GoldTexture);
        goldSprite.x = 365;
        goldSprite.width = 30;
        goldSprite.height = 26;
        goldSprite.y = 30;
        this.container.addChild(sprite);
        this.container.addChild(healthText);
        this.container.addChild(goldText);
        this.container.addChild(healthSprite);
        this.container.addChild(goldSprite);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
