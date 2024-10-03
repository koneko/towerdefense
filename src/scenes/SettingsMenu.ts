import Button from '../base/Button';
import SceneBase from './SceneBase';
import * as PIXI from 'pixi.js';

export default class SettingsMenu extends SceneBase {
    constructor(bounds: PIXI.Rectangle) {
        super(bounds);
        this.draw();
    }

    protected draw() {
        this.container.removeChildren();
        const g = new PIXI.Graphics();
        g.rect(0, 0, this.bounds.width, this.bounds.height);
        g.fill(0x000000);

        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
