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
        const g = new PIXI.Graphics();
        g.rect(0, 0, this.bounds.width, this.bounds.height);
        g.fill(0x000000);
        this.container.addChild(g);
        const text = new PIXI.Text({
            text: `HP: ${this.hp}\nGold: ${this.gold}`,
            style: new PIXI.TextStyle({
                fill: 'white',
                fontSize: 24,
            }),
        });
        this.container.addChild(text);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
