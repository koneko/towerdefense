import GameObject from '../base/GameObject';
import * as PIXI from 'pixi.js';

export class Creep extends GameObject {
    constructor(bounds?: PIXI.Rectangle) {
        super(bounds);
    }

    protected draw() {
        this.container.removeChildren();

        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
